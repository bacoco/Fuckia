export interface GitHubRemote {
  owner: string;
  repo: string;
  remoteUrl: string;
  fullName: string;
  webUrl: string;
}

export function parseGitHubRemote(remoteUrl: string): GitHubRemote | null {
  const trimmed = remoteUrl.trim();
  const httpsMatch = trimmed.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/);
  const sshMatch = trimmed.match(/^git@github\.com:([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
  const sshUrlMatch = trimmed.match(/^ssh:\/\/git@github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
  const match = httpsMatch ?? sshMatch ?? sshUrlMatch;

  if (!match) {
    return null;
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  return {
    owner,
    repo,
    remoteUrl: trimmed,
    fullName: `${owner}/${repo}`,
    webUrl: `https://github.com/${owner}/${repo}`
  };
}
