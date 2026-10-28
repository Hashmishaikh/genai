import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts"

import dotenv from 'dotenv';
dotenv.config();

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    maxTokens: 500,
});

// const main = async () => {
//     // const response = await model.invoke("what is the capital of india?");
//     // console.log(response.content);
//     const response = await model.stream("what is the capital of india?");
//     //for streaming   
//     for await (const chunk of response) {
//         console.log(chunk.content);
//     }
// }

// main();
const run = async () => {
    const systemTemplate = "Translate the following from english to {language}"
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"]
    ])
    const promptValue = await promptTemplate.invoke({
        language: "hindi",
        text: "Hello, everyone my name is khan"
    })
    // console.log("prompt value is:", promptValue)
    promptValue.toChatMessages();
    const response = await model.invoke(promptValue)
    console.log(response.content)

}
run()