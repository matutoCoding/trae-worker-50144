import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import OrderCard from '@/components/OrderCard';
import { orders, orderStatusList, orderTypeList } from '@/data/orders';
import styles from './index.module.scss';

const OrderPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      let matchStatus = true;
      let matchType = true;

      if (activeStatus !== 'all') {
        if (activeStatus === 'inProgress') {
          matchStatus = !['finished', 'delivered', 'pending'].includes(order.status);
        } else if (activeStatus === 'finished') {
          matchStatus = order.status === 'finished' || order.status === 'delivered';
        } else {
          matchStatus = order.status === activeStatus;
        }
      }

      if (activeType !== 'all') {
        matchType = order.type === activeType;
      }

      return matchStatus && matchType;
    });
  }, [activeStatus, activeType]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending').length;
    const inProgress = orders.filter(
      (o) => !['finished', 'delivered'].includes(o.status) && o.status !== 'pending'
    ).length;
    const finished = orders.filter((o) => o.status === 'finished').length;
    return { pending, inProgress, finished };
  }, []);

  const handleNewOrder = () => {
    console.log('[Order] 新建定制订单');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  };

  const handleExchange = () => {
    console.log('[Order] 以旧换新');
    Taro.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  };

  const handleRefresh = () => {
    console.log('[Order] 页面刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 500);
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onRefresherRefresh={handleRefresh}
      refresherEnabled
    >
      <View className={styles.header}>
        <Text className={styles.title}>订单定制</Text>
        <Text className={styles.subtitle}>管理客户定制订单，跟踪生产进度</Text>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <View className={styles.statValue}>{stats.pending}</View>
            <Text className={styles.statLabel}>待开始</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statValue}>{stats.inProgress}</View>
            <Text className={styles.statLabel}>进行中</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statValue}>{stats.finished}</View>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      <View className={styles.actionGrid}>
        <View className={styles.actionCard} onClick={handleNewOrder}>
          <View className={styles.actionIcon}>✏️</View>
          <Text className={styles.actionTitle}>专属定制</Text>
          <Text className={styles.actionDesc}>新建定制订单</Text>
        </View>
        <View className={styles.actionCard} onClick={handleExchange}>
          <View className={classNames(styles.actionIcon, styles.goldIcon)}>♻️</View>
          <Text className={styles.actionTitle}>以旧换新</Text>
          <Text className={styles.actionDesc}>旧银饰换新</Text>
        </View>
        <View className={styles.actionCard} onClick={handleNewOrder}>
          <View className={styles.actionIcon}>📦</View>
          <Text className={styles.actionTitle}>批发订单</Text>
          <Text className={styles.actionDesc}>批量订货</Text>
        </View>
      </View>

      <ScrollView className={styles.filterTabs} scrollX>
        {orderStatusList.map((item) => (
          <View
            key={item.id}
            className={classNames(styles.tabItem, {
              [styles.activeTab]: item.id === activeStatus,
            })}
            onClick={() => setActiveStatus(item.id)}
          >
            {item.name}
          </View>
        ))}
      </ScrollView>

      <View className={styles.typeFilter}>
        <View
          className={classNames(styles.typeTag, {
            [styles.activeType]: activeType === 'all',
          })}
          onClick={() => setActiveType('all')}
        >
          全部类型
        </View>
        {orderTypeList.map((item) => (
          <View
            key={item.id}
            className={classNames(styles.typeTag, {
              [styles.activeType]: activeType === item.id,
            })}
            onClick={() => setActiveType(item.id)}
          >
            {item.name}
          </View>
        ))}
      </View>

      <View className={styles.orderList}>
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {filteredOrders.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>📋</View>
            <Text className={styles.emptyText}>暂无相关订单</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OrderPage;
