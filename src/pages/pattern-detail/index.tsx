import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getPatternById } from '@/data/patterns';
import type { Pattern } from '@/types';
import { getDifficultyText, getDifficultyColor } from '@/utils';
import styles from './index.module.scss';

const PatternDetailPage: React.FC = () => {
  const [pattern, setPattern] = useState<Pattern | null>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const id = currentPage?.options?.id;
    if (id) {
      const found = getPatternById(id);
      if (found) {
        setPattern(found);
      }
    }
  }, []);

  return (
    <ScrollView className={styles.page} scrollY>
      {pattern ? (
        <View>
          <Image
            style={{ width: '100%', height: 400, background: '#f5f5f5' }}
            src={pattern.image}
            mode="aspectFill"
          />
          <View style={{ padding: 32, background: '#fff' }}>
            <Text style={{ fontSize: 34, fontWeight: 600 }}>{pattern.name}</Text>
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 22,
                  padding: '4rpx 16rpx',
                  borderRadius: 8,
                  background: pattern.traditional ? 'rgba(139,0,0,0.08)' : '#f5f5f5',
                  color: pattern.traditional ? '#8B0000' : '#666',
                  marginRight: 16,
                }}
              >
                {pattern.traditional ? '传统纹样' : '现代纹样'}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  padding: '4rpx 16rpx',
                  borderRadius: 8,
                  background: 'rgba(245,124,0,0.08)',
                  color: getDifficultyColor(pattern.difficulty),
                }}
              >
                难度：{getDifficultyText(pattern.difficulty)}
              </Text>
            </View>
          </View>
          <View style={{ padding: 24, marginTop: 16, background: '#fff' }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>寓意</Text>
            <Text style={{ fontSize: 28, color: '#666', lineHeight: 1.6 }}>
              {pattern.meaning}
            </Text>
          </View>
          <View style={{ padding: 24, marginTop: 16, background: '#fff' }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>纹样介绍</Text>
            <Text style={{ fontSize: 28, color: '#666', lineHeight: 1.6 }}>
              {pattern.description}
            </Text>
          </View>
        </View>
      ) : (
        <View className={styles.container}>
          <Text className={styles.icon}>🔍</Text>
          <Text className={styles.title}>纹样详情</Text>
          <Text className={styles.desc}>功能正在开发中...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PatternDetailPage;
