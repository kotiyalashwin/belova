
import * as z from "zod";
const filesSchema = z.object({
  filePath: z.string(),
  content: z.string(),
});
export const graphStateSchema = z.object({
  ctx: z.array(filesSchema).optional(), //coz initial we wont add this
  prompt: z.string(),
  files: z.array(filesSchema).optional(),
  completed: z.array(z.string()).optional(),
});

export const codeAiSchema = z.object({
  files: z.array(filesSchema),
});

export type GraphState = z.infer<typeof graphStateSchema>;
export type WriterState = z.infer<typeof filesSchema>;
