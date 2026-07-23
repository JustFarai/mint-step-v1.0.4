import React, { useState, useEffect } from 'react';
import { 
  Folder, BookOpen, Smartphone, Shield, Download, Code, Play, 
  RefreshCw, CheckCircle, Save, Edit, Eye, MessageSquare, Layers, Sparkles,
  DollarSign
} from 'lucide-react';
import { FileNode } from './types';
import FileTree from './components/FileTree';
import FolderExplainer from './components/FolderExplainer';
import DeviceSimulator from './components/DeviceSimulator';
import ArchitectChat from './components/ArchitectChat';
import ArchitectureGraph from './components/ArchitectureGraph';
import DesignSystemViewer from './components/DesignSystemViewer';
import WealthFlowDashboard from './components/WealthFlowDashboard';

export default function App() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [activeTab, setActiveTab] = useState<'explainer' | 'graph'>('explainer');
  const [middlePanelMode, setMiddlePanelMode] = useState<'editor' | 'designSystem'>('designSystem');
  const [rightPanelTab, setRightPanelTab] = useState<'simulator' | 'chat'>('simulator');
  const [currentWorkspaceTab, setCurrentWorkspaceTab] = useState<'architect' | 'finance'>('architect');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch the file tree recursively from the server
  const fetchFileTree = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (response.ok && data.files) {
        setFiles(data.files);
        // Default to select pubspec.yaml if present
        if (!selectedFile && data.files.length > 0) {
          const pubspecNode = findNodeByName(data.files, 'pubspec.yaml');
          if (pubspecNode) {
            handleSelectFile(pubspecNode.path);
          } else {
            // Find first available file
            const firstFile = findFirstFile(data.files);
            if (firstFile) handleSelectFile(firstFile.path);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const findNodeByName = (nodes: FileNode[], name: string): FileNode | null => {
    for (const node of nodes) {
      if (node.name === name) return node;
      if (node.children) {
        const found = findNodeByName(node.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSelectFile = async (path: string) => {
    setSelectedFile(path);
    setIsEditing(false);
    try {
      const response = await fetch('/api/files/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path })
      });
      const data = await response.json();
      if (response.ok) {
        setFileContent(data.content);
        setEditorContent(data.content);
      }
    } catch (err) {
      console.error("Error reading file content:", err);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, content: editorContent })
      });
      if (response.ok) {
        setFileContent(editorContent);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Error writing file:", err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchFileTree();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans antialiased overflow-hidden">
      {/* Upper Navigation Bar */}
      <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              MintStep <span className="text-emerald-500 text-sm font-semibold ml-1">v1.0.4</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Flutter Architecture System</p>
          </div>
        </div>

        {/* Center Tab Switcher */}
        <div className="hidden md:flex bg-slate-100/85 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => setCurrentWorkspaceTab('architect')}
            className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              currentWorkspaceTab === 'architect'
                ? 'bg-white text-emerald-600 shadow-2xs border border-slate-200/40 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Flutter Prototyper</span>
          </button>
          <button
            onClick={() => setCurrentWorkspaceTab('finance')}
            className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              currentWorkspaceTab === 'finance'
                ? 'bg-white text-emerald-600 shadow-2xs border border-slate-200/40 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>FinFlow Dashboard</span>
          </button>
        </div>

        <div className="flex gap-4 items-center">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Production Ready</span>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
          
          {/* Export action */}
          <button
            onClick={() => {
              alert("To download this complete Flutter Clean Architecture boilerplate as a ZIP, click the settings icon in AI Studio and select 'Export to ZIP'!");
            }}
            className="hidden md:flex bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Boilerplate</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-200"></div>

          {/* Avatars Pile */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700">MS</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[9px] font-bold text-white">FA</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
          </div>
        </div>
      </header>

      {currentWorkspaceTab === 'architect' ? (
        /* Main Workspace Body Grid */
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column (Files list & structural explainers) */}
        <section className="lg:col-span-3 flex flex-col space-y-6 h-[calc(100vh-140px)] overflow-y-auto pr-1">
          <div className="h-[280px] shrink-0">
            <FileTree 
              files={files} 
              onSelectFile={handleSelectFile} 
              selectedFilePath={selectedFile} 
            />
          </div>

          {/* Tab Selector for Explainer/Architecture Graph */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex-1 flex flex-col">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('explainer')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'explainer' 
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Folder Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'graph' 
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'explainer' ? (
                <FolderExplainer onSelectNode={handleSelectFile} />
              ) : (
                <ArchitectureGraph />
              )}
            </div>
          </div>
        </section>

        {/* Middle Column (Visual Code Viewer & Editor or Design System View) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[calc(100vh-140px)]">
          {/* Middle Column Tabs */}
          <div className="flex bg-slate-50 p-1 border-b border-slate-200 shrink-0">
            <button
              onClick={() => setMiddlePanelMode('designSystem')}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                middlePanelMode === 'designSystem' 
                  ? 'bg-white text-emerald-600 shadow-xs border border-slate-250' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Design System Spec</span>
            </button>
            <button
              onClick={() => setMiddlePanelMode('editor')}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                middlePanelMode === 'editor' 
                  ? 'bg-white text-emerald-600 shadow-xs border border-slate-250' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Source Code Editor</span>
            </button>
          </div>

          {middlePanelMode === 'designSystem' ? (
            <div className="flex-1 overflow-y-auto">
              <DesignSystemViewer />
            </div>
          ) : (
            <>
              {/* Editor Header controls */}
              <div className="bg-slate-50/50 border-b border-slate-200 px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono text-xs font-bold text-slate-800 truncate max-w-[200px] md:max-w-xs">
                    {selectedFile || "Select a file to inspect"}
                  </span>
                </div>

                {selectedFile && (
                  <div className="flex items-center space-x-2">
                    {saveSuccess && (
                      <span className="text-[10px] text-green-600 font-semibold flex items-center animate-fade-in mr-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Changes saved
                      </span>
                    )}
                    
                    {isEditing ? (
                      <button
                        onClick={handleSaveFile}
                        disabled={isSaving}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
                      >
                        {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        <span>{isSaving ? 'Saving...' : 'Save File'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all"
                      >
                        <Edit className="w-3 h-3 text-slate-500" />
                        <span>Edit Source</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Editor Canvas */}
              <div className="flex-1 overflow-auto bg-slate-950 flex font-mono text-[11px] leading-relaxed">
                {selectedFile ? (
                  isEditing ? (
                    <textarea
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full h-full p-5 bg-slate-950 text-emerald-400 font-mono outline-hidden resize-none border-none focus:ring-0 focus:outline-hidden"
                      placeholder="Modify file content..."
                    />
                  ) : (
                    <div className="flex w-full">
                      {/* Line numbers column */}
                      <div className="w-10 bg-slate-900/60 border-r border-slate-800 text-slate-500 text-right pr-3.5 select-none py-5 font-light">
                        {fileContent.split('\n').map((_, index) => (
                          <div key={index} className="h-5">{index + 1}</div>
                        ))}
                      </div>
                      {/* Actual code view */}
                      <pre className="flex-1 p-5 text-slate-200 overflow-x-auto whitespace-pre font-mono h-full">
                        {fileContent.split('\n').map((line, index) => (
                          <div key={index} className="h-5 hover:bg-slate-800/35 transition-all">
                            {line || ' '}
                          </div>
                        ))}
                      </pre>
                    </div>
                  )
                ) : (
                  <div className="m-auto text-slate-500 flex flex-col items-center space-y-2">
                    <Code className="w-8 h-8 text-slate-600" />
                    <span className="text-xs">No file loaded in workspace</span>
                  </div>
                )}
              </div>
            </>
          )}
        </section>


        {/* Right Column (Live Phone Simulator & Assistant Chat) */}
        <section className="lg:col-span-4 flex flex-col h-[calc(100vh-140px)]">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-full overflow-hidden">
            {/* Tabs Selector */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 mb-4 flex-shrink-0">
              <button
                onClick={() => setRightPanelTab('simulator')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  rightPanelTab === 'simulator' 
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Device Simulator</span>
              </button>
              <button
                onClick={() => setRightPanelTab('chat')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  rightPanelTab === 'chat' 
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Architect Advisor</span>
              </button>
            </div>

            {/* Dynamic content */}
            <div className="flex-1 overflow-hidden">
              {rightPanelTab === 'simulator' ? (
                <div className="h-full overflow-y-auto pr-1">
                  <DeviceSimulator />
                </div>
              ) : (
                <div className="h-full">
                  <ArchitectChat 
                    selectedFile={selectedFile} 
                    selectedFileContent={fileContent} 
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        </main>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <WealthFlowDashboard />
        </div>
      )}

      {/* Footer bar */}
      <footer className="h-12 border-t border-slate-200 bg-white px-8 flex items-center justify-between text-[11px] font-semibold text-slate-400 shrink-0">
        <div className="flex gap-6">
          <span className="text-slate-900 font-bold">MD3 Standards Compliant</span>
          <span>Lint: flutter_lints ^2.0</span>
          <span>Dart SDK: 3.2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          All systems optimized for low-latency delivery
        </div>
      </footer>
    </div>
  );
}
