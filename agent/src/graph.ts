
import { StateGraph } from "@langchain/langgraph";
import { graphStateSchema } from "./schema";
import { assignWriters, generateFiles, getContext, synthesizer, writer } from "./node";


export const belova = new StateGraph(graphStateSchema)
//nodes
.addNode("getcontext",getContext)
.addNode("codegen", generateFiles)
.addNode("writer", writer,{defer:true})
.addNode("synthesizer", synthesizer)
//Edges
.addEdge("__start__","getcontext")
.addEdge("getcontext","codegen")
.addConditionalEdges("codegen",assignWriters,["writer"])
.addEdge("writer", "synthesizer")
.addEdge("synthesizer", "__end__")
.compile()
