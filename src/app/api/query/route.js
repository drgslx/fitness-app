import { NextResponse } from 'next/server';
import pinecone from '@/libs/pinecone';

export async function POST(request) {
  const { vector } = await request.json();
  const index = pinecone.Index('your-index-name');
  const result = await index.query({ vector, topK: 5, includeValues: true });
  return NextResponse.json(result);
}
