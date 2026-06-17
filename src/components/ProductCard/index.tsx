import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Product } from '@/types';
import { formatMoney, formatWeight } from '@/utils';
import styles from './index.module.scss';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/product-detail/index?id=${product.id}`,
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={product.image}
          mode="aspectFill"
          lazyLoad
        />
        <View className={styles.stockBadge}>库存 {product.stock}</View>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{product.name}</Text>
        <Text className={styles.specs}>
          {product.purity}足银 · {product.patternName}
        </Text>
        <View className={styles.footer}>
          <Text className={styles.price}>¥{formatMoney(product.price)}</Text>
          <Text className={styles.weight}>{formatWeight(product.weight)}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
