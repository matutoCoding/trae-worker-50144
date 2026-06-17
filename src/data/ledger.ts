import type { LedgerRecord, WorkshopStats } from '@/types';

export const incomeCategories = [
  { id: 'custom', name: '定制收入', icon: '✏️' },
  { id: 'retail', name: '零售收入', icon: '💰' },
  { id: 'wholesale', name: '批发收入', icon: '📦' },
  { id: 'exchange', name: '以旧换新', icon: '♻️' },
  { id: 'deposit', name: '定金收入', icon: '💵' },
  { id: 'balance', name: '尾款收入', icon: '💎' },
  { id: 'custom', name: '其他收入', icon: '📝' },
];

export const expenseCategories = [
  { id: 'material', name: '银料采购', icon: '🥈' },
  { id: 'tool', name: '工具耗材', icon: '🔧' },
  { id: 'labor', name: '人工成本', icon: '👨‍🔧' },
  { id: 'rent', name: '房租水电', icon: '🏠' },
  { id: 'packaging', name: '包装运输', icon: '📦' },
  { id: 'marketing', name: '营销推广', icon: '📢' },
  { id: 'other', name: '其他支出', icon: '📝' },
];

const getCategoryName = (type: string, category: string) => {
  const list = type === 'income' ? incomeCategories : expenseCategories;
  return list.find((c) => c.id === category)?.name || category;
};

export const ledgerRecords: LedgerRecord[] = [
  {
    id: 'l001',
    type: 'income',
    typeName: '收入',
    category: 'custom',
    categoryName: '定制收入',
    amount: 2880,
    paymentMethod: 'wechat',
    relatedOrderId: 'o001',
    relatedOrderNo: 'MY20240618001',
    description: '蝴蝶牡丹银手镯定制',
    createTime: '2024-06-10 09:30:00',
    operator: '龙师傅',
  },
  {
    id: 'l002',
    type: 'income',
    typeName: '收入',
    category: 'deposit',
    categoryName: '定金收入',
    amount: 3000,
    paymentMethod: 'alipay',
    relatedOrderId: 'o002',
    relatedOrderNo: 'MY20240618002',
    description: '龙凤呈祥银项圈定金',
    createTime: '2024-06-15 14:20:00',
    operator: '龙师傅',
  },
  {
    id: 'l003',
    type: 'expense',
    typeName: '支出',
    category: 'material',
    categoryName: '银料采购',
    amount: 3250,
    paymentMethod: 'bank',
    description: '采购999足银锭500g',
    createTime: '2024-06-01 10:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l004',
    type: 'income',
    typeName: '收入',
    category: 'wholesale',
    categoryName: '批发收入',
    amount: 3600,
    paymentMethod: 'bank',
    relatedOrderId: 'o004',
    relatedOrderNo: 'MY20240618004',
    description: '十二瓣花耳环批发10对',
    createTime: '2024-06-05 08:00:00',
    operator: '吴师傅',
  },
  {
    id: 'l005',
    type: 'expense',
    typeName: '支出',
    category: 'material',
    categoryName: '银料采购',
    amount: 1160,
    paymentMethod: 'wechat',
    description: '采购925银丝200g',
    createTime: '2024-06-10 15:30:00',
    operator: '吴师傅',
  },
  {
    id: 'l006',
    type: 'income',
    typeName: '收入',
    category: 'retail',
    categoryName: '零售收入',
    amount: 780,
    paymentMethod: 'cash',
    description: '石榴花银吊坠零售',
    createTime: '2024-06-08 16:45:00',
    operator: '吴师傅',
  },
  {
    id: 'l007',
    type: 'expense',
    typeName: '支出',
    category: 'tool',
    categoryName: '工具耗材',
    amount: 280,
    paymentMethod: 'cash',
    description: '购买錾刀套装',
    createTime: '2024-06-03 09:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l008',
    type: 'income',
    typeName: '收入',
    category: 'exchange',
    categoryName: '以旧换新',
    amount: 430,
    paymentMethod: 'wechat',
    relatedOrderId: 'o003',
    relatedOrderNo: 'MY20240618003',
    description: '福字银戒指以旧换新',
    createTime: '2024-06-12 10:15:00',
    operator: '吴师傅',
  },
  {
    id: 'l009',
    type: 'expense',
    typeName: '支出',
    category: 'rent',
    categoryName: '房租水电',
    amount: 3000,
    paymentMethod: 'bank',
    description: '6月份房租',
    createTime: '2024-06-01 08:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l010',
    type: 'income',
    typeName: '收入',
    category: 'retail',
    categoryName: '零售收入',
    amount: 2580,
    paymentMethod: 'alipay',
    description: '蝴蝶牡丹银手镯零售',
    createTime: '2024-06-16 11:30:00',
    operator: '吴师傅',
  },
  {
    id: 'l011',
    type: 'expense',
    typeName: '支出',
    category: 'labor',
    categoryName: '人工成本',
    amount: 8000,
    paymentMethod: 'bank',
    description: '5月份人工工资',
    createTime: '2024-06-05 17:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l012',
    type: 'income',
    typeName: '收入',
    category: 'deposit',
    categoryName: '定金收入',
    amount: 1500,
    paymentMethod: 'wechat',
    relatedOrderId: 'o005',
    relatedOrderNo: 'MY20240618005',
    description: '百鸟朝凤银发簪定金',
    createTime: '2024-06-14 16:45:00',
    operator: '龙师傅',
  },
];

export const workshopStats: WorkshopStats = {
  pendingOrders: 3,
  inProgressOrders: 5,
  finishedOrders: 12,
  totalSilverWeight: 2900,
  todayIncome: 2580,
  monthIncome: 18850,
  productCount: 53,
  customerCount: 28,
};

export const getMonthSummary = () => {
  const income = ledgerRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const expense = ledgerRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  return {
    income,
    expense,
    profit: income - expense,
  };
};
