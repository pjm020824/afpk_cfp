import React from 'react';
import { UserFinancialProfile, DebtItem, LoanRepaymentType } from '../../types/financial';
import { Landmark, AlertTriangle, Plus, Trash2, Calculator } from 'lucide-react';
import { formatKRW } from '../../utils/formatters';
import { calculateLoan } from '../../calculations/loans';

interface Step3Props {
  data: UserFinancialProfile;
  onChange: (updates: Partial<UserFinancialProfile>) => void;
}

export const Step3AssetsDebts: React.FC<Step3Props> = ({ data, onChange }) => {
  const handleAssetChange = (field: keyof UserFinancialProfile['assets'], value: number) => {
    onChange({
      assets: {
        ...data.assets,
        [field]: Math.max(0, value)
      }
    });
  };

  const addDebt = () => {
    const newDebt: DebtItem = {
      id: `debt-${Date.now()}`,
      name: '신규 대출',
      category: 'credit',
      balance: 10000000,
      annualInterestRate: 4.5,
      remainingMonths: 36,
      repaymentType: 'equal_principal_interest',
      currentMonthlyPayment: 297000
    };
    onChange({ debts: [...data.debts, newDebt] });
  };

  const updateDebt = (id: string, updates: Partial<DebtItem>) => {
    const updated = data.debts.map(d => {
      if (d.id !== id) return d;
      const merged = { ...d, ...updates };

      // 잔액이나 금리, 기간, 상환방식이 바뀌었을 때 월 상환액 자동 재계산 편의 제공
      if ('balance' in updates || 'annualInterestRate' in updates || 'remainingMonths' in updates || 'repaymentType' in updates) {
        if (!('currentMonthlyPayment' in updates)) {
          const calc = calculateLoan(merged.balance, merged.annualInterestRate, merged.remainingMonths, merged.repaymentType);
          merged.currentMonthlyPayment = calc.monthlyPayment;
        }
      }
      return merged;
    });
    onChange({ debts: updated });
  };

  const removeDebt = (id: string) => {
    onChange({ debts: data.debts.filter(d => d.id !== id) });
  };

  const totalAssets = data.assets.cashAndChecking + data.assets.savingsDeposits + data.assets.stocksFunds + data.assets.pensionAssets + data.assets.realEstate + data.assets.otherAssets;
  const totalDebts = data.debts.reduce((sum, d) => sum + (d.balance || 0), 0);
  const netWorth = totalAssets - totalDebts;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Landmark className="w-5 h-5 text-blue-400" />
          <span>STEP 3. 자산 및 부채 현황</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          보유 자산을 유동성, 투자, 연금, 부동산으로 구분하고 부채의 잔액 및 상환 조건을 입력합니다.
        </p>
      </div>

      {/* 1. 보유 자산 섹션 */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">보유 자산 항목</h4>
          <span className="text-xs font-semibold text-emerald-400">자산 합계: {formatKRW(totalAssets)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-300 font-medium">현금 및 수시입출금 (비상자금)</label>
            <input
              type="number"
              step="100000"
              value={data.assets.cashAndChecking || ''}
              onChange={(e) => handleAssetChange('cashAndChecking', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.cashAndChecking)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">정기예금 / 적금</label>
            <input
              type="number"
              step="500000"
              value={data.assets.savingsDeposits || ''}
              onChange={(e) => handleAssetChange('savingsDeposits', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.savingsDeposits)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">주식 / ETF / 펀드</label>
            <input
              type="number"
              step="500000"
              value={data.assets.stocksFunds || ''}
              onChange={(e) => handleAssetChange('stocksFunds', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.stocksFunds)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">연금자산 (연금저축/IRP/퇴직연금)</label>
            <input
              type="number"
              step="500000"
              value={data.assets.pensionAssets || ''}
              onChange={(e) => handleAssetChange('pensionAssets', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.pensionAssets)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">부동산 (주택/전세보증금)</label>
            <input
              type="number"
              step="1000000"
              value={data.assets.realEstate || ''}
              onChange={(e) => handleAssetChange('realEstate', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.realEstate)}</span>
          </div>

          <div>
            <label className="text-slate-300 font-medium">기타 자산 (귀금속/회원권 등)</label>
            <input
              type="number"
              step="500000"
              value={data.assets.otherAssets || ''}
              onChange={(e) => handleAssetChange('otherAssets', parseInt(e.target.value) || 0)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">{formatKRW(data.assets.otherAssets)}</span>
          </div>
        </div>
      </div>

      {/* 2. 부채 상세 목록 섹션 */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">보유 부채(대출) 목록</h4>
            <span className="text-[11px] text-slate-400">({data.debts.length}건)</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-rose-300">부채 합계: {formatKRW(totalDebts)}</span>
            <button
              type="button"
              onClick={addDebt}
              className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/30 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>대출 추가</span>
            </button>
          </div>
        </div>

        {data.debts.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            등록된 대출이 없습니다. 대출이 있다면 '대출 추가' 버튼을 눌러주세요.
          </div>
        ) : (
          <div className="space-y-3">
            {data.debts.map((debt, index) => (
              <div key={debt.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 mr-2">
                    <span className="font-semibold text-slate-400">#{index + 1}</span>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, { name: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-medium focus:border-blue-500 flex-1 max-w-[200px]"
                      placeholder="대출명 (예: 주택담보대출)"
                    />
                    <select
                      value={debt.category}
                      onChange={(e) => updateDebt(debt.id, { category: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                    >
                      <option value="mortgage">주택담보</option>
                      <option value="jeonse">전세자금</option>
                      <option value="credit">신용대출</option>
                      <option value="student">학자금</option>
                      <option value="other">기타부채</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDebt(debt.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="대출 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400">대출 잔액 (원)</label>
                    <input
                      type="number"
                      step="500000"
                      value={debt.balance || ''}
                      onChange={(e) => updateDebt(debt.id, { balance: parseInt(e.target.value) || 0 })}
                      className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-400">{formatKRW(debt.balance)}</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">연 이자율 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={debt.annualInterestRate || ''}
                      onChange={(e) => updateDebt(debt.id, { annualInterestRate: parseFloat(e.target.value) || 0 })}
                      className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">남은 기간 (개월)</label>
                    <input
                      type="number"
                      value={debt.remainingMonths || ''}
                      onChange={(e) => updateDebt(debt.id, { remainingMonths: parseInt(e.target.value) || 0 })}
                      className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">상환 방식</label>
                    <select
                      value={debt.repaymentType}
                      onChange={(e) => updateDebt(debt.id, { repaymentType: e.target.value as LoanRepaymentType })}
                      className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    >
                      <option value="equal_principal_interest">원리금균등</option>
                      <option value="equal_principal">원금균등</option>
                      <option value="bullet">만기일시</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">월 상환액 (원)</label>
                    <input
                      type="number"
                      value={debt.currentMonthlyPayment || ''}
                      onChange={(e) => updateDebt(debt.id, { currentMonthlyPayment: parseInt(e.target.value) || 0 })}
                      className="mt-0.5 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    />
                    <span className="text-[10px] text-slate-400">{formatKRW(debt.currentMonthlyPayment)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. 순자산 서머리 카드 */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400">총자산 ({formatKRW(totalAssets)}) - 총부채 ({formatKRW(totalDebts)})</span>
          <p className="text-sm font-bold text-white mt-0.5">현재 순자산: <span className={netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatKRW(netWorth)}</span></p>
        </div>
        <div className="text-slate-400 text-right">
          <span>자기자본(순자산) 비율: {totalAssets > 0 ? Math.round((netWorth / totalAssets) * 100) : 0}%</span>
        </div>
      </div>

    </div>
  );
};
