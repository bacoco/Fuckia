# AI Improvement Policy

AI can help improve Fuckia, but AI does not own final authority.

## Allowed AI Work

Agents may:

- summarize public issues;
- cluster repeated failure classes;
- propose updates to rules, skills, templates, validators, and docs;
- draft pull requests;
- write tests and fixtures;
- update failure catalog entries;
- prepare migration notes.

## Required Human Or Independent Review

Before merge, an improvement PR must have:

- a linked issue or failure report;
- explicit acceptance criteria;
- verification commands;
- PDG pass;
- review by a human or independent agent that did not implement the change.

## Forbidden AI Work

Agents must not:

- merge their own PRs;
- auto-close public reports as fixed without verification;
- weaken the constitution;
- remove safety gates to simplify installation;
- use private user data from reports;
- write changes into external product repositories while analyzing Fuckia issues.

## Self-Application

Fuckia must apply its own rules to self-improvement:

- evidence before claims;
- source of truth before memory;
- plan review before risky implementation;
- no self-review for risky work;
- real verification before Done;
- archived receipt after merge.

## Future Automation

Future automation can add:

- issue clustering;
- duplicate detection;
- failure-class trend reports;
- proposed PR drafts;
- validator gap reports.

Future automation must keep human or independent review before merge.
