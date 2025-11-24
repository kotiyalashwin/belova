//TODO:
// - Add verifying code logic
// - Add writing file to e2b (but we need sandbox_id or sandbox instance that will be created in the main backend serve)
// - Think how will you handle (running commands)- ig I need to add a tool to the llm that can run terminal commands
import {
  codeAiSchema,
  type GraphState,
  type WriterState,
  type WriterState as ContextState,
} from "./schema";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Send, type LangGraphRunnableConfig } from "@langchain/langgraph";
import { promises as fs } from "fs";
import path from "path";
import { PROMPT } from "../prompt";
const ai = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});
const PROJECT_ROOT =
  process.env.E2B_MODE === "true"
    ? "/home/user/react-app"
    : path.resolve("react-app");
//NODES

export const getContext = async (state: GraphState) => {
  //do the db stuff here
  const ctx: ContextState[] = [];
  //adds the context to the graphState
  return { ctx };
};

export const generateFiles = async (state: GraphState) => {
  const ctx = state.ctx || [];
  const ctxString = (): string => {
    if (ctx.length > 0) {
      return ctx
        .map(
          (f) => `
        === FILE START: ${f.filePath} ===
        Path: ${f.filePath}

        Content:
        \`\`\` Typescript ${f.filePath}
        ${f.content}
        \`\`\`
        === FILE END: ${f.filePath} ===
        `,
        )
        .join("\n");
    } else {
      return `=====NO CONTEXT AVAILABLE=====`;
    }
  };

  //prompt injection and context injection
  const coder = ai.withStructuredOutput(codeAiSchema);
  const prompt = PROMPT;
  const result = await coder.invoke([
    {
      role: "system",
      content: prompt,
    },
    { role: "human", content: state.prompt },
  ]);
  return { files: result.files, commands: result.commands };
};

export const writer = async (
  state: WriterState,
  config?: LangGraphRunnableConfig,
) => {
  const { filePath, content } = state;
  if (config?.writer) {
    config.writer({
      type: "file_started",
      filePath: filePath,
      message: `Starting to write ${filePath}...`,
    });
  }

  const fullPath = path.resolve(PROJECT_ROOT, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
  return {};
};

export const synthesizer = async () => {
  return {};
};

//Orchestrators

//orchestrator always expects and array of SendObject
export const assignWriters = (state: GraphState) => {
  return state.files?.map((file) => new Send("writer", file)) || [];
};

//Handlers
export const handleCommands = async (
  state: GraphState,
  config?: LangGraphRunnableConfig,
) => {
  if (state.commands.length === 0) {
    return {};
  }

  for (const command of state.commands) {
    if (config?.writer) {
      config.writer({
        type: "executing",
        message: `Running: ${command}`,
      });
    }
  }

  return {
    command: [],
  };
};
