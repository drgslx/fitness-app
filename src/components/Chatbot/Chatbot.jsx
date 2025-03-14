'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert user query to an embedding
    const resEmbedding = await fetch('/api/embedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });

    const { embedding } = await resEmbedding.json();

    // Query Pinecone with the embedding
    const resQuery = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vector: embedding }),
    });

    const { matches } = await resQuery.json();

    // Generate a response using the top match
    const topMatch = matches[0]; // Assuming the best match is the first
    const resGenerate = await fetch('/api/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: topMatch.text }),
    });

    const data = await resGenerate.json();
    setResponse(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
