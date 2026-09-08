# Spaceship X26 — Passenger Resource Management System

Take-home coding challenge submission for EverestEngineering (Lead Software Engineer role).

## Approach

Built with a clean-architecture split so business rules are independently testable
from the web framework:

- `src/domain` — framework-agnostic business logic (membership tiers, access policy,
  Crew Lead invariant). No NestJS or TypeORM dependencies here.
- `src/infrastructure` — TypeORM entities implementing persistence for the domain.
- `src/<feature>` (crew-leads, passengers, resources, access-control, reporting) —
  thin NestJS modules: controllers, services, DI wiring.

Implemented all three challenge levels: basic passenger/resource management with the
Crew Lead invariant (Level 1), real-time access validation and audit logging (Level 2),
and personal history / aggregated reporting / usage analytics (Level 3).

## Tech stack

- **NestJS + TypeScript** (ESM modules, Vitest for testing) — chosen to match the
  role's required stack (Node.js, TypeScript, React), and to keep one module system
  and test runner consistent with the React frontend.
- **PostgreSQL via TypeORM**, hosted on Supabase — chosen over an in-memory store to
  demonstrate relational data modeling (explicitly required by the role), using
  TypeORM's decorator-based entities as the closest match to prior EF Core experience.
- **React + Vite + TypeScript** frontend — separate repo (`prms-web`), consumes this API.

## Design decisions

- **`AccessPolicy` is an interface** (`TierBasedAccessPolicy` the current
  implementation), not inline conditionals — new access rules can be added without
  touching existing code (Open/Closed principle). Membership tiers are modeled as an
  ordinal enum (Silver=1 < Gold=2 < Platinum=3), so "higher tiers inherit lower access"
  is a single comparison rather than an explicit inheritance graph.
- **The exactly-3-Crew-Leads invariant is enforced with a Postgres advisory lock**
  (`pg_advisory_xact_lock`) wrapped in a transaction, not a plain check-then-insert.
  A naive count check has a race window where two concurrent creation requests can
  both read count=2 and both succeed, producing 4 Crew Leads. The advisory lock
  serializes concurrent creation attempts against this specific invariant.
- **`UsageRecord` doubles as both the audit trail (Level 2) and the personal-history
  source (Level 3)** — no separate audit log table, since every resource interaction
  inherently is the audit entry.
- **Access is re-validated live at the moment a resource is used**, not cached from
  when it was discovered — a passenger downgraded after viewing their accessible
  resources will correctly be denied on the actual use attempt.

## Assumptions

- No authentication/authorization middleware (e.g. JWT) is implemented. Crew-Lead-only
  actions (managing passengers, provisioning/decommissioning resources, changing
  membership levels) are logically separated by endpoint but not technically gated
  behind a real auth session in this submission — see Trade-offs below.
- Resource `category` is a free-text field rather than a constrained enum/lookup table,
  kept simple for the challenge's scope.

## Trade-offs (given the challenge's time constraint)

- **No real authentication layer.** Given the time available, I prioritized the core
  domain logic (access control, the Crew Lead invariant, reporting) over building out
  JWT/session auth. In production this would gate the Crew-Lead-only endpoints for real.
- **`synchronize: true`** is used for TypeORM schema management instead of proper
  migrations — reasonable for a take-home, not something I'd do in production.
- **Connected directly to a hosted Supabase Postgres instance for local development**,
  rather than a local Postgres via Docker or SQLite. This was a pragmatic call after
  hitting a Docker/PATH conflict and a native-binary compilation failure for
  `better-sqlite3` on Windows — rather than lose time to local toolchain issues, I used
  the same hosted database planned for deployment. The schema/entity code is
  environment-agnostic either way.
- **Frontend/backend DTOs are duplicated** rather than shared via a types package,
  since `prms-api` and `prms-web` are separate repos. A generated client (from an
  OpenAPI spec) or a shared package would be the production version of this.

## Areas to improve with more time

- Real authentication/authorization to actually enforce the Crew-Lead-only endpoints.
- TypeORM migrations instead of `synchronize`.
- A shared types package or generated OpenAPI client between API and web.
- More exhaustive edge-case tests (e.g., a resource decommissioned mid-use, a tier
  downgrade racing a use-resource request).
- OpenAPI/Swagger documentation for the API surface.
- CI pipeline (lint + test on push).

## AI tool usage disclosure

- **Tool used:** Claude (Anthropic)
- **How used:** Architecture and design discussion (including choosing between the two
  offered coding challenges), scaffolding NestJS modules/entities/services/controllers,
  debugging environment issues (an npm dependency-resolution bug, Node/npm version
  compatibility, a native module compilation failure, Supabase connection
  pooling/IPv6 routing, a Windows PATH conflict, TypeScript decorator configuration),
  and reviewing test output.
- **Portions AI-assisted:** The domain layer design (`AccessPolicy` pattern,
  membership-tier modeling), TypeORM entity definitions, the concurrency-safe Crew
  Lead invariant implementation, the Passengers/Resources/AccessControl/Reporting
  services and controllers, the unit tests, and this README.
- **Workflow:** Built iteratively, layer by layer — domain model first, then
  persistence, then each feature module in turn — verifying each layer with manual
  API calls before moving to the next. All architectural and business-logic decisions
  were reviewed and approved by me before implementation.

## Running locally

```bash
npm install
cp .env.example .env   # set DATABASE_URL to your Postgres connection string
npm run start:dev
npm test
```
