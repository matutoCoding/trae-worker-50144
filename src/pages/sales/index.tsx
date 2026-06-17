import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { incomeCategories, expenseCategories } from '@/data/ledger';
import { formatCurrency } from '@/utils';
import type { LedgerRecord } from '@/types';
import styles from './index.module.scss';

const SalesPage: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'income' | 'expense'>('all');
  const [showCategory, setShowCategory] = useState(false);

  const { ledgerRecords } = useWorkshopStore();

  const stats = useMemo(() => {
    const income = ledgerRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = ledgerRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    const profit = income - expense;
    const count = ledgerRecords.length;
    return { income, expense, profit, count };
  }, [ledgerRecords]);

  const categoryStats = useMemo(() => {
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};

    ledgerRecords.forEach((r) => {
      if (r.type === 'income') {
        incomeByCategory[r.category] = (incomeByCategory[r.category] || 0) + r.amount;
      } else {
        expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + r.amount;
      }
    });

    return { incomeByCategory, expenseByCategory };
  }, [ledgerRecords]);

  const filteredRecords = useMemo(() => {
    let list = ledgerRecords;
    if (tab === 'income') {
      list = list.filter((r) => r.type === 'income');
    } else if (tab === 'expense') {
      list = list.filter((r) => r.type === 'expense');
    }
    return list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }, [ledgerRecords, tab]);

  const getCategoryIcon = (type: string, category: string) => {
    const list = type === 'income' ? incomeCategories : expenseCategories;
    return list.find((c) => c.id === category)?.icon || '📝';
  };

  const getMethodName = (method: string) => {
    const map: Record<string, string> = {
      cash: '现金',
      wechat: '微信',
      alipay: '支付宝',
      bank: '银行',
    };
    return map[method] || method;
  };

  const renderRecord = (record: LedgerRecord) => (
    <View key={record.id} className={styles.recordCard}>
      <View className={styles.recordHeader}>
        <View className={styles.recordType}>
          <View className={styles.typeIcon}>
            {getCategoryIcon(record.type, record.category)}
          </View>
          <Text>{record.categoryName}</Text>
        </View>
        <Text
          className={classNames(styles.recordAmount, {
            [styles.income]: record.type === 'income',
            [styles.expense]: record.type === 'expense',
          })}
        >
          {record.type === 'income' ? '+' : '-'}
          {formatCurrency(record.amount)}
        </Text>
      </View>
      <View className={styles.recordBody}>
        <Text className={styles.recordDesc}>{record.description}</Text>
        <Text className={styles.recordMethod}>{getMethodName(record.paymentMethod)}</Text>
      </View>
      <View className={styles.recordFooter}>
        <Text className={styles.recordCategory}>
          {record.relatedOrderNo && `订单：${record.relatedOrderNo}`}
        </Text>
        <Text className={styles.recordTime}>{record.createTime}</Text>
      </View>
    </View>
  );

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/ledger-form/index' });
  };

  const renderCategoryRow = (cat: any, amount: number) => (
    <View key={cat.id} className={styles.categoryRow}>
      <View className={styles.categoryInfo}>
        <View className={styles.typeIcon}>{cat.icon}</View>
        <Text className={styles.categoryName}>{cat.name}</Text>
      </View>
      <Text className={styles.categoryAmount}>{formatCurrency(amount)}</Text>
    </View>
  );

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsCard}>
        <View className={styles.mainStat}>
          <Text className={styles.mainLabel}>本期结余</Text>
          <Text className={styles.mainValue}>{formatCurrency(stats.profit)}</Text>
        </View>
        <View className={styles.statGrid}>
          <View className={styles.statItem}>
            <Text className={classNames(styles.statValue, styles.incomeValue)}>
              {formatCurrency(stats.income)}
            </Text>
            <Text className={styles.statLabel}>总收入</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={classNames(styles.statValue, styles.expenseValue)}>
              {formatCurrency(stats.expense)}
            </Text>
            <Text className={styles.statLabel}>总支出</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.count}</Text>
            <Text className={styles.statLabel}>记录数</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classNames(styles.tabBtn, { [styles.activeTab]: tab === 'all' })}
          onClick={() => {
            setTab('all');
            setShowCategory(false);
          }}
        >
          全部
        </View>
        <View
          className={classNames(styles.tabBtn, { [styles.activeTab]: tab === 'income' })}
          onClick={() => {
            setTab('income');
            setShowCategory(true);
          }}
        >
          收入
        </View>
        <View
          className={classNames(styles.tabBtn, { [styles.activeTab]: tab === 'expense' })}
          onClick={() => {
            setTab('expense');
            setShowCategory(true);
          }}
        >
          支出
        </View>
      </View>

      {showCategory && (
        <>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>分类统计</Text>
          </View>
          <View style={{ padding: '0 32rpx' }}>
            <View className={styles.categoryList}>
              {tab === 'income' &&
                incomeCategories
                  .filter((c) => stats.incomeByCategory[c.id])
                  .sort(
                    (a, b) =>
                      (stats.incomeByCategory[b.id] || 0) -
                      (stats.incomeByCategory[a.id] || 0)
                  )
                  .map((c) => renderCategoryRow(c, stats.incomeByCategory[c.id] || 0))}
              {tab === 'expense' &&
                expenseCategories
                  .filter((c) => stats.expenseByCategory[c.id])
                  .sort(
                    (a, b) =>
                      (stats.expenseByCategory[b.id] || 0) -
                      (stats.expenseByCategory[a.id] || 0)
                  )
                  .map((c) => renderCategoryRow(c, stats.expenseByCategory[c.id] || 0))}
            </View>
          </View>
        </>
      )}

      <View className={styles.sectionTitle}>
        <View className={styles.decor} />
        <Text>收支明细</Text>
      </View>

      <View className={styles.list}>
        {filteredRecords.map(renderRecord)}
        {filteredRecords.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>💰</View>
            <Text>暂无记录</Text>
            <Text style={{ marginTop: 8, display: 'block', fontSize: 24 }}>
              点击下方按钮登记
            </Text>
          </View>
        )}
      </View>

      <View className={styles.actionBtn} onClick={handleAdd}>
        <Text className={styles.btnIcon}>+</Text>
        <Text>记一笔</Text>
      </View>
    </ScrollView>
  );
};

export default SalesPage;
