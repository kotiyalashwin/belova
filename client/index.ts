import { Client } from "@langchain/langgraph-sdk";

const client = new Client({ apiUrl: "http://localhost:8080" });

// Create thread
const thread = await client.threads.create();
console.log("Thread created:", thread);

// Run the graph
const run = await client.runs.create(
  thread.thread_id,
  "belova",
  {
    input: {
      prompt: "Create a landing page component",
      ctx: [],
      files: [],
      completed: []
    }
  }
);

console.log("Run result:", run);
