import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import SectionTitle from '@/components/SectionTitle';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { processSteps } from '@/data/orders';
import { silverTypes, processSteps as processDetailSteps } from '@/data/silver';
import { formatWeight } from '@/utils';
import styles from './index.module.scss';

const WorkshopPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'process' | 'silver'>('process');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const { orders, silverMaterials, getSilverTotalWeight, getSilverByType } = useWorkshopStore();

  const inProgressOrders = useMemo(() => {
    return orders.filter(
      (o) => !['finished', 'delivered'].includes(o.status) && o.status !== 'pending'
    );
  }, [orders]);

  const totalSilverWeight = useMemo(() => getSilverTotalWeight(), [silverMaterials]);
  const ingotStock = useMemo(() => getSilverByType('ingot'), [silverMaterials]);
  const wireStock = useMemo(() => getSilverByType('wire'), [silverMaterials]);
  const sheetStock = useMemo(() => getSilverByType('sheet'), [silverMaterials]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pending').length;
  }, [orders]);

  const handleAddSilver = () => {
    Taro.navigateTo({ url: '/pages/silver-form/index?mode=in' });
  };

  const handleUseSilver = () => {
    Taro.navigateTo({ url: '/pages/silver-form/index?mode=out' });
  };

  const goToSilverPage = () => {
    Taro.navigateTo({ url: '/pages/silver/index' });
  };

  const goToProcessPage = () => {
    Taro.navigateTo({ url: '/pages/process/index' });
  };

  const handleProcessClick = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${orderId}`,
    });
  };

  const handleStepClick = (index: number) => {
    setSelectedStepIndex(index);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 500);
  };

  const getStepStatus = (orderCurrentStep: number, stepIndex: number) => {
    if (stepIndex < orderCurrentStep) return 'completed';
    if (stepIndex === orderCurrentStep - 1) return 'active';
    return 'pending';
  };

  const selectedStep = processDetailSteps[selectedStepIndex];

  const activeSilverMaterials = useMemo(
    () => silverMaterials.filter((s) => s.weight > 0),
    [silverMaterials]
  );

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onRefresherRefresh={handleRefresh}
      refresherEnabled
      refresherTriggered={refreshing}
    >
      <View className={styles.header}>
        <Text className={styles.title}>锻造工坊</Text>
        <Text className={styles.subtitle}>匠心锻造，传承苗银工艺</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <View className={styles.statValue}>
              {inProgressOrders.length}
              <Text className={styles.unit}>单</Text>
            </View>
            <Text className={styles.statLabel}>进行中</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statValue}>
              {pendingCount}
              <Text className={styles.unit}>单</Text>
            </View>
            <Text className={styles.statLabel}>待开始</Text>
          </View>
          <View className={styles.statItem}>
            <View className={styles.statValue}>
              {(totalSilverWeight / 1000).toFixed(2)}
              <Text className={styles.unit}>kg</Text>
            </View>
            <Text className={styles.statLabel}>银料库存</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.tabs}>
          <View
            className={classNames(styles.tab, {
              [styles.activeTab]: activeTab === 'process',
            })}
            onClick={() => setActiveTab('process')}
          >
            生产工序
          </View>
          <View
            className={classNames(styles.tab, {
              [styles.activeTab]: activeTab === 'silver',
            })}
            onClick={() => setActiveTab('silver')}
          >
            银料管理
          </View>
        </View>

        {activeTab === 'process' && (
          <>
            <SectionTitle title="进行中的订单" actionText="全部工序 →" onActionClick={goToProcessPage} />
            
            {inProgressOrders.slice(0, 3).map((order) => (
              <View
                key={order.id}
                className={styles.processCard}
                onClick={() => handleProcessClick(order.id)}
              >
                <View className={styles.processHeader}>
                  <Text className={styles.processOrder}>{order.orderNo}</Text>
                  <View className={styles.processStatus}>{order.statusName}</View>
                </View>
                <Text className={styles.processProduct}>
                  {order.productName} · {order.customerName}
                </Text>
                <View className={styles.stepsHorizontal}>
                  <View className={styles.stepLine}>
                    <View
                      className={styles.stepLineFill}
                      style={{
                        width: `${((order.currentStep - 1) / (processSteps.length - 1)) * 100}%`,
                      }}
                    />
                  </View>
                  {processSteps.map((step, index) => (
                    <View
                      key={step.id}
                      className={classNames(styles.stepPoint, {
                        [styles.active]: getStepStatus(order.currentStep, index) === 'active',
                        [styles.completed]: getStepStatus(order.currentStep, index) === 'completed',
                      })}
                    >
                      <View className={styles.stepDot}>
                        {getStepStatus(order.currentStep, index) === 'completed' ? '✓' : step.id}
                      </View>
                      <Text className={styles.stepName}>{step.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {inProgressOrders.length === 0 && (
              <View className={styles.emptyTip}>
                <Text style={{ fontSize: 24, color: '#999', textAlign: 'center', padding: '32rpx 0' }}>
                  暂无进行中的订单
                </Text>
              </View>
            )}

            <SectionTitle title="工序详解" />
            <View className={styles.actionRow}>
              {processDetailSteps.map((step, index) => (
                <View
                  key={step.id}
                  className={styles.actionBtnCard}
                  onClick={() => handleStepClick(index)}
                >
                  <View className={styles.actionBtnIcon}>
                    {['🔥', '⚙️', '🔨', '🔗', '✨', '🎨'][index] || '🔧'}
                  </View>
                  <Text className={styles.actionBtnText}>{step.name}</Text>
                </View>
              ))}
            </View>

            {selectedStep && (
              <View className={styles.processDetail}>
                <Text className={styles.processDetailTitle}>{selectedStep.name}</Text>
                <Text className={styles.processDetailDesc}>
                  {selectedStep.description}
                </Text>
                <View className={styles.processDetailDesc}>
                  <Text style={{ fontWeight: 500, color: '#333' }}>所需工具：</Text>
                </View>
                <View className={styles.processTools}>
                  {selectedStep.tools.map((tool, idx) => (
                    <View key={idx} className={styles.toolTag}>
                      {tool}
                    </View>
                  ))}
                </View>
                <View className={styles.tips}>
                  <Text className={styles.tipsTitle}>💡 工艺要点</Text>
                  <Text className={styles.tipsContent}>{selectedStep.tips}</Text>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === 'silver' && (
          <>
            <SectionTitle title="银料库存" actionText="全部库存 →" onActionClick={goToSilverPage} />
            
            <View className={styles.stockSummary}>
              <View className={styles.stockItem}>
                <Text className={styles.stockValue}>{formatWeight(totalSilverWeight)}</Text>
                <Text className={styles.stockLabel}>总库存</Text>
              </View>
              <View className={styles.stockItem}>
                <Text className={styles.stockValue}>{formatWeight(ingotStock)}</Text>
                <Text className={styles.stockLabel}>银锭</Text>
              </View>
              <View className={styles.stockItem}>
                <Text className={styles.stockValue}>{formatWeight(wireStock)}</Text>
                <Text className={styles.stockLabel}>银丝</Text>
              </View>
              <View className={styles.stockItem}>
                <Text className={styles.stockValue}>{formatWeight(sheetStock)}</Text>
                <Text className={styles.stockLabel}>银片</Text>
              </View>
            </View>
            
            <View className={styles.actionRow}>
              <View className={styles.actionBtnCard} onClick={handleAddSilver}>
                <View className={styles.actionBtnIcon}>📥</View>
                <Text className={styles.actionBtnText}>银料入库</Text>
              </View>
              <View className={styles.actionBtnCard} onClick={handleUseSilver}>
                <View className={styles.actionBtnIcon}>📤</View>
                <Text className={styles.actionBtnText}>银料领用</Text>
              </View>
            </View>

            <View className={styles.silverList}>
              {activeSilverMaterials.slice(0, 5).map((item) => (
                <View key={item.id} className={styles.silverCard}>
                  <View className={styles.silverHeader}>
                    <Text className={styles.silverName}>{item.name}</Text>
                    <View className={styles.silverType}>
                      {silverTypes.find((t) => t.id === item.type)?.name}
                    </View>
                  </View>
                  <View className={styles.silverInfo}>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>成色</Text>
                      <Text className={styles.infoValue}>{item.purity}</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>重量</Text>
                      <Text className={classNames(styles.infoValue, styles.weight)}>
                        {formatWeight(item.weight)}
                      </Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>单价</Text>
                      <Text className={styles.infoValue}>¥{item.inPrice}/g</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <SectionTitle title="银料类型" />
            <View className={styles.silverList}>
              {silverTypes.map((type) => {
                const typeWeight = silverMaterials
                  .filter((s) => s.type === type.id)
                  .reduce((sum, s) => sum + s.weight, 0);
                return (
                  <View key={type.id} className={styles.silverCard}>
                    <View className={styles.silverHeader}>
                      <Text className={styles.silverName}>{type.name}</Text>
                      <View className={styles.silverType}>
                        {formatWeight(typeWeight)}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default WorkshopPage;
