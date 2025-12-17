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
    <div className="my-12 border border-white/5 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 bg-white/[0.02] backdrop-blur-2xl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 md:p-10 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center space-x-6">
            <Bookmark size={24} className={`${isOpen ? 'text-blood-500' : 'text-ink-300 opacity-40'}`} />
            <span className="font-serif font-semibold text-ink-50 text-2xl lg:text-3xl tracking-tight leading-none">{title}</span>
        </div>
        <div className={`p-2.5 rounded-full border transition-all duration-500 ${isOpen ? 'bg-blood-900 border-blood-500 text-white' : 'border-white/10 text-ink-300'}`}>
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-10 lg:p-16 space-y-12 text-ink-100 border-t border-white/5 leading-loose text-[1.15rem] lg:text-[1.25rem] font-serif font-light tracking-wide">
          {content.map((p, i) => (
            <p key={i} className="hover:text-white transition-colors duration-500">{highlightText(p)}</p>
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
            // 移除下划线，改用颜色强调
            return <span key={i} className="text-blood-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">{part}</span>;
        }
        return part;
    });
};

export const ChapterView: React.FC<ChapterViewProps> = ({ chapter }) => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-8 lg:px-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* 章节头部 */}
      <div className="mb-32 relative">
        <div className="flex items-center space-x-6 text-[11px] uppercase tracking-[0.8em] text-blood-500 mb-8 font-black opacity-50">
           <span className="w-12 h-[1px] bg-blood-600"></span>
           <span>{chapter.category}</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tightest leading-[0.95] mb-12 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          {chapter.title}
        </h2>
        <div className="h-1.5 w-32 bg-gradient-to-r from-blood-600 to-transparent rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)]"></div>
      </div>

      {/* 正文排版：字号调整为符合经典阅读美学的比例 */}
      <div className="space-y-16 text-[1.2rem] md:text-[1.35rem] leading-loose text-ink-100 font-serif font-light tracking-[0.035em] antialiased">
        {chapter.content.map((block, index) => {
          if (typeof block === 'string') {
            const isFirstParagraph = index === 0;
            
            // 四级标题：作为小节标题
            if (block.startsWith('####')) {
               return (
                 <h3 key={index} className="text-3xl md:text-4xl font-semibold text-blood-500 mt-36 mb-16 font-serif flex items-center group">
                   <div className="relative mr-6 shrink-0">
                      <Sparkles size={28} className="text-blood-900/50 group-hover:text-blood-500 transition-all duration-700" />
                   </div>
                   <span className="tracking-tight">{block.replace('####', '').trim()}</span>
                 </h3>
               );
            }

            // 分割线
            if (block === '---') {
                return (
                  <div key={index} className="flex justify-center items-center my-36 opacity-10">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                );
            }

            // 数字分割
            if (/^\d+$/.test(block)) {
                return (
                    <div key={index} className="flex justify-center items-center my-32">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/5"></div>
                        <span className="mx-16 text-xl text-ink-300 font-mono font-bold tracking-[1.2em] opacity-40">{block}</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/5"></div>
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
              <div key={index} className="my-24 bg-white/[0.02] p-12 lg:p-20 rounded-3xl border-l-[12px] border-blood-600 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden ring-1 ring-white/5 group">
                <div className="absolute -top-16 -right-16 text-blood-950/20 pointer-events-none transform rotate-12 transition-transform duration-1000 group-hover:rotate-6 group-hover:scale-110">
                    <ScrollText size={380} />
                </div>
                <ul className="space-y-12 relative z-10">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-8 text-ink-50 group/item">
                      <span className="text-blood-500 font-black mt-2 group-hover/item:scale-125 transition-all duration-500 text-3xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">◆</span>
                      <span className="flex-1 text-2xl lg:text-3xl font-medium leading-snug tracking-tight">{highlightText(item)}</span>
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