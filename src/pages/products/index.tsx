import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { productCategories } from '@/data/silver';
import { formatCurrency, formatWeight } from '@/utils';
import type { Product } from '@/types';
import styles from './index.module.scss';

const ProductsPage: React.FC = () => {
  const [category, setCategory] = useState('all');

  const { products } = useWorkshopStore();

  const filteredProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const handleCardClick = (product: Product) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${product.id}`,
    });
  };

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/product-form/index' });
  };

  const renderCard = (product: Product) => (
    <View
      key={product.id}
      className={styles.card}
      onClick={() => handleCardClick(product)}
    >
      <View
        className={styles.cardImage}
        style={{ backgroundImage: `url(${product.image})` }}
      />
      <View className={styles.cardBody}>
        <Text className={styles.cardName}>{product.name}</Text>
        <Text className={styles.cardSpec}>
          {formatWeight(product.weight)} · {product.purity}
        </Text>
        <View className={styles.cardFooter}>
          <Text className={styles.price}>{formatCurrency(product.price)}</Text>
          <Text className={styles.stock}>库存 {product.stock}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.filterBar}>
        {productCategories.map((cat) => (
          <View
            key={cat.id}
            className={classNames(styles.filterBtn, {
              [styles.activeFilter]: category === cat.id,
            })}
            onClick={() => setCategory(cat.id)}
          >
            {cat.name}
          </View>
        ))}
      </View>

      <View className={styles.grid}>
        {filteredProducts.map(renderCard)}
        {filteredProducts.length === 0 && (
          <View className={styles.emptyState}>
            <View className={styles.emptyIcon}>💍</View>
            <Text>暂无成品</Text>
            <Text style={{ marginTop: 8, display: 'block', fontSize: 24 }}>
              点击下方按钮添加
            </Text>
          </View>
        )}
      </View>

      <View className={styles.actionBtn} onClick={handleAdd}>
        <Text className={styles.btnIcon}>+</Text>
        <Text>新增成品</Text>
      </View>
    </ScrollView>
  );
};

export default ProductsPage;
