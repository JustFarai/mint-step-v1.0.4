import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileJson, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { FileNode } from '../types';

interface FileTreeProps {
  files: FileNode[];
  onSelectFile: (filePath: string) => void;
  selectedFilePath: string | null;
}

export default function FileTree({ files, onSelectFile, selectedFilePath }: FileTreeProps) {
  return (
    <div className="bg-white text-slate-700 rounded-2xl overflow-hidden border border-slate-200 flex flex-col h-full shadow-xs">
      <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Folder className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-800 tracking-tight text-xs uppercase">File Structure</span>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 font-bold uppercase tracking-wider font-sans">
          Flutter stable
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5">
        {files.length === 0 ? (
          <div className="text-slate-400 p-4 text-center">Loading codebase structure...</div>
        ) : (
          files.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              depth={0}
              onSelectFile={onSelectFile}
              selectedFilePath={selectedFilePath}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  key?: string;
  node: FileNode;
  depth: number;
  onSelectFile: (filePath: string) => void;
  selectedFilePath: string | null;
}

function TreeNode({ node, depth, onSelectFile, selectedFilePath }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isDirectory = node.type === 'directory';
  const isSelected = selectedFilePath === node.path;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.dart')) return <FileCode className="w-4 h-4 text-emerald-500" />;
    if (name.endsWith('.yaml') || name.endsWith('.yml')) return <FileText className="w-4 h-4 text-amber-500" />;
    if (name.endsWith('.json')) return <FileJson className="w-4 h-4 text-blue-500" />;
    if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-indigo-500" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center space-x-2 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all border border-transparent ${
          isSelected
            ? 'bg-emerald-50/80 text-emerald-700 font-bold border-emerald-100/80 shadow-xs'
            : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
        }`}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
        onClick={handleToggle}
      >
        {isDirectory ? (
          <>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            {isOpen ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" /> : <Folder className="w-4 h-4 text-amber-500 shrink-0" />}
            <span className="font-semibold text-slate-800">{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.name)}
            <span className={isSelected ? 'text-emerald-800' : 'text-slate-600'}>{node.name}</span>
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onSelectFile={onSelectFile}
              selectedFilePath={selectedFilePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
