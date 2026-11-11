import React, { useState } from 'react';
import { ProjectItem, TabType } from '../types';
import { triggerFileDownload } from '../utils/canvasRenderer';
import { 
  FolderKanban, 
  Download, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Trophy, 
  Smartphone, 
  ShieldCheck, 
  Type, 
  FileText, 
  Calendar, 
  Eye, 
  X,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MyProjectsProps {
  projects: ProjectItem[];
  onDeleteProject: (id: string) => void;
  onEditProject: (project: ProjectItem) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const MyProjects: React.FC<MyProjectsProps> = ({
  projects,
  onDeleteProject,
  onEditProject,
  onNavigateTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'thumbnail' | 'poster' | 'shorts' | 'logo' | 'text'>('all');
  const [viewingProject, setViewingProject] = useState<ProjectItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'text') return p.type === 'title' || p.type === 'description';
    return p.type === filter;
  });

  const handleDownload = (p: ProjectItem) => {
    if (p.previewUrl) {
      const fileName = `GOALSTAR_${p.type.toUpperCase()}_${p.id}.png`;
      triggerFileDownload(p.previewUrl, fileName);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#00F0FF', '#B026FF'],
        });
      } catch {}
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: ProjectItem['type']) => {
    switch (type) {
      case 'thumbnail':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'poster':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'shorts':
        return <Smartphone className="w-4 h-4 text-rose-400" />;
      case 'logo':
      case 'banner':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'title':
        return <Type className="w-4 h-4 text-purple-400" />;
      case 'description':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return <FolderKanban className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              MY CREATOR PROJECTS
            </h2>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              {projects.length} SAVED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Re-open previous designs in editor, preview full-resolution images, or download directly to your phone.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'thumbnail', label: 'Thumbnails' },
          { id: 'poster', label: 'Posters' },
          { id: 'shorts', label: 'Shorts 9:16' },
          { id: 'logo', label: 'Logos & PFPs' },
          { id: 'text', label: 'Titles & SEO' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'bg-[#0a0e24] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-[#090d22] rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white font-orbitron">No Projects in this category</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Use the creation suite to generate thumbnails, posters, logos, or titles.
          </p>
          <button
            onClick={() => onNavigateTab('thumbnails')}
            className="px-4 py-2 bg-cyan-500 text-black font-extrabold text-xs rounded-xl shadow-md hover:brightness-110 transition-all"
          >
            Create New Thumbnail
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProjects.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0a0e24] border border-slate-800 hover:border-cyan-500/40 hover:bg-[#0c1230] transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Media Preview if image */}
              {item.previewUrl ? (
                <div
                  onClick={() => setViewingProject(item)}
                  className="relative aspect-video bg-black/60 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded border border-cyan-500/30">
                      {item.dimensions || 'HD PNG'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-br from-[#0c1230] to-[#080b1a] border-b border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.type)}
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 font-mono">
                    {item.data?.description || item.data?.titles?.[0] || 'Text Project Content'}
                  </p>
                </div>
              )}

              {/* Card Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {item.previewUrl ? (
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all"
                        title="Download image to phone"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleCopyText(
                            item.data?.description || JSON.stringify(item.data?.titles, null, 2),
                            item.id
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold transition-all"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Text</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onEditProject(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteProject(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Preview Modal */}
      {viewingProject && viewingProject.previewUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#0a0e24] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white font-orbitron">{viewingProject.title}</h3>
                <span className="text-[10px] font-mono text-cyan-300">{viewingProject.dimensions}</span>
              </div>
              <button
                onClick={() => setViewingProject(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-black">
              <img
                src={viewingProject.previewUrl}
                alt={viewingProject.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onEditProject(viewingProject);
                  setViewingProject(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold"
              >
                Open in Editor
              </button>

              <button
                onClick={() => handleDownload(viewingProject)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30"
              >
                <Download className="w-4 h-4 fill-black" />
                <span>Download to Phone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
