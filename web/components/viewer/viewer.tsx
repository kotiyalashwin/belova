"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "../custom-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeEditor } from "./code";
import { FileExplorer } from "./explorer";
import IframeWithLoader from "./iframeloader";

type FileType = {
	file_path: string;
	content: string;
};

export type FileNode = {
	name: string;
	path: string;
	children?: FileNode[];
	isFile: boolean;
	content?: string;
};

function buildFileTree(files: FileType[]): FileNode[] {
	const root: Record<string, any> = {};

	for (const file of files) {
		const parts = file.file_path.split("/");
		let current = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];

			if (!current[part]) {
				current[part] = {
					name: part,
					path: parts.slice(0, i + 1).join("/"),
					children: {},
					isFile: i === parts.length - 1,
				};
				if (i === parts.length - 1) current[part].content = file.content;
			}

			current = current[part].children;
		}
	}

	function objectToArray(obj: any): FileNode[] {
		return Object.values(obj).map((node: any) => ({
			name: node.name,
			path: node.path,
			isFile: node.isFile,
			content: node.content,
			children: node.children ? objectToArray(node.children) : [],
		}));
	}

	return objectToArray(root);
}

export const CodeViewer: React.FC<{ projectId: string,prompt:string }> = ({
	projectId, prompt
}: {
	projectId: string;
    prompt:string
}) => {
	const [tree, setTree] = useState<FileNode[]>([]);
	const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [prevUrl, setPrevUrl]= useState<string | null>(null)
	useEffect(() => {
        setTree([])
		axios
			.post(`${process.env.NEXT_PUBLIC_API_URL}/${projectId}`, {
				prompt: prompt,
			})
			.then((res) => {
				const data = res.data;
				const files: FileType[] = data.files;
				const treeFiles = buildFileTree(files);
                const prevUrl = `${process.env.NEXT_PUBLIC_PREVIEW_BASE_URL}-${data.sandbox_id}.e2b.app`
                setPrevUrl(prevUrl)
				setTree(treeFiles);
				setSelectedFile(treeFiles[0]);
			});
	}, [projectId,prompt]);
	return (
		<div className="flex w-full h-screen bg-[#0a0a0a]">
			{tree.length === 0 ? (
				<div className="flex justify-center h-full w-full">
					<Loader variant="square" message="Building your MVP..." />
				</div>
			) : (
				<>
					<div className="w-80 flex-shrink-0">
						<FileExplorer files={tree} onFileClick={setSelectedFile} />
					</div>
					
					<Tabs defaultValue="code" className="flex-1 flex flex-col min-w-0 p-4">
						<div className="px-4 pt-4 border-b border-neutral-900/50">
							<TabsList className="bg-neutral-900/30 border border-neutral-800/50 gap-2">
								<TabsTrigger value="code" className=" text-neutral-400 data-[state=active]:text-black">Code Viewer</TabsTrigger>
								<TabsTrigger value="preview" className={`text-xs text-neutral-400 data-[state=active]:text-black ${prevUrl ? "" : "opacity-50 cursor-not-allowed"}`} disabled={!prevUrl}>Preview</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="code" className="flex-1 overflow-hidden p-0 m-0">
							{selectedFile ? (
								<div className="h-full w-full">
									<CodeEditor code={selectedFile.content || ""} />
								</div>
							) : (
								<div className="flex items-center justify-center h-full text-neutral-500 text-sm">Select a file to view code</div>
							)}
						</TabsContent>

						<TabsContent
							value="preview"
							className="flex-1 overflow-hidden p-0 m-0"
						>
                                <IframeWithLoader prevUrl={prevUrl} />
							{/* <iframe */}
							{/* 	src={prevUrl ?? ""} */}
							{/* 	title="Preview" */}
							{/* 	className="w-full h-full border-none" */}
							{/* /> */}
						</TabsContent>
					</Tabs>
				</>
			)}
		</div>
	);
};
