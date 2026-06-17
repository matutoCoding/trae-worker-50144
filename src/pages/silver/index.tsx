import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { silverTypes, purityList } from '@/data/silver';
import { formatWeight, formatCurrency } from '@/utils';
import type { SilverMaterial } from '@/types';
import styles from './index.module.scss';

const SilverPage: React.FC = () => {
  const [tab, setTab] = useState<'stock' | 'record'>('stock');

  const {
    silverMaterials,
    silverRecords,
    getSilverTotalWeight,
    getSilverByType,
  } = useWorkshopStore();

  const totalStock = useMemo(() => getSilverTotalWeight(), [silverMaterials]);
  const ingotStock = useMemo(() => getSilverByType('ingot'), [silverMaterials]);
  const wireStock = useMemo(() => getSilverByType('wire'), [silverMaterials]);
  const sheetStock = useMemo(() => getSilverByType('sheet'), [silverMaterials]);

  const activeStock = useMemo(
    () => silverMaterials.filter((s) => s.weight > 0),
    [silverMaterials]
  );

  const getTypeName = (type: string) =>
    silverTypes.find((t) => t.id === type)?.name || type;

  const getPurityName = (purity: string) =>
    purityList.find((p) => p.id === purity)?.name || purity;

  const renderStockCard = (silver: SilverMaterial) => (
    <View key={silver.id} className={styles.silverCard}>
      <View className={styles.silverHeader}>
        <Text className={styles.silverName}>{silver.name}</Text>
        <View className={styles.badge}>{getPurityName(silver.purity)}</View>
      </View>
      <View className={styles.silverInfo}>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>{formatWeight(silver.weight)}</Text>
          <Text className={styles.infoLabel}>剩余重量</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>{getTypeName(silver.type)}</Text>
          <Text className={styles.infoLabel}>类型</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoValue}>{formatCurrency(silver.inPrice)}/g</Text>
          <Text className={styles.infoLabel}>单价</Text>
        </View>
      </View>
      <View className={styles.silverFooter}>
        <Text className={styles.supplier}>来源：{silver.supplier}</Text>
        <Text className={styles.inTime}>{silver.inTime}</Text>
      </View>
    </View>
  );

  const renderRecordItem = (record: any, index: number) => (
    <View key={`${record.type}-${index}`} className={styles.recordItem}>
      <View className={styles.recordRow}>
        <Text className={styles.recordType}>
          {record.type === 'in' ? '入库' : '领用'} · {record.name}
        </Text>
        <Text
          className={classNames(styles.recordWeight, {
            [styles.inWeight]: record.type === 'in',
            [styles.outWeight]: record.type === 'out',
          })}
        >
          {record.type === 'in' ? '+' : '-'}
          {formatWeight(record.weight)}
        </Text>
      </View>
      <View className={styles.recordRow}>
        <Text className={styles.recordInfo}>
          {record.type === 'in'
            ? `来源：${record.supplier}`
            : `关联订单：${record.orderNo || '无'}`}
        </Text>
        <Text className={styles.recordTime}>{record.time}</Text>
      </View>
    </View>
  );

  const handleAdd = () => {
    const mode = tab === 'stock' ? 'in' : 'out';
    Taro.navigateTo({ url: `/pages/silver-form/index?mode=${mode}` });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatWeight(totalStock)}</Text>
          <Text className={styles.statLabel}>总库存(g)</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatWeight(ingotStock)}</Text>
          <Text className={styles.statLabel}>银锭</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatWeight(wireStock)}</Text>
          <Text className={styles.statLabel}>银丝</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatWeight(sheetStock)}</Text>
          <Text className={styles.statLabel}>银片</Text>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classNames(styles.tabBtn, { [styles.activeTab]: tab === 'stock' })}
          onClick={() => setTab('stock')}
        >
          库存
        </View>
        <View
          className={classNames(styles.tabBtn, { [styles.activeTab]: tab === 'record' })}
          onClick={() => setTab('record')}
        >
          流水
        </View>
      </View>

      <View className={styles.list}>
        {tab === 'stock' && (
          <>
            {activeStock.map(renderStockCard)}
            {activeStock.length === 0 && (
              <View className={styles.emptyState}>
                <View className={styles.emptyIcon}>📦</View>
                <Text>暂无库存银料</Text>
                <Text style={{ marginTop: 8, display: 'block', fontSize: 24 }}>
                  点击下方按钮入库
                </Text>
              </View>
            )}
          </>
        )}

        {tab === 'record' && (
          <>
            {silverRecords.map(renderRecordItem)}
            {silverRecords.length === 0 && (
              <View className={styles.emptyState}>
                <View className={styles.emptyIcon}>📝</View>
                <Text>暂无出入库记录</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View className={styles.actionBtn} onClick={handleAdd}>
        <Text className={styles.btnIcon}>+</Text>
        <Text>{tab === 'stock' ? '银料入库' : '银料领用'}</Text>
      </View>
    </ScrollView>
  );
};

export default SilverPage;
