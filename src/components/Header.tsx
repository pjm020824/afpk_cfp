import React from 'react';
import { ShieldCheck, Sparkles, User, HelpCircle, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  aiStatus: 'ai_active' | 'rule_based' | 'loading' | 'idle';
  activePersonaName: string;
  onOpenDemoSelector: () => void;
  onResetToNew: () => void;
  onOpenTaxGuide: () => void;
  currentView: 'home' | 'wizard' | 'dashboard';
  onChangeView: (view: 'home' | 'wizard' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  aiStatus,
  activePersonaName,
  onOpenDemoSelector,
  onResetToNew,
  onOpenTaxGuide,
  currentView,
  onChangeView
}) => {
  const getAiBadge = () => {
    switch (aiStatus) {
      case 'ai_active':
        return { text: 'Gemini 3.8 AI 분석 완료', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
      case 'loading':
        return { text: 'AI 분석 생성 중...', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse' };
      case 'rule_based':
        return { text: 'CFP 규칙 기반 분석 모드', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
      default:
        return { text: hasApiKey ? 'Gemini AI 연동 대기' : 'CFP 표준엔진 가동', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const aiBadge = getAiBadge();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* 브랜드 및 로고 */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onChangeView('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                LifePlan AI
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                CFP 재무설계 절차 참고
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI 종합 재무설계 플랫폼</p>
          </div>
        </div>

        {/* 내비게이션 및 액티브 상태 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* AI 상태 배지: 실제 연동 여부 정확 표시 */}
          <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${aiBadge.color}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiBadge.text}</span>
          </div>

          {/* 현재 프로필 배지 */}
          <button
            onClick={onOpenDemoSelector}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="가상 고객 사례 불러오기"
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="max-w-[120px] sm:max-w-none truncate">{activePersonaName}</span>
          </button>

          {/* 세제 가이드 버튼 */}
          <button
            onClick={onOpenTaxGuide}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>세제·절세 가이드</span>
          </button>

          {/* 새 진단 시작 */}
          {currentView !== 'home' && (
            <button
              onClick={onResetToNew}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
              title="초기화 후 새 입력"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">처음으로</span>
            </button>
          )}

          {/* 메인 액션 버튼 */}
          {currentView === 'home' ? (
            <button
              onClick={() => onChangeView('wizard')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-blue-600/30 transition"
            >
              진단 시작하기
            </button>
          ) : currentView === 'wizard' ? (
            <button
              onClick={() => onChangeView('dashboard')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
            >
              대시보드 보기
            </button>
          ) : (
            <button
              onClick={() => onChangeView('wizard')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              정보 수정하기
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
