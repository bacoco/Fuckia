#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  agent-install.sh --target <repo> --dry-run [--agent-mode auto|codex-only|claude-only|dual-agent]
  agent-install.sh --target <repo> --apply --yes --agent-mode <codex-only|claude-only|dual-agent>

Installs Fuckia governance files without Node.js or npm.
EOF
}

mode=""
target=""
yes="false"
agent_mode="auto"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --target)
      target="${2:-}"
      shift 2
      ;;
    --dry-run)
      mode="dry-run"
      shift
      ;;
    --apply)
      mode="apply"
      shift
      ;;
    --yes)
      yes="true"
      shift
      ;;
    --agent-mode)
      agent_mode="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [ -z "$target" ] || [ -z "$mode" ]; then
  usage >&2
  exit 1
fi

if [ "$mode" = "apply" ] && [ "$yes" != "true" ]; then
  echo "Apply requires --yes." >&2
  exit 1
fi

case "$agent_mode" in
  auto|codex-only|claude-only|dual-agent)
    ;;
  *)
    echo "Unknown agent mode: $agent_mode" >&2
    usage >&2
    exit 1
    ;;
esac

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fuckia_dir="$(cd "$script_dir/../../.." && pwd)"
target_dir="$(cd "$target" && pwd)"

template_dir="$fuckia_dir/kit/templates"
skills_dir="$fuckia_dir/kit/generated-skills"
runtime_dir="$(mktemp -d)"
trap 'rm -rf "$runtime_dir"' EXIT

if [ ! -d "$template_dir" ] || [ ! -d "$skills_dir" ]; then
  echo "Fuckia templates or generated skills are missing." >&2
  exit 1
fi

codex_markers=()
claude_markers=()
for marker in AGENTS.md .agents .agents/skills; do
  if [ -e "$target_dir/$marker" ]; then
    codex_markers+=("$marker")
  fi
done
for marker in CLAUDE.md .claude .claude/skills; do
  if [ -e "$target_dir/$marker" ]; then
    claude_markers+=("$marker")
  fi
done

resolved_agent_mode="$agent_mode"
agent_mode_status="resolved"
agent_mode_reason="Explicit agent mode selected."
agent_mode_question=""

if [ "$agent_mode" = "auto" ]; then
  if [ "${#codex_markers[@]}" -gt 0 ] && [ "${#claude_markers[@]}" -eq 0 ]; then
    resolved_agent_mode="codex-only"
    agent_mode_reason="Detected Codex markers only."
  elif [ "${#claude_markers[@]}" -gt 0 ] && [ "${#codex_markers[@]}" -eq 0 ]; then
    resolved_agent_mode="claude-only"
    agent_mode_reason="Detected Claude markers only."
  else
    resolved_agent_mode=""
    agent_mode_status="ambiguous"
    if [ "${#codex_markers[@]}" -gt 0 ] && [ "${#claude_markers[@]}" -gt 0 ]; then
      agent_mode_reason="Detected both Codex and Claude markers."
    else
      agent_mode_reason="No Codex or Claude markers detected."
    fi
    agent_mode_question="Install Fuckia for Codex only, Claude only, or both?"
  fi
fi

if [ "$agent_mode_status" = "ambiguous" ]; then
  echo "Fuckia Agent Install"
  echo "===================="
  echo "mode: $mode"
  echo "agent_mode: ambiguous"
  echo "reason: $agent_mode_reason"
  echo "question: $agent_mode_question"
  echo "target: $target_dir"
  echo
  echo "next:"
  echo "- rerun with --agent-mode codex-only"
  echo "- rerun with --agent-mode claude-only"
  echo "- rerun with --agent-mode dual-agent"
  if [ "$mode" = "dry-run" ]; then
    echo "writes: none"
    exit 0
  fi
  exit 1
fi

declare -a sources=()
declare -a outputs=()
declare -a kinds=()

add_file() {
  sources+=("$1")
  outputs+=("$2")
  kinds+=("${3:-required}")
}

add_template() {
  add_file "$template_dir/$1" "$2" "${3:-required}"
}

include_codex() {
  [ "$resolved_agent_mode" = "codex-only" ] || [ "$resolved_agent_mode" = "dual-agent" ]
}

include_claude() {
  [ "$resolved_agent_mode" = "claude-only" ] || [ "$resolved_agent_mode" = "dual-agent" ]
}

sed "s/__AGENT_MODE__/$resolved_agent_mode/g" "$template_dir/project/fuckia.config.yaml" > "$runtime_dir/fuckia.config.yaml"

if include_codex; then
  add_template "agents/README.md" ".agents/README.md"
  add_template "agents/skills/README.md" ".agents/skills/README.md"
  add_template "project/AGENTS.md" "AGENTS.md"
fi

if include_claude; then
  add_template "claude/README.md" ".claude/README.md"
  add_template "claude/skills/README.md" ".claude/skills/README.md"
  add_template "project/CLAUDE.md" "CLAUDE.md"
fi

add_file "$runtime_dir/fuckia.config.yaml" "fuckia.config.yaml"
add_template "project/root-readme.md" "README.md" "optional"
add_template "github/README.md" ".github/README.md"
add_template "github/pull_request_template.md" ".github/PULL_REQUEST_TEMPLATE.md"
add_template "github/workflows/README.md" ".github/workflows/README.md"
add_template "github/workflows/collab-contract.yml" ".github/workflows/collab-contract.yml"
add_template "github/workflows/generated-skills.yml" ".github/workflows/generated-skills.yml"
add_template "github/workflows/pr-scope.yml" ".github/workflows/pr-scope.yml"
add_template "docs/README.md" "docs/README.md"
add_template "docs/fuckia/README.md" "docs/fuckia/README.md"
add_template "docs/fuckia/archive/README.md" "docs/fuckia/archive/README.md"
add_template "docs/fuckia/end-of-work-checkpoint.md" "docs/fuckia/end-of-work-checkpoint.md"
add_template "docs/fuckia/linear/README.md" "docs/fuckia/linear/README.md"
add_template "docs/fuckia/linear/templates/README.md" "docs/fuckia/linear/templates/README.md"
add_template "docs/fuckia/merge-proposals/README.md" "docs/fuckia/merge-proposals/README.md"
add_template "linear/templates/spec.md" "docs/fuckia/linear/templates/spec.md"
add_template "linear/templates/plan.md" "docs/fuckia/linear/templates/plan.md"
add_template "linear/templates/plan-review.md" "docs/fuckia/linear/templates/plan-review.md"
add_template "linear/templates/implement.md" "docs/fuckia/linear/templates/implement.md"
add_template "linear/templates/code-review.md" "docs/fuckia/linear/templates/code-review.md"
add_template "linear/templates/verify.md" "docs/fuckia/linear/templates/verify.md"

if include_claude; then
  for skill_file in "$skills_dir"/claude-*.md; do
    [ -f "$skill_file" ] || continue
    skill_name="$(basename "$skill_file" .md)"
    skill_name="${skill_name#claude-}"
    add_file "$skill_file" ".claude/skills/$skill_name/SKILL.md"
  done
fi

if include_codex; then
  for skill_file in "$skills_dir"/codex-*.md; do
    [ -f "$skill_file" ] || continue
    skill_name="$(basename "$skill_file" .md)"
    skill_name="${skill_name#codex-}"
    add_file "$skill_file" ".agents/skills/$skill_name/SKILL.md"
  done
fi

is_existing_project="false"
for signal in AGENTS.md CLAUDE.md .agents .claude .github/workflows docs/fuckia fuckia.config.yaml; do
  if [ -e "$target_dir/$signal" ]; then
    is_existing_project="true"
  fi
done

safe_name() {
  printf '%s' "$1" | sed 's/[^A-Za-z0-9._-]/__/g'
}

proposal_path_for() {
  printf 'docs/fuckia/merge-proposals/%s.md' "$(safe_name "$1")"
}

declare -a create_files=()
declare -a preserve_files=()
declare -a identical_files=()
declare -a proposal_files=()

