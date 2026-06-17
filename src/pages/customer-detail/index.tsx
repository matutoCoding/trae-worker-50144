import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { customers } from '@/data/customers';
import { orders } from '@/data/orders';
import OrderCard from '@/components/OrderCard';
import type { Customer, Order } from '@/types';
import { formatMoney, formatDate } from '@/utils';
import styles from './index.module.scss';

const CustomerDetailPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const id = currentPage?.options?.id;
    if (id) {
      const found = customers.find((c) => c.id === id);
      if (found) {
        setCustomer(found);
        const orderList = orders.filter((o) => o.customerId === id);
        setCustomerOrders(orderList);
      }
    }
  }, []);

  return (
    <ScrollView className={styles.page} scrollY>
      {customer ? (
        <View>
          <View
            style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
              padding: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <Image
              src={customer.avatar}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              mode="aspectFill"
            />
            <View>
              <Text
                style={{ fontSize: 32, fontWeight: 600, color: '#fff', display: 'block' }}
              >
                {customer.name}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.7)',
                  marginTop: 8,
                  display: 'block',
                }}
              >
                {customer.phone}
              </Text>
              <View
                style={{
                  marginTop: 12,
                  display: 'inline-block',
                  padding: '4rpx 16rpx',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 22, color: '#fff' }}>
                  {customer.levelName}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              消费统计
            </Text>
            <View style={{ display: 'flex', justifyContent: 'space-around' }}>
              <View style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 600, color: '#8B0000' }}>
                  {customer.totalOrders}
                </Text>
                <Text style={{ fontSize: 22, color: '#999', display: 'block', marginTop: 4 }}>
                  订单数
                </Text>
              </View>
              <View style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 600, color: '#8B0000' }}>
                  ¥{formatMoney(customer.totalAmount, 0)}
                </Text>
                <Text style={{ fontSize: 22, color: '#999', display: 'block', marginTop: 4 }}>
                  累计消费
                </Text>
              </View>
              <View style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 32, fontWeight: 600, color: '#8B0000' }}>
                  {formatDate(customer.lastOrderTime).slice(5)}
                </Text>
                <Text style={{ fontSize: 22, color: '#999', display: 'block', marginTop: 4 }}>
                  最近下单
                </Text>
              </View>
            </View>
          </View>

          {customer.remark && (
            <View style={{ padding: 24, background: '#fff', marginTop: 16 }}>
              <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>
                备注
              </Text>
              <Text style={{ fontSize: 26, color: '#666' }}>{customer.remark}</Text>
            </View>
          )}

          <View style={{ padding: 24, marginTop: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 16 }}>
              历史订单 ({customerOrders.length})
            </Text>
            {customerOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        </View>
      ) : (
        <View className={styles.container}>
          <Text className={styles.icon}>👤</Text>
          <Text className={styles.title}>客户详情</Text>
          <Text className={styles.desc}>功能正在开发中...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CustomerDetailPage;
