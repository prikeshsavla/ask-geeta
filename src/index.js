import 'dotenv/config'
import {MultiQueryRetriever} from "langchain/retrievers/multi_query";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import {ContextualCompressionRetriever} from "langchain/retrievers/contextual_compression";
import {EmbeddingsFilter} from "langchain/retrievers/document_compressors/embeddings_filter";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {HumanMessage} from "@langchain/core/messages";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {LanceDB} from "@langchain/community/vectorstores/lancedb";

import {connect} from "vectordb";
import llm from "./model.js";
import embeddings from "./embeddings.js";

// Retrieve the most similar text
const getVectorStore = async () => {
    const dbName = process.env.DATABASE_NAME
    const db = await connect(process.env.DATABASE_PATH + '/' + process.env.EMBEDDING_MODEL);
    const table = await db.openTable(dbName);
    return new LanceDB(embeddings, {table});
}

const createRetrievalChain = async () => {
    const baseCompressor = new EmbeddingsFilter({
        embeddings: embeddings, similarityThreshold: 0.8,
    });

    const vectorStore = await getVectorStore();
    const contextualCompressionRetriever = new ContextualCompressionRetriever({
        baseCompressor, baseRetriever: vectorStore.asRetriever(),
    });

    const multiQueryRetriever = MultiQueryRetriever.fromLLM({
        llm, retriever: contextualCompressionRetriever,
    });

    const SYSTEM_TEMPLATE = `You are an AI assistant that helps users answer questions based on a specific context. 
Your answer should be upto 3 sentences, as precise as possible and should only come from the context.
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>
`;

    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE], new MessagesPlaceholder("messages")]
    );

    const documentChain = await createStuffDocumentsChain({
        llm, prompt: questionAnsweringPrompt,
    });
    const parseRetrieverInput = (params) => {
        return params.messages[params.messages.length - 1].content;
    };
    return RunnablePassthrough.assign({
        context: RunnableSequence.from([parseRetrieverInput, multiQueryRetriever]),
    }).assign({
        answer: documentChain,
    });
}

const retrievalChain = await createRetrievalChain()

if (process.argv.length < 3) throw "Missing Question"
// const question = "What qualities is Krishna telling Arjun to learn"
const question = process.argv[2];
console.log("Asking LLM: " + question);
// Generate a response
const response = await retrievalChain.invoke({
    messages: [new HumanMessage(question)]
})
console.log(response.answer);
