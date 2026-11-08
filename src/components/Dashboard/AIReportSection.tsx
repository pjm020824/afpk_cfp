import React, { useState } from 'react';
import { AIAnalysisReport } from '../../types/financial';
import { 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  ListOrdered, 
  Info,
  RefreshCw
} from 'lucide-react';

interface AIReportProps {
  report: AIAnalysisReport | null;
  isLoading: boolean;
  onRefreshReport: () => void;
  aiSource: string;
}

export const AIReportSection: React.FC<AIReportProps> = ({
  report,
  isLoading,
  onRefreshReport,
  aiSource
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!report) return;

    const formattedText = `[LifePlan AI - CFP 종합 재무설계 보고서]
작성일시: ${new Date(report.generatedAt).toLocaleString('ko-KR')}
분석엔진: ${report.isAIGenerated ? 'Google Gemini 3.8 Flash' : 'CFP 표준 금융공학 엔진'}

■ 1. 재무상태 종합 요약
- 총평: ${report.summary.headline}
- 순자산 평가: ${report.summary.netWorthText}
- 현금흐름 진단: ${report.summary.cashflowEvaluation}
- 주요 강점:
${report.summary.keyStrengths.map(s => `  • ${s}`).join('\n')}
- 주요 우려사항:
${report.summary.keyConcerns.map(c => `  • ${c}`).join('\n')}

■ 2. 주요 재무문제 진단 (TOP 3)
${report.diagnoses.map((d, i) => `${i + 1}. [${d.severity.toUpperCase()}] ${d.title}
   - 원인: ${d.cause}
   - 관련지표: ${d.metrics}
   - 개선권고: ${d.recommendation}`).join('\n\n')}

■ 3. 재무목표 충돌 및 우선순위 전략
- 충돌분석: ${report.goalsEvaluationText.conflictAnalysis}
- 배분전략: ${report.goalsEvaluationText.priorityStrategy}

■ 4. 대안 시나리오 비교 판정
- 종합판정: ${report.scenarioComparisonText.verdict}
- 기대효과: ${report.scenarioComparisonText.tradeoffs}

■ 5. 단계별 실행 계획 (Action Plan)
[즉시 실행 (1개월 내)]
${report.actionPlan.immediate.map(item => `  1. ${item}`).join('\n')}

[3개월 내 점검 과제]
${report.actionPlan.midTerm.map(item => `  2. ${item}`).join('\n')}

[1년 내 재검토 과제]
${report.actionPlan.longTerm.map(item => `  3. ${item}`).join('\n')}

■ 6. 계산 근거 및 분석 한계
- 적용 공식: ${report.assumptionsAndLimits.formulasUsed.join(', ')}
- 유의사항: ${report.assumptionsAndLimits.caveats.join(' / ')}
- 추가 확인 필요 정보: ${report.assumptionsAndLimits.furtherVerificationNeeded.join(' / ')}
`;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      
      {/* 헤더 및 AI 상태 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Gemini AI 종합 재무분석 보고서</h3>
              <p className="text-xs text-slate-400">금융공학 계산값을 바탕으로 한 전문 CFP 자문 리포트</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* AI 모드 배지 */}
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 ${
            report?.isAIGenerated
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>{report?.isAIGenerated ? 'Gemini 3.8 Flash 실시간 분석' : 'CFP 표준 규칙 모드'}</span>
          </span>

          {/* 다시 생성 */}
          <button
            onClick={onRefreshReport}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="보고서 다시 생성"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* 공모전용 원클릭 전체 복사 */}
          <button
            onClick={handleCopy}
            disabled={!report || isLoading}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료!' : '보고서 텍스트 복사'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-white">Gemini AI가 정량 계산 결과를 정밀 분석 중입니다...</p>
          <p className="text-xs text-slate-500">숫자 왜곡 검증 및 CFP 7단계 실행 계획을 조율하고 있습니다.</p>
        </div>
      ) : !report ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          생성된 보고서가 없습니다. 상단의 '보고서 생성' 버튼을 눌러주세요.
        </div>
      ) : (
        <div className="space-y-6 text-xs text-slate-300">
          
          {/* 1. 재무상태 요약 카드 */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>1. 종합 진단 및 총평</span>
            </h4>
            <p className="text-sm font-semibold text-blue-200 leading-relaxed bg-blue-950/40 p-3 rounded-lg border border-blue-500/20">
              "{report.summary.headline}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">순자산 및 자산구조</span>
                <p className="mt-1 leading-relaxed">{report.summary.netWorthText}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">월간 현금흐름 건전성</span>
                <p className="mt-1 leading-relaxed">{report.summary.cashflowEvaluation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400">주요 강점 (Strengths)</span>
                <ul className="space-y-1 list-disc list-inside text-emerald-200">
                  {report.summary.keyStrengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                <span className="font-bold text-rose-400">주요 우려사항 (Concerns)</span>
                <ul className="space-y-1 list-disc list-inside text-rose-200">
                  {report.summary.keyConcerns.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 2. 주요 재무문제 진단 TOP 3 */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>2. 핵심 재무 위험요인 진단 (TOP 3)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.diagnoses.map((diag, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-400 text-xs">#{index + 1}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        diag.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : diag.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {diag.severity.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-xs leading-snug">{diag.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                      <strong>원인:</strong> {diag.cause}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong>지표:</strong> {diag.metrics}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-blue-300 bg-blue-950/20 p-2 rounded">
                    <strong>개선안:</strong> {diag.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 목표 충돌 분석 & 대안 시나리오 비교 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h5 className="font-bold text-indigo-400 text-xs flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>3. 목표 충돌 해소 자금 배분 전략</span>
              </h5>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {report.goalsEvaluationText.conflictAnalysis}
              </p>
              <p className="text-indigo-200 text-[11px] leading-relaxed pt-1">
                {report.goalsEvaluationText.priorityStrategy}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h5 className="font-bold text-emerald-400 text-xs flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>4. 대안 시나리오 종합 판정</span>
              </h5>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {report.scenarioComparisonText.verdict}
              </p>
              <p className="text-emerald-200 text-[11px] leading-relaxed pt-1">
                {report.scenarioComparisonText.tradeoffs}
              </p>
            </div>
          </div>

          {/* 5. 단계별 실행 계획 (Action Plan) */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>5. 단계별 실행 로드맵 (Action Plan)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* 즉시 실행 */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 inline-block">
                  즉시 실행 (1개월 내)
                </span>
                <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside text-slate-300">
                  {report.actionPlan.immediate.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 3개월 내 */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 inline-block">
                  3개월 내 점검 과제
                </span>
                <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside text-slate-300">
                  {report.actionPlan.midTerm.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 1년 내 */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 inline-block">
                  1년 내 재검토 과제
                </span>
                <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside text-slate-300">
                  {report.actionPlan.longTerm.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 6. 계산 근거 및 한계 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>계산 근거 공식 및 분석 한계 안내</span>
            </div>
            <p><strong>적용 공식:</strong> {report.assumptionsAndLimits.formulasUsed.join(' | ')}</p>
            <p><strong>유의사항:</strong> {report.assumptionsAndLimits.caveats.join(' / ')}</p>
            <p><strong>추가 확인 필요:</strong> {report.assumptionsAndLimits.furtherVerificationNeeded.join(' / ')}</p>
          </div>

        </div>
      )}

    </div>
  );
};
