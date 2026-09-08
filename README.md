# Spaceship X26 — Passenger Resource Management System

Take-home submission for EverestEngineering (Lead Software Engineer role).

## Stack

- NestJS + TypeScript (ESM, Vitest) — matches the role's required stack
- PostgreSQL via TypeORM (hosted on Supabase) — for relational data modeling
- React + Vite + TypeScript frontend (separate repo: `prms-web`)

## Architecture

- `src/domain` — framework-agnostic business logic (membership tiers, access policy, Crew Lead invariant). No NestJS/TypeORM dependencies.
- `src/infrastructure` — TypeORM entities implementing persistence for the domain.
- `src/<feature>` (crew-leads, passengers, resources, access-control, reporting) — thin NestJS controllers/services/DI wiring per module.

Implements all three challenge levels: basic passenger/resource management with the Crew Lead invariant (Level 1), real-time access validation and audit logging (Level 2), and personal history / aggregated reporting / usage analytics (Level 3).

## Key design decisions

- `AccessPolicy` is an interface (`TierBasedAccessPolicy` the current implementation), not inline conditionals — new access rules plug in without touching existing code. Tiers are an ordinal enum (Silver < Gold < Platinum), so "higher tiers inherit lower access" is a single comparison.
- The exactly-3-Crew-Leads invariant is enforced with a Postgres advisory lock (`pg_advisory_xact_lock`) in a transaction, not a plain check-then-insert — a naive count check has a race window where two concurrent requests can both read count=2 and both succeed.
- `UsageRecord` serves as both the audit trail (Level 2) and the personal-history source (Level 3) — no separate audit table, since every resource interaction is inherently the audit entry.
- Resource access is re-checked live at time of use, not cached from discovery time — a passenger downgraded after viewing accessible resources is correctly denied on the actual use attempt.

## Trade-offs

- No real auth (JWT) — Crew-Lead-only endpoints are logically separated but not gated behind a real session. Would add this first with more time.
- `synchronize: true` instead of migrations — reasonable for a take-home, not for production.
- Dev/local DB is hosted Supabase Postgres rather than local Docker/SQLite, after hitting a Docker PATH conflict and a native-binary build failure (`better-sqlite3`) on Windows. Schema/entity code is environment-agnostic either way.
- Frontend/backend DTOs are duplicated (separate `prms-api`/`prms-web` repos) rather than shared via a types package or generated OpenAPI client.

## Areas to improve with more time

- Real authentication/authorization to enforce the Crew-Lead-only endpoints
- TypeORM migrations instead of `synchronize`
- A shared types package or generated OpenAPI client between API and web
- More edge-case tests (e.g. a resource decommissioned mid-use, a tier downgrade racing a use-resource request)
- OpenAPI/Swagger documentation
- CI pipeline (lint + test on push)

## AI tool usage disclosure

- **Tool:** Claude (Anthropic)
- **Used for:** architecture and design discussion (including choosing between the offered coding challenges), scaffolding modules/entities/services/controllers, debugging environment issues (npm dependency resolution, Node/npm version compatibility, native module build failures, Supabase connection pooling/IPv6 routing, a Windows PATH conflict, TS decorator config), and reviewing test output.
- **AI-assisted:** the domain layer (`AccessPolicy` pattern, tier modeling), TypeORM entities, the concurrency-safe Crew Lead invariant, the feature services/controllers, unit tests, and this README.
- Built iteratively — domain model, then persistence, then each feature module — verifying each layer before moving to the next. All architectural and business-logic decisions were reviewed and approved before implementation.

## Running locally

```bash
npm install
cp .env.example .env   # set DATABASE_URL to your Postgres connection string
npm run start:dev
npm test
```
