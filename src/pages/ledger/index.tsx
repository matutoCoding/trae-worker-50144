import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import ProductCard from '@/components/ProductCard';
import CustomerCard from '@/components/CustomerCard';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { incomeCategories, expenseCategories } from '@/data/ledger';
import { formatCurrency, formatDate } from '@/utils';
import type { Product, Customer } from '@/types';
import styles from './index.module.scss';

type TabType = 'product' | 'customer' | 'ledger';

const LedgerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ledger');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { products, customers, ledgerRecords } = useWorkshopStore();

  const monthSummary = useMemo(() => {
    const income = ledgerRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = ledgerRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    return {
      income,
      expense,
      profit: income - expense,
    };
  }, [ledgerRecords]);

  const todayIncome = useMemo(() => {
    const today = formatDate(new Date());
    return ledgerRecords
      .filter((r) => r.type === 'income' && r.createTime.startsWith(today))
      .reduce((sum, r) => sum + r.amount, 0);
  }, [ledgerRecords]);

  const filteredRecords = useMemo(() => {
    let list = ledgerRecords;
    if (ledgerFilter !== 'all') {
      list = list.filter((r) => r.type === ledgerFilter);
    }
    return list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }, [ledgerRecords, ledgerFilter]);

  const vipCount = useMemo(
    () => customers.filter((c) => c.level !== 'regular').length,
    [customers]
  );

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    return {
      productCount: products.length,
      productStock: totalStock,
      customerCount: customers.length,
      vipCount,
    };
  }, [products, customers, vipCount]);

  const getCategoryName = (type: string, category: string) => {
    const cats = type === 'income' ? incomeCategories : expenseCategories;
    const found = cats.find((c) => c.id === category);
    return found ? found.name : category;
  };

  const getCategoryIcon = (type: string, category: string) => {
    const cats = type === 'income' ? incomeCategories : expenseCategories;
    const found = cats.find((c) => c.id === category);
    return found ? found.icon : '📝';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const handleAddLedger = () => {
    Taro.navigateTo({ url: '/pages/ledger-form/index' });
  };

  const handleAddProduct = () => {
    Taro.navigateTo({ url: '/pages/product-form/index' });
  };

  const handleAddCustomer = () => {
    Taro.navigateTo({ url: '/pages/customer-form/index' });
  };

  const goToSales = () => {
    Taro.navigateTo({ url: '/pages/sales/index' });
  };

  const goToProducts = () => {
    Taro.navigateTo({ url: '/pages/products/index' });
  };

  const goToCustomers = () => {
    Taro.navigateTo({ url: '/pages/customers/index' });
  };

  const handleProductClick = (product: Product) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${product.id}`,
    });
  };

  const handleCustomerClick = (customer: Customer) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${customer.id}`,
    });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onRefresherRefresh={handleRefresh}
      refresherEnabled
      refresherTriggered={refreshing}
    >
      <View className={styles.header}>
        <Text className={styles.title}>经营台账</Text>
        <Text className={styles.subtitle}>成品档案 · 客户管理 · 收支结算</Text>

        <View className={styles.summaryCard}>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>总收入</Text>
              <View className={classNames(styles.summaryValue, styles.income)}>
                ¥{formatCurrency(monthSummary.income)}
              </View>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>总支出</Text>
              <View className={classNames(styles.summaryValue, styles.expense)}>
                ¥{formatCurrency(monthSummary.expense)}
              </View>
            </View>
          </View>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>净利润</Text>
              <View className={classNames(styles.summaryValue, styles.profit)}>
                ¥{formatCurrency(monthSummary.profit)}
              </View>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>今日收入</Text>
              <View className={styles.summaryValue}>
                ¥{formatCurrency(todayIncome)}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        <View
          className={classNames(styles.tab, {
            [styles.activeTab]: activeTab === 'ledger',
          })}
          onClick={() => setActiveTab('ledger')}
        >
          销售台账
        </View>
        <View
          className={classNames(styles.tab, {
            [styles.activeTab]: activeTab === 'product',
          })}
          onClick={() => setActiveTab('product')}
        >
          成品档案
        </View>
        <View
          className={classNames(styles.tab, {
            [styles.activeTab]: activeTab === 'customer',
          })}
          onClick={() => setActiveTab('customer')}
        >
          客户管理
        </View>
      </View>

      <View className={styles.section}>
        {activeTab === 'ledger' && (
          <>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <View className={styles.decor} />
                <Text className={styles.titleText}>收支明细</Text>
              </View>
              <View className={styles.actionRow}>
                <Text className={styles.seeAllBtn} onClick={goToSales}>全部 →</Text>
                <Text className={styles.actionBtn} onClick={handleAddLedger}>+ 记一笔</Text>
              </View>
            </View>

            <View className={styles.categoryFilter}>
              <View
                className={classNames(styles.filterTag, {
                  [styles.activeFilter]: ledgerFilter === 'all',
                })}
                onClick={() => setLedgerFilter('all')}
              >
                全部
              </View>
              <View
                className={classNames(styles.filterTag, {
                  [styles.activeFilter]: ledgerFilter === 'income',
                })}
                onClick={() => setLedgerFilter('income')}
              >
                收入
              </View>
              <View
                className={classNames(styles.filterTag, {
                  [styles.activeFilter]: ledgerFilter === 'expense',
                })}
                onClick={() => setLedgerFilter('expense')}
              >
                支出
              </View>
            </View>

            <View className={styles.ledgerList}>
              {filteredRecords.slice(0, 10).map((record) => (
                <View key={record.id} className={styles.ledgerItem}>
                  <View
                    className={classNames(styles.ledgerIcon, {
                      [styles.incomeIcon]: record.type === 'income',
                      [styles.expenseIcon]: record.type === 'expense',
                    })}
                  >
                    {getCategoryIcon(record.type, record.category)}
                  </View>
                  <View className={styles.ledgerInfo}>
                    <Text className={styles.ledgerTitle}>
                      {record.categoryName}
                    </Text>
                    <Text className={styles.ledgerDesc}>{record.description}</Text>
                  </View>
                  <View className={styles.ledgerAmount}>
                    <View
                      className={classNames(styles.amountValue, {
                        [styles.income]: record.type === 'income',
                        [styles.expense]: record.type === 'expense',
                      })}
                    >
                      {record.type === 'income' ? '+' : '-'}¥{formatCurrency(record.amount)}
                    </View>
                    <Text className={styles.amountTime}>
                      {record.createTime}
                    </Text>
                  </View>
                </View>
              ))}
              {filteredRecords.length === 0 && (
                <View className={styles.emptyTip}>
                  <Text style={{ fontSize: 24, color: '#999', textAlign: 'center', padding: '48rpx 0' }}>
                    暂无收支记录
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === 'product' && (
          <>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <View className={styles.decor} />
                <Text className={styles.titleText}>成品库存</Text>
              </View>
              <View className={styles.actionRow}>
                <Text className={styles.seeAllBtn} onClick={goToProducts}>全部 →</Text>
                <Text className={styles.actionBtn} onClick={handleAddProduct}>+ 新增成品</Text>
              </View>
            </View>

            <View className={styles.statGrid}>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{stats.productStock}</View>
                <Text className={styles.statLabel}>库存总数</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{products.length}</View>
                <Text className={styles.statLabel}>款式数量</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>2</View>
                <Text className={styles.statLabel}>银匠师傅</Text>
              </View>
            </View>

            <View className={styles.productGrid}>
              {products.slice(0, 4).map((product) => (
                <View
                  key={product.id}
                  className={styles.productItem}
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard product={product} />
                </View>
              ))}
            </View>

            {products.length === 0 && (
              <View className={styles.emptyTip}>
                <Text style={{ fontSize: 24, color: '#999', textAlign: 'center', padding: '48rpx 0' }}>
                  暂无成品
                </Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'customer' && (
          <>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <View className={styles.decor} />
                <Text className={styles.titleText}>客户列表</Text>
              </View>
              <View className={styles.actionRow}>
                <Text className={styles.seeAllBtn} onClick={goToCustomers}>全部 →</Text>
                <Text className={styles.actionBtn} onClick={handleAddCustomer}>+ 新增客户</Text>
              </View>
            </View>

            <View className={styles.statGrid}>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{stats.customerCount}</View>
                <Text className={styles.statLabel}>客户总数</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{vipCount}</View>
                <Text className={styles.statLabel}>VIP客户</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>
                  {customers.filter((c) => c.lastOrderTime).length}
                </View>
                <Text className={styles.statLabel}>已消费</Text>
              </View>
            </View>

            <View className={styles.customerList}>
              {customers.slice(0, 5).map((customer) => (
                <View
                  key={customer.id}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <CustomerCard customer={customer} />
                </View>
              ))}
            </View>

            {customers.length === 0 && (
              <View className={styles.emptyTip}>
                <Text style={{ fontSize: 24, color: '#999', textAlign: 'center', padding: '48rpx 0' }}>
                  暂无客户
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default LedgerPage;
