# Repararea testelor pentru PR #13

Ramura verificata: `responsive-frontend`, commit `f593ce7`. Referintele au fost actualizate cu `git fetch origin --prune`. API-ul GitHub confirma ca PR #13 are acelasi commit. In executia CI `37119113212`, backendul esua la pytest, frontendul la Playwright; infrastructure si containers treceau. Modificarile de mai jos sunt locale, fara commit sau push.

## Fisiere schimbate si scop

| Fisiere | Schimbare |
| --- | --- |
| `backend/tests/test_profile.py` | Verifica activitatea initiala blocata si factorul sedentar pentru zero sesiuni. |
| `backend/tests/test_session_activity.py` | Verifica pragurile 0-8 sesiuni, permisiunile, recalcularea tintelor si independenta fata de media activitatii zilnice. |
| `backend/tests/test_energy.py` | Separa raportul zilnic de tinta profilului; testul de proprietate foloseste ID-ul sportului creat. |
| `backend/tests/test_progress_route.py`, `test_progress_routes.py` | Creeaza sporturi, exercitii si sesiuni pentru fiecare utilizator; verifica izolarea si catalogul exact. |
| `backend/tests/test_live_training_report.py` | Creeaza definitiile exercitiilor si foloseste ID-urile generate in raport. |
| `backend/tests/test_template_actions.py`, `test_restore_template_from_workout.py` | Elimina ID-urile impuse 45/46 din fixture-uri. |
| `backend/tests/test_tracking.py` | Verifica actualizarea sesiunii finalizate, conform comportamentului existent. |
| `backend/tests/test_food_catalog.py` | Configureaza explicit filtrarea pentru Romania si testeaza separat cautarea globala. |
| `backend/tests/test_food_experience.py` | Foloseste modulul CLI existent `scripts.import_off`. |
| `frontend/src/tests/barcode.test.mjs` | Corecteaza importul modulului de coduri de bare. |
| `frontend/e2e/activity.spec.cjs` | Mock coerent cu ID-urile returnate, data salvata, finalizarea si stergerea sesiunii; verifica URL-ul cu `?day=`. |
| `frontend/e2e/profile.spec.cjs` | Mock si verificari conforme API-ului pentru activitate initiala fixa si nivel curent calculat din sesiuni. |
| `frontend/e2e/food-catalog.spec.cjs` | Furnizeaza raspunsuri de profil valide dupa navigarea din catalog. |
| `frontend/e2e/food-experience.spec.cjs` | Verifica ID-ul alimentului din fixture, fara a repeta un numar in asteptarea payload-ului. |
| `frontend/e2e/responsive.spec.cjs` | Corecteaza endpoint-urile sporturilor si referintele din mock-uri; scrie capturile in rezultatele testului, fara a rescrie imaginile versionate. |
| `frontend/e2e/activity.spec.js`, `food-experience.spec.js` | Elimina copiile redundante; suitele `.cjs` pastreaza acoperirea. |
| `frontend/playwright.shared.cjs`, `playwright.config.js` | Configuratie comuna, un singur proces Vite si descoperirea tuturor suitelor, inclusiv articole. |
| `frontend/playwright.activity.config.cjs`, `playwright.activity.confic.cjs` | Nume corect pentru configuratia activitatii si compatibilitate cu vechiul nume. |
| `frontend/playwright.food-catalog.config.cjs`, `playwright.food-catalog.config.js` | Folosesc configuratia comuna si un export ESM valid pentru fisierul `.js`. |
| `frontend/playwright.profile.config.cjs`, `playwright.responsive.config.cjs` | Refolosesc configuratia comuna, evitand divergentele dintre comenzi. |
| `frontend/package.json`, `.github/workflows/ci.yml` | Comenzi unitare explicite si executarea lor in CI; comanda E2E ruleaza toate suitele. |
| `frontend/src/features/profile/PersonalProfileFields.jsx` | Afiseaza separat nivelul curent si alegerea istorica; selectia exista doar la primul profil. |
| `frontend/src/features/profile/ProfileSettings.jsx` | Afiseaza nivelul automat, intervalul si avertizarea pentru sesiuni fara durata. |
| `frontend/src/features/profile/ProfileScreen.jsx` | Pastreaza activitatea initiala din API la salvare si conserva obiectivul nesalvat la refresh. |
| `frontend/src/features/profile/profileForm.js` | Permisiunile de rezerva blocheaza activitatea pentru profilurile existente. |
| `frontend/src/features/profile/ProfileRecommendation.jsx` | Explica sursa reala a recomandarii: repaus inmultit cu factorul activitatii din sesiuni. |
| `frontend/src/features/auth/LoginScreen.jsx`, `frontend/src/components/activity/EnergyPanel.jsx` | Actualizeaza explicatiile care promiteau editarea activitatii initiale. |
| `review/test-repair.md` | Documenteaza implementarile, verificarile si limitele. |

## Implementare si flux de date

Backendul de productie nu a fost modificat. Fixture-urile creeaza entitatile necesare, fac `flush()` sau citesc raspunsul API, apoi folosesc ID-urile generate. Numerele arbitrare sunt potrivite in datele unui test unitar sau ale unui mock coerent, dar nu in locul unor inregistrari lipsa dintr-un test cu baza de date.

Corectia reala din frontend elimina discrepanta fata de contractul publicat de backend. `ProfileScreen` citeste `activity_summary` si `edit_permissions`; `PersonalProfileFields` afiseaza nivelul curent fara editare si pastreaza alegerea initiala ca informatie istorica. Salvarea obiectivului trimite activitatea initiala existenta. Calculul ramane pe server, in `recommendation()` si `summarize_activity()`.

Fluxul aplicatiei: UI -> client API cu token Firebase -> endpoint profil -> autentificare si verificarea proprietarului -> servicii de profil/activitate -> SQLAlchemy -> raspuns cu recomandare, rezumat si permisiuni -> UI. Testele backend folosesc baze izolate si suprascriu dependentele; Playwright simuleaza API-ul si autentificarea exclusiv in teste.

## Considerente si decizii arhitecturale

Nu sunt dependinte sau migrari noi. Verificarile de autorizare, istoricul tintelor si prioritatea tintelor manuale au fost pastrate. Testele de progres verifica explicit ca exercitiile altui utilizator nu apar. Configuratia Playwright comuna reduce divergentele; serverul este pornit pe un port fix cu `--strictPort` si fara reutilizarea unui proces existent. Capturile sunt artefacte ignorate de Git.

Testele browserului verifica interfata cu API simulat, fara a demonstra singure integrarea reala Firebase/PostgreSQL. PostgreSQL local nu a putut fi verificat: pornirea containerului temporar a esuat deoarece Docker daemon nu ruleaza. Rularea GitHub Actions pentru modificarile locale necesita un commit/push ulterior.

In aceasta sesiune Windows cu sandbox, Playwright a asteptat oprirea procesului Vite dupa terminarea verificarilor. Au fost oprite doar procesele de preview cu PID-urile identificate in logurile propriilor rulari; apoi comenzile au terminat cu exit code 0. Gestionarea automata a proceselor in Linux CI nu a fost verificata local. Au aparut si mesaje Vite proxy `ECONNREFUSED` la inchiderea paginilor cu API simulat; acestea nu au produs teste esuate.

## Verificare

- Baseline backend: 29 teste esuate, 80 trecute.
- Rulare finala backend: `..\.venv\Scripts\python.exe -m pytest tests -q`, din `backend`: **112 trecute**, o avertizare de depreciere Starlette/AnyIO.
- Frontend unit: `npm run test:unit`, din `frontend`: **2 trecute**.
- Frontend browser: `npm run test:e2e -- --output test-results/ci-repair-final`, din `frontend`: **41 trecute** in 2,9 minute, inclusiv articole, profil, activitate, alimente si responsive; exit code 0 dupa cleanup-ul descris mai sus.
- `npm run build`: trecut.
- Diff-ul efectiv a fost revizuit conform skill-ului `implementation-review`; `git diff --check`: trecut.
- Captura Playwright pentru patru sesiuni a fost inspectata: nivel curent Moderat, alegerea initiala afisata separat si pastrata fixa.
- Ajustarile finale strict din mock-uri: filtrul Playwright `-g '4 completed sessions|7 completed sessions|all routes at 320px'`: **3 trecute**, exit code 0 dupa cleanup.
- Descoperire prin `--list`: configuratia food-catalog ESM **13 teste**, configuratia activity si aliasul cu numele vechi **18 teste** fiecare, exit code 0. Exportul ESM foloseste direct configuratia comuna pentru a evita blocarea loader-ului Playwright.
