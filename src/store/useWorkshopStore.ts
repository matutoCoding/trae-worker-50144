import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import type {
  Order,
  SilverMaterial,
  Product,
  Customer,
  LedgerRecord,
  OrderType,
  SilverType,
  CustomerLevel,
  SilverRecord,
} from '@/types';
import { orders as mockOrders } from '@/data/orders';
import { silverMaterials as mockSilver } from '@/data/silver';
import { products as mockProducts } from '@/data/products';
import { customers as mockCustomers } from '@/data/customers';
import { ledgerRecords as mockLedger } from '@/data/ledger';
import { generateId, formatDateTime } from '@/utils';

interface WorkshopState {
  orders: Order[];
  silverMaterials: SilverMaterial[];
  silverRecords: SilverRecord[];
  products: Product[];
  customers: Customer[];
  ledgerRecords: LedgerRecord[];
}

interface WorkshopActions {
  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'status' | 'statusName' | 'currentStep' | 'totalSteps' | 'createTime' | 'typeName'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderStep: (id: string) => void;
  addSilver: (silver: Omit<SilverMaterial, 'id' | 'typeName' | 'inTime'>) => SilverMaterial;
  useSilver: (silverId: string, weight: number, orderId?: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createTime'>) => Product;
  updateProductStock: (id: string, stock: number) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'levelName' | 'totalOrders' | 'totalAmount' | 'lastOrderTime' | 'createTime' | 'avatar'>) => Customer;
  updateCustomerStats: (id: string, amount: number) => void;
  addLedgerRecord: (record: Omit<LedgerRecord, 'id' | 'createTime'>) => LedgerRecord;
  getSilverTotalWeight: () => number;
  getSilverByType: (type: SilverType) => number;
  resetAllData: () => void;
}

const taroStorage = {
  getItem: (name: string) => {
    return Promise.resolve(Taro.getStorageSync(name));
  },
  setItem: (name: string, value: string) => {
    Taro.setStorageSync(name, value);
    return Promise.resolve();
  },
  removeItem: (name: string) => {
    Taro.removeStorageSync(name);
    return Promise.resolve();
  },
};

const statusMap: Record<Order['status'], string> = {
  pending: '待开始',
  melting: '熔银中',
  drawing: '拉丝中',
  engraving: '錾刻中',
  welding: '焊接中',
  polishing: '抛光中',
  finished: '已完成',
  delivered: '已交付',
  cancelled: '已取消',
};

const typeNameMap: Record<OrderType, string> = {
  custom: '专属定制',
  wholesale: '批发订单',
  exchange: '以旧换新',
};

const silverTypeNameMap: Record<SilverType, string> = {
  ingot: '银锭',
  wire: '银丝',
  sheet: '银片',
  scrap: '边角料',
};

const levelNameMap: Record<CustomerLevel, string> = {
  regular: '普通客户',
  vip: 'VIP客户',
  svip: 'SVIP客户',
};

const stepStatusMap: string[] = ['pending', 'melting', 'drawing', 'engraving', 'welding', 'polishing', 'finished'];

const initialState: WorkshopState = {
  orders: mockOrders.map((o) => ({ ...o, typeName: typeNameMap[o.type as OrderType] || o.type })),
  silverMaterials: mockSilver,
  silverRecords: mockSilver.slice(0, 3).map((s, i) => ({
    type: 'in' as const,
    name: s.name,
    weight: s.weight,
    purity: s.purity,
    supplier: s.supplier,
    time: s.inTime,
  })),
  products: mockProducts,
  customers: mockCustomers.map((c) => ({ ...c, levelName: levelNameMap[c.level as CustomerLevel] || c.level })),
  ledgerRecords: mockLedger,
};

