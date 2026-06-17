import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getOrderById, processSteps } from '@/data/orders';
import ProcessStepComponent from '@/components/ProcessStep';
import type { Order } from '@/types';
import { formatMoney, formatDate } from '@/utils';
import styles from './index.module.scss';

const OrderDetailPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const id = currentPage?.options?.id;
    if (id) {
      const found = getOrderById(id);
      if (found) {
        setOrder(found);
      }
    }
  }, []);

  const getStepStatus = (stepIndex: number) => {
    if (!order) return 'pending';
    if (stepIndex < order.currentStep) return 'completed';
    if (stepIndex === order.currentStep - 1) return 'active';
    return 'pending';
  };

  return (
    <ScrollView className={styles.page} scrollY>
      {order ? (
        <View>
          <View
            style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
              padding: 48,
              color: '#fff',
            }}
          >
            <Text style={{ fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
              {order.orderNo}
            </Text>
            <Text
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: '#fff',
                marginTop: 16,
              }}
            >
              {order.statusName}
            </Text>
            <Text style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
              进度: {order.currentStep}/{order.totalSteps} 工序
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              商品信息
            </Text>
            <Text style={{ fontSize: 28, color: '#333', marginBottom: 8 }}>
              {order.productName}
            </Text>
            <Text style={{ fontSize: 26, color: '#666', marginBottom: 8 }}>
              纹样：{order.patternName}
            </Text>
            <Text style={{ fontSize: 26, color: '#666', marginBottom: 8 }}>
              银料：{order.silverWeight}g · {order.silverPurity}足银
            </Text>
            <Text style={{ fontSize: 26, color: '#666' }}>
              类型：{order.typeName}
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              客户信息
            </Text>
            <Text style={{ fontSize: 28, color: '#333', marginBottom: 8 }}>
              {order.customerName}
            </Text>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              工序进度
            </Text>
            {processSteps.slice(0, -1).map((step, index) => (
              <ProcessStepComponent
                key={step.id}
                step={{
                  id: step.id,
                  name: step.name,
                  description: '',
                  duration: '',
                  tools: [],
                  tips: '',
                }}
                index={index}
                status={getStepStatus(index) as any}
                showMeta={false}
              />
            ))}
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              费用信息
            </Text>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 26, color: '#666' }}>总价</Text>
              <Text style={{ fontSize: 28, color: '#8B0000', fontWeight: 600 }}>
                ¥{formatMoney(order.price)}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 26, color: '#666' }}>已收定金</Text>
              <Text style={{ fontSize: 26, color: '#333' }}>
                ¥{formatMoney(order.deposit)}
              </Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 26, color: '#666' }}>创建时间</Text>
              <Text style={{ fontSize: 26, color: '#333' }}>
                {formatDate(order.createTime)}
              </Text>
            </View>
          </View>

          {order.remark && (
            <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
              <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
                备注
              </Text>
              <Text style={{ fontSize: 26, color: '#666' }}>{order.remark}</Text>
            </View>
          )}
        </View>
      ) : (
        <View className={styles.container}>
          <Text className={styles.icon}>📋</Text>
          <Text className={styles.title}>订单详情</Text>
          <Text className={styles.desc}>功能正在开发中...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderDetailPage;
