import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import ProductCard from '@/components/ProductCard';
import CustomerCard from '@/components/CustomerCard';
import { products } from '@/data/products';
import { customers } from '@/data/customers';
import { ledgerRecords, ledgerCategories, workshopStats } from '@/data/ledger';
import { formatMoney, formatDate } from '@/utils';
import styles from './index.module.scss';

type TabType = 'product' | 'customer' | 'ledger';

const LedgerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ledger');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'income' | 'expense'>('all');

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
  }, []);

  const filteredRecords = useMemo(() => {
    if (ledgerFilter === 'all') return ledgerRecords;
    return ledgerRecords.filter((r) => r.type === ledgerFilter);
  }, [ledgerFilter]);

  const getCategoryName = (type: string, category: string) => {
    const cats = type === 'income' ? ledgerCategories.income : ledgerCategories.expense;
    const found = cats.find((c) => c.id === category);
    return found ? found.name : category;
  };

  const handleRefresh = () => {
    console.log('[Ledger] 页面刷新');
    Taro.stopPullDownRefresh();
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onRefresherRefresh={handleRefresh}
      refresherEnabled
    >
      <View className={styles.header}>
        <Text className={styles.title}>经营台账</Text>
        <Text className={styles.subtitle}>成品档案 · 客户管理 · 收支结算</Text>

        <View className={styles.summaryCard}>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>本月收入</Text>
              <View className={classNames(styles.summaryValue, styles.income)}>
                ¥{formatMoney(monthSummary.income)}
              </View>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>本月支出</Text>
              <View className={classNames(styles.summaryValue, styles.expense)}>
                ¥{formatMoney(monthSummary.expense)}
              </View>
            </View>
          </View>
          <View className={styles.summaryRow}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>本月利润</Text>
              <View className={classNames(styles.summaryValue, styles.profit)}>
                ¥{formatMoney(monthSummary.profit)}
              </View>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>今日收入</Text>
              <View className={styles.summaryValue}>
                ¥{formatMoney(workshopStats.todayIncome)}
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
              <Text className={styles.actionBtn}>+ 记一笔</Text>
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
              {filteredRecords.map((record) => (
                <View key={record.id} className={styles.ledgerItem}>
                  <View
                    className={classNames(styles.ledgerIcon, {
                      [styles.incomeIcon]: record.type === 'income',
                      [styles.expenseIcon]: record.type === 'expense',
                    })}
                  >
                    {record.type === 'income' ? '💰' : '💸'}
                  </View>
                  <View className={styles.ledgerInfo}>
                    <Text className={styles.ledgerTitle}>
                      {getCategoryName(record.type, record.category)}
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
                      {record.type === 'income' ? '+' : '-'}¥{formatMoney(record.amount)}
                    </View>
                    <Text className={styles.amountTime}>
                      {formatDate(record.createTime)}
                    </Text>
                  </View>
                </View>
              ))}
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
              <Text className={styles.actionBtn}>+ 新增成品</Text>
            </View>

            <View className={styles.statGrid}>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{workshopStats.productCount}</View>
                <Text className={styles.statLabel}>成品总数</Text>
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
              {products.map((product) => (
                <View key={product.id} className={styles.productItem}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'customer' && (
          <>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <View className={styles.decor} />
                <Text className={styles.titleText}>客户列表</Text>
              </View>
              <Text className={styles.actionBtn}>+ 新增客户</Text>
            </View>

            <View className={styles.statGrid}>
              <View className={styles.statCard}>
                <View className={styles.statNum}>{workshopStats.customerCount}</View>
                <Text className={styles.statLabel}>客户总数</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>
                  {customers.filter((c) => c.level !== 'normal').length}
                </View>
                <Text className={styles.statLabel}>VIP客户</Text>
              </View>
              <View className={styles.statCard}>
                <View className={styles.statNum}>3</View>
                <Text className={styles.statLabel}>本月新增</Text>
              </View>
            </View>

            <View className={styles.customerList}>
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default LedgerPage;
