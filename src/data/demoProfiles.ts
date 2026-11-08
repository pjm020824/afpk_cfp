/**
 * 공모전 및 시연용 3대 가상 고객 프로필 데이터
 * Section 10 규격 준수: 사회초년생, 맞벌이 부부, 은퇴 예정자
 */

import { UserFinancialProfile } from '../types/financial';

export interface DemoProfileItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  profile: UserFinancialProfile;
}

export const DEMO_PROFILES: DemoProfileItem[] = [
  {
    id: 'young_professional',
    badge: '사회초년생',
    title: '사례 A: 26세 1인 가구 김민준',
    subtitle: '학자금 대출 상환과 종잣돈 마련이 시급한 사회초년생',
    description: '입사 2년 차, 월 280만 원의 소득 중 학자금 대출 상환과 생활비 지출로 저축 여력이 제한적이며 첫 종잣돈 5,000만 원 마련을 목표로 합니다.',
    profile: {
      age: 26,
      householdType: 'single',
      dependentsCount: 0,
      employmentStatus: 'employed',
      expectedRetirementAge: 60,
      interests: ['비상자금 확보', '학자금대출 조기상환', '첫 1억 종잣돈 만들기'],
      income: {
        monthlySalary: 2800000,
        monthlyBusiness: 0,
        monthlyPension: 0,
        monthlyOther: 0
      },
      expenses: {
        housing: 450000,       // 월세 및 관리비
        living: 600000,        // 식비 및 장보기
        transportCommunication: 200000, // 교통/통신
        education: 100000,     // 자기계발
        insurance: 100000,     // 실손 및 건강보험
        otherConsumption: 250000 // 문화/기타
      }, // 소비지출 합계: 1,700,000원
      savingsAndInvestment: {
        monthlySavings: 500000,       // 청년도약계좌 등 적금
        monthlyInvestment: 250000,    // 국내/해외 ETF 적립
        monthlyPensionSavings: 100000 // 연금저축펀드
      }, // 저축투자 합계: 850,000원
      assets: {
        cashAndChecking: 3000000,
        savingsDeposits: 5000000,
        stocksFunds: 2000000,
        pensionAssets: 0,
        realEstate: 0,
        otherAssets: 0
      }, // 총 금융자산: 10,000,000원
      debts: [
        {
          id: 'loan-student',
          name: '한국장학재단 학자금 대출',
          category: 'student',
          balance: 15000000,
          annualInterestRate: 1.7,
          remainingMonths: 72,
          repaymentType: 'equal_principal_interest',
          currentMonthlyPayment: 219000 // 월 상환액
        }
      ],
      goals: [
        {
          id: 'goal-emergency',
          category: 'emergency_fund',
          name: '3개월 필수 생활비 비상자금',
          targetAmount: 6000000,
          targetYears: 1,
          currentAmount: 3000000,
          priority: 'high',
          isFlexible: false,
          notes: '급여통장과 분리된 CMA 통장에 예치'
        },
        {
          id: 'goal-debt-clear',
          category: 'debt_repayment',
          name: '학자금 대출 조기 전액 상환',
          targetAmount: 15000000,
          targetYears: 4,
          currentAmount: 0,
          priority: 'high',
          isFlexible: true,
          notes: '금리는 낮으나 심리적 부채부담 해소 목적'
        },
        {
          id: 'goal-seed-money',
          category: 'seed_money',
          name: '30세 이전 5,000만 원 종잣돈',
          targetAmount: 50000000,
          targetYears: 4,
          currentAmount: 7000000,
          priority: 'medium',
          isFlexible: true,
          notes: '청년우대형 금융상품 및 인덱스 펀드 적립'
        }
      ],
      assumptions: {
        expectedReturnRate: 5.5,
        inflationRate: 2.3,
        incomeGrowthRate: 3.0,
        savingsGrowthRate: 3.0,
        retirementMonthlyExpenses: 2200000,
        lifeExpectancy: 90
      }
    }
  },
  {
    id: 'dual_income_couple',
    badge: '맞벌이 부부',
    title: '사례 B: 30대 맞벌이 부부 (33세/31세)',
    subtitle: '내 집 마련과 출산·육아, 은퇴 준비가 동시 충돌하는 30대',
    description: '부부 합산 세후 650만 원의 높은 소득을 올리고 있으나, 3년 내 수도권 아파트 내 집 마련과 출산 준비로 큰 목돈 지출이 예정되어 목표 충돌이 발생합니다.',
    profile: {
      age: 33,
      householdType: 'couple_no_kids',
      dependentsCount: 0,
      employmentStatus: 'employed',
      expectedRetirementAge: 60,
      interests: ['내 집 마련', '출산 및 자녀양육비', '장기 은퇴준비'],
      income: {
        monthlySalary: 6500000, // 부부 합산 세후 소득
        monthlyBusiness: 0,
        monthlyPension: 0,
        monthlyOther: 0
      },
      expenses: {
        housing: 800000,       // 아파트 관리비 및 주거비
        living: 1500000,       // 부부 식비 및 외식, 장보기
        transportCommunication: 450000, // 부부 차량 유지비 및 통신
        education: 200000,     // 역량 강화
        insurance: 350000,     // 부부 종신/건강/실손보험
        otherConsumption: 500000 // 여가, 경조사, 문화
      }, // 소비지출 합계: 3,800,000원
      savingsAndInvestment: {
        monthlySavings: 1000000,      // 주택청약 및 정기적금
        monthlyInvestment: 800000,    // 미국/국내 주식 및 ETF
        monthlyPensionSavings: 300000 // 부부 개인연금/IRP
      }, // 저축투자 합계: 2,100,000원
      assets: {
        cashAndChecking: 15000000,
        savingsDeposits: 35000000,
        stocksFunds: 25000000,
        pensionAssets: 5000000,
        realEstate: 0,
        otherAssets: 0
      }, // 총 금융자산: 80,000,000원
      debts: [
        {
          id: 'loan-jeonse',
          name: '전세자금 보증대출',
          category: 'jeonse',
          balance: 30000000,
          annualInterestRate: 3.8,
          remainingMonths: 24,
          repaymentType: 'bullet',
          currentMonthlyPayment: 95000 // 월 이자 상환
        }
      ],
      goals: [
        {
          id: 'goal-housing',
          category: 'housing',
          name: '수도권 내 집 마련 계약/잔금',
          targetAmount: 200000000, // 대출 외 필요 순수 자기자본
          targetYears: 4,
          currentAmount: 65000000,
          priority: 'high',
          isFlexible: false,
          notes: '디딤돌/보금자리론 등 정책금융 연계 계획'
        },
        {
          id: 'goal-baby',
          category: 'education',
          name: '출산 및 1~3세 영유아 케어 펀드',
          targetAmount: 30000000,
          targetYears: 2,
          currentAmount: 10000000,
          priority: 'high',
          isFlexible: false,
          notes: '배우자 육아휴직 기간 소득감소 보전'
        },
        {
          id: 'goal-retirement-couple',
          category: 'retirement',
          name: '60세 은퇴시점 부부 은퇴자산 6억',
          targetAmount: 600000000,
          targetYears: 27,
          currentAmount: 5000000,
          priority: 'medium',
          isFlexible: true,
          notes: '국민연금 외 추가 사적연금 캐시카우 구축'
        }
      ],
      assumptions: {
        expectedReturnRate: 6.0,
        inflationRate: 2.5,
        incomeGrowthRate: 2.5,
        savingsGrowthRate: 2.0,
        retirementMonthlyExpenses: 3200000,
        lifeExpectancy: 92
      }
    }
  },
  {
    id: 'retirement_preparer',
    badge: '은퇴 예정자',
    title: '사례 C: 55세 직장인 박진우',
    subtitle: '퇴직 5년 전, 자산 소진 방지와 현금흐름 창출이 절실한 은퇴준비',
    description: '월 500만 원 소득의 55세 가장으로 60세 정년퇴직을 앞두고 있습니다. 금융자산 2억 원, 연금자산 1억 원을 보유 중이며 은퇴 후 생활비 부족과 자산 고갈 위험에 직면해 있습니다.',
    profile: {
      age: 55,
      householdType: 'couple_with_kids',
      dependentsCount: 1, // 대학생 자녀 1명
      employmentStatus: 'employed',
      expectedRetirementAge: 60,
      interests: ['은퇴 후 안정적 월 현금흐름', '국민/개인연금 수령 최적화', '노후 의료비 및 자산 소진 방지'],
      income: {
        monthlySalary: 5000000,
        monthlyBusiness: 0,
        monthlyPension: 0, // 현재는 미수령, 63세부터 국민연금 수령 예정
        monthlyOther: 0
      },
      expenses: {
        housing: 400000,       // 아파트 관리비
        living: 1400000,       // 부부 및 자녀 식비/생활비
        transportCommunication: 400000, // 차량 1대 및 통신
        education: 500000,     // 자녀 막학기 등록금/용돈 지원
        insurance: 300000,     // 노후 보장성 보험료
        otherConsumption: 200000 // 경조사 및 여가
      }, // 소비지출 합계: 3,200,000원
      savingsAndInvestment: {
        monthlySavings: 500000,       // 안전 예적금
        monthlyInvestment: 500000,    // 배당성향 ETF
        monthlyPensionSavings: 700000 // IRP 및 연금저축 추가 납입 (세액공제 최대화)
      }, // 저축투자 합계: 1,700,000원
      assets: {
        cashAndChecking: 20000000,
        savingsDeposits: 80000000,
        stocksFunds: 100000000, // 금융자산 총 2억
        pensionAssets: 100000000, // 별도 퇴직연금/개인연금 1억
        realEstate: 450000000,   // 자가 아파트 (실거주)
        otherAssets: 0
      },
      debts: [
        {
          id: 'loan-mortgage',
          name: '주택담보대출 (잔여 3년)',
          category: 'mortgage',
          balance: 10000000,
          annualInterestRate: 3.5,
          remainingMonths: 36,
          repaymentType: 'equal_principal_interest',
          currentMonthlyPayment: 293000
        }
      ],
      goals: [
        {
          id: 'goal-retire-cashflow',
          category: 'retirement',
          name: '은퇴 직후(60~90세) 월 280만 원 생활비 수령 체계',
          targetAmount: 400000000,
          targetYears: 5,
          currentAmount: 200000000, // 연금 및 금융자산 일부
          priority: 'high',
          isFlexible: false,
          notes: '60세 퇴직 후 국민연금 개시(63세) 전 3년간 소득공백기(소득크레바스) 대응'
        },
        {
          id: 'goal-emergency-medical',
          category: 'emergency_fund',
          name: '노후 의료비 및 장기요양 비상펀드',
          targetAmount: 50000000,
          targetYears: 5,
          currentAmount: 30000000,
          priority: 'high',
          isFlexible: false,
          notes: '중대질환 및 간병비 대비 별도 유동성 계좌 확보'
        },
        {
          id: 'goal-child-wedding',
          category: 'wedding',
          name: '자녀 결혼 독립자금 일부 지원',
          targetAmount: 50000000,
          targetYears: 3,
          currentAmount: 20000000,
          priority: 'medium',
          isFlexible: true,
          notes: '본인 노후준비에 지장이 없는 범위 내에서만 지원'
        }
      ],
      assumptions: {
        expectedReturnRate: 4.5,
        inflationRate: 2.2,
        incomeGrowthRate: 0.0,
        savingsGrowthRate: 0.0,
        retirementMonthlyExpenses: 2800000,
        lifeExpectancy: 90
      }
    }
  }
];
