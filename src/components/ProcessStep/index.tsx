import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import type { ProcessStep } from '@/types';
import styles from './index.module.scss';

interface ProcessStepProps {
  step: ProcessStep;
  index: number;
  status?: 'pending' | 'active' | 'completed';
  showMeta?: boolean;
}

const ProcessStepComponent: React.FC<ProcessStepProps> = ({
  step,
  index,
  status = 'pending',
  showMeta = true,
}) => {
  return (
    <View
      className={classNames(styles.stepItem, {
        [styles.active]: status === 'active',
        [styles.completed]: status === 'completed',
      })}
    >
      <View className={styles.stepDot}>
        <Text className={styles.stepNum}>
          {status === 'completed' ? '✓' : index + 1}
        </Text>
      </View>
      <View className={styles.stepContent}>
        <Text className={styles.stepName}>{step.name}</Text>
        <Text className={styles.stepDesc}>{step.description}</Text>
        {showMeta && (
          <View className={styles.stepMeta}>
            <View className={styles.metaItem}>时长: {step.duration}</View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProcessStepComponent;
