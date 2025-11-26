# Express Server with Bun (TypeScript)

This is an equivalent Express server using Bun and TypeScript that provides the same functionality as the Python FastAPI server.

## Features

- **Express.js** web server with TypeScript
- **WebSocket** support for real-time communication
- **CORS** enabled for cross-origin requests
- **Agent Service** with mock sandbox environment
- **Tool System** for file operations and command execution
- **Persistent Storage** for project data and context
- **Health Check** endpoint

## Project Structure

```
server-bun/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── agent/
│   │   ├── agentService.ts     # Agent service implementation
│   │   └── tools.ts           # Tool definitions and registry
│   └── utils/
│       └── persistentStore.ts  # File-based storage utilities
├── package.json
├── tsconfig.json
└── bun.lock
```

## API Endpoints

### POST `/chat/:project_id`
Create or continue a project with the given prompt.

**Request Body:**
```json
{
  "prompt": "Create a React todo app"
}
```

**Response:**
```json
{
  "status": "success",
  "project_id": "my-project",
  "file_count": 5,
  "files": ["src/App.jsx", "package.json", ...],
  "sandbox_id": "sandbox-my-project-123456",
  "sandbox_active": true
}
```

### WebSocket `/ws/:project_id`
Real-time WebSocket connection for project updates.

**Message Events:**
- `started` - Project creation started
- `thinking` - Agent is processing
- `file_creating` - File creation in progress
- `file_created` - File created successfully
- `command` - Command execution started
- `command_failed` - Command execution failed
- `command_error` - Command execution error
- `tool_error` - Tool execution error
- `error` - General error

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-26T23:52:00.000Z"
}
```

## Installation & Setup

1. Install dependencies:
```bash
bun install
```

2. Start development server:
```bash
bun run dev
# or
bun --watch src/index.ts
```

3. Start production server:
```bash
bun run start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
# Add other environment variables as needed
```

## Tools Available

The agent service provides the following tools:

1. **create_file** - Create files with content
2. **execute_command** - Execute shell commands
3. **save_context** - Save project context
4. **get_context** - Retrieve saved project context

## Mock Implementation

This server uses mock implementations for:
- **E2B Sandbox** - Simulated sandbox environment
- **LangChain/LangGraph** - Tool interface without actual LLM integration
- **File System** - In-memory file storage with optional persistence

To integrate with real services, replace the mock implementations in:
- `src/agent/agentService.ts` - Replace MockSandbox with real E2B integration
- Add actual LLM integration for agent processing
- Configure real database connections if needed

## Development

The server includes comprehensive TypeScript types and follows the same patterns as the Python original:

- WebSocket connection management
- Project isolation by ID
- Error handling and logging
- Graceful shutdown handling

## Port Configuration

Default port is `3001`. Can be overridden with `PORT` environment variable.