"use client";

import { useEffect, useState } from "react";
import Chat from "@/components/chat/chat";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodeViewer } from "@/components/viewer/viewer";
import { Loader } from "../custom-loader";

interface ChatWithCodeViewerProps {
	projectId: string;
}

export default function ChatWithCodeViewer({
	projectId,
}: ChatWithCodeViewerProps) {
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const [prompt, setPrompt] = useState<string>("");

	useEffect(() => {
		const prompt = localStorage.getItem("prompt") || "create a todo";
		setPrompt(prompt);
	}, []);

	return (
		<div className="h-screen w-screen bg-neutral-900 text-white">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel
					className="min-h-screen"
					defaultSize={30}
					minSize={10}
					maxSize={90}
				>
					<Chat
                        changePrompt={(value)=> setPrompt(value)}
						projectId={projectId}
						onSocketConnect={(value: boolean) => setIsSocketConnected(value)}
					/>
				</ResizablePanel>
				<ResizableHandle className="bg-neutral-800"  withHandle />
				<ResizablePanel>
					{isSocketConnected ? (
						<CodeViewer projectId={projectId} prompt={prompt} />
					) : (
						<div className="flex items-center justify-center h-full text-neutral-500">
							<Loader variant="gradient" />
						</div>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
