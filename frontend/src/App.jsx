import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, AuthProvider, useAuth } from "./auth";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import WorkoutSessionsPage from "./pages/WorkoutSessionsPage";
import SportsCatalogPage from "./pages/SportsCatalogPage";
import NutritionPage from "./pages/NutritionPage";
import React, { useEffect, useRef, useState } from "react";

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
  const { user, admin } = useAuth();

  return (
    <>
      <nav>
        <Link to="/articles">
          <strong>ATHLETICA</strong>
        </Link>
        <div>
          <Link to="/articles">Articole</Link>
          <details className="nav-dropdown">
            <summary>Antrenamente</summary>

            <div className="nav-dropdown-menu">
              <Link
                to="/workouts/sessions"
                onClick={(event) =>
                  event.currentTarget
                    .closest("details")
                    ?.removeAttribute("open")
                }
              >
                Sesiuni
              </Link>

              <Link
                to="/workouts/catalog"
                onClick={(event) =>
                  event.currentTarget
                    .closest("details")
                    ?.removeAttribute("open")
                }
              >
                Catalog sporturi
              </Link>
            </div>
          </details>
          <Link to="/nutrition">Alimentatie</Link>
          {admin && <Link to="/admin">Admin</Link>}
          {user ? (
            <button onClick={() => signOut(auth)}>Deconectare</button>
          ) : (
            <Link to="/login">Autentificare</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/articles" replace />} />
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
          <Route path="sessions" element={<WorkoutSessionsPage />} />
          <Route path="catalog" element={<SportsCatalogPage />} />
        </Route>

        <Route
          path="/nutrition"
          element={
            <SignedIn>
              <NutritionPage />
            </SignedIn>
          }
        />
        <Route
          path="*"
          element={
            <main>
              Pagina nu exista. <Link to="/articles">Toate articolele</Link>
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
