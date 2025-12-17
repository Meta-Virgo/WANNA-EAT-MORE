import React, { useState } from 'react';
import { Chapter } from '../types';
import { StatBlock } from './StatBlock';
import { ScrollText, ChevronDown, ChevronUp, Bookmark, Sparkles } from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
}

const CollapsibleSection: React.FC<{ title: string, content: string[] }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-12 border border-white/5 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 bg-paper-900/40 hover:border-blood-900/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 md:p-10 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center space-x-6">
            <Bookmark size={22} className={`${isOpen ? 'text-blood-500' : 'text-ink-300 opacity-20'}`} />
            <span className="font-serif font-bold text-ink-50 text-2xl lg:text-3xl tracking-tight leading-tight">{title}</span>
        </div>
        <div className={`p-2 rounded-full border transition-all duration-500 ${isOpen ? 'bg-blood-900 border-blood-500 text-white' : 'border-white/10 text-ink-300'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-10 lg:p-14 space-y-12 text-ink-100 border-t border-white/5 leading-reading text-[1.2rem] lg:text-[1.35rem] font-serif font-light tracking-reading bg-black/40">
          {content.map((p, i) => (
            <p key={i} className="hover:text-white transition-colors duration-500">{highlightText(p)}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

const highlightText = (text: string) => {
    if (typeof text !== 'string') return text;
    
    const parts = text.split(/(<[^>]+>|SAN\s*值|[\dD]+\/[\dD]+|POW\d+|【[^】]+】|1D\d+|IDEA|D100|MP\d+D\d+|STR\d+|CON\d+|SIZ\d+|INT\d+|DEX\d+|APP\d+|EDU\d+)/gi);
    
    return parts.map((part, i) => {
        if (part.startsWith('<') && part.endsWith('>')) {
            return <strong key={i} className="text-blood-400 font-bold bg-blood-900/10 px-1 rounded mx-0.5 border border-blood-900/20">{part}</strong>;
        }
        if (/SAN\s*值|[\dD]+\/[\dD]+|1D\d+|IDEA|D100|MP\d+D\d+|STR\d+|CON\d+|SIZ\d+|INT\d+|DEX\d+|APP\d+|EDU\d+/i.test(part)) {
            return <strong key={i} className="text-blood-500 font-bold tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.1)]">{part}</strong>;
        }
        if (part.startsWith('【') && part.endsWith('】')) {
            return <span key={i} className="text-blood-400 font-bold drop-shadow-[0_0_12px_rgba(239,68,68,0.25)]">{part}</span>;
        }
        return part;
    });
};

export const ChapterView: React.FC<ChapterViewProps> = ({ chapter }) => {
  return (
    <div className="max-w-[56rem] mx-auto py-24 px-8 sm:px-16 lg:px-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* 章节头部 */}
      <div className="mb-24 relative group">
        <div className="flex items-center space-x-5 text-[11px] uppercase tracking-[0.6em] text-blood-500 mb-8 font-black opacity-50 group-hover:opacity-100 transition-opacity">
           <span className="w-12 h-px bg-blood-600/50"></span>
           <span>{chapter.category}</span>
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white tracking-tightest leading-[1.05] mb-10 drop-shadow-2xl">
          {chapter.title}
        </h2>
        <div className="h-1.5 w-32 bg-gradient-to-r from-blood-600 to-transparent rounded-full opacity-30 group-hover:opacity-70 group-hover:w-48 transition-all duration-700"></div>
      </div>

      {/* 正文排版优化 */}
      <div className="space-y-14 text-[1.2rem] sm:text-[1.25rem] md:text-[1.35rem] leading-reading text-ink-100 font-serif font-light tracking-reading antialiased">
        {chapter.content.map((block, index) => {
          if (typeof block === 'string') {
            const isFirstParagraph = index === 0;
            
            if (block.startsWith('####')) {
               return (
                 <h3 key={index} className="text-3xl md:text-4xl font-serif font-bold text-blood-500 mt-32 mb-12 flex items-center group">
                   <div className="relative mr-6 shrink-0 transition-transform duration-500 group-hover:scale-125">
                      <Sparkles size={24} className="text-blood-900/40 group-hover:text-blood-500" />
                   </div>
                   <span className="tracking-tighter">{block.replace('####', '').trim()}</span>
                 </h3>
               );
            }

            if (block === '---') {
                return (
                  <div key={index} className="flex justify-center items-center my-32">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                );
            }

            if (/^\d+$/.test(block)) {
                return (
                    <div key={index} className="flex justify-center items-center my-24 opacity-20">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-ink-300"></div>
                        <span className="mx-12 text-xl text-ink-50 font-mono font-black tracking-[1.2em]">{block}</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-ink-300"></div>
                    </div>
                )
            }

            return (
              <p key={index} className={`relative break-words transition-all duration-500 hover:text-white ${isFirstParagraph && chapter.id !== 'intro' ? 'drop-cap' : ''}`}>
                {highlightText(block)}
              </p>
            );
          } else if (block.type === 'statblock') {
            return <StatBlock key={index} data={block.data} />;
          } else if (block.type === 'list') {
            return (
              <div key={index} className="my-20 bg-white/[0.01] p-10 md:p-14 rounded-3xl border-l-[12px] border-blood-600 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-16 -right-16 text-blood-950/5 pointer-events-none transform rotate-12 transition-all duration-1000 group-hover:rotate-0 group-hover:scale-110">
                    <ScrollText size={320} />
                </div>
                <ul className="space-y-10 relative z-10">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-8 text-ink-50">
                      <span className="text-blood-600 font-black mt-2 transition-all duration-300 text-2xl group-hover:text-blood-400">◆</span>
                      <span className="flex-1 text-2xl lg:text-3xl font-serif font-medium leading-snug tracking-tight">{highlightText(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else if (block.type === 'collapsible') {
            return <CollapsibleSection key={index} title={block.title} content={block.content} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};