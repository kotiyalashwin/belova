import { StateGraph } from "@langchain/langgraph";
import { graphStateSchema, type GraphState } from "./schema";
import { assignWriters, generateFiles, getContext, handleCommands, synthesizer, writer } from "./node";


export const belova = new StateGraph(graphStateSchema)
//nodes
.addNode("getcontext",getContext)
.addNode("codegen", generateFiles)
.addNode("writer", writer,{defer:true})
.addNode("commandhandler", handleCommands)
.addNode("synthesizer", synthesizer)
//Edges
.addEdge("__start__","getcontext")
.addEdge("getcontext","codegen")
.addEdge("codegen","commandhandler")
.addConditionalEdges("commandhandler",assignWriters,["writer"])
.addEdge("writer", "synthesizer")
.addEdge("synthesizer", "__end__")
.compile()
