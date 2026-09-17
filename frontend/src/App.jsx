import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, AuthProvider, useAuth } from "./auth";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
function SignedIn({children}) {
  const {user,loading}=useAuth();
  if(loading)return <main>Se verifică sesiunea…</main>;
  return user?children:<Navigate to="/login" replace/>;
}
function AdminRoute() {
  const { user, admin, loading } = useAuth();
  if (loading) return <main>Se verifică sesiunea…</main>;
  if (!user) return <Navigate to="/login" replace/>;
  return admin ? <AdminPage/> : <main>Acces rezervat administratorilor.</main>;
}
function Layout() {
  const { user, admin } = useAuth();
  return <><nav><Link to="/articles"><strong>ATHLETICA</strong></Link><div>
    <Link to="/articles">Articole</Link>
    <Link to="/workouts">Antrenamente</Link>
    <Link to="/nutrition">Alimentație</Link>
    {admin && <Link to="/admin">Admin</Link>}
    {user ? <button onClick={() => signOut(auth)}>Deconectare</button> : <Link to="/login">Autentificare</Link>}
  </div></nav><Routes>
    <Route path="/" element={<Navigate to="/articles" replace/>}/>
    <Route path="/articles" element={<ArticlesPage/>}/>
    <Route path="/articles/:slug" element={<ArticlePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/admin" element={<AdminRoute/>}/>
    <Route path="/workouts" element={<SignedIn><WorkoutsPage/></SignedIn>}/>
    <Route path="/nutrition" element={<SignedIn><NutritionPage/></SignedIn>}/>
    <Route path="*" element={<main>Pagina nu există. <Link to="/articles">Toate articolele</Link></main>}/>
  </Routes></>;
}
export default function App() { return <BrowserRouter><AuthProvider><Layout/></AuthProvider></BrowserRouter>; }
