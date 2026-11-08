import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserFinancialProfile, AIAnalysisReport } from './types/financial';
import { DEMO_PROFILES, DemoProfileItem } from './data/demoProfiles';
import { calculateFinancialHealth } from './calculations/indicators';
import { evaluateGoalsAndConflicts } from './calculations/goalConflict';
import { calculateScenarios } from './calculations/scenarios';
import { calculateRetirementAnalysis } from './calculations/retirement';
import { checkServerHealth, requestAIReport } from './services/aiService';

// UI 컴포넌트
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { WizardContainer } from './components/Wizard/WizardContainer';
import { DemoSelectorModal } from './components/DemoSelectorModal';
import { TaxGuideModal } from './components/Dashboard/TaxGuideModal';

// 대시보드 섹션 컴포넌트
import { FinancialHealthCards } from './components/Dashboard/FinancialHealthCards';
import { GoalConflictCard } from './components/Dashboard/GoalConflictCard';
import { CashflowAndAssetCharts } from './components/Dashboard/CashflowAndAssetCharts';
import { ScenarioComparisonSection } from './components/Dashboard/ScenarioComparisonSection';
import { RetirementSection } from './components/Dashboard/RetirementSection';
import { AIReportSection } from './components/Dashboard/AIReportSection';

import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Edit3, 
  Users, 
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // 현재 활성화된 고객 프로필 (기본값: 사례 A 사회초년생)
  const [profile, setProfile] = useState<UserFinancialProfile>(DEMO_PROFILES[0].profile);
  const [activePersonaName, setActivePersonaName] = useState<string>(DEMO_PROFILES[0].badge + ' 사례');
  
  // 화면 뷰 상태: 'home' | 'wizard' | 'dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'wizard' | 'dashboard'>('home');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'conflict' | 'scenarios' | 'retirement' | 'ai_report'>('overview');

  // 모달 제어 상태
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isTaxGuideOpen, setIsTaxGuideOpen] = useState(false);

  // 서버 및 AI 상태
  const [hasApiKey, setHasApiKey] = useState(false);
  const [aiReport, setAiReport] = useState<AIAnalysisReport | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSource, setAiSource] = useState<string>('rule_based_cfp_engine');

  // 시나리오 B 지출 절감 커스텀 금액
  const [customExpenseReduction, setCustomExpenseReduction] = useState<number>(300000);

  // 1. 서버 헬스체크 및 API 키 상태 확인
  useEffect(() => {
    checkServerHealth().then(res => {
      setHasApiKey(res.hasApiKey);
    });
  }, []);

  // 2. 금융공학 순수 함수 계산 (Memoized)
  const health = useMemo(() => calculateFinancialHealth(profile), [profile]);
  const goalsResult = useMemo(() => evaluateGoalsAndConflicts(profile, health), [profile, health]);
  const scenarios = useMemo(() => calculateScenarios(profile, health, customExpenseReduction), [profile, health, customExpenseReduction]);
  const retirement = useMemo(() => calculateRetirementAnalysis(profile), [profile]);

  // 3. AI 분석 리포트 생성 함수
  const fetchAIReport = useCallback(async (currentProf = profile, expenseReduction = customExpenseReduction) => {
    setIsLoadingAI(true);
    try {
      const currentHealth = calculateFinancialHealth(currentProf);
      const currentGoals = evaluateGoalsAndConflicts(currentProf, currentHealth);
      const currentScenarios = calculateScenarios(currentProf, currentHealth, expenseReduction);

      const res = await requestAIReport({
        profile: currentProf,
        health: currentHealth,
        goalsResult: currentGoals,
        scenarios: currentScenarios
      });

      setAiReport(res.report);
      setAiSource(res.source);
    } catch (err) {
      console.error('AI 분석 리포트 생성 오류:', err);
    } finally {
      setIsLoadingAI(false);
    }
  }, [profile, customExpenseReduction]);

  // 4. 가상 고객 선택 처리
  const handleSelectDemo = (demo: DemoProfileItem) => {
    setProfile(demo.profile);
    setActivePersonaName(`${demo.badge} (${demo.title.split(':')[1]?.trim() || demo.badge})`);
    setCurrentView('dashboard');
    // 지출 절감 기본값 초기화
    const varExp = demo.profile.expenses.living + demo.profile.expenses.otherConsumption;
    const initialReduction = Math.round(varExp * 0.15);
    setCustomExpenseReduction(initialReduction);
    // AI 리포트 자동 갱신
    fetchAIReport(demo.profile, initialReduction);
  };

  // 5. 마법사 완료 처리
  const handleFinishWizard = (newProfile: UserFinancialProfile) => {
    setProfile(newProfile);
    setActivePersonaName('사용자 맞춤 프로필');
    setCurrentView('dashboard');
    fetchAIReport(newProfile, customExpenseReduction);
  };

  // 6. 초기화 및 새 진단 시작
  const handleResetToNew = () => {
    setProfile(DEMO_PROFILES[0].profile);
    setActivePersonaName('새 고객 진단');
    setCurrentView('wizard');
  };

  const aiStatus: 'ai_active' | 'rule_based' | 'loading' | 'idle' = isLoadingAI
    ? 'loading'
    : (aiReport?.isAIGenerated ? 'ai_active' : (aiReport ? 'rule_based' : 'idle'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* 헤더 */}
      <Header
        hasApiKey={hasApiKey}
        aiStatus={aiStatus}
        activePersonaName={activePersonaName}
        onOpenDemoSelector={() => setIsDemoModalOpen(true)}
        onResetToNew={handleResetToNew}
        onOpenTaxGuide={() => setIsTaxGuideOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. 홈 소개 화면 (Service Introduction) */}
        {currentView === 'home' && (
          <HomeHero
            onStartWizard={() => setCurrentView('wizard')}
            onSelectDemo={handleSelectDemo}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
        )}

        {/* 2. 5단계 입력 마법사 화면 (Wizard) */}
        {currentView === 'wizard' && (
          <WizardContainer
            initialData={profile}
            onFinish={handleFinishWizard}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {/* 3. 재무 진단 및 시뮬레이션 대시보드 화면 (Dashboard) */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            
            {/* 상단 프로필 요약 및 액션 바 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    분석 대상
                  </span>
                  <h2 className="text-lg font-black text-white">{activePersonaName}</h2>
                  <span className="text-xs text-slate-400">({profile.age}세, {profile.householdType === 'single' ? '1인 가구' : '부부 가구'})</span>
                </div>
                <p className="text-xs text-slate-400">
                  총 {profile.goals.length}개 재무목표 등록 | 은퇴 예정 {profile.expectedRetirementAge}세 | 기준 수익률 {profile.assumptions.expectedReturnRate}%
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentView('wizard')}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>정보 수정하기</span>
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>다른 사례 불러오기</span>
                </button>
              </div>
            </div>

            {/* 대시보드 탭 내비게이션 바 */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
              <button
                onClick={() => setDashboardTab('overview')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 whitespace-nowrap transition ${
                  dashboardTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>종합 재무상태표</span>
              </button>

              <button
                onClick={() => setDashboardTab('conflict')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 whitespace-nowrap transition ${
                  dashboardTab === 'conflict'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>재무목표 충돌 분석</span>
                {goalsResult.conflictAnalysis.hasConflict && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}
              </button>

              <button
                onClick={() => setDashboardTab('scenarios')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 whitespace-nowrap transition ${
                  dashboardTab === 'scenarios'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>3대 시나리오 비교</span>
              </button>

              <button
                onClick={() => setDashboardTab('retirement')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 whitespace-nowrap transition ${
                  dashboardTab === 'retirement'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>은퇴 시뮬레이션</span>
              </button>

              <button
                onClick={() => setDashboardTab('ai_report')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 whitespace-nowrap transition ${
                  dashboardTab === 'ai_report'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Gemini AI 분석 보고서</span>
              </button>
            </div>

            {/* 탭 1: 종합 재무상태표 (Overview) */}
            {dashboardTab === 'overview' && (
              <div className="space-y-6">
                <FinancialHealthCards health={health} />
                <CashflowAndAssetCharts health={health} profile={profile} />
                <GoalConflictCard goalsResult={goalsResult} onNavigateToWizard={() => setCurrentView('wizard')} />
              </div>
            )}

            {/* 탭 2: 재무목표 충돌 분석 (Conflict) */}
            {dashboardTab === 'conflict' && (
              <div className="space-y-6">
                <GoalConflictCard goalsResult={goalsResult} onNavigateToWizard={() => setCurrentView('wizard')} />
                <ScenarioComparisonSection
                  scenarios={scenarios}
                  onUpdateExpenseReduction={setCustomExpenseReduction}
                  currentExpenseReduction={customExpenseReduction}
                />
              </div>
            )}

            {/* 탭 3: 3대 시나리오 비교 (Scenarios) */}
            {dashboardTab === 'scenarios' && (
              <div className="space-y-6">
                <ScenarioComparisonSection
                  scenarios={scenarios}
                  onUpdateExpenseReduction={setCustomExpenseReduction}
                  currentExpenseReduction={customExpenseReduction}
                />
              </div>
            )}

            {/* 탭 4: 은퇴 시뮬레이션 (Retirement) */}
            {dashboardTab === 'retirement' && (
              <div className="space-y-6">
                <RetirementSection retirement={retirement} profile={profile} />
              </div>
            )}

            {/* 탭 5: Gemini AI 보고서 (AI Report) */}
            {dashboardTab === 'ai_report' && (
              <div className="space-y-6">
                <AIReportSection
                  report={aiReport}
                  isLoading={isLoadingAI}
                  onRefreshReport={() => fetchAIReport(profile)}
                  aiSource={aiSource}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* 푸터 */}
      <Footer />

      {/* 가상 고객 시연 선택 모달 */}
      <DemoSelectorModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectProfile={handleSelectDemo}
        currentProfileAge={profile.age}
      />

      {/* 대한민국 세제 및 절세 가이드 모달 */}
      <TaxGuideModal
        isOpen={isTaxGuideOpen}
        onClose={() => setIsTaxGuideOpen(false)}
      />

    </div>
  );
}
