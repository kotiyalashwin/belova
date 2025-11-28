import ChatWithCodeViewer from "@/components/pages/ChatWithComponent";

export default async function Page({params}:{params : Promise<{id:string}>}) {
    const projectId = (await params).id
  return <ChatWithCodeViewer projectId={projectId} />;
}
