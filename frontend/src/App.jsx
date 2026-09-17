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
import HomePage from "./pages/HomePage";


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
          element={<SignedIn><WorkoutsPage /></SignedIn>}
        >
          <Route index element={<Navigate to="/workouts/sessions" replace />} />
          <Route path="sessions" element={<WorkoutSessionsPage />} />
          <Route path="catalog" element={<SportsCatalogPage />} />
        </Route>

        <Route
          path="/nutrition"
          element={<SignedIn><NutritionPage /></SignedIn>}
        />
        <Route
          path="*"
          element={<main>Pagina nu exista. <Link to="/articles">Toate articolele</Link></main>}
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
