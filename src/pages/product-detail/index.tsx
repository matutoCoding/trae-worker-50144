import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getProductById } from '@/data/products';
import type { Product } from '@/types';
import { formatMoney, formatWeight, formatDate } from '@/utils';
import styles from './index.module.scss';

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const id = currentPage?.options?.id;
    if (id) {
      const found = getProductById(id);
      if (found) {
        setProduct(found);
      }
    }
  }, []);

  return (
    <ScrollView className={styles.page} scrollY>
      {product ? (
        <View>
          <Image
            style={{ width: '100%', height: 500, background: '#f5f5f5' }}
            src={product.image}
            mode="aspectFill"
          />
          <View style={{ padding: 24, background: '#fff' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 34, fontWeight: 600, flex: 1 }}>
                {product.name}
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#8B0000',
                }}
              >
                ¥{formatMoney(product.price)}
              </Text>
            </View>
            <Text style={{ fontSize: 26, color: '#999', marginTop: 8, display: 'block' }}>
              {product.purity}足银 · {product.patternName}
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              规格参数
            </Text>
            <View style={{ display: 'flex', flexWrap: 'wrap' }}>
              <View style={{ width: '50%', marginBottom: 16 }}>
                <Text style={{ fontSize: 24, color: '#999' }}>重量</Text>
                <Text style={{ fontSize: 26, color: '#333', display: 'block', marginTop: 4 }}>
                  {formatWeight(product.weight)}
                </Text>
              </View>
              <View style={{ width: '50%', marginBottom: 16 }}>
                <Text style={{ fontSize: 24, color: '#999' }}>尺寸</Text>
                <Text style={{ fontSize: 26, color: '#333', display: 'block', marginTop: 4 }}>
                  {product.size}
                </Text>
              </View>
              <View style={{ width: '50%', marginBottom: 16 }}>
                <Text style={{ fontSize: 24, color: '#999' }}>库存</Text>
                <Text style={{ fontSize: 26, color: '#333', display: 'block', marginTop: 4 }}>
                  {product.stock} 件
                </Text>
              </View>
              <View style={{ width: '50%', marginBottom: 16 }}>
                <Text style={{ fontSize: 24, color: '#999' }}>成本</Text>
                <Text style={{ fontSize: 26, color: '#333', display: 'block', marginTop: 4 }}>
                  ¥{formatMoney(product.cost)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>
              工匠
            </Text>
            <Text style={{ fontSize: 26, color: '#666' }}>
              {product.craftsman}
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>
              产品介绍
            </Text>
            <Text style={{ fontSize: 26, color: '#666', lineHeight: 1.6 }}>
              {product.description}
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 24, color: '#999' }}>
              入库时间：{formatDate(product.createTime)}
            </Text>
          </View>
        </View>
      ) : (
        <View className={styles.container}>
          <Text className={styles.icon}>💍</Text>
          <Text className={styles.title}>成品详情</Text>
          <Text className={styles.desc}>功能正在开发中...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProductDetailPage;
