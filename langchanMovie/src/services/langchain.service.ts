import "dotenv/config";
import { ChatGoogle } from '@langchain/google/node';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RecommendationsSchema } from "../schema/movies.schema.js";

function getChatModel() {
    const provider = process.env.LLM_PROVIDER || "gemini";

    if (provider === "gemini") {
        return new ChatGoogle({
            model: "gemini-3.1-flash-lite",
            temperature: 0.3,
            apiKey: process.env.GEMINI_API_KEY ?? "",
        });
    } else {
        return new ChatOpenAI({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            temperature: 0.3,
            apiKey: process.env.OPENAI_API_KEY ?? "",
        });
    }
}

const model = getChatModel();

const prompTemplate = ChatPromptTemplate.fromMessages([
    ["system",
        `You are a movie recommendataion expert.

        Return high-quality recommendation based on:
        -user's request
        -genre
        -mood
        -count

        Every movie should feel intentional.
        Do not recommend only the most obvious title every time
        `], ["human", `User Request {userPrompt}:

        Preferences:
        - Genre: {genre}
        - Mood: {mood}
        - Number of movies: {count}`
    ]
]);

export async function getRecommendations(input: {
    userPrompt: string;
    genre: string;
    mood: string;
    count: number;
}) {
    const chain = prompTemplate.pipe(model); //.pipe(model) is the LCEL Langchain expression language
    // it connect your component in to a chain
    // input - promttemplate -> variable - call model (gemini) - res[ponse]
    const response = await chain.invoke({
        userPrompt: input.userPrompt,
        genre: input.genre,
        mood: input.mood,
        count: input.count,
    });
    console.log(response)
    return response.text as string;
}


// zod + structure output
const structureModel = model.withStructuredOutput(RecommendationsSchema);

export async function getStructuredRecommendations(input: {
    userPrompt: string;
    genre: string;
    mood: string;
    count: number;
}) {
    const chain = prompTemplate.pipe(structureModel);
    const response = await chain.invoke({
        userPrompt: input.userPrompt,
        genre: input.genre,
        mood: input.mood,
        count: input.count,
    });
    console.log(response)
    return response;
}