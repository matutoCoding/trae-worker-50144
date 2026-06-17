import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { processSteps as stepList } from '@/data/silver';
import type { Order } from '@/types';
import styles from './index.module.scss';

const ProcessPage: React.FC = () => {
  const { orders, updateOrderStep } = useWorkshopStore();

  const inProgressOrders = useMemo(
    () => orders.filter((o) => !['finished', 'delivered', 'cancelled'].includes(o.status)),
    [orders]
  );

  const pendingCount = inProgressOrders.length;
  const totalSteps = inProgressOrders.reduce((sum, o) => sum + (o.totalSteps || 6), 0);
  const completedSteps = inProgressOrders.reduce((sum, o) => sum + (o.currentStep || 0), 0);

  const handleStepClick = (order: Order) => {
    if (order.currentStep >= order.totalSteps) return;

    Taro.showModal({
      title: '确认工序完成',
      content: `确认完成「${stepList[order.currentStep]?.name}」工序？`,
      success: (res) => {
        if (res.confirm) {
          updateOrderStep(order.id);
          Taro.showToast({ title: '工序已更新', icon: 'success' });
        }
      },
    });
  };

  const renderProcessStepper = (order: Order) => (
    <View key={order.id} className={styles.orderCard}>
      <View className={styles.orderHeader}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <View className={styles.orderType}>{order.typeName}</View>
      </View>
      <View className={styles.orderInfo}>
        <Text className={styles.productName}>{order.productName}</Text>
        <Text className={styles.customerInfo}>
          {order.customerName} · 银重 {order.silverWeight}g · 成色 {order.silverPurity}
        </Text>
      </View>
      <View className={styles.stepper}>
        {stepList.slice(0, order.totalSteps).map((step, index) => {
          const isCompleted = index < order.currentStep;
          const isCurrent = index === order.currentStep;
          return (
            <View
              key={step.id}
              className={classNames(styles.stepItem, {
                [styles.completed]: isCompleted,
                [styles.current]: isCurrent,
              })}
            >
              <View className={styles.stepDot} />
              <View className={styles.stepLine} />
              <View className={styles.stepContent}>
                <Text className={styles.stepName}>{step.name}</Text>
                <Text className={styles.stepTime}>{step.desc}</Text>
                {isCurrent && (
                  <View className={styles.stepAction}>
                    <View
                      className={styles.stepBtn}
                      onClick={() => handleStepClick(order)}
                    >
                      标记完成
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>锻造工序</Text>
        <Text className={styles.subtitle}>
          传统苗银锻造 · 七十二道工序 · 匠心传承
        </Text>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{pendingCount}</Text>
          <Text className={styles.statLabel}>进行中订单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{completedSteps}</Text>
          <Text className={styles.statLabel}>已完成工序</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{totalSteps}</Text>
          <Text className={styles.statLabel}>总工序数</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <View className={styles.decor} />
        <Text>进行中的订单</Text>
      </View>

      <View className={styles.list}>
        {inProgressOrders.map(renderProcessStepper)}
        {inProgressOrders.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>🔨</View>
            <Text>暂无进行中的订单</Text>
            <Text style={{ marginTop: 8, display: 'block', fontSize: 24 }}>
              新订单将在此处显示工序进度
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProcessPage;