export const useWorkshopStore = create<WorkshopState & WorkshopActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: generateId(),
          orderNo: `MY${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          status: 'pending',
          statusName: '待开始',
          currentStep: 0,
          totalSteps: 6,
          createTime: formatDateTime(new Date()),
          typeName: typeNameMap[orderData.type],
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));

        if (orderData.deposit > 0) {
          get().addLedgerRecord({
            type: 'income',
            typeName: '收入',
            category: orderData.type,
            categoryName: `${typeNameMap[orderData.type]}定金`,
            amount: orderData.deposit,
            paymentMethod: 'cash',
            relatedOrderId: newOrder.id,
            relatedOrderNo: newOrder.orderNo,
            description: `${newOrder.productName} - 定金`,
            operator: '系统',
          });
        }

        get().updateCustomerStats(orderData.customerId, orderData.deposit);

        console.log('[Store] 新增订单:', newOrder.orderNo);
        return newOrder;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  statusName: statusMap[status],
                  currentStep: stepStatusMap.indexOf(status),
                }
              : o
          ),
        }));
        console.log('[Store] 更新订单状态:', id, status);
      },

      updateOrderStep: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order || order.currentStep >= order.totalSteps) return;

        const nextStep = order.currentStep + 1;
        const nextStatus = stepStatusMap[nextStep] as Order['status'];

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  currentStep: nextStep,
                  status: nextStatus,
                  statusName: statusMap[nextStatus],
                }
              : o
          ),
        }));

        if (nextStep === order.totalSteps) {
          get().addLedgerRecord({
            type: 'income',
            typeName: '收入',
            category: order.type,
            categoryName: `${typeNameMap[order.type]}尾款`,
            amount: order.price - order.deposit,
            paymentMethod: 'cash',
            relatedOrderId: order.id,
            relatedOrderNo: order.orderNo,
            description: `${order.productName} - 尾款`,
            operator: '系统',
          });
        }

        console.log('[Store] 更新订单工序:', id, nextStep, nextStatus);
      },

      addSilver: (silverData) => {
        const newSilver: SilverMaterial = {
          ...silverData,
          id: generateId(),
          typeName: silverTypeNameMap[silverData.type],
          inTime: formatDateTime(new Date()).slice(0, 10),
        };
        set((state) => ({
          silverMaterials: [newSilver, ...state.silverMaterials],
          silverRecords: [
            {
              type: 'in',
              name: newSilver.name,
              weight: newSilver.weight,
              purity: newSilver.purity,
              supplier: newSilver.supplier,
              time: formatDateTime(new Date()),
            },
            ...state.silverRecords,
          ],
        }));

        get().addLedgerRecord({
          type: 'expense',
          typeName: '支出',
          category: 'material',
          categoryName: '银料采购',
          amount: silverData.weight * silverData.inPrice,
          paymentMethod: 'bank',
          description: `${newSilver.name} 入库 ${silverData.weight}g`,
          operator: '系统',
        });

        console.log('[Store] 新增银料入库:', newSilver.name, newSilver.weight);
        return newSilver;
      },

      useSilver: (silverId, weight, orderId) => {
        const silver = get().silverMaterials.find((s) => s.id === silverId);
        if (!silver) return;

        const order = orderId ? get().orders.find((o) => o.id === orderId) : undefined;

        set((state) => ({
          silverMaterials: state.silverMaterials.map((s) =>
            s.id === silverId ? { ...s, weight: s.weight - weight } : s
          ),
          silverRecords: [
            {
              type: 'out',
              name: silver.name,
              weight,
              purity: silver.purity,
              orderId,
              orderNo: order?.orderNo,
              time: formatDateTime(new Date()),
            },
            ...state.silverRecords,
          ],
        }));

        get().addLedgerRecord({
          type: 'expense',
          typeName: '支出',
          category: 'material',
          categoryName: '银料领用',
          amount: weight * silver.inPrice,
          paymentMethod: 'cash',
          relatedOrderId: orderId,
          relatedOrderNo: order?.orderNo,
          description: `${silver.name} 领用 ${weight}g`,
          operator: '系统',
        });

        console.log('[Store] 银料领用:', silverId, weight, orderId);
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          createTime: formatDateTime(new Date()).slice(0, 10),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        console.log('[Store] 新增成品:', newProduct.name);
        return newProduct;
      },

      updateProductStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock } : p)),
        }));
        console.log('[Store] 更新成品库存:', id, stock);
      },

      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: generateId(),
          levelName: levelNameMap[customerData.level],
          totalOrders: 0,
          totalAmount: 0,
          lastOrderTime: '-',
          createTime: formatDateTime(new Date()).slice(0, 10),
          avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
        };
        set((state) => ({ customers: [newCustomer, ...state.customers] }));
        console.log('[Store] 新增客户:', newCustomer.name);
        return newCustomer;
      },

      updateCustomerStats: (id, amount) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id
              ? {
                  ...c,
                  totalOrders: c.totalOrders + 1,
                  totalAmount: c.totalAmount + amount,
                  lastOrderTime: formatDateTime(new Date()),
                }
              : c
          ),
        }));
      },

      addLedgerRecord: (recordData) => {
        const newRecord: LedgerRecord = {
          ...recordData,
          id: generateId(),
          createTime: formatDateTime(new Date()),
        };
        set((state) => ({ ledgerRecords: [newRecord, ...state.ledgerRecords] }));
        console.log('[Store] 新增台账记录:', newRecord.description, newRecord.amount);
        return newRecord;
      },

      getSilverTotalWeight: () => {
        return get().silverMaterials.reduce((sum, s) => sum + s.weight, 0);
      },

      getSilverByType: (type) => {
        return get()
          .silverMaterials.filter((s) => s.type === type)
          .reduce((sum, s) => sum + s.weight, 0);
      },

      resetAllData: () => {
        set(initialState);
        console.log('[Store] 数据已重置为初始状态');
      },
    }),
    {
      name: 'miao-workshop-storage',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        orders: state.orders,
        silverMaterials: state.silverMaterials,
        silverRecords: state.silverRecords,
        products: state.products,
        customers: state.customers,
        ledgerRecords: state.ledgerRecords,
      }),
    }
  )
);
