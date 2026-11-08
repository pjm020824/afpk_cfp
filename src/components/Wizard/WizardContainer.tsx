import React, { useState } from 'react';
import { UserFinancialProfile } from '../../types/financial';
import { Step1Basic } from './Step1Basic';
import { Step2IncomeExpenses } from './Step2IncomeExpenses';
import { Step3AssetsDebts } from './Step3AssetsDebts';
import { Step4Goals } from './Step4Goals';
import { Step5Assumptions } from './Step5Assumptions';
import { ArrowLeft, ArrowRight, CheckCircle2, User, Wallet, Landmark, Target, Sliders } from 'lucide-react';

interface WizardContainerProps {
  initialData: UserFinancialProfile;
  onFinish: (profile: UserFinancialProfile) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: '기본상황', icon: User },
  { id: 2, title: '소득·지출', icon: Wallet },
  { id: 3, title: '자산·부채', icon: Landmark },
  { id: 4, title: '재무목표', icon: Target },
  { id: 5, title: '가정설정', icon: Sliders },
];

export const WizardContainer: React.FC<WizardContainerProps> = ({
  initialData,
  onFinish,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFinancialProfile>(initialData);

  const handleUpdate = (updates: Partial<UserFinancialProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinish(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* 스텝 인디케이터 헤더 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md space-y-4">
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-blue-400">CFP 5단계 입력 마법사</span>
          <span>진행률: {currentStep} / 5 단계 ({Math.round(progressPercentage)}%)</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* 스텝 탭 목록 */}
        <div className="grid grid-cols-5 gap-1 pt-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCurrent = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition ${
                  isCurrent
                    ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
                <span className="text-[10px] mt-0.5 sm:hidden">{step.title}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 스텝 본문 내용 카드 */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl">
        {currentStep === 1 && <Step1Basic data={formData} onChange={handleUpdate} />}
        {currentStep === 2 && <Step2IncomeExpenses data={formData} onChange={handleUpdate} />}
        {currentStep === 3 && <Step3AssetsDebts data={formData} onChange={handleUpdate} />}
        {currentStep === 4 && <Step4Goals data={formData} onChange={handleUpdate} />}
        {currentStep === 5 && <Step5Assumptions data={formData} onChange={handleUpdate} />}

        {/* 이전 / 다음 버튼 액션 바 */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold flex items-center space-x-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? '처음으로' : '이전 단계'}</span>
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition transform active:scale-95"
          >
            <span>{currentStep === 5 ? '재무분석 결과 보기' : '다음 단계'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
