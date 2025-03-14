import { NextResponse } from 'next/server';
import pinecone from '@/libs/pinecone';

export async function POST(request) {
  const { id, vector } = await request.json();
  
  try {
    const index = pinecone.Index('your-index-name');
    await index.upsert([{ id, values: vector }]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
