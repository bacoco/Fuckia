# Prompt a donner au dev

Tu dois creer un repo/template reutilisable pour coordonner Claude Code, Codex, Linear et GitHub sur les nouveaux projets et les projets existants.

Lis d'abord `00-agent-constitution.md`. Ces lois sont le contrat racine du systeme. Elles ne sont pas une checklist de developpeur.

Lis d'abord tous les fichiers dans ce dossier:

```text
docs/specs/specs/2026-05-19-claude-codex-linear-github-collaboration-kit/
```

Objectif:

- Les 5 lois de `00-agent-constitution.md` doivent gouverner tous les skills, templates, validators, workflows, reviews et receipts.
- Linear doit devenir le cockpit actif: spec active, contrats d'issues, statuts, decisions, verification receipts.
- GitHub doit rester la preuve technique: branches, PRs, CI, reviews, merge history, archive versionnee.
- Claude et Codex doivent suivre les memes regles.
- Les skills partages doivent etre ecrits une seule fois dans une source neutre, puis generes vers les formats Claude et Codex.
- Les roles planner, plan reviewer, implementer, code reviewer et verifier doivent etre separes sur les travaux risques.
- Les agents ne doivent jamais declarer Done seulement parce que les tests unitaires ou le typecheck passent.
- Le systeme doit couvrir le catalogue des 8 classes d'echec de `07-failure-catalog-cross-review.md`.
- Le systeme doit livrer le set initial de skills et les mitigations supplementaires de `08-initial-skills-and-risk-map.md`.
- Le systeme doit appliquer `11-evidence-language-guard.md`: pas de causalite incertaine sans preuve.

Livrables attendus:

1. Un repo/template installable sur un nouveau projet.
2. Une procedure de migration pour projet existant.
3. Les templates Linear: Project, issue contract, statuses, verification receipt.
   - Inclure les issue types ou templates: spec, plan, plan-review, implement, code-review, verify.
   - `plan-review` doit bloquer `implement` sur les travaux risques.
4. Les templates GitHub: PR template, workflows/checks, branch protection guide.
5. Le systeme de skills:
   - shared;
   - claude-only;
   - codex-only;
   - skills v1 de `08-initial-skills-and-risk-map.md`;
   - generateurs;
   - validateurs;
   - hash check des fichiers generes.
6. Les checks minimaux:
   - constitution references;
   - Linear ID obligatoire;
   - allowed/forbidden files;
   - delete budget;
   - plan-review approval;
   - planner/reviewer separation;
   - implementer/code-reviewer separation;
   - generated skills sync;
   - evidence language guard;
   - verification receipt;
   - archive snapshot.
7. Un mode warning puis un mode strict.
8. Une demo sur repo vierge.
9. Un pilote sur un projet existant.

Contraintes non negociables:

- Ne pas traiter `00-agent-constitution.md` comme de la documentation passive.
- Chaque loi doit etre mappee a des skills, templates, checks, gates ou receipts.
- Ne pas inventer les APIs Linear/GitHub/Claude/Codex. Verifier les docs officielles et documenter les choix.
- Ne pas ecrire deux versions manuelles des skills partages.
- Ne pas laisser un skill Claude-only ou Codex-only affaiblir une regle partagee.
- Ne pas donner a un troisieme modele un role d'ecriture sans contrat Linear, file locks et gates GitHub.
- Ne pas ecrire une cause incertaine sans preuve. Utiliser `Unknown`, poser une question, ou verifier.
- Ne pas faire de Linear une simple archive Markdown. Linear est actif.
- Ne pas faire de GitHub une simple duplication. GitHub est la preuve et l'archive versionnee.
- Ne pas autoriser un agent a remplacer un moteur, shell, route, hook, store ou pipeline existant sans contrat Linear explicite.
- Ne pas autoriser les subagents paralleles sur les memes fichiers.
- Ne pas autoriser un agent a approuver son propre plan sur un travail risque.
- Ne pas autoriser un agent a etre le seul reviewer de son propre code sur un travail risque.
- Ne pas auto-merger sur typecheck ou tests unitaires.
- Ne pas migrer tous les projets en strict avant un pilote.

Avant de coder, produis une courte note de decisions:

```text
Capabilities verifiees:
Choix techniques:
Risques:
Fallbacks:
Plan de pilotage:
```

Definition of Done du repo/template:

- constitution referencee par README, skills generes, templates, validators et workflows;
- generation Claude/Codex prouvee;
- validation de skill invalide prouvee;
- PR test qui echoue sur fichier interdit;
- PR test qui echoue sur delete budget;
- PR test qui echoue sur skill genere modifie a la main;
- doctor qui detecte skill non charge, doublon, shadowing, frontmatter invalide, hash stale, AGENTS/CLAUDE divergence;
- check qui bloque le langage causal non prouve dans les plans, reviews, receipts et handoffs;
- issue implement bloquee tant que plan-review n'est pas approuvee;
- tentative de self-review bloquee ou escaladee;
- issue Linear pilote avec verification receipt;
- archive GitHub d'un snapshot Linear;
- documentation courte pour installer sur nouveau projet et migrer un projet existant.

Contexte important:

Ce kit est ne d'un incident ou un agent a interprete un plan ambigu comme permission de creer un moteur parallele, supprimer une grande partie d'un shell fonctionnel, faire passer des tests isoles, puis declarer succes sans verifier le vrai parcours produit.
Le kit ne doit pas seulement eviter ce cas precis; il doit prevenir les classes generales d'echecs entre Claude et Codex:
spec ambigue, implementation divergente, self-review, coordination invisible, tooling asymetrique,
verification insuffisante, memoire contradictoire, et cout/boucle excessive.

Problemes supplementaires a traiter explicitement:

- skill non charge, tronque, shadowed, ou en doublon;
- split-brain entre Linear, GitHub, Markdown archive et memoire d'agent;
- review theater: commentaire sans decision bloquante;
- prompt injection par issue, PR, commit, screenshot ou fichier d'instructions modifie dans la branche;
- PR forks sans secrets disponibles;
- worktrees stale et branches obsoletes;
- subagents ou cloud tasks qui ecrivent hors scope visible;
- bypass d'urgence qui devient la norme;
- verification sur mauvais environnement;
- fuite de donnees dans les archives;
- boucles infinies Claude/Codex de fix/review.
- langage prudent mais non prouve qui transforme une hypothese en fait.
