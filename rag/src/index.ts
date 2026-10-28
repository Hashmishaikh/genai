import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import dotenv from 'dotenv';
import fs from 'fs'
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
dotenv.config();


async function main() {
    // step 1: load the document
    const rawText = fs.readFileSync("./src/data/docs.txt", 'utf-8')
    // console.log(rawText)

    // step 2: split the document
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    })
    const docs: any = await splitter.splitDocuments([
        new Document({ pageContent: rawText })
    ])
    // step 3 create embeddding from chunks and stored data in memory database
    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
    );

    // step 4 retrive or fetch chunk data
    const retreiver = vectorStore.asRetriever();
    const question = "Who won the 2023 world cup";
    const result = await retreiver.invoke(question);

    // steps 5 
    const context = result.map((doc, index: number) => {
        return `Document ${index + 1} : ${doc.pageContent}`;
    }).join("\n");

    const prompt = `You are a helpful assistant.Use the context below to answer the quetion.
    
    Context:
    ${context}

    Question: ${question}`;

    // step 6: invoke the model to get answer
    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        maxTokens: 500,
    });

    const response = await model.invoke(prompt);
    console.log("Answer:", response.content);
}
main()