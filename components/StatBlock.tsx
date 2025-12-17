import React, { useState } from 'react';
import { Skull, Swords, Heart, Move, Zap, Shield, Sparkles, User, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface StatBlockProps {
  data: string;
}

export const StatBlock: React.FC<StatBlockProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const titleLine = lines[0];
  const body = lines.slice(1);

  const isMythos = lines.some(l => /装甲|SAN\s*值丧失|咒文|无形之子|怪物/.test(l));

  const statsRegex = /([A-Z\u4e00-\u9fa5]+)\s*(\d+)/g;
  const coreStats: { label: string; value: string }[] = [];
  const statsLine = body.find(l => /STR|CON|SIZ|INT|POW|DEX|APP|EDU/.test(l));
  if (statsLine) {
    let match;
    while ((match = statsRegex.exec(statsLine)) !== null) {
      coreStats.push({ label: match[1], value: match[2] });
    }
  }

  const derivedStats: { label: string; value: string }[] = [];
  const derivLine = body.find(l => /耐久力|移动/.test(l));
  if (derivLine) {
    const derivMatches = derivLine.match(/([^\d\s]+)\s*(\d+)/g);
    derivMatches?.forEach(m => {
      const parts = m.match(/([^\d\s]+)\s*(\d+)/);
      if (parts) derivedStats.push({ label: parts[1], value: parts[2] });
    });
  }

  const dbLine = body.find(l => /db\s*[+-]?[\d\w]*/i.test(l));
  const dbValue = dbLine ? dbLine.replace(/db/i, '').trim() : null;

  const weapons = body.filter(l => l.startsWith('武器：')).map(l => {
    const content = l.replace('武器：', '').trim();
    const parts = content.split(/\s+/);
    return { name: parts[0], stats: parts.slice(1).join(' ') };
  });

  const skillLines = body.filter(l => l.startsWith('技能：'));
  const skills = skillLines.length > 0 
    ? skillLines.join(' ').replace(/技能：/g, '').split(/\s+/).filter(s => s.trim().length > 0) 
    : [];

  const armor = body.find(l => l.startsWith('装甲：'))?.replace('装甲：', '');
  const sanLoss = body.find(l => /SAN\s*值丧失：/.test(l))?.replace(/.*SAN\s*值丧失：/, '');
  const specialAbilities = body.filter(l => l.startsWith('＊'));
  
  const generalNotes = body.filter(l => 
    !l.startsWith('＊') && !l.startsWith('武器：') && !l.startsWith('技能：') && 
    !l.startsWith('装甲：') && !l.includes('SAN值丧失') &&
    !l.includes('STR') && !l.includes('耐久') && !l.includes('db') &&
    l.length > 5
  );

  return (
    <div className={`my-16 font-sans transition-all duration-700 rounded-2xl overflow-hidden border-2 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative group ${
      isMythos ? 'border-blood-900/50 bg-blood-950/20' : 'border-white/10 bg-white/[0.02]'
    }`}>
      {/* 侧边装饰 */}
      <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${isMythos ? 'bg-blood-600' : 'bg-ink-300 opacity-20'}`}></div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-8 flex items-center justify-between transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-center space-x-6">
          <div className={`p-4 rounded-xl flex items-center justify-center transition-all duration-500 ${
            isMythos ? 'bg-blood-900 text-blood-400 shadow-[0_0_20px_rgba(127,29,29,0.3)]' : 'bg-paper-800 text-ink-300'
          }`}>
            {isMythos ? <Skull size={32} /> : <User size={32} />}
          </div>
          <div>
            <h4 className={`text-2xl md:text-3xl font-serif font-black tracking-tighter ${isMythos ? 'text-blood-400' : 'text-ink-50'}`}>
              {titleLine}
            </h4>
            <div className="flex items-center space-x-3 mt-1.5">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm ${
                isMythos ? 'bg-blood-900/40 text-blood-500' : 'bg-white/5 text-ink-300'
              }`}>
                {isMythos ? 'mythos entity' : 'subject record'}
              </span>
              {!isExpanded && <span className="text-[9px] text-ink-300/30 uppercase tracking-widest font-black animate-pulse">open file</span>}
            </div>
          </div>
        </div>
        <div className={`p-2.5 rounded-full border transition-all duration-500 ${
          isExpanded ? 'bg-blood-900 border-blood-500 text-white' : 'bg-white/5 border-white/10 text-ink-300'
        }`}>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-10 pb-12 space-y-14 border-t border-white/5 pt-12">
          
          {/* 属性网格 */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {coreStats.map((s, i) => (
              <div key={i} className="flex flex-col items-center bg-black/40 border border-white/5 rounded-xl py-4 transition-all hover:bg-white/[0.05] hover:border-blood-900/30">
                <span className={`text-[10px] font-bold mb-2 uppercase tracking-tighter opacity-60 ${isMythos ? 'text-blood-400' : 'text-ink-300'}`}>{s.label}</span>
                <span className="text-xl font-mono font-black text-ink-50">{s.value}</span>
              </div>
            ))}
          </div>

          {/* 衍生属性 */}
          <div className="flex flex-wrap gap-5">
            {derivedStats.map((s, i) => (
              <div key={i} className="flex-1 min-w-[160px] flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                <div className={`flex items-center space-x-3 ${isMythos ? 'text-blood-400' : 'text-ink-300'}`}>
                  {s.label.includes('耐久') ? <Heart size={20} /> : <Move size={20} />}
                  <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                </div>
                <span className="text-3xl font-mono font-black text-ink-50">{s.value}</span>
              </div>
            ))}
            {dbValue && (
              <div className="flex-1 min-w-[160px] flex items-center justify-between p-5 bg-blood-950/30 border border-blood-900/40 rounded-2xl">
                <div className="flex items-center space-x-3 text-blood-500">
                  <Zap size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Bonus</span>
                </div>
                <span className="text-2xl font-mono font-black text-blood-500">{dbValue}</span>
              </div>
            )}
          </div>

          {/* 武器库 */}
          {weapons.length > 0 && (
            <div className="space-y-6">
              <h5 className={`text-[11px] font-black tracking-[0.5em] uppercase opacity-40 ${isMythos ? 'text-blood-400' : 'text-ink-300'}`}>Combat Capabilities</h5>
              <div className="grid grid-cols-1 gap-4">
                {weapons.map((w, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-black/50 border border-white/5 rounded-2xl hover:border-blood-900/40 transition-all">
                    <div className="flex items-center space-x-5">
                      <Swords size={20} className={isMythos ? 'text-blood-600' : 'text-ink-300'} />
                      <span className="text-2xl font-serif font-black text-white">{w.name}</span>
                    </div>
                    <span className={`font-mono font-black px-8 py-2.5 rounded-xl text-xl mt-4 sm:mt-0 ${
                      isMythos ? 'bg-blood-900/30 text-blood-400 border border-blood-500/20' : 'bg-white/5 text-ink-100 border border-white/10'
                    }`}>
                      {w.stats}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 特殊能力 */}
          {specialAbilities.length > 0 && (
            <div className="space-y-6">
              <h5 className="text-[11px] font-black tracking-[0.5em] text-blood-500 uppercase opacity-60">Abilities & Traits</h5>
              <div className="space-y-5">
                {specialAbilities.map((abil, i) => (
                  <div key={i} className="bg-blood-950/40 border-l-4 border-blood-600 p-8 rounded-r-2xl shadow-inner flex items-start space-x-6">
                    <AlertTriangle size={24} className="text-blood-500 shrink-0 mt-1" />
                    <p className="text-xl text-ink-50 font-medium leading-relaxed italic">{abil}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 防御与理智 */}
          {isMythos && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {armor && (
                <div className="p-8 rounded-2xl bg-black/60 border border-white/5 space-y-4">
                  <div className="flex items-center space-x-3 text-blood-400 opacity-60">
                    <Shield size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Passive Protection</span>
                  </div>
                  <p className="text-[0.95rem] text-ink-100 leading-loose italic border-l-2 border-blood-900/50 pl-5">{armor}</p>
                </div>
              )}
              {sanLoss && (
                <div className="p-8 rounded-2xl bg-blood-950/20 border border-blood-900/30 flex flex-col justify-center text-center">
                  <span className="text-[10px] font-black text-blood-500 uppercase tracking-widest mb-3 opacity-60">Sanity Loss Potential</span>
                  <p className="text-5xl font-mono font-black text-blood-500 tracking-tightest">{sanLoss}</p>
                </div>
              )}
            </div>
          )}

          {/* 技能与笔记 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
            {skills.length > 0 && (
              <div className="space-y-5">
                <h6 className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center">
                   Training & Expertise
                </h6>
                <div className="flex flex-wrap gap-3">
                  {skills.map((s, i) => (
                    <span key={i} className={`px-5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 ${
                      isMythos ? 'bg-blood-900/20 text-blood-400 border border-blood-600/20' : 'bg-white/5 text-ink-100 border border-white/10'
                    }`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {generalNotes.length > 0 && (
              <div className="space-y-5">
                <h6 className="text-[10px] font-black opacity-30 uppercase tracking-widest">Observation Logs</h6>
                <div className="space-y-4">
                  {generalNotes.map((note, i) => (
                    <p key={i} className="text-[0.85rem] text-ink-300 italic leading-relaxed pl-5 border-l border-white/10 opacity-70">{note}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};