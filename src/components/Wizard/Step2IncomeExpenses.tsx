import React from 'react';
import { UserFinancialProfile } from '../../types/financial';
import { Wallet, CreditCard, PiggyBank, ArrowDownRight, Info } from 'lucide-react';
import { formatKRW } from '../../utils/formatters';

interface Step2Props {
  data: UserFinancialProfile;
  onChange: (updates: Partial<UserFinancialProfile>) => void;
}

export const Step2IncomeExpenses: React.FC<Step2Props> = ({ data, onChange }) => {
  // 소득 변경 핸들러
  const handleIncomeChange = (field: keyof UserFinancialProfile['income'], value: number) => {
    onChange({
      income: {
        ...data.income,
        [field]: Math.max(0, value)
      }
    });
  };

  // 소비지출 변경 핸들러
  const handleExpenseChange = (field: keyof UserFinancialProfile['expenses'], value: number) => {
    onChange({
      expenses: {
        ...data.expenses,
        [field]: Math.max(0, value)
      }
    });
  };

  // 저축투자 변경 핸들러
  const handleSavingsChange = (field: keyof UserFinancialProfile['savingsAndInvestment'], value: number) => {
    onChange({
      savingsAndInvestment: {
        ...data.savingsAndInvestment,
        [field]: Math.max(0, value)
      }
    });
  };

  const totalMonthlyIncome = data.income.monthlySalary + data.income.monthlyBusiness + data.income.monthlyPension + data.income.monthlyOther;
  const totalMonthlyConsumption = data.expenses.housing + data.expenses.living + data.expenses.transportCommunication + data.expenses.education + data.expenses.insurance + data.expenses.otherConsumption;
  const totalDebtPayment = data.debts.reduce((sum, d) => sum + (d.currentMonthlyPayment || 0), 0);
  const totalMonthlySavings = data.savingsAndInvestment.monthlySavings + data.savingsAndInvestment.monthlyInvestment + data.savingsAndInvestment.monthlyPensionSavings;

  const availableCashflow = totalMonthlyIncome - totalMonthlyConsumption - totalDebtPayment;
  const unallocatedCashflow = availableCashflow - totalMonthlySavings;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          <span>STEP 2. 월 소득 및 지출 구조</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          CFP 원칙에 따라 <strong>순수 소비지출</strong>, <strong>금융자산 저축·투자</strong>, <strong>부채 원리금 상환</strong>을 엄격히 분리하여 이중차감을 방지합니다.
        </p>
      </div>

      {/* 1. 월 세후 소득 섹션 */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
            <Wallet className="w-4 h-4" />
            <span>월 정기 세후 수입</span>
          </h4>
          <span className="text-xs font-semibold text-white">합계: {formatKRW(totalMonthlyIncome)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium">세후 근로소득 (실수령액)</label>
            <input
              type="number"
              step="50000"
              value={data.income.monthlySalary || ''}
              onChange={(e) => handleIncomeChange('monthlySalary', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
              placeholder="예: 3000000"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.income.monthlySalary)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">사업 및 부업소득</label>
            <input
              type="number"
              step="50000"
              value={data.income.monthlyBusiness || ''}
              onChange={(e) => handleIncomeChange('monthlyBusiness', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
              placeholder="예: 0"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.income.monthlyBusiness)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">정기 연금소득</label>
            <input
              type="number"
              step="50000"
              value={data.income.monthlyPension || ''}
              onChange={(e) => handleIncomeChange('monthlyPension', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
              placeholder="예: 0"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.income.monthlyPension)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">기타 정기 수입 (배당/이자/임대)</label>
            <input
              type="number"
              step="50000"
              value={data.income.monthlyOther || ''}
              onChange={(e) => handleIncomeChange('monthlyOther', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
              placeholder="예: 0"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.income.monthlyOther)}</span>
          </div>
        </div>
      </div>

      {/* 2. 월 소비 지출 섹션 */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-1.5">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">월 소비 지출 (저축·대출 제외)</h4>
          </div>
          <span className="text-xs font-semibold text-white">소비합계: {formatKRW(totalMonthlyConsumption)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium">주거비 (월세/관리비)</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.housing || ''}
              onChange={(e) => handleExpenseChange('housing', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.housing)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">식비 및 생활비</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.living || ''}
              onChange={(e) => handleExpenseChange('living', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.living)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">교통 및 통신비</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.transportCommunication || ''}
              onChange={(e) => handleExpenseChange('transportCommunication', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.transportCommunication)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">교육 및 자기계발비</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.education || ''}
              onChange={(e) => handleExpenseChange('education', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.education)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">보장성 보험료</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.insurance || ''}
              onChange={(e) => handleExpenseChange('insurance', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.insurance)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">기타 소비 (문화/여가/경조사)</label>
            <input
              type="number"
              step="10000"
              value={data.expenses.otherConsumption || ''}
              onChange={(e) => handleExpenseChange('otherConsumption', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.expenses.otherConsumption)}</span>
          </div>
        </div>
      </div>

      {/* 3. 월 정기 저축 및 투자 섹션 */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-1.5">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">정기 저축 및 투자 (자산 형성)</h4>
          </div>
          <span className="text-xs font-semibold text-white">저축합계: {formatKRW(totalMonthlySavings)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium">정기적금 / 주택청약</label>
            <input
              type="number"
              step="50000"
              value={data.savingsAndInvestment.monthlySavings || ''}
              onChange={(e) => handleSavingsChange('monthlySavings', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.savingsAndInvestment.monthlySavings)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">주식 / 펀드 / ETF 적립</label>
            <input
              type="number"
              step="50000"
              value={data.savingsAndInvestment.monthlyInvestment || ''}
              onChange={(e) => handleSavingsChange('monthlyInvestment', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.savingsAndInvestment.monthlyInvestment)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">연금저축 / IRP 납입</label>
            <input
              type="number"
              step="50000"
              value={data.savingsAndInvestment.monthlyPensionSavings || ''}
              onChange={(e) => handleSavingsChange('monthlyPensionSavings', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.savingsAndInvestment.monthlyPensionSavings)}</span>
          </div>
        </div>
      </div>

      {/* 4. 실시간 현금흐름 검증 서머리 바 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950/60 border border-blue-500/30 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-300">
          <Info className="w-4 h-4" />
          <span>CFP 현금흐름 배분 실시간 검증 (월 단위)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">월 세후소득</span>
            <span className="font-bold text-white text-sm">{formatKRW(totalMonthlyIncome)}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">소비+대출상환</span>
            <span className="font-bold text-rose-300 text-sm">{formatKRW(totalMonthlyConsumption + totalDebtPayment)}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">월 가용현금흐름</span>
            <span className={`font-bold text-sm ${availableCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatKRW(availableCashflow)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">미배분 잉여현금</span>
            <span className={`font-bold text-sm ${unallocatedCashflow >= 0 ? 'text-blue-300' : 'text-amber-400'}`}>
              {formatKRW(unallocatedCashflow)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
