import React, { useState, useEffect } from 'react';
import { Menu, ChevronUp, Users, Clock, ChevronDown } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { CONTENT, APP_TITLE, APP_SUBTITLE, AUTHOR_INFO, SCENARIO_STATS } from './constants';

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

  const startReading = () => {
    const contentStart = document.getElementById('chapter-content-start');
    contentStart?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-paper-950 text-ink-100 overflow-hidden font-sans selection:bg-blood-600/40 selection:text-white">
      {/* 移动端顶栏 */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-paper-950/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 py-5 shadow-2xl">
        <span className="font-serif font-black text-blood-500 tracking-tightest text-xl uppercase truncate pr-4">{APP_TITLE}</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-ink-200 p-2 bg-white/5 hover:bg-blood-900 rounded-lg transition-all border border-white/10 shrink-0">
          <Menu size={20} />
        </button>
      </div>

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeChapterId={activeChapterId}
        onSelectChapter={setActiveChapterId}
      />

      <main id="main-content" className="flex-1 overflow-y-auto relative bg-paper-950 scroll-smooth custom-scrollbar">
        <div className="relative z-10 pt-20 md:pt-0 min-h-full flex flex-col">
            {activeChapterId === 'intro' && (
                <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative">
                    {/* 背景氛围层 - 仅在首页渲染 */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#000_100%)]"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.3)_0%,_transparent_70%)] animate-pulse duration-[8000ms]"></div>
                    </div>

                    {/* 顶部标签 */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-30 animate-in fade-in slide-in-from-top-4 duration-1000">
                      <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.6em] text-ink-300 uppercase">
                        <span className="w-8 h-px bg-white/20"></span>
                        <span>Scenario Code: 1-WEM</span>
                        <span className="w-8 h-px bg-white/20"></span>
                      </div>
                    </div>

                    <div className="relative z-10 space-y-16 w-full max-w-6xl animate-in fade-in duration-1000">
                        <div className="flex flex-col items-center">
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif font-black text-blood-500 tracking-tightest leading-none mb-4 drop-shadow-[0_25px_50px_rgba(239,68,68,0.25)] uppercase animate-in zoom-in-95 duration-700">
                                {APP_TITLE}
                            </h1>
                            <div className="flex items-center space-x-6 w-full max-w-lg mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blood-900/40"></div>
                                <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-ink-50 tracking-[0.4em] sm:tracking-[0.6em] uppercase opacity-80 font-light whitespace-nowrap">
                                    {APP_SUBTITLE}
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blood-900/40"></div>
                            </div>
                        </div>

                        {/* 核心参数：勋章化排版 */}
                        <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                          <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-full px-8 py-4 backdrop-blur-md shadow-2xl space-x-12">
                            <div className="flex items-center space-x-4 group">
                              <Users size={20} className="text-blood-500 group-hover:scale-110 transition-transform" />
                              <div className="flex flex-col items-start leading-tight">
                                <span className="text-[9px] text-ink-300 uppercase tracking-widest opacity-50">Players</span>
                                <span className="text-sm md:text-base font-mono font-bold text-ink-50 tracking-reading">{SCENARIO_STATS.players}</span>
                              </div>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="flex items-center space-x-4 group">
                              <Clock size={20} className="text-blood-500 group-hover:scale-110 transition-transform" />
                              <div className="flex flex-col items-start leading-tight">
                                <span className="text-[9px] text-ink-300 uppercase tracking-widest opacity-50">Duration</span>
                                <span className="text-sm md:text-base font-mono font-bold text-ink-50 tracking-reading">{SCENARIO_STATS.duration}</span>
                              </div>
                            </div>
                          </div>

                          <div className="max-w-xl mx-auto space-y-4">
                            <p className="text-ink-300 font-serif text-lg md:text-2xl tracking-[0.15em] font-light italic leading-relaxed opacity-60">
                                {AUTHOR_INFO}
                            </p>
                          </div>
                        </div>
                    </div>

                    {/* 向下引导图标 */}
                    <button 
                      onClick={startReading}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity animate-bounce"
                    >
                      <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-ink-200">Scroll to Start</span>
                      <ChevronDown size={20} className="text-blood-500" />
                    </button>
                </div>
            )}

            <div id="chapter-content-start">
              <ChapterView chapter={activeChapter} />
            </div>

            {/* 翻页导航 */}
            <div className="max-w-4xl mx-auto w-full px-8 pb-32 mt-16 flex flex-col sm:flex-row gap-6">
                {(() => {
                    const currentIndex = CONTENT.findIndex(c => c.id === activeChapterId);
                    const prev = CONTENT[currentIndex - 1];
                    const next = CONTENT[currentIndex + 1];

                    return (
                        <>
                            <div className="flex-1">
                                {prev && (
                                    <button 
                                        onClick={() => setActiveChapterId(prev.id)}
                                        className="text-left group w-full p-8 border border-white/5 hover:border-blood-900/50 rounded-2xl transition-all bg-white/[0.02] hover:bg-blood-950/10 backdrop-blur-sm"
                                    >
                                        <div className="text-blood-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 opacity-40 group-hover:opacity-100 transition-opacity">PREV</div>
                                        <div className="text-ink-100 font-serif font-bold group-hover:text-white transition-colors truncate text-xl tracking-tighter">
                                            {prev.title}
                                        </div>
                                    </button>
                                )}
                            </div>
                            <div className="flex-1">
                                {next && (
                                    <button 
                                        onClick={() => setActiveChapterId(next.id)}
                                        className="text-right group w-full p-8 border border-white/5 hover:border-blood-900/50 rounded-2xl transition-all bg-white/[0.02] hover:bg-blood-950/10 backdrop-blur-sm"
                                    >
                                        <div className="text-blood-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 opacity-40 group-hover:opacity-100 transition-opacity">NEXT</div>
                                        <div className="text-ink-100 font-serif font-bold group-hover:text-white transition-colors truncate text-xl tracking-tighter">
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
          className={`fixed bottom-8 right-8 z-50 p-4 bg-blood-900 text-white rounded-full shadow-2xl transition-all duration-500 hover:bg-blood-600 hover:-translate-y-1 active:scale-90 border border-blood-500/20 ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronUp size={24} />
        </button>
      </main>
    </div>
  );
};

export default App;