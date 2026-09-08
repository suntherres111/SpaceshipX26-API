# Spaceship X26 — Passenger Resource Management System

## Approach

Built with a clean-architecture split: framework-agnostic domain logic (`src/domain`),
persistence via TypeORM (`src/infrastructure`), NestJS modules as the thin outer layer
(`src/<feature>`). Chose this over a framework-first structure so business rules
(tier inheritance, Crew Lead invariant, access policy) are unit-testable without
spinning up Nest's DI container.

## Tech stack

- NestJS + TypeScript (ESM, Vitest) — chosen to match the JD's required stack and to
  keep one module system/test runner consistent with the React frontend
- PostgreSQL via TypeORM — chosen over in-memory storage to demonstrate relational
  data modeling (explicitly required in the JD), using TypeORM's decorator-based
  entities as the closest match to my existing EF Core experience
- React (Vite, TypeScript) frontend — separate repo, consumes this API

## Design decisions

- `AccessPolicy` is an interface (`TierBasedAccessPolicy` the current implementation)
  rather than inline conditionals, so new access rules can be added without touching
  existing code (Open/Closed).
- Crew Lead count (exactly 3) is enforced as an explicit domain invariant, not just a
  DB constraint — [fill in once implemented: how the check avoids a race between
  concurrent creation requests].

## Assumptions

- Pickup/notification-style external systems (if any) are out of scope, per the brief.
- [add more as they come up]

## Trade-offs (given the time constraint)

- `synchronize: true` used for TypeORM schema creation instead of migrations —
  acceptable for a take-home, would use proper migrations in production.
- Frontend/backend DTOs are duplicated rather than shared via a types package, since
  the two are separate repos — a generated client or shared package would be the
  production version of this.
- [add more as they come up]

## Areas to improve with more time

- [fill in at the end — likely candidates: more exhaustive edge-case tests, an OpenAPI
  spec, shared types package, CI pipeline]

## AI tool usage disclosure

- Tool(s) used: Claude
- How used: [fill in — e.g. architecture discussion, scaffolding boilerplate, debugging
  npm/environment issues, code review]
- Portions AI-assisted: [be specific per module once you know]
- Notable prompts/workflow: [optional]

## Running locally

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npm run start:dev
npm test
```
