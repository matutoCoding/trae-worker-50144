import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import OrderCard from '@/components/OrderCard';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { orderStatusList, orderTypeList } from '@/data/orders';
import styles from './index.module.scss';

const OrderPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { orders } = useWorkshopStore();

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
    }).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  }, [orders, activeStatus, activeType]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending').length;
    const inProgress = orders.filter(
      (o) => !['finished', 'delivered'].includes(o.status) && o.status !== 'pending'
    ).length;
    const finished = orders.filter((o) => o.status === 'finished' || o.status === 'delivered').length;
    return { pending, inProgress, finished };
  }, [orders]);

  const handleNewOrder = (type: 'custom' | 'exchange' | 'wholesale') => {
    Taro.navigateTo({
      url: `/pages/order-form/index?type=${type}`,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const handleCardClick = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${orderId}`,
    });
  };

  const goToProcess = () => {
    Taro.navigateTo({ url: '/pages/process/index' });
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
        <View className={styles.actionCard} onClick={() => handleNewOrder('custom')}>
          <View className={styles.actionIcon}>✏️</View>
          <Text className={styles.actionTitle}>专属定制</Text>
          <Text className={styles.actionDesc}>新建定制订单</Text>
        </View>
        <View className={styles.actionCard} onClick={() => handleNewOrder('exchange')}>
          <View className={classNames(styles.actionIcon, styles.goldIcon)}>♻️</View>
          <Text className={styles.actionTitle}>以旧换新</Text>
          <Text className={styles.actionDesc}>旧银饰换新</Text>
        </View>
        <View className={styles.actionCard} onClick={() => handleNewOrder('wholesale')}>
          <View className={styles.actionIcon}>📦</View>
          <Text className={styles.actionTitle}>批发订单</Text>
          <Text className={styles.actionDesc}>批量订货</Text>
        </View>
      </View>

      <View className={styles.quickNav}>
        <View className={styles.quickNavItem} onClick={goToProcess}>
          <View className={styles.quickNavIcon}>🔨</View>
          <View className={styles.quickNavText}>
            <Text className={styles.quickNavTitle}>锻造工序</Text>
            <Text className={styles.quickNavDesc}>查看生产进度 →</Text>
          </View>
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
          <View key={order.id} onClick={() => handleCardClick(order.id)}>
            <OrderCard order={order} />
          </View>
        ))}
        {filteredOrders.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>📋</View>
            <Text className={styles.emptyText}>暂无相关订单</Text>
            <Text style={{ marginTop: 16, fontSize: 24, color: '#999' }}>
              点击上方卡片创建新订单
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OrderPage;
