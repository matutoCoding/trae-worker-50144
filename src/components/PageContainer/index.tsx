import React, { ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showHeader?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  children,
  showHeader = true,
}) => {
  return (
    <View className={styles.container}>
      {showHeader && (
        <View className={styles.header}>
          {title && <Text className={styles.title}>{title}</Text>}
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View className={styles.content}>{children}</View>
    </View>
  );
};

export default PageContainer;
