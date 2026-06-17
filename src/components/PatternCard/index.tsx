import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import type { Pattern } from '@/types';
import { getDifficultyText } from '@/utils';
import styles from './index.module.scss';

interface PatternCardProps {
  pattern: Pattern;
  onClick?: () => void;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/pattern-detail/index?id=${pattern.id}`,
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={pattern.image}
          mode="aspectFill"
          lazyLoad
        />
        {pattern.traditional && (
          <View className={styles.traditionalBadge}>传统纹样</View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{pattern.name}</Text>
        <Text className={styles.meaning}>{pattern.meaning}</Text>
        <View className={styles.footer}>
          <View
            className={classNames(styles.difficulty, styles[pattern.difficulty])}
          >
            {getDifficultyText(pattern.difficulty)}
          </View>
          <Text className={styles.category}>{pattern.category}</Text>
        </View>
      </View>
    </View>
  );
};

export default PatternCard;
