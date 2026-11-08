import React, { useState } from 'react';
import { RetirementAnalysisResult, UserFinancialProfile } from '../../types/financial';
import { formatKRW } from '../../utils/formatters';
import { Clock, AlertTriangle, CheckCircle, ShieldCheck, ChevronDown, ChevronUp, Calculator, Info } from 'lucide-react';

interface RetirementProps {
  retirement: RetirementAnalysisResult;
  profile: UserFinancialProfile;
}

export const RetirementSection: React.FC<RetirementProps> = ({ retirement, profile }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(true);

  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    yearsToRetirement,
    retirementDurationYears,
    accumulatedAtRetirement,
    requiredAtRetirement,
    requiredAtRetirementPresentValue,
    shortfallAtRetirement,
    depletionAge,
    isDepletedBeforeLifeExpectancy,
    preRetirementReturnPercent,
    postRetirementReturnPercent,
    inflationRatePercent,
    realDiscountRatePercent,
    firstYearAnnualLivingExpense,
    simulationSchedule
  } = retirement;

  // 주요 연령대(5년 주기) 및 은퇴시점/소진시점 필터링
  const milestoneYears = simulationSchedule.filter((s) => {
    return (
      s.age === currentAge ||
      s.age === retirementAge ||
      s.age === 65 ||
      s.age === 70 ||
      s.age === 75 ||
      s.age === 80 ||
      s.age === 85 ||
      s.age === lifeExpectancy ||
      s.age === depletionAge
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-6">
      
      {/* 헤더 및 소진 경고 배너 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">은퇴자산 현금흐름 및 자산소진 시뮬레이션</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            은퇴 시점({retirementAge}세)부터 기대수명({lifeExpectancy}세)까지의 인플레이션 반영 생활비 인출과 자산 잔액을 추적합니다.
          </p>
        </div>

        {/* 소진 경고 배지 */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
          isDepletedBeforeLifeExpectancy
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          {isDepletedBeforeLifeExpectancy ? (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{depletionAge}세 자산 소진 위험 (소득 공백 발생)</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{lifeExpectancy}세까지 자산 소진 위험 없음 (안전)</span>
            </>
          )}
        </div>
      </div>

      {/* 3대 핵심 은퇴 지표 카드 (현재가치/미래가치/명목·실질 명시) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">은퇴 시점 예상 준비자산</span>
            <span className="text-[10px] text-blue-300 font-medium">은퇴시점 미래가치(FV)</span>
          </div>
          <span className="text-lg font-bold text-blue-400 block">{formatKRW(accumulatedAtRetirement)}</span>
          <span className="text-[10px] text-slate-500 block">
            {retirementAge}세 시점 (연 {preRetirementReturnPercent}% 복리운용 + 월 저축 적립)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">은퇴 시점 필요 은퇴자금</span>
            <span className="text-[10px] text-purple-300 font-medium">은퇴시점 미래가치(FV)</span>
          </div>
          <span className="text-lg font-bold text-white block">{formatKRW(requiredAtRetirement)}</span>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span>현재가치(PV) 환산:</span>
            <span className="text-slate-300 font-medium">{formatKRW(requiredAtRetirementPresentValue)}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">은퇴자금 과부족 (Shortfall)</span>
            <span className="text-[10px] text-rose-300 font-medium">은퇴시점 기준</span>
          </div>
          <span className={`text-lg font-bold block ${shortfallAtRetirement > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {shortfallAtRetirement > 0 ? `-${formatKRW(shortfallAtRetirement)} 부족` : `+${formatKRW(accumulatedAtRetirement - requiredAtRetirement)} 여유`}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {shortfallAtRetirement > 0 ? '추가 연금 적립 또는 소비 절감 필요' : '노후 준비 양호'}
          </span>
        </div>
      </div>

      {/* 금융계산 검증 및 상세 수식 공개 아코디언 */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full px-4 py-3 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between text-slate-300 font-semibold transition"
        >
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>금융계산 공식 및 수치 검증 경로 (CFP 계산 산식 공개)</span>
          </div>
          {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormulaDetails && (
          <div className="p-4 space-y-3.5 border-t border-slate-800 text-[11px] leading-relaxed text-slate-300">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2 border-b border-slate-800/80">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">은퇴 전 기대수익률 (명목)</span>
                <span className="font-bold text-white text-xs">연 {preRetirementReturnPercent}%</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">은퇴 후 운용수익률 (보수적)</span>
                <span className="font-bold text-white text-xs">연 {postRetirementReturnPercent}% (전기의 75%)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">연 물가상승률 (인플레이션)</span>
                <span className="font-bold text-white text-xs">연 {inflationRatePercent}%</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">피셔 실질 할인율 (r_real)</span>
                <span className="font-bold text-emerald-400 text-xs">연 {realDiscountRatePercent}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="font-semibold text-white">① 은퇴 시점 예상 준비자산 ({formatKRW(accumulatedAtRetirement)}) 산출 경로:</p>
                <p className="text-slate-400">
                  • 기초자산: 현재보유 금융투자자산 + 연금자산 + 정기예적금 = {formatKRW(profile.assets.stocksFunds + profile.assets.pensionAssets + profile.assets.savingsDeposits)}<br />
                  • 은퇴 전 연간 적립액: (정기예적금 + 투자적립 + 연금저축) × 12 = {formatKRW((profile.savingsAndInvestment.monthlySavings + profile.savingsAndInvestment.monthlyInvestment + profile.savingsAndInvestment.monthlyPensionSavings) * 12)}/년<br />
                  • 적용 공식: 연 {preRetirementReturnPercent}% 복리 운용수익 및 매년 정기적립 누적 (총 {yearsToRetirement}년간 증식)
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">② 은퇴 첫해 필요 생활비 ({formatKRW(firstYearAnnualLivingExpense)}/년, 월 {formatKRW(Math.round(firstYearAnnualLivingExpense / 12))}) 산출 경로:</p>
                <p className="text-slate-400">
                  • 현재가치 기준 희망 생활비: 월 {formatKRW(profile.assumptions.retirementMonthlyExpenses)} (연 {formatKRW(profile.assumptions.retirementMonthlyExpenses * 12)})<br />
                  • 물가상승률 {inflationRatePercent}%를 {yearsToRetirement}년간 복리 적용: {formatKRW(profile.assumptions.retirementMonthlyExpenses * 12)} × (1 + {inflationRatePercent / 100})^{yearsToRetirement} = {formatKRW(firstYearAnnualLivingExpense)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">③ 은퇴 필요자금 ({formatKRW(requiredAtRetirement)}) 연금 현가 공식:</p>
                <p className="text-slate-400">
                  • 피셔 방정식(Fisher Equation) 실질 할인율: <code>r_real = (1 + {postRetirementReturnPercent / 100}) / (1 + {inflationRatePercent / 100}) - 1 = {realDiscountRatePercent}%</code><br />
                  • 균등 구매력 연금현가 공식: <code>PV = {formatKRW(firstYearAnnualLivingExpense)} × [1 - (1 + r_real)^(-{retirementDurationYears})] / r_real = {formatKRW(requiredAtRetirement)}</code><br />
                  • 물가상승률을 실질 할인율에 일관되게 반영하여 <strong>물가상승률 중복 적용 없이</strong> 정확한 구매력을 보존하도록 계산되었습니다.
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">④ 자산 소진 예상 시점 ({depletionAge ? `${depletionAge}세` : '평생 안전'}):</p>
                <p className="text-slate-400">
                  {depletionAge ? (
                    `60세 시점 ${formatKRW(accumulatedAtRetirement)}을 기초자산으로 하여, 매년 물가상승률(${inflationRatePercent}%)만큼 증액되는 생활비를 인출하고 잔액에 연 ${postRetirementReturnPercent}% 운용수익이 가산될 때, ${depletionAge}세(은퇴 ${depletionAge - retirementAge}년 차)에 자산 잔액이 0원에 도달하여 소진 위험이 발생합니다.`
                  ) : (
                    `기대수명(${lifeExpectancy}세)까지 자산 잔액이 지속 유지되어 고갈 위험이 발생하지 않습니다.`
                  )}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 연령별 자산 잔액 타임라인 프리뷰 테이블 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">생애주기 주요 연령별 자산 잔액 추이 (세후·실질 현금흐름 반영)</span>
          <span>(은퇴 전: 자산증식기 / 은퇴 후: 인출기)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="py-2.5 px-3">연령</th>
                <th className="py-2.5 px-3">구분</th>
                <th className="py-2.5 px-3 text-right">기초 자산</th>
                <th className="py-2.5 px-3 text-right">연간 인출/유입</th>
                <th className="py-2.5 px-3 text-right">운용 수익</th>
                <th className="py-2.5 px-3 text-right">기말 자산 잔액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {milestoneYears.map((row) => (
                <tr key={row.age} className={`hover:bg-slate-800/30 transition ${row.age === depletionAge ? 'bg-rose-950/20 text-rose-300 font-semibold' : ''}`}>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {row.age}세 ({row.year}년)
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      !row.isRetired
                        ? 'bg-blue-500/20 text-blue-300'
                        : row.age === depletionAge
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {!row.isRetired ? '활동기(은퇴전)' : row.age === depletionAge ? '⚠️ 자산 소진' : '은퇴 생활기'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{formatKRW(row.beginningAssets)}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${row.netAnnualCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.netAnnualCashflow >= 0 ? `+${formatKRW(row.netAnnualCashflow)}` : formatKRW(row.netAnnualCashflow)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">+{formatKRW(row.investmentReturn)}</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${row.endingAssets > 0 ? 'text-white' : 'text-rose-400'}`}>
                    {formatKRW(row.endingAssets)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 안내사항 */}
      <div className="p-3.5 rounded-xl bg-slate-950 text-slate-400 text-xs border border-slate-800 leading-relaxed">
        <strong>CFP 은퇴설계 가이드:</strong> 은퇴 후 소득공백기(퇴직 후 국민연금 개시 연령인 63~65세까지의 3~5년)에는 개인연금(연금저축/IRP) 또는 퇴직연금을 통한 가교연금(Bridge Pension) 설계가 필수적입니다.
      </div>

    </div>
  );
};
