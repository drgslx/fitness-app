import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle, imageUrl } from "../../api/articles";
import { useAuth } from "../../auth";
export default function ArticleScreen() {
  const { slug } = useParams();
  const { admin } = useAuth();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setArticle(null);
    setError("");
    window.scrollTo(0, 0);
    getArticle(slug)
      .then((data) => active && setArticle(data))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [slug]);
  return (
    <main className="max-w-[850px] [&_h1]:break-words [&_h1]:leading-tight [&_figure]:my-6 [&_img]:w-full [&_img]:rounded-2xl">
      <Link className="text-accent hover:underline" to="/articles">
        ← Înapoi la toate articolele
      </Link>
      {error ? (
        <p role="alert" className="notice-error">
          {error}
        </p>
      ) : !article ? (
        <p>Se încarcă…</p>
      ) : (
        <article>
          <p className="text-sm text-muted">
            {new Date(article.created_at).toLocaleDateString("ro-RO")}
            {admin && " · ID: " + article.id}
          </p>
          <h1>{article.title}</h1>
          <p className="text-xl text-[#aab7ae]">{article.summary}</p>
          {article.images.map((image) => (
            <figure key={image.id}>
              <img
                loading="lazy"
                decoding="async"
                src={imageUrl(image.url)}
                alt={image.alt_text}
              />
            </figure>
          ))}
          <div className="mt-4 max-w-[820px] whitespace-pre-wrap break-words leading-relaxed">
            {article.content}
          </div>
          <p>
            <Link className="text-accent hover:underline" to="/articles">
              ← Înapoi la toate articolele
            </Link>
          </p>
        </article>
      )}
    </main>
  );
}
