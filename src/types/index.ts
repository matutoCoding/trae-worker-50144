export interface Pattern {
  id: string;
  name: string;
  category: string;
  meaning: string;
  description: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  traditional: boolean;
  createTime: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  type: 'custom' | 'wholesale' | 'exchange';
  typeName: string;
  patternId: string;
  patternName: string;
  productName: string;
  silverWeight: number;
  silverPurity: string;
  price: number;
  deposit: number;
  status: 'pending' | 'melting' | 'drawing' | 'engraving' | 'welding' | 'polishing' | 'finished' | 'delivered' | 'cancelled';
  statusName: string;
  currentStep: number;
  totalSteps: number;
  createTime: string;
  expectedTime: string;
  remark: string;
}

export interface SilverMaterial {
  id: string;
  name: string;
  purity: string;
  weight: number;
  unit: string;
  type: 'ingot' | 'wire' | 'sheet' | 'scrap';
  typeName: string;
  supplier: string;
  inPrice: number;
  inTime: string;
  remark: string;
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  duration: string;
  tools: string[];
  tips: string;
}

export interface Product {
  id: string;
  name: string;
  patternId: string;
  patternName: string;
  category: string;
  weight: number;
  purity: string;
  size: string;
  price: number;
  cost: number;
  stock: number;
  image: string;
  description: string;
  createTime: string;
  craftsman: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  level: 'regular' | 'vip' | 'svip';
  levelName: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderTime: string;
  address?: string;
  note?: string;
  tags?: string[];
  createTime: string;
  avatar: string;
}

export type CustomerLevel = Customer['level'];

export type LedgerCategory = string;

export interface LedgerRecord {
  id: string;
  type: 'income' | 'expense';
  typeName: string;
  category: LedgerCategory;
  categoryName: string;
  amount: number;
  paymentMethod: string;
  relatedOrderId?: string;
  relatedOrderNo?: string;
  description: string;
  createTime: string;
  operator: string;
}

export interface WorkshopStats {
  pendingOrders: number;
  inProgressOrders: number;
  finishedOrders: number;
  totalSilverWeight: number;
  todayIncome: number;
  monthIncome: number;
  productCount: number;
  customerCount: number;
}

export interface SilverRecord {
  id?: string;
  type: 'in' | 'out';
  name: string;
  weight: number;
  purity?: string;
  supplier?: string;
  orderId?: string;
  orderNo?: string;
  time: string;
}

export type OrderStatus = Order['status'];
export type OrderType = Order['type'];
export type SilverType = SilverMaterial['type'];
