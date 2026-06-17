import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import type { Customer } from '@/types';
import { formatMoney, formatDate } from '@/utils';
import styles from './index.module.scss';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/customer-detail/index?id=${customer.id}`,
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={customer.avatar} mode="aspectFill" />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{customer.name}</Text>
            <View className={classNames(styles.level, styles[customer.level])}>
              {customer.levelName}
            </View>
          </View>
          <Text className={styles.phone}>{customer.phone}</Text>
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <View className={styles.statValue}>{customer.totalOrders}</View>
          <Text className={styles.statLabel}>订单数</Text>
        </View>
        <View className={styles.statItem}>
          <View className={styles.statValue}>¥{formatMoney(customer.totalAmount, 0)}</View>
          <Text className={styles.statLabel}>累计消费</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.lastOrder}>
          最近下单: {formatDate(customer.lastOrderTime)}
        </Text>
      </View>
    </View>
  );
};

export default CustomerCard;
