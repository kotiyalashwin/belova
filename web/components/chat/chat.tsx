"use client";
import { ChevronRight, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CreatedMessage from "./created";
import Thinking from "./thinking";
import Terminal from "./terminal";
import FileCreating from "./file-creating";
import Finished from "./finished";

type ChatType = "user" | "ai";

interface ChatMessage {
	id: string;
	type: ChatType;
	message: string;
	event?: "thinking" | "started" | "file_created" | "file_creating" | "completed" | "command" | "finished";
	completed?: boolean;
}

export default function Chat({
	projectId,
	onSocketConnect,
    changePrompt
}: {
    changePrompt:(value:string)=> void
	projectId: string;
	onSocketConnect: (value:boolean) => void;
}) {
	const prompt = localStorage.getItem("prompt") ?? "";
	const [chats, setChats] = useState<ChatMessage[]>([
		{ id: "1", type: "user", message: prompt },
	]);
	const [input, setInput] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	});

	useEffect(() => {
	  const ws = new WebSocket(`ws://localhost:3001/ws/${projectId}`);

	  ws.onopen = () => {
	    console.log("WebSocket connected");
	    onSocketConnect(true)
	  };

	  ws.onmessage = (event) => {
	    try {
	      const data: { e: "started" | "file_created" | "file_creating" | "completed" | "thinking" | "command" | "finished" ; message: string } = JSON.parse(
	        event.data
	      );

	      setChats((prev) => {
	        let updated = [...prev];

	        if (data.e === "file_created" || data.e === "command") {
	          updated = updated.filter((msg) => msg.event !== "started");
	        }

	        if (data.e === "file_created") {
	          for (let i = updated.length - 1; i >= 0; i--) {
	            if (updated[i].event === "file_creating" && !updated[i].completed) {
	              updated[i] = { ...updated[i], completed: true };
	              break;
	            }
	          }
	        }

	        updated.push({
	          id: Date.now().toString(),
	          type: "ai",
	          message: data.message,
	          event: data.e,
	        });

	        return updated;
	      });
	    } catch (err) {
	      console.error("Failed to parse WebSocket message", err);
	    }
	  };

	  ws.onclose = () => {
	    console.log("WebSocket disconnected");
	  };

	  return () => ws.close();
	}, [projectId,onSocketConnect]);

	const handleSend = () => {
		if (!input.trim()) return;

		const newUserMessage: ChatMessage = {
			id: Date.now().toString(),
			type: "user",
			message: input,
		};

		setChats((prev) => [...prev, newUserMessage]);
        changePrompt(input)
		setInput("");
	};
	const getChatComponent = (type: string, message: string, action?: string, completed?: boolean) => {
		switch (type) {
			case "ai":
				switch (action) {
					case "thinking":
						return <Thinking message={message} />;
					case "file_created":
						return <CreatedMessage message={message} />;
					case "file_creating":
						return <FileCreating message={message} completed={completed} />;
                    case "started":
                        return <div className="text-neutral-500 px-4 animate-pulse text-sm font-light">Creating Project...</div>
                    case "command":
                        return <Terminal command={message}/>
                    case "finished":
                        return <Finished message={message}/>
                    
				}
			case "user":
				return (
					<div className="max-w-[75%] px-4 py-2.5 rounded-lg break-words text-neutral-200 bg-neutral-900/50 border border-neutral-800/50 text-sm leading-relaxed">
						{message}
					</div>
				);
		}
	};
	return (
		<div className="h-full flex bg-[#0a0a0a] flex-col text-white">
			<h1 className="text-sm font-medium mb-2 px-6 pt-6 text-neutral-400 uppercase tracking-wider">Conversation</h1>

			<div className="flex-1 border-t border-neutral-900/50 overflow-y-auto px-6 py-4 space-y-5">
				{chats.map((chat) => (
					<div
						key={chat.id}
						className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}
					>
						{getChatComponent(chat.type, chat.message, chat.event, chat.completed)}
					</div>
				))}
				<div ref={chatEndRef} />
			</div>

			<div className="px-6 py-4 flex items-center gap-3 border-t border-neutral-900/50 bg-[#0a0a0a]">
						<Input
							placeholder="Type your message..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="flex-1 bg-neutral-900/30 border border-neutral-800/50 text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-neutral-700 focus:border-neutral-700 rounded-lg px-4 py-2 text-sm"
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSend();
							}}
						/>
						<button
							type="button"
							onClick={handleSend}
							className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium"
						>
							Send
						</button>
			</div>
		</div>
	);
}
