import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles, imageUrl } from "../api/articles";
import { useAuth } from "../auth";
export default function ArticlesPage() {
  const { admin } = useAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getArticles()
      .then((data) => active && setArticles(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  return (
    <main>
      <section className="max-w-[900px] py-9 md:py-12 [&_h1]:max-w-[900px] [&_h1]:text-5xl [&_h1]:tracking-tight md:[&_h1]:text-7xl [&_p]:max-w-[700px] [&_p]:text-muted">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-accent">
          SPORT SCIENCE · RECUPERARE · ANTRENAMENT
        </span>
        <h1>Antrenează-te informat.</h1>
        <p>
          Articole practice, fără zgomot, pentru sportivi care vor progres
          măsurabil.
        </p>
      </section>
      {error && (
        <p role="alert" className="rounded-lg border border-red-400/30 bg-[#321a18] px-3 py-2 text-[#ffaaaa]">
          {error}
        </p>
      )}
      {loading && <p>Se încarcă…</p>}
      {!loading && !error && !articles.length && (
        <p>Nu există încă articole publicate.</p>
      )}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {articles.map((article) => (
          <Link
            className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-lg transition-colors hover:border-accent/30 block text-inherit no-underline hover:text-inherit focus-visible:outline-2 focus-visible:outline-accent [&_img]:h-48 [&_img]:w-full [&_img]:object-cover"
            to={"/articles/" + article.slug}
            key={article.id}
          >
            {article.images[0] && (
              <img
                src={imageUrl(article.images[0].url)}
                alt={article.images[0].alt_text}
              />
            )}
            <div className="p-4">
              <p className="text-sm text-muted">
                {new Date(article.created_at).toLocaleDateString("ro-RO")}
                {admin && " · ID: " + article.id}
              </p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <span className="text-accent">Citește articolul →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
