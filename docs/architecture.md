# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- Presentation tier decision: React components load data via getJson() from src/api/client.ts using relative /api paths proxied to port 8000; each component renders loading (role="status"), error (role="alert"), and empty states accessibly.
- Logic tier decision: Express routes delegate to service functions in src/services/octofitService.ts; services validate input and return 4xx responses for invalid user/team IDs without throwing 500 errors; routes handle success/error responses.
- Data tier decision: Mongoose schemas define required fields and validation; User and Team are stored separately; Activity references both and computes points; Workout tracks focus/difficulty; seed script uses upserts to idempotently create demo data.
- Activity tracking approach: POST /api/activities validates userId and teamId as ObjectId references to existing documents; calculates points based on activity type and minutes; stores occurredAt as current timestamp; rejects invalid IDs with 400.
- Team management approach: POST /api/teams validates name is required; responds with 400 if missing; creates team with name, mascot, and empty members array; GET lists all teams with their member IDs.
- Leaderboard approach: Aggregate activities by team, sum points per team, sort by total points descending, add 1-based rank; return teamName, totalPoints, and rank for each entry.
- Workout suggestions approach: Find user by email from seeded data; match workouts to user's fitnessGoal or recent activity type; return suggestions with focus, duration, difficulty, and reason; respond with 404 if email not found.

## Test plan

Record the commands you run and what each failure means.

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend` — validates User, Team, Activity, Workout schemas have required fields and constraints; currently fails because schemas lack required field definitions and computed properties (points, occurredAt).
- API command: `npm run test:api --prefix octofit-tracker/backend` — validates all /api/* routes behave per contract (POST validation, rejection of invalid IDs, leaderboard ranking, workout suggestions by email); currently fails because createActivity and createTeam throw 501, getLeaderboard returns empty, suggestWorkouts has no filtering logic.
- Frontend command: `npm test --prefix octofit-tracker/frontend` — validates components load via getJson(), render loading/error/empty states with accessible ARIA roles; currently fails because components lack data loading and state rendering.
- Backend build command: `npm run build --prefix octofit-tracker/backend` — TypeScript compilation check; validates no type errors; run after each backend change.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend` — Vite bundle and TypeScript check; validates no type errors and optimization; run after each frontend change.
