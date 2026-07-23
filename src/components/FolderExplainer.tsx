import React from 'react';
import { Layers, HelpCircle, ArrowRightLeft, ShieldAlert, Navigation, Palette } from 'lucide-react';

interface FolderExplainerProps {
  onSelectNode: (path: string) => void;
}

export default function FolderExplainer({ onSelectNode }: FolderExplainerProps) {
  const folders = [
    {
      title: "core/navigation",
      icon: <Navigation className="w-5 h-5 text-emerald-500" />,
      description: "App router powered by GoRouter.",
      purpose: "Encapsulates path configurations, nested routing (ShellRoutes), and redirect logic (e.g. auth state transitions) in one clean location.",
      scalability: "Prevents routing clutter, supports deep-linking out of the box, and allows smooth, declarative parameter-passing to multi-screen setups."
    },
    {
      title: "core/theme",
      icon: <Palette className="w-5 h-5 text-pink-500" />,
      description: "Material 3 color systems and typography settings.",
      purpose: "Configures explicit light and dark themes using custom ColorSchemes built from seed colors. No hardcoded colors are allowed inside views.",
      scalability: "Changing any element of the app's visual identity requires updating only this file. Instantly adapts to system preference."
    },
    {
      title: "features/steps/domain",
      icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
      description: "Pure business logic (Entities, Use Cases, Repository Contracts).",
      purpose: "The absolute heart of the feature. Contains purely plain Dart objects with ZERO imports of Flutter or external package SDKs (like Firebase or Hive).",
      scalability: "Absolutely stable. Since it contains no external dependency, business rules can be verified with lightning-fast unit tests and never change when APIs shift."
    },
    {
      title: "features/steps/data",
      icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" />,
      description: "Data layer (Models, Data Sources, Repository Implementations).",
      purpose: "Implements repository contracts, fetches cloud data (Firestore) or caches local information (Hive) depending on connectivity status.",
      scalability: "Offline-First Strategy. High throughput local storage caches changes instantly. Synchronizations run in background threads to protect network load."
    },
    {
      title: "features/steps/presentation",
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      description: "State Management and UI Widgets (Riverpod, Screens).",
      purpose: "Renders widgets following Material 3 guidelines and listens to StateNotifier providers to instantly redraw views upon status changes.",
      scalability: "Separation of concerns. Widgets are lightweight, mostly stateless, and carry zero business calculation logic."
    },
    {
      title: "core/error",
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      description: "Clean error handling and exceptions.",
      purpose: "Maps technical system errors (e.g. socket exceptions, HTTP 500) into standardized Failures (ServerFailure, NetworkFailure) presented clearly to users.",
      scalability: "Guarantees that error states are uniform and prevent system-level crashes from ever leaking onto the viewport."
    }
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-800">Clean Architecture Directories</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Select any folder aspect to understand its scalability design pattern.</p>
      </div>

      <div className="flex flex-col gap-4">
        {folders.map((f, idx) => (
          <div key={idx} className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center space-x-2.5 mb-2.5">
              <div className="p-1.5 bg-white rounded-lg border border-slate-200/50">
                {f.icon}
              </div>
              <h4 className="font-bold text-slate-800 font-mono text-xs truncate">{f.title}</h4>
            </div>
            
            <p className="text-[11px] font-semibold text-emerald-600 mb-2">{f.description}</p>
            
            <div className="space-y-2 text-[11px] text-slate-600">
              <div>
                <span className="font-bold text-slate-700">Purpose: </span>
                {f.purpose}
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                <span className="font-bold text-emerald-800">Scalability: </span>
                <span className="text-slate-600">{f.scalability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
