# PR conflict resolution

The resolution combines feature commit `6f8ecf8` with `origin/main` at `31a90eb`. It is prepared in `.merge-resolution`, an isolated Git worktree, because the original checkout cannot access `.agents/skills` even when the merge command runs with elevated approval. The user has authorized publishing the resolution to PR #16 and synchronizing the original checkout. The local inaccessible skills directory is excluded from status scans; its tracked counterpart remains in the merge.

The thirteen textual conflicts are resolved. The profile and training pages retain main's extracted components, navigation, registration flow and responsive styles. The feature's completion dialog, locked personal fields, rolling activity window and individual-session energy calculation are carried into those components.

## Files and purpose

These are the feature's resulting differences from main. Other incoming main files are retained by the merge.

| File | Purpose |
| --- | --- |
| `backend/alembic/versions/0010_workout_completion.py` | Preserve the migration that moves duration/intensity to executed sessions and removes template measurements. |
| `backend/app/api/profile.py` | Retain main's shared edit-permission enforcement and include training days in summaries. |
| `backend/app/models/tracking.py` | Keep nullable session measurements and templates without completion measurements. |
| `backend/app/schemas/tracking.py` | Require measured duration/intensity in completion requests rather than planning requests. |
| `backend/app/services/energy.py` | Use main's shared active-workout selection, sum every session's energy, and retain recorded-day averages. |
| `backend/app/services/profile.py` | Preserve `activity_level_for_sessions`, automatic recommendations and the recorded-average override; retain edit permissions and shared report reuse. |
| `backend/app/services/training_activity.py` | Count all executed sessions in the rolling window, including multiple sessions per day and sessions shorter than fifteen minutes. |
| `backend/app/training/energy_fields.py` | Keep measured fields out of template/planning validation. |
| `backend/app/training/progress_router.py` | Exclude legacy future completions from progress reports. |
| `backend/app/training/sessions_router.py` | Preserve completion validation, ownership, row locking, correction/cancellation and future-date restrictions. |
| `backend/tests/test_energy.py` | Merge current ownership fixtures with completion payload and recorded-average assertions. |
| `backend/tests/test_profile.py` | Retain permission tests, confirm signup activity cannot override recent executed sessions, and reuse migration-seeded goal types instead of inserting duplicate keys in PostgreSQL CI. |
| `backend/tests/test_recent_activity.py` | Keep same-day session, sport-specific energy, month-boundary and future-completion regressions; respect immutable signup data in setup. |
| `backend/tests/test_session_activity.py` | Adapt main's session tests to completion-only measurements and the approved average-based maintenance behavior. |
| `backend/tests/test_tracking.py` | Supply required completion measurements in existing session lifecycle tests. |
| `backend/tests/test_workout_completion.py` | Preserve required-field, idempotency, correction, cancellation and template execution regressions. |
| `backend/tests/test_workout_completion_migration.py` | Preserve migration upgrade/downgrade coverage. |
| `frontend/e2e/activity.spec.cjs` | Retain main's stable mock identifiers and date filtering while testing completion dialogs and future restrictions. |
| `frontend/e2e/profile.spec.cjs` | Combine static personal-field, goal editing and rolling-window tests with main's signup, retry and activity-refresh coverage. |
| `frontend/e2e/responsive.spec.cjs` | Adapt layout assertions to the preserved accordion and visible action footer. |
| `frontend/src/components/activity/EnergyFields.jsx` | Hide duration/intensity during planning and avoid planning calorie previews. |
| `frontend/src/components/activity/EnergyPanel.jsx` | Explain recent session counts, individual energy contributions and confirmed-day averages; use main's shared button component. |
| `frontend/src/components/activity/activityLevels.js` | Share activity labels and the 0 / 1-2 / 3-4 / 5-6 / 7+ session thresholds. |
| `frontend/src/features/profile/MonthSummary.jsx` | Default to the last seven days while retaining the optional monthly view. |
| `frontend/src/features/profile/PersonalProfileFields.jsx` | Render saved identity as text, expose height editing only for minors, and preserve reusable registration fields. |
| `frontend/src/features/profile/ProfileRecommendation.jsx` | Explain whether maintenance comes from recorded-day averages or provisional session frequency. |
| `frontend/src/features/profile/ProfileScreen.jsx` | Pass current activity to extracted settings, including compatibility with feature recommendation metadata. |
| `frontend/src/features/profile/ProfileSettings.jsx` | Restore header editing, goal-only saved-profile controls and static saved goal values. |
| `frontend/src/features/profile/constants.js` | Reuse shared activity options rather than maintain duplicate thresholds. |
| `frontend/src/features/training/SessionsScreen.jsx` | Manage the completion dialog in main's extracted screen. |
| `frontend/src/features/training/components/SessionsList.jsx` | Preserve the session accordion, measured completion summary and visible actions. |
| `frontend/src/features/training/components/workouts/WorkoutCompletionDialog.jsx` | Preserve required completion inputs and apply shared button styles. |
| `frontend/src/features/training/components/workouts/WorkoutSessionForm.jsx` | Keep main's extracted form styling and omit duration/intensity from planned sessions and templates. |
| `review/merge-resolution.md` | Record the resolution, verification and publishing steps. |

The page wrappers `ProfilePage.jsx` and `WorkoutSessionsPage.jsx` now match main and delegate to the extracted screens. Browser-generated changes to main's tracked debug log and npm-generated lockfile metadata are discarded.

## Implementation and data flow

The sessions list opens `WorkoutCompletionDialog`. The dialog submits duration/intensity through the authenticated API client to `PUT /workouts/{id}/completion`. The backend validates the payload, resolves the authenticated user's session, checks the date in the profile timezone, and locks the session. It stores the measurements and creates or updates the completion log in the same transaction as energy-goal refresh. Repeated identical completion requests keep one log.

`active_completed_workouts` filters by owner, log owner, active sport and date. `summarize_activity` counts every selected session independently. `energy_report` calculates each session's net energy from activity type, duration, intensity and eligible body weight, then adds the session energies for that day. Step overlap handling remains intact. Four or more confirmed complete days in the rolling week enable the recorded-energy average for maintenance; otherwise the current session-frequency factor remains provisional. GET requests do not modify goal history.

The profile API exposes shared edit permissions. Saved sex and birth date remain immutable, height is editable only before age eighteen, and the signup activity selection stays historical. The UI displays saved personal data as text and exposes goal controls through the header's Edit button. Registration still uses the shared fields with editable initial inputs.

## Engineering review

- Ownership checks and future-date checks remain enforced by the backend, independently of disabled UI controls.
- Completion mutations retain row locking and atomic goal refresh. Both SQLite and PostgreSQL regressions pass; these tests do not simulate simultaneous requests from multiple independent transactions.
- Both current and historical fallback days use their own inclusive seven-day window. The session count is not deduplicated by day.
- Legacy sessions missing measurements can affect the frequency label, but their energy is unavailable and the day cannot become complete until its issues are resolved.
- Main's shared active-session query and one-report reuse in profile responses are retained. Rolling summaries reuse loaded sessions rather than query once per day. No performance benchmark was run.
- No new dependency or architectural layer was introduced. The approved feature is placed inside main's reusable components instead of restoring duplicated page implementations.
- Previously recorded future completions remain cancellable; they are ignored while their dates are in the future. This merge does not delete existing user records.

## Verification

- `../../.venv/Scripts/python.exe -m pytest -q --tb=short`: **142 passed**. This includes completion migration tests; the only warning is an existing Starlette deprecation.
- `npm run build`: **passed**.
- Playwright activity/profile suites: **20 passed**, including registration, retry, Google signup, activity refresh, completion correction, profile locking and month-boundary selection.
- All nine responsive tests produced passing assertions in an earlier run. Windows teardown stalled, so that finished runner was stopped. The final 320px and 1280px route checks and profile draft check were repeated against an explicitly managed Vite server: **3 passed**, process exit zero.
- Conflict-marker scan and Git whitespace checks: **passed** after staging.

The temporary test server/configuration were removed after verification. No real database deployment or PR merge is part of this change. PostgreSQL checks use a separate disposable database, not the application database.

## Additional CI validation and publication

The complete frontend suite passes: **43 browser tests**, plus **2 unit tests**. All **142 backend tests pass on PostgreSQL** with the same migration-before-tests setup as CI. All **142 also pass on SQLite**. PostgreSQL migration rollback to `0001_articles` and upgrade back to head pass on the disposable test database.

The PostgreSQL run exposed a test fixture bug: `profile_client` inserted goal types already created by migrations. It now checks for each existing key before inserting. This preserves SQLite setup and fixes duplicate-key failures in PostgreSQL CI without changing application behavior.

The user explicitly authorized the merge commit and push on 2026-10-03. The resolution is published as an ordinary branch update to `session-execution-update-feature`, without force-pushing. CI and conflict status can be checked on [PR #16](https://github.com/drgslx/fitness-app/pull/16).

The original checkout can be fast-forwarded to the resolved commit with a local sparse-checkout exception for its inaccessible `.agents` directory. This exception does not remove the shared instructions from GitHub. Merging PR #16 into main remains a separate action.
