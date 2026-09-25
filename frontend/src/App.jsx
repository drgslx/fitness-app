import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Navbar from "./components/Navbar";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import WorkoutSessionsPage from "./pages/WorkoutSessionsPage";
import SportsCatalogPage from "./pages/SportsCatalogPage";
import NutritionPage from "./pages/NutritionPage";
import NutritionJournalPage from "./pages/NutritionJournalPage";
import FoodFormPage from "./pages/FoodFormPage";
import RecipesPage from "./pages/RecipesPage";
import HomePage from "./pages/HomePage";
import AddSportPage from "./pages/AddSportPage";
import AddSessionPage from "./pages/AddSessionPage";
import WorkoutReportsPage from "./pages/WorkoutReportsPage";
import NutritionReportsPage from "./pages/NutritionReportsPage";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute />} />

        <Route
          path="/workouts"
          element={
            <SignedIn>
              <WorkoutsPage />
            </SignedIn>
          }
        >
          <Route index element={<Navigate to="/workouts/sessions" replace />} />
          <Route path="reports" element={<WorkoutReportsPage />} />


          <Route path="sessions" element={<WorkoutSessionsPage />} />

          <Route path="sessions/new" element={<AddSessionPage />} />

          <Route path="sessions/:sessionId/edit" element={<AddSessionPage />} />

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
          <Route index element={<Navigate to="/nutrition/journal" replace />} />

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
