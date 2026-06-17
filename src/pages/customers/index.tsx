import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { customerLevels } from '@/data/customers';
import { formatCurrency } from '@/utils';
import type { Customer } from '@/types';
import styles from './index.module.scss';

const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');

  const { customers } = useWorkshopStore();

  const stats = useMemo(() => {
    const total = customers.length;
    const totalAmount = customers.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrder = totalOrders > 0 ? totalAmount / totalOrders : 0;
    return { total, totalAmount, totalOrders, avgOrder };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    let list = customers;
    if (level !== 'all') {
      list = list.filter((c) => c.level === level);
    }
    if (search) {
      const keyword = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          c.phone.includes(keyword) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(keyword)))
      );
    }
    return list.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [customers, search, level]);

  const handleCardClick = (customer: Customer) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${customer.id}`,
    });
  };

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/customer-form/index' });
  };

  const getLevelName = (levelId: string) =>
    customerLevels.find((l) => l.id === levelId)?.name || levelId;

  const renderCard = (customer: Customer) => (
    <View
      key={customer.id}
      className={styles.customerCard}
      onClick={() => handleCardClick(customer)}
    >
      <View className={styles.cardHeader}>
        <View className={styles.customerName}>
          <Text>{customer.name}</Text>
          <View className={styles.levelBadge}>{getLevelName(customer.level)}</View>
        </View>
        <Text className={styles.phone}>{customer.phone}</Text>
      </View>
      <View className={styles.cardBody}>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>{customer.totalOrders}</Text>
          <Text className={styles.infoLabel}>订单数</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>{formatCurrency(customer.totalAmount)}</Text>
          <Text className={styles.infoLabel}>消费额</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>
            {customer.totalOrders > 0
              ? formatCurrency(customer.totalAmount / customer.totalOrders)
              : '—'}
          </Text>
          <Text className={styles.infoLabel}>客单价</Text>
        </View>
      </View>
      <View className={styles.cardFooter}>
        <View className={styles.tags}>
          {customer.tags?.slice(0, 3).map((tag, i) => (
            <Text key={i} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        <Text className={styles.lastOrder}>
          {customer.lastOrderTime ? `最近：${customer.lastOrderTime}` : '暂无消费'}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.total}</Text>
          <Text className={styles.statLabel}>客户数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{stats.totalOrders}</Text>
          <Text className={styles.statLabel}>总订单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>
            {formatCurrency(stats.totalAmount)}
          </Text>
          <Text className={styles.statLabel}>总消费</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>
            {formatCurrency(stats.avgOrder)}
          </Text>
          <Text className={styles.statLabel}>客单价</Text>
        </View>
      </View>

      <View className={styles.searchBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索客户姓名、手机或标签"
          value={search}
          onInput={(e) => setSearch(e.detail.value)}
        />
      </View>

      <View className={styles.filterTabs}>
        <View
          className={classNames(styles.filterBtn, { [styles.activeFilter]: level === 'all' })}
          onClick={() => setLevel('all')}
        >
          全部
        </View>
        {customerLevels.map((lv) => (
          <View
            key={lv.id}
            className={classNames(styles.filterBtn, {
              [styles.activeFilter]: level === lv.id,
            })}
            onClick={() => setLevel(lv.id)}
          >
            {lv.name}
          </View>
        ))}
      </View>

      <View className={styles.list}>
        {filteredCustomers.map(renderCard)}
        {filteredCustomers.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>👥</View>
            <Text>{search ? '未找到匹配客户' : '暂无客户'}</Text>
            {!search && (
              <Text style={{ marginTop: 8, display: 'block', fontSize: 24 }}>
                点击下方按钮添加
              </Text>
            )}
          </View>
        )}
      </View>

      <View className={styles.actionBtn} onClick={handleAdd}>
        <Text className={styles.btnIcon}>+</Text>
        <Text>新增客户</Text>
      </View>
    </ScrollView>
  );
};

export default CustomersPage;
