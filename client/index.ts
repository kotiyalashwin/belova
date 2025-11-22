import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: "http://localhost:8080" });

const thread = await client.threads.create();
console.log("Thread created:", thread);

//STREAMING
const stream = await client.runs.stream(thread.thread_id, "belova", {
  input: {
    prompt: "Create a multiple component landing page ",
    ctx: [],
    files: [],
    completed: [],
  },
  streamMode: "custom",
});

for await (const chunk of stream){
    if(chunk.event === "custom"){
        const chunkData = chunk.data as {type:string,filePath:string,message:String}
        console.log(`Status: ${chunkData.message}`)
    }
}
