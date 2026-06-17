import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
  accent?: 'default' | 'ethnic' | 'gold';
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, unit, accent = 'default', icon }) => {
  return (
    <View
      className={classNames(styles.statCard, {
        [styles.ethnicAccent]: accent === 'ethnic',
        [styles.goldAccent]: accent === 'gold',
      })}
    >
      <View className={styles.value}>
        {value}
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
      <Text className={styles.label}>{label}</Text>
      {icon && <View className={styles.icon}>{icon}</View>}
    </View>
  );
};

export default StatCard;
