import 'dotenv/config'
import {OllamaEmbeddings} from "@langchain/ollama";

const embeddings = new OllamaEmbeddings({
    baseUrl: process.env.OLLAMA_SERVER_URL,
    model: process.env.EMBEDDING_MODEL
})
export default embeddings;