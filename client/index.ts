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
        commands:[],
  },
  streamMode: "custom",
});

for await (const chunk of stream) {
  if (chunk.event === "custom") {
    const chunkData = chunk.data as {
      type: string;
      filePath: string;
      message: String;
    };
    if (chunkData.type === "file_started") {
      console.log(`Status: ${chunkData.message}`);
    }
    if (chunkData.type === "executing") {
      console.log(`=============COMMAND============\n`);
      console.log(chunkData.message);
    }
  }
}
