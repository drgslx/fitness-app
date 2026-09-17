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
      <section className="hero">
        <span className="eyebrow">
          SPORT SCIENCE · RECUPERARE · ANTRENAMENT
        </span>
        <h1>Antrenează-te informat.</h1>
        <p>
          Articole practice, fără zgomot, pentru sportivi care vor progres
          măsurabil.
        </p>
      </section>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {loading && <p>Se încarcă…</p>}
      {!loading && !error && !articles.length && (
        <p>Nu există încă articole publicate.</p>
      )}
      <section className="grid">
        {articles.map((article) => (
          <Link
            className="card card-link"
            to={"/articles/" + article.slug}
            key={article.id}
          >
            {article.images[0] && (
              <img
                src={imageUrl(article.images[0].url)}
                alt={article.images[0].alt_text}
              />
            )}
            <div className="card-body">
              <p className="meta">
                {new Date(article.created_at).toLocaleDateString("ro-RO")}
                {admin && " · ID: " + article.id}
              </p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <span className="read-more">Citește articolul →</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
