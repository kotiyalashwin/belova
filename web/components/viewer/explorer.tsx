import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, FileCode, FileJson, FileText, Image } from 'lucide-react';
import { FileNode } from './viewer';

interface FileExplorerProps {
  files: FileNode[];
  onFileClick: (file: FileNode) => void;
}

export const FileExplorer = ({ files , onFileClick} : FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState();

  const getFileIcon = (fileName:string) => {
    const iconProps = { size: 14, className: "flex-shrink-0" };
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jsx':
      case 'js':
      case 'ts':
      case 'tsx':
        return <FileCode {...iconProps} className="flex-shrink-0 text-yellow-500/70" />;
      case 'json':
        return <FileJson {...iconProps} className="flex-shrink-0 text-yellow-500/70" />;
      case 'md':
      case 'txt':
        return <FileText {...iconProps} className="flex-shrink-0 text-blue-500/70" />;
      case 'png':
      case 'jpg':
      case 'svg':
      case 'ico':
      case 'gif':
        return <Image {...iconProps} className="flex-shrink-0 text-purple-500/70" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileCode {...iconProps} className="flex-shrink-0 text-blue-500/70" />;
      case 'html':
        return <FileCode {...iconProps} className="flex-shrink-0 text-orange-500/70" />;
      default:
        return <File {...iconProps} className="flex-shrink-0 text-neutral-500" />;
    }
  };

  const toggleFolder = (path:string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderTree = (node: FileNode, level = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    if (!node.isFile) {
      return (
        <div key={node.path} className="select-none">
          <div
            className={`flex items-center gap-1.5 py-1.5 px-2 cursor-pointer hover:bg-neutral-900/50 transition-colors rounded group ${
              isSelected ? 'bg-neutral-900/70' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown size={14} className="flex-shrink-0 text-neutral-500" />
            ) : (
              <ChevronRight size={14} className="flex-shrink-0 text-neutral-500" />
            )}
            {isExpanded ? (
              <FolderOpen size={14} className="flex-shrink-0 text-neutral-400" />
            ) : (
              <Folder size={14} className="flex-shrink-0 text-neutral-400" />
            )}
            <span className="text-xs text-neutral-300 truncate font-normal">{node.name}</span>
          </div>
          {isExpanded && node.children && node.children.length > 0 && (
            <div className="animate-in slide-in-from-top-1 duration-200">
              {node.children.map(child => renderTree(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-neutral-900/50 transition-colors rounded group ${
          isSelected ? 'bg-neutral-900/70' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 24}px` }}
        onClick={()=>{ console.log("File changed");onFileClick(node)}}
        
      >
        {getFileIcon(node.name)}
        <span className="text-xs text-neutral-300 truncate">{node.name}</span>
      </div>
    );
  };

  const countFilesAndFolders = (nodes:FileNode[]) => {
    let files = 0;
    let folders = 0;

    const traverse = (node:FileNode) => {
      if (node.isFile) {
        files++;
      } else {
        folders++;
        if (node.children) {
          node.children.forEach(traverse);
        }
      }
    };

    nodes.forEach(traverse);
    return { files, folders };
  };

  const stats = countFilesAndFolders(files);

  return (
    <div className="w-80 h-screen flex flex-col bg-[#0a0a0a] border-r border-neutral-900/50">
      <div className="px-4 py-3 border-b border-neutral-900/50">
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Explorer</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {files.length > 0 ? (
          files.map(node => renderTree(node))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2 px-4">
              <Folder size={32} className="mx-auto text-neutral-700" />
              <p className="text-neutral-600 text-xs">No files yet</p>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="px-4 py-2 border-t border-neutral-900/50 text-xs text-neutral-500">
          <div className="flex justify-between">
            <span>{stats.files} {stats.files === 1 ? 'file' : 'files'}</span>
            <span>{stats.folders} {stats.folders === 1 ? 'folder' : 'folders'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

