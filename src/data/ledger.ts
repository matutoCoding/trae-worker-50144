import type { LedgerRecord, WorkshopStats } from '@/types';

export const ledgerCategories = {
  income: [
    { id: 'custom', name: '定制收入' },
    { id: 'retail', name: '零售收入' },
    { id: 'trade', name: '批发收入' },
    { id: 'exchange', name: '以旧换新' },
    { id: 'other', name: '其他收入' },
  ],
  expense: [
    { id: 'material', name: '银料采购' },
    { id: 'tool', name: '工具耗材' },
    { id: 'labor', name: '人工成本' },
    { id: 'rent', name: '房租水电' },
    { id: 'other', name: '其他支出' },
  ],
};

export const ledgerRecords: LedgerRecord[] = [
  {
    id: 'l001',
    type: 'income',
    typeName: '收入',
    category: 'custom',
    amount: 2880,
    orderId: 'o001',
    description: '蝴蝶牡丹银手镯定制',
    createTime: '2024-06-10 09:30:00',
    operator: '龙师傅',
  },
  {
    id: 'l002',
    type: 'income',
    typeName: '收入',
    category: 'custom',
    amount: 3000,
    orderId: 'o002',
    description: '龙凤呈祥银项圈定金',
    createTime: '2024-06-15 14:20:00',
    operator: '龙师傅',
  },
  {
    id: 'l003',
    type: 'expense',
    typeName: '支出',
    category: 'material',
    amount: 3250,
    description: '采购999足银锭500g',
    createTime: '2024-06-01 10:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l004',
    type: 'income',
    typeName: '收入',
    category: 'trade',
    amount: 3600,
    orderId: 'o004',
    description: '十二瓣花耳环批发10对',
    createTime: '2024-06-05 08:00:00',
    operator: '吴师傅',
  },
  {
    id: 'l005',
    type: 'expense',
    typeName: '支出',
    category: 'material',
    amount: 1160,
    description: '采购925银丝200g',
    createTime: '2024-06-10 15:30:00',
    operator: '吴师傅',
  },
  {
    id: 'l006',
    type: 'income',
    typeName: '收入',
    category: 'retail',
    amount: 780,
    description: '石榴花银吊坠零售',
    createTime: '2024-06-08 16:45:00',
    operator: '吴师傅',
  },
  {
    id: 'l007',
    type: 'expense',
    typeName: '支出',
    category: 'tool',
    amount: 280,
    description: '购买錾刀套装',
    createTime: '2024-06-03 09:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l008',
    type: 'income',
    typeName: '收入',
    category: 'exchange',
    amount: 430,
    orderId: 'o003',
    description: '福字银戒指以旧换新',
    createTime: '2024-06-12 10:15:00',
    operator: '吴师傅',
  },
  {
    id: 'l009',
    type: 'expense',
    typeName: '支出',
    category: 'rent',
    amount: 3000,
    description: '6月份房租',
    createTime: '2024-06-01 08:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l010',
    type: 'income',
    typeName: '收入',
    category: 'retail',
    amount: 2580,
    description: '蝴蝶牡丹银手镯零售',
    createTime: '2024-06-16 11:30:00',
    operator: '吴师傅',
  },
  {
    id: 'l011',
    type: 'expense',
    typeName: '支出',
    category: 'labor',
    amount: 8000,
    description: '5月份人工工资',
    createTime: '2024-06-05 17:00:00',
    operator: '龙师傅',
  },
  {
    id: 'l012',
    type: 'income',
    typeName: '收入',
    category: 'custom',
    amount: 1500,
    orderId: 'o005',
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
