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
    <div className="my-10 border border-white/5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 bg-paper-900/40">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/[0.02] transition-colors text-left border-b border-transparent"
      >
        <div className="flex items-center space-x-5">
            <Bookmark size={20} className={`${isOpen ? 'text-blood-500' : 'text-ink-300 opacity-30'}`} />
            <span className="font-serif font-semibold text-ink-50 text-xl lg:text-2xl tracking-tight leading-tight">{title}</span>
        </div>
        <div className={`p-1.5 rounded-full border transition-all duration-300 ${isOpen ? 'bg-blood-900 border-blood-500 text-white' : 'border-white/10 text-ink-300'}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <div className={`transition-all duration-500 ease-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-8 lg:p-12 space-y-10 text-ink-100 border-t border-white/5 leading-loose text-[1.1rem] lg:text-[1.2rem] font-serif font-light tracking-wide bg-black/20">
          {content.map((p, i) => (
            <p key={i} className="hover:text-white transition-colors duration-300">{highlightText(p)}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

// 语义化高亮函数
const highlightText = (text: string) => {
    if (typeof text !== 'string') return text;
    
    const parts = text.split(/(<[^>]+>|SAN\s*值|[\dD]+\/[\dD]+|POW\d+|【[^】]+】|1D\d+|IDEA|D100|MP\d+D\d+)/gi);
    
    return parts.map((part, i) => {
        if (part.startsWith('<') && part.endsWith('>')) {
            return <strong key={i} className="text-blood-400 font-bold bg-blood-900/10 px-1 rounded mx-0.5 border border-blood-900/20">{part}</strong>;
        }
        if (/SAN\s*值|[\dD]+\/[\dD]+|1D\d+|IDEA|D100|MP\d+D\d+/i.test(part)) {
            return <strong key={i} className="text-blood-500 font-bold tracking-tight">{part}</strong>;
        }
        if (part.startsWith('【') && part.endsWith('】')) {
            return <span key={i} className="text-blood-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">{part}</span>;
        }
        return part;
    });
};

export const ChapterView: React.FC<ChapterViewProps> = ({ chapter }) => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 sm:px-12 lg:px-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* 章节头部 */}
      <div className="mb-20 relative">
        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] text-blood-500 mb-6 font-black opacity-60">
           <span className="w-8 h-px bg-blood-600"></span>
           <span>{chapter.category}</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tightest leading-[1.1] mb-8 drop-shadow-2xl max-w-full overflow-hidden truncate">
          {chapter.title}
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-blood-600 to-transparent rounded-full opacity-50"></div>
      </div>

      {/* 正文排版 */}
      <div className="space-y-12 text-[1.1rem] sm:text-[1.25rem] leading-loose text-ink-100 font-serif font-light tracking-wide antialiased">
        {chapter.content.map((block, index) => {
          if (typeof block === 'string') {
            const isFirstParagraph = index === 0;
            
            // 四级标题：作为小节标题
            if (block.startsWith('####')) {
               return (
                 <h3 key={index} className="text-2xl md:text-3xl font-semibold text-blood-500 mt-24 mb-10 font-serif flex items-center group">
                   <div className="relative mr-4 shrink-0">
                      <Sparkles size={20} className="text-blood-900/50 group-hover:text-blood-500 transition-all duration-500" />
                   </div>
                   <span className="tracking-tight">{block.replace('####', '').trim()}</span>
                 </h3>
               );
            }

            // 分割线
            if (block === '---') {
                return (
                  <div key={index} className="flex justify-center items-center my-24 opacity-10">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                );
            }

            // 数字分割
            if (/^\d+$/.test(block)) {
                return (
                    <div key={index} className="flex justify-center items-center my-20">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5"></div>
                        <span className="mx-10 text-lg text-ink-300 font-mono font-bold tracking-[0.8em] opacity-30">{block}</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5"></div>
                    </div>
                )
            }

            // 标准段落
            return (
              <p key={index} className={`relative break-words transition-all duration-500 hover:text-white ${isFirstParagraph && chapter.id !== 'intro' ? 'drop-cap' : ''}`}>
                {highlightText(block)}
              </p>
            );
          } else if (block.type === 'statblock') {
            return <StatBlock key={index} data={block.data} />;
          } else if (block.type === 'list') {
            return (
              <div key={index} className="my-16 bg-white/[0.01] p-8 md:p-12 rounded-2xl border-l-8 border-blood-600 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 text-blood-950/10 pointer-events-none transform rotate-12 transition-transform duration-1000 group-hover:rotate-6">
                    <ScrollText size={240} />
                </div>
                <ul className="space-y-8 relative z-10">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-6 text-ink-50">
                      <span className="text-blood-500 font-black mt-1.5 transition-all duration-300 text-xl">◆</span>
                      <span className="flex-1 text-xl lg:text-2xl font-medium leading-snug tracking-tight">{highlightText(item)}</span>
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