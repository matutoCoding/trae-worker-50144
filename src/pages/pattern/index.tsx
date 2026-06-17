import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import PatternCard from '@/components/PatternCard';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import { patterns, patternCategories } from '@/data/patterns';
import { products } from '@/data/products';
import styles from './index.module.scss';

const PatternPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      const matchCategory =
        activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        !searchText ||
        p.name.includes(searchText) ||
        p.meaning.includes(searchText);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchText]);

  const featuredProducts = products.slice(0, 4);

  const featuredPatterns = patterns.filter((p) => p.traditional).slice(0, 4);

  const handleRefresh = () => {
    console.log('[Pattern] 页面刷新');
    Taro.stopPullDownRefresh();
  };

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/pattern-detail/index?id=${id}`,
    });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToLower={() => console.log('[Pattern] 滚动到底部')}
      onRefresherRefresh={handleRefresh}
      refresherEnabled
    >
      <View className={styles.header}>
        <Text className={styles.title}>苗银款式库</Text>
        <Text className={styles.subtitle}>传承千年苗银工艺，匠心独运</Text>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索纹样名称或寓意"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <ScrollView className={styles.categoryTabs} scrollX>
        {patternCategories.map((cat) => (
          <View
            key={cat.id}
            className={classNames(styles.tabItem, {
              [styles.activeTab]: cat.id === activeCategory,
            })}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </View>
        ))}
      </ScrollView>

      <View className={styles.section}>
        <SectionTitle title="传统纹样寓意" actionText="更多寓意 →" />
        <View className={styles.meaningCard}>
          <Text className={styles.meaningTitle}>蝴蝶妈妈的传说</Text>
          <Text className={styles.meaningContent}>
            苗族神话中，蝴蝶妈妈是人类和万物的始祖。蝴蝶纹因此成为苗族银饰中最神圣、最常见的纹样，象征着生命的起源与繁衍，寓意子孙满堂、生命不息。每一只錾刻的蝴蝶，都是对美好生活的祈愿。
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <SectionTitle title="热门款式" actionText="查看全部 →" />
        <View className={styles.patternGrid}>
          {filteredPatterns.slice(0, 4).map((pattern) => (
            <View key={pattern.id} className={styles.patternItem}>
              <PatternCard pattern={pattern} onClick={() => goToDetail(pattern.id)} />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.featuredSection}>
        <SectionTitle title="经典纹样" />
        <View className={styles.featuredGrid}>
          {featuredPatterns.map((p) => (
            <View
              key={p.id}
              className={classNames(styles.tag, styles.ethnicTag)}
              onClick={() => goToDetail(p.id)}
            >
              {p.name}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <SectionTitle title="成品展示" actionText="更多成品 →" />
        <ScrollView className={styles.productScroll} scrollX>
          {featuredProducts.map((product) => (
            <View key={product.id} className={styles.productItem}>
              <ProductCard product={product} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <SectionTitle title="全部纹样" />
        <View className={styles.patternGrid}>
          {filteredPatterns.map((pattern) => (
            <View key={pattern.id} className={styles.patternItem}>
              <PatternCard pattern={pattern} onClick={() => goToDetail(pattern.id)} />
            </View>
          ))}
        </View>
        {filteredPatterns.length === 0 && (
          <View style={{ textAlign: 'center', padding: '48rpx 0', color: '#999' }}>
            暂无相关纹样
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PatternPage;
