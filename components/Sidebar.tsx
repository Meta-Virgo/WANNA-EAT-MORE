import React from 'react';
import { BookOpen, X, ChevronRight, Info, PlayCircle, Flag, ScrollText } from 'lucide-react';
import { CONTENT, APP_TITLE } from '../constants';
import { ContentCategory } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
}

const CategoryIcon = ({ category }: { category: ContentCategory }) => {
  switch (category) {
    case '前言': return <ScrollText size={16} />;
    case '模组背景&导入': return <Info size={16} />;
    case '故事开始': return <PlayCircle size={16} />;
    case '结局与结算': return <Flag size={16} />;
    default: return <BookOpen size={16} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeChapterId, onSelectChapter }) => {
  const categories: ContentCategory[] = ['前言', '模组背景&导入', '故事开始', '结局与结算'];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-paper-950 text-ink-200 shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-paper-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:h-screen md:border-r md:flex-shrink-0 flex flex-col`}
    >
      <div className="flex items-center justify-between p-6 border-b border-paper-800">
        <div className="flex flex-col space-y-1">
          <span className="font-serif font-bold tracking-[0.2em] text-xl text-blood-500">{APP_TITLE}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink-300">CoC Scenario Reader</span>
        </div>
        <button onClick={onClose} className="md:hidden text-ink-300 hover:text-ink-100">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
        {categories.map((cat) => {
          const chaptersInCat = CONTENT.filter(c => c.category === cat);
          if (chaptersInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center space-x-2 px-3 mb-3">
                <span className="text-blood-900"><CategoryIcon category={cat} /></span>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-300 border-b border-blood-900/30 flex-1 pb-1">
                  {cat}
                </h3>
              </div>
              <div className="space-y-1">
                {chaptersInCat.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      onSelectChapter(chapter.id);
                      onClose();
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-sm text-sm transition-all duration-200 flex items-center justify-between group ${
                      activeChapterId === chapter.id
                        ? 'bg-blood-900/10 text-blood-500 border-l-2 border-blood-500 shadow-inner pl-4'
                        : 'text-ink-200 hover:bg-paper-800 hover:text-ink-100 border-l-2 border-transparent hover:pl-4'
                    }`}
                  >
                    <span className="truncate font-medium">{chapter.title}</span>
                    {activeChapterId === chapter.id && <ChevronRight size={14} className="animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-paper-800 text-[10px] text-ink-300 font-mono text-center">
        © NEI SHAN JING ER LANG
      </div>
    </div>
  );
};