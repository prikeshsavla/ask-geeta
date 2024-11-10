import 'dotenv/config'

import {ChatOllama} from "@langchain/ollama";

const model = new ChatOllama({
    model: process.env.CHAT_MODEL,
    temperature: 0
})
export default model;