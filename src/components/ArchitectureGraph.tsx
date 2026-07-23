import React, { useState } from 'react';
import { Network, ArrowUp, Layers, HelpCircle, ArrowRightLeft } from 'lucide-react';

export default function ArchitectureGraph() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  const layers = [
    {
      id: "presentation",
      name: "Presentation Layer (UI)",
      color: "border-amber-200 bg-amber-50/40 text-amber-900",
      icon: <Layers className="w-4 h-4 text-amber-500" />,
      desc: "Flutter Widgets, Screens, and Riverpod Notifiers.",
      rules: [
        "Handles user interactions, UI states, and Material 3 alignments.",
        "Watches StateNotifiers and triggers UI updates.",
        "STRICTLY FORBIDDEN to contain business calculation logic or talk directly to Firebase."
      ],
      dependency: "Depends on DOMAIN use-cases. Standard DI binds providers to actual repos."
    },
    {
      id: "domain",
      name: "Domain Layer (Core Rules)",
      color: "border-purple-200 bg-purple-50/40 text-purple-900",
      icon: <HelpCircle className="w-4 h-4 text-purple-500" />,
      desc: "Entities, Use Cases, and Repository Interfaces.",
      rules: [
        "The absolute structural center of the feature.",
        "Contains purely plain Dart objects with ZERO external imports.",
        "Defines contracts (Repository interfaces) that other layers must implement."
      ],
      dependency: "Completely independent of other layers. Independent of Flutter or external DBs."
    },
    {
      id: "data",
      name: "Data Layer (Sources)",
      color: "border-blue-200 bg-blue-50/40 text-blue-900",
      icon: <ArrowRightLeft className="w-4 h-4 text-blue-500" />,
      desc: "Repository Implementations, Models, Hive Databases, Firestore APIs.",
      rules: [
        "Concretely implements Domain repository interfaces.",
        "Maps JSON/Firestore schemas into local models using fromJson/toJson.",
        "Handles caching protocols (caching to Hive database, sending to Firestore backend)."
      ],
      dependency: "Depends on DOMAIN layer contracts. Implements the Domain Interfaces."
    }
  ];

  return (
    <div className="bg-white rounded-xl p-1">
      <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-100 pb-3">
        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/50">
          <Network className="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-slate-800">Clean Architecture Flow</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Hover a layer to view its dependency contracts.</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-3">
        {layers.map((layer, idx) => (
          <React.Fragment key={layer.id}>
            {idx > 0 && (
              <div className="flex flex-col items-center -my-1">
                <ArrowUp className="w-4 h-4 text-slate-300 animate-pulse" />
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                  Depends On
                </span>
              </div>
            )}
            
            <div
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              className={`w-full border rounded-xl p-3.5 transition-all duration-300 cursor-help ${layer.color} ${
                hoveredLayer === layer.id ? 'scale-[1.01] border-slate-400 shadow-xs ring-4 ring-emerald-500/5' : 'shadow-2xs'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                {layer.icon}
                <span className="font-bold text-xs tracking-tight">{layer.name}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium mb-2">{layer.desc}</p>
              
              {/* Expand rules */}
              <div className="bg-white/90 p-2.5 rounded-lg border border-slate-100/80 space-y-1 text-[10px]">
                <span className="font-bold text-slate-500 block text-[9px] uppercase tracking-wider mb-1">Internal Rules:</span>
                {layer.rules.map((rule, rIdx) => (
                  <div key={rIdx} className="flex items-start space-x-1">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span className="text-slate-600 leading-normal">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-slate-400 font-bold mt-2.5 flex items-center gap-1 flex-wrap">
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Dependency:</span>
                <span className="text-slate-500 italic font-medium">{layer.dependency}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
