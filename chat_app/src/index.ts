const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config()

const openai = new OpenAI();

type Context = {
    role: "user" | "system" | "assistant",
    content: string
}[];

const context: Context = [{
    role: "system",
    content: "You are a helpful assistant"
},
{
    role: "user",
    content: "Hello!,how are you"
},
];

async function getChatCompletion() {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context
    })
    const responseMessage = response.choices[0].message;
    context.push({
        role: "assistant",
        content: responseMessage.content || ""
    })

    console.log(`Assistant: ${responseMessage.content}`)
}


async function run() {
    const input = require("prompt-sync")({ sigint: true });
    while (true) {

        const userInput = input() as string;
        if (userInput.toLowerCase() === "exit") {
            console.log("Exiting chat");
            break;
        }
        // const response = await openai.chat.completions.create({
        //     model: 'gpt-3.5-turbo',
        //     messages: [{ role: 'user', content: userInput }]
        // })

        context.push({
            role: "user",
            content: userInput
        })

        await getChatCompletion()
    }

}

run()