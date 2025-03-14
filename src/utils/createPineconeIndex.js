import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {RecursiveCharaterTextSplitter} from "langchain/text_splitter";
import {OpenAI} from "langchain/llms/openai";
import {loadQaStuffChain} from "langchain/chains";
import { Document } from "langchain/document";
import {timeout} from "./timeout";

export const createPineconeIndex = async () => {
   console.log("Creating Pinecone index...");
   const existingINdexes = await client.listIndexes();

   if (existingINdexes.includes(indexName)) {
     console.log("Index already exists. Skipping creation.");
     return;
   }
   const textSplitter = new RecursiveCharaterTextSplitter({
     chunkSize: 1000,
     chunkOverlap: 200,
   });

}