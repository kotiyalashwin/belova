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
const ai = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});
export const getContext = async(state: GraphState) => {
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
  const result = await coder.invoke([
    {
      role: "system",
      content: `You are an AI based website builder which already has a precooked vite react app, Based on users requirement you have to create the user application. You have access to the following context files: ${ctxString}. If there are no context files then it is a fresh project else you have to do changes according to the already present files`,
    },
    { role: "human", content: state.prompt },
  ]);
  return { files: result.files };
};

//orchestrator always expects and array of SendObject
export const assignWriters = (state: GraphState) => {
  return state.files?.map((file) => new Send("writer", file)) || [];
};
export const writer = async (state: WriterState, config?:LangGraphRunnableConfig) => {
  const { filePath, content } = state;
    if (config?.writer) {
    config.writer({
      type: "file_started",
      filePath: filePath,
      message: `Starting to write ${filePath}...`
    });
  }
  //TODO: add e2b logic here
  const fullPath = path.join("app", filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
  return {};
};

export const synthesizer = async()=>{
    return {}
}
