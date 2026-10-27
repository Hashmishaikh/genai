import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import dotenv from 'dotenv'

dotenv.config({})

const openai = new OpenAI();

const context: ChatCompletionMessageParam[] = [{
    role: "system",
    content: "You are a helpful assistant"
},
{
    role: "user",
    content: "what is the current time in New York?"
},
]

// creating our own tools to get the current date of newyork
function getTimeInNewYork() {
    return new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
}


async function callOpenAiTools() {
    const response: any = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        tools: [{
            type: "function",
            function: {
                name: "getTimeInNewYork",
                description: "get current time in newyork"
            }
        }],
        tool_choice: "auto"
    })

    // step 2 decide tools to use/call
    const willInvokeTool = response.choices[0].finish_reason === "tool_calls";
    const toolcall = response.choices[0].message.tool_calls?.[0];
    if (willInvokeTool && toolcall) {
        const toolName = toolcall.function.name;
        if (toolName === "getTimeInNewYork") {
            const time = getTimeInNewYork();

            context.push(response.choices[0].message);
            context.push({
                role: 'tool',
                tool_call_id: toolcall?.id,
                content: time
            })
        }
    }

    const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
    })
    console.log(secondResponse?.choices[0]?.message?.content)

}

callOpenAiTools();
