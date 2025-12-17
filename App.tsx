import React, { useState, useEffect } from 'react';
import { Menu, ChevronUp } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { CONTENT, APP_TITLE, AUTHOR_INFO } from './constants';

const App: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>(CONTENT[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const activeChapter = CONTENT.find((c) => c.id === activeChapterId) || CONTENT[0];

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeChapterId]);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    const handleScroll = () => {
       if (mainContent && mainContent.scrollTop > 500) {
         setShowScrollTop(true);
       } else {
         setShowScrollTop(false);
       }
    };
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-paper-950 text-ink-100 overflow-hidden font-sans selection:bg-blood-600/40 selection:text-white">
      {/* 移动端顶栏 - 更高级的毛玻璃效果 */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-paper-950/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 py-5 shadow-2xl">
        <span className="font-serif font-black text-blood-500 tracking-tightest text-2xl uppercase">{APP_TITLE}</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-ink-200 p-2.5 bg-white/5 hover:bg-blood-900 rounded-full transition-all border border-white/10">
          <Menu size={24} />
        </button>
      </div>

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeChapterId={activeChapterId}
        onSelectChapter={setActiveChapterId}
      />

      <main id="main-content" className="flex-1 overflow-y-auto relative bg-paper-950 scroll-smooth custom-scrollbar">
        {/* 高级环境光效：模拟昏暗书房的光影 */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#000_100%)]"></div>
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[radial-gradient(circle_at_15%_15%,_rgba(239,68,68,0.25)_0%,_transparent_60%)]"></div>
        <div className="fixed bottom-0 right-0 w-full h-full pointer-events-none z-0 opacity-5 bg-[radial-gradient(circle_at_85%_85%,_rgba(239,68,68,0.2)_0%,_transparent_50%)]"></div>
        
        <div className="relative z-10 pt-20 md:pt-0 min-h-full flex flex-col">
            {activeChapterId === 'intro' && (
                <div className="min-h-screen flex flex-col justify-center items-center text-center p-12 relative overflow-hidden border-b border-white/5">
                    <div className="relative z-10 space-y-16">
                        <div className="flex flex-col items-center">
                            <h1 className="text-8xl md:text-[10rem] font-serif font-black text-blood-500 tracking-tightest leading-none mb-10 drop-shadow-[0_30px_60px_rgba(239,68,68,0.4)] animate-in zoom-in duration-1000 uppercase">
                                {APP_TITLE}
                            </h1>
                            <div className="h-[1px] w-80 bg-gradient-to-r from-transparent via-blood-600 to-transparent mb-10 opacity-50"></div>
                            <h2 className="text-4xl md:text-6xl font-serif text-ink-50 tracking-[0.8em] uppercase opacity-90 font-light">
                                无尽食欲
                            </h2>
                        </div>
                        <div className="max-w-xl mx-auto space-y-4">
                          <p className="text-blood-500 font-mono text-[11px] tracking-[0.5em] uppercase font-black opacity-80">Codex Transcript</p>
                          <p className="text-ink-300 font-serif text-lg md:text-2xl tracking-[0.25em] font-light italic">
                              {AUTHOR_INFO}
                          </p>
                        </div>
                    </div>
                </div>
            )}

            <ChapterView chapter={activeChapter} />

            {/* 翻页导航 */}
            <div className="max-w-4xl mx-auto w-full px-8 pb-32 mt-32 flex justify-between items-center">
                {(() => {
                    const currentIndex = CONTENT.findIndex(c => c.id === activeChapterId);
                    const prev = CONTENT[currentIndex - 1];
                    const next = CONTENT[currentIndex + 1];

                    return (
                        <>
                            <div className="w-1/2 pr-6">
                                {prev && (
                                    <button 
                                        onClick={() => setActiveChapterId(prev.id)}
                                        className="text-left group w-full p-10 border border-white/5 hover:border-blood-900 rounded-3xl transition-all bg-white/[0.02] hover:bg-blood-950/10 backdrop-blur-md"
                                    >
                                        <div className="text-blood-500 text-[9px] font-black uppercase tracking-[0.4em] mb-4 opacity-40 group-hover:opacity-100 transition-opacity">PREV LOG</div>
                                        <div className="text-ink-100 font-serif font-bold group-hover:text-white transition-colors truncate text-2xl tracking-tighter">
                                            {prev.title}
                                        </div>
                                    </button>
                                )}
                            </div>
                            <div className="w-1/2 pl-6 text-right">
                                {next && (
                                    <button 
                                        onClick={() => setActiveChapterId(next.id)}
                                        className="text-right group w-full p-10 border border-white/5 hover:border-blood-900 rounded-3xl transition-all bg-white/[0.02] hover:bg-blood-950/10 backdrop-blur-md"
                                    >
                                        <div className="text-blood-500 text-[9px] font-black uppercase tracking-[0.4em] mb-4 opacity-40 group-hover:opacity-100 transition-opacity">NEXT LOG</div>
                                        <div className="text-ink-100 font-serif font-bold group-hover:text-white transition-colors truncate text-2xl tracking-tighter">
                                            {next.title}
                                        </div>
                                    </button>
                                )}
                            </div>
                        </>
                    )
                })()}
            </div>
        </div>

        {/* 悬浮回到顶部 */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-12 right-12 z-50 p-5 bg-blood-900 text-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-blood-600 hover:-translate-y-2 active:scale-90 border border-blood-500/20 ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronUp size={28} />
        </button>
      </main>
    </div>
  );
};

export default App;