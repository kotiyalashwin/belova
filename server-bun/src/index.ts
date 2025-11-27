import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { agentService } from './agent/agentService';
import { ExtendedWebSocket, ChatPayload, ChatResponse, WebSocketMessage } from './types';
import { inject } from './agent/inject';

const app = express();
const server = createServer(app);

// CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Store active connections and runs
const activeSockets: Record<string, ExtendedWebSocket> = {};
const activeRuns: Record<string, Promise<void>> = {};

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: ExtendedWebSocket, req: any) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const projectId = url.pathname.replace('/ws/', '');
    if (!projectId) {
        ws.close(1008, 'Project ID required');
        return;
    }

    ws.project_id = projectId;
    ws.isAlive = true;
    activeSockets[projectId] = ws;

    console.log(`[WebSocket]: New connection for ${projectId}`)

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (data: any) => {
        try {
            const message = JSON.parse(data.toString());

        } catch (error) {
            // Ignore invalid JSON
        }
    });

    ws.on('close', async () => {
        console.log(`[WebSocket]: Connection closed for ${projectId}`)
        delete activeSockets[projectId];

        try {
            await agentService.close_sandbox(projectId);
        } catch (error) {
            console.error(`[Sandbox]: Error closing sandbox for project ${projectId}:`, error);
        }
    });

    ws.on('error', (error: any) => {
        console.error(`[WebSocket]: Error in connection for ProjectID: ${projectId}:`, error);
    });
});

setInterval(() => {
    wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (!ws.isAlive) {
            ws.terminate();
            return;
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

app.post('/chat/:project_id', async (req: Request, res: Response) => {
    const { project_id } = req.params;
    const { prompt }: ChatPayload = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Too short or no description' });
    }

    if (project_id in activeRuns) {
        return res.status(409).json({ error: 'Project is being created. Kindly wait' });
    }

    const task = async () => {
        try {
            const socket = activeSockets[project_id];
            await agentService.run_agent_stream(prompt, project_id, socket);
        } catch (error) {
            console.error('[Task]: Error in task execution:', error);
            const ws = activeSockets[project_id];
            if (ws) {
                try {
                    const errorMessage: WebSocketMessage = {
                        e: 'error',
                        message: error instanceof Error ? error.message : String(error)
                    };
                    ws.send(JSON.stringify(errorMessage));
                } catch {
                    // Ignore send errors
                }
            }
        } finally {
            delete activeRuns[project_id];
        }
    };

    activeRuns[project_id] = task();

    try {
        await activeRuns[project_id];
    } catch (error) {
        console.error('[Task]: Task execution failed:', error);
    }

    const sandbox = agentService.sandboxes.get(project_id);
    let files: string[] = [];

    if (sandbox) {
        try {
            const result = await sandbox.commands.run(inject, { cwd: "/home/user/react-app" });
            files = JSON.parse(result.stdout) ;
        } catch (error) {
            console.error('[Sandbox]: Error getting file list:', error);
        }
    }

    const response: ChatResponse = {
        status: 'success',
        project_id,
        file_count: files.length,
        files,
        sandbox_active: agentService.sandboxes.has(project_id)
    };

    if (sandbox?.sandboxId) {
        response.sandbox_id = sandbox.sandboxId;
    }

    res.json(response);
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`[Server]: Running on port ${PORT}`);
    console.log(`[WebSocket]: WS server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server]: SIGTERM received, shutting down gracefully');

    wss.clients.forEach((ws) => {
        ws.close();
    });

    server.close(() => {
        console.log('[Server]: Server closed');
        process.exit(0);
    });
});
