import { Sandbox } from "e2b";
import { Client } from "@langchain/langgraph-sdk";
import { ExtendedWebSocket, WebSocketMessage } from '../types';

export class AgentService {
    sandboxes: Map<string, Sandbox> = new Map();

    async get_sandbox(project_id: string): Promise<Sandbox> {
        if (!this.sandboxes.has(project_id)) {
            console.log(`[Sandbox]: Initializing new E2B sandbox for project: ${project_id}`);
            const sbx = await Sandbox.create("agent-react", { timeoutMs: 600000 });

            const apiKeys = {
                LANGSMITH_TRACING: "true",
                LANGSMITH_ENDPOINT: process.env.LANGSMITH_ENDPOINT!,
                LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY!,
                LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT!,
                GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
                E2B_MODE: "true",
            };

            const envContent = Object.entries(apiKeys)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join("\n");

            await sbx.files.write("/home/user/agent/.env", envContent);

            await sbx.commands.run("langgraphjs dev -p 8080 > /tmp/langgraph.log 2>&1", {
                cwd: "/home/user/agent/",
                background: true,
            });

            // Wait a bit for server to start
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Read initial logs
            const logs = await sbx.files.read("/tmp/langgraph.log");
            console.log("[Langraph]: === LangGraph Server Logs ===");
            console.log("[Langraph]:", logs);

            const langraph_host = sbx.getHost(8080);
            console.log(`[Langraph]: Server running at https://${langraph_host}`);

            this.sandboxes.set(project_id, sbx);
            console.log('[Sandbox]: E2B Sandbox is setup with REACT environment and LangGraph server');
        }
        return this.sandboxes.get(project_id)!;
    }

    async close_sandbox(project_id: string): Promise<void> {
        if (this.sandboxes.has(project_id)) {
            const sandbox = this.sandboxes.get(project_id)!;
            try {
                await sandbox.kill();
            } catch (error) {
                console.warn(`[Sandbox]: Error closing sandbox: ${error}`);
            }
            this.sandboxes.delete(project_id);
            console.log(`[Sandbox]: Closed E2B sandbox: ${project_id}`);
        }
    }

    async _send_ws_message(socket: ExtendedWebSocket | undefined, message: WebSocketMessage): Promise<void> {
        if (socket && socket.readyState === socket.OPEN) {
            try {
                socket.send(JSON.stringify(message));
                await new Promise(resolve => setTimeout(resolve, 20));
            } catch (error) {
                console.warn(`[WebSocket]: Failed to send WebSocket message: ${error}`);
            }
        }
    }

    async run_agent_stream(
        prompt: string,
        project_id: string,
        socket?: ExtendedWebSocket
    ): Promise<void> {
        const sandbox = await this.get_sandbox(project_id);

        await this._send_ws_message(socket, { e: 'started', message: 'Creating project...' });

        try {
            const langraph_host = sandbox.getHost(8080);
            console.log(`[Langraph]: Server running at https://${langraph_host}`);

            const client = new Client({ apiUrl: `https://${langraph_host}` });

            const thread = await client.threads.create();
            console.log("[Langraph]: Thread created:", thread);

            await this._send_ws_message(socket, {
                e: 'thinking',
                message: 'Cooking your app....'
            });

            const stream = await client.runs.stream(thread.thread_id, "belova", {
                input: {
                    prompt: prompt,
                    ctx: [],
                    files: [],
                    completed: [],
                    commands: [],
                },
                streamMode: "custom",
            });

            for await (const chunk of stream) {
                if (chunk.event === "custom") {
                    const chunkData = chunk.data as {
                        type: string;
                        filePath: string;
                        message: string;
                    };
                    if (chunkData.type === "file_started") {
                        await this._send_ws_message(socket, {
                            e: 'file_creating',
                            message: chunkData.message
                        });
                    }
                    if (chunkData.type === "file_created") {
                        await this._send_ws_message(socket, {
                            e: "file_created", message: chunkData.message
                        })
                    }
                    if (chunkData.type === "executing") {
                        await this._send_ws_message(socket, {
                            e: 'command',
                            message: chunkData.message
                        });
                    }
                }
            }

            const react_host = sandbox.getHost(5173);
            console.log(`[Application]: Ready at https://${react_host}`);

            await this._send_ws_message(socket, {
                e: 'finished',
                message: `https://${react_host}`
            });

        } catch (error) {
            const error_msg = `❌ Error in agent stream: ${error}`;
            console.error('[Agent]:', error_msg);
            await this._send_ws_message(socket, { e: 'error', message: String(error) });
            throw error;
        }
    }
}

export const agentService = new AgentService();