for index in "${!sources[@]}"; do
  source_file="${sources[$index]}"
  output_file="${outputs[$index]}"
  kind="${kinds[$index]}"
  target_file="$target_dir/$output_file"

  if [ "$kind" = "optional" ] && [ -e "$target_file" ]; then
    preserve_files+=("$output_file")
    continue
  fi

  if [ -e "$target_file" ]; then
    if cmp -s "$source_file" "$target_file"; then
      identical_files+=("$output_file")
    else
      preserve_files+=("$output_file")
      proposal_files+=("$(proposal_path_for "$output_file")")
    fi
  else
    create_files+=("$output_file")
  fi
done

echo "Fuckia Agent Install"
echo "===================="
echo "mode: $mode"
echo "agent_mode: $resolved_agent_mode"
echo "agent_mode_reason: $agent_mode_reason"
echo "target: $target_dir"
echo "target_kind: $([ "$is_existing_project" = "true" ] && echo "existing" || echo "new")"
echo

print_list() {
  title="$1"
  shift
  echo "$title"
  if [ "$#" -eq 0 ]; then
    echo "- none"
  else
    for item in "$@"; do
      echo "- $item"
    done
  fi
  echo
}

markdown_list() {
  if [ "$#" -eq 0 ]; then
    echo "- none"
  else
    for item in "$@"; do
      echo "- \`$item\`"
    done
  fi
}

print_list "files_to_create:" "${create_files[@]+"${create_files[@]}"}"
print_list "files_to_preserve:" "${preserve_files[@]+"${preserve_files[@]}"}"
print_list "merge_proposals_to_create:" "${proposal_files[@]+"${proposal_files[@]}"}"
print_list "identical_files:" "${identical_files[@]+"${identical_files[@]}"}"

if [ "$mode" = "dry-run" ]; then
  echo "writes: none"
  exit 0
fi

for proposal_file in "${proposal_files[@]+"${proposal_files[@]}"}"; do
  if [ -e "$target_dir/$proposal_file" ]; then
    echo "Blocked: merge proposal already exists: $proposal_file" >&2
    exit 1
  fi
done

if [ "$is_existing_project" = "true" ] && [ ! -e "$target_dir/docs/fuckia/migration-plan.md" ]; then
  mkdir -p "$target_dir/docs/fuckia"
  cat > "$target_dir/docs/fuckia/migration-plan.md" <<EOF
# Fuckia Migration Plan

Target: \`$target_dir\`
Agent mode: \`$resolved_agent_mode\`

Existing governance files are preserved. Proposed Fuckia content for existing files is written under \`docs/fuckia/merge-proposals/\`.

## Files To Create

$(markdown_list "${create_files[@]+"${create_files[@]}"}")

## Files To Preserve

$(markdown_list "${preserve_files[@]+"${preserve_files[@]}"}")

## Merge Proposals

$(markdown_list "${proposal_files[@]+"${proposal_files[@]}"}")
EOF
fi

for index in "${!sources[@]}"; do
  source_file="${sources[$index]}"
  output_file="${outputs[$index]}"
  kind="${kinds[$index]}"
  target_file="$target_dir/$output_file"

  if [ "$kind" = "optional" ] && [ -e "$target_file" ]; then
    continue
  fi

  if [ -e "$target_file" ]; then
    if cmp -s "$source_file" "$target_file"; then
      continue
    fi

    proposal_file="$(proposal_path_for "$output_file")"
    proposal_target="$target_dir/$proposal_file"
    mkdir -p "$(dirname "$proposal_target")"
    {
      echo "# Merge Proposal: $output_file"
      echo
      echo "Fuckia did not overwrite the existing file."
      echo
      echo "Target file: \`$output_file\`"
      echo "Source: \`${source_file#$fuckia_dir/}\`"
      echo
      echo "Review the existing file and merge the relevant governance rules manually."
      echo
      echo "## Proposed Content"
      echo
      echo '````text'
      cat "$source_file"
      echo '````'
    } > "$proposal_target"
    continue
  fi

  mkdir -p "$(dirname "$target_file")"
  cp "$source_file" "$target_file"
done

echo "status: applied"
