import { NextResponse } from 'next/server';
import { getEmbedding } from '@/libs/embeddings';

export async function POST(request) {
  const { text } = await request.json();
  const embedding = await getEmbedding(text);
  return NextResponse.json({ embedding });
}
