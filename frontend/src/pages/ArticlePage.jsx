import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle, imageUrl } from "../api/articles";
import { useAuth } from "../auth";
export default function ArticlePage() {
  const { slug } = useParams(); const { admin } = useAuth();
  const [article, setArticle] = useState(null); const [error, setError] = useState("");
  useEffect(() => { let active = true; setArticle(null); setError(""); window.scrollTo(0, 0);
    getArticle(slug).then(data => active && setArticle(data)).catch(e => active && setError(e.message));
    return () => { active = false; }; }, [slug]);
  return <main className="article-page"><Link className="back-link" to="/articles">← Înapoi la toate articolele</Link>
    {error ? <p role="alert" className="error">{error}</p> : !article ? <p>Se încarcă…</p> : <article>
      <p className="meta">{new Date(article.created_at).toLocaleDateString("ro-RO")}{admin && " · ID: " + article.id}</p>
      <h1>{article.title}</h1><p className="article-summary">{article.summary}</p>
      {article.images.map(image => <figure key={image.id}><img src={imageUrl(image.url)} alt={image.alt_text}/></figure>)}
      <div className="content">{article.content}</div><p><Link className="back-link" to="/articles">← Înapoi la toate articolele</Link></p>
    </article>}</main>;
}
