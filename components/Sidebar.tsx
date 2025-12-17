import React from 'react';
import { BookOpen, X, ChevronRight, Info, PlayCircle, Flag, ScrollText } from 'lucide-react';
import { CONTENT, APP_TITLE, APP_SUBTITLE } from '../constants';
import { ContentCategory } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
}

const CategoryIcon = ({ category }: { category: ContentCategory }) => {
  switch (category) {
    case '前言': return <ScrollText size={14} />;
    case '模组背景&导入': return <Info size={14} />;
    case '故事开始': return <PlayCircle size={14} />;
    case '结局与结算': return <Flag size={14} />;
    default: return <BookOpen size={14} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeChapterId, onSelectChapter }) => {
  const categories: ContentCategory[] = ['前言', '模组背景&导入', '故事开始', '结局与结算'];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-paper-950 text-ink-200 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-r border-white/5 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:h-screen md:flex-shrink-0 flex flex-col`}
    >
      <div className="p-8 border-b border-white/5 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif font-black tracking-widest text-2xl text-blood-500 uppercase">{APP_TITLE}</span>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-ink-300">
            <X size={20} />
          </button>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-ink-300 opacity-60">
          {APP_SUBTITLE} • Scenario Reader
        </span>
      </div>

      <nav className="flex-1 p-6 space-y-10 overflow-y-auto custom-scrollbar">
        {categories.map((cat) => {
          const chaptersInCat = CONTENT.filter(c => c.category === cat);
          if (chaptersInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center space-x-3 px-2 group">
                <span className="text-blood-900 group-hover:text-blood-500 transition-colors"><CategoryIcon category={cat} /></span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-ink-300 flex-1 border-b border-blood-900/20 pb-1.5">
                  {cat}
                </h3>
              </div>
              <div className="space-y-1.5">
                {chaptersInCat.map((chapter) => {
                  const isActive = activeChapterId === chapter.id;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        onSelectChapter(chapter.id);
                        onClose();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-between group relative ${
                        isActive
                          ? 'bg-blood-950/20 text-ink-50 border border-blood-900/40 shadow-[0_0_20px_rgba(127,29,29,0.1)]'
                          : 'text-ink-300 hover:bg-white/[0.03] hover:text-ink-100 border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-4 bg-blood-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      )}
                      <span className={`truncate ${isActive ? 'font-bold tracking-tight' : 'font-medium opacity-80'}`}>
                        {chapter.title}
                      </span>
                      {isActive && <ChevronRight size={14} className="text-blood-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="text-[9px] text-ink-300 font-mono tracking-widest text-center opacity-40 hover:opacity-100 transition-opacity">
          © {new Date().getFullYear()} NEI SHAN JING ER LANG
        </div>
      </div>
    </div>
  );
};