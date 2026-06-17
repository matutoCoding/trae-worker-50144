import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import type { Order } from '@/types';
import { formatMoney } from '@/utils';
import styles from './index.module.scss';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/order-detail/index?id=${order.id}`,
      });
    }
  };

  const progressPercent = (order.currentStep / order.totalSteps) * 100;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <View className={classNames(styles.status, styles[order.status])}>
          {order.statusName}
        </View>
      </View>

      <Text className={styles.productName}>{order.productName}</Text>
      <Text className={styles.customer}>
        {order.customerName} · {order.patternName} · {order.silverWeight}g
      </Text>

      <View className={styles.progress}>
        <View className={styles.progressBar}>
          <View
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </View>
        <Text className={styles.progressText}>
          进度: {order.currentStep}/{order.totalSteps} 工序
        </Text>
      </View>

      <View className={styles.footer}>
        <View className={styles.type}>{order.typeName}</View>
        <View className={styles.price}>
          <Text className={styles.label}>总价</Text>
          ¥{formatMoney(order.price)}
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
