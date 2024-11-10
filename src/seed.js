import 'dotenv/config'
import {CSVLoader} from "@langchain/community/document_loaders/fs/csv";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {LanceDB} from "@langchain/community/vectorstores/lancedb";
import embeddings from "./embeddings.js";

const loader = new CSVLoader("data/bhagavad_gita.csv", {
    column: "meaning_in_english",
});

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 20,
});
const splits = await textSplitter.splitDocuments(docs);
const vectorStore = new LanceDB(embeddings, {
    uri: process.env.DATABASE_PATH, tableName: process.env.DATABASE_NAME
});

const batchSize = 50;

const count = splits.length / batchSize
const promises = [];
let startTime = new Date().getTime();
for (let i = 0; i < count; i++) {
    const start = i * batchSize
    let end = (i + 1) * batchSize > splits.length ? splits.length : (i + 1) * batchSize
    console.log(`Pushing batch ${start} - ${end}`)
    promises.push(vectorStore.addDocuments(splits.slice(start, end)))
}
await Promise.all(promises).then(() => {
    console.log('Job complete')
});
// const vectors = await embeddings.embedDocuments(splits)
let endTime = new Date().getTime();
console.log(`time:  ${new Date(startTime)} - ${new Date(endTime)} | ${(endTime - startTime) / 1000}`);
