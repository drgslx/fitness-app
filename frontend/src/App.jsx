import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Navbar from "./components/Navbar";
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const WorkoutsPage = lazy(() => import("./pages/WorkoutsPage"));
const WorkoutSessionsPage = lazy(() => import("./pages/WorkoutSessionsPage"));
const SportsCatalogPage = lazy(() => import("./pages/SportsCatalogPage"));
const NutritionPage = lazy(() => import("./pages/NutritionPage"));
const NutritionJournalPage = lazy(() => import("./pages/NutritionJournalPage"));
const FoodFormPage = lazy(() => import("./pages/FoodFormPage"));
const RecipesPage = lazy(() => import("./pages/RecipesPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AddSportPage = lazy(() => import("./pages/AddSportPage"));
const AddSessionPage = lazy(() => import("./pages/AddSessionPage"));
const WorkoutReportsPage = lazy(() => import("./pages/WorkoutReportsPage"));
const NutritionReportsPage = lazy(() => import("./pages/NutritionReportsPage"));

function SignedIn({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <main>Se verifica sesiunea...</main>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const { user, admin, loading } = useAuth();
  if (loading) return <main>Se verifica sesiunea...</main>;
  if (!user) return <Navigate to="/login" replace />;
  return admin ? <AdminPage /> : <main>Acces rezervat administratorilor.</main>;
}

function Layout() {
  return (
    <>
      <Navbar />
      <div id="page-content" tabIndex={-1}>
        <Suspense
          fallback={
            <main>
              <p role="status">Se incarca pagina...</p>
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <SignedIn>
                  <ProfilePage />
                </SignedIn>
              }
            />
            <Route path="/admin" element={<AdminRoute />} />

            <Route
              path="/workouts"
              element={
                <SignedIn>
                  <WorkoutsPage />
                </SignedIn>
              }
            >
              <Route
                index
                element={<Navigate to="/workouts/sessions" replace />}
              />
              <Route path="reports" element={<WorkoutReportsPage />} />

              <Route path="sessions" element={<WorkoutSessionsPage />} />

              <Route path="sessions/new" element={<AddSessionPage />} />

              <Route
                path="sessions/:sessionId/edit"
                element={<AddSessionPage />}
              />

              <Route path="catalog" element={<SportsCatalogPage />} />

              <Route path="sports/new" element={<AddSportPage />} />
            </Route>

            <Route
              path="/nutrition"
              element={
                <SignedIn>
                  <NutritionPage />
                </SignedIn>
              }
            >
              <Route
                index
                element={<Navigate to="/nutrition/journal" replace />}
              />

              <Route path="journal" element={<NutritionJournalPage />} />
              <Route path="reports" element={<NutritionReportsPage />} />

              <Route path="foods/new" element={<FoodFormPage />} />
              <Route path="foods/:foodId/edit" element={<FoodFormPage />} />
              <Route path="recipes" element={<RecipesPage />} />
            </Route>

            <Route
              path="*"
              element={
                <main>
                  Pagina nu exista. <Link to="/">Acasa</Link>
                </main>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
