import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { patterns } from '@/data/patterns';
import { purityList } from '@/data/silver';
import type { OrderType } from '@/types';
import { formatCurrency } from '@/utils';
import styles from './index.module.scss';

const OrderFormPage: React.FC = () => {
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>('custom');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [patternId, setPatternId] = useState('');
  const [patternName, setPatternName] = useState('');
  const [productName, setProductName] = useState('');
  const [silverWeight, setSilverWeight] = useState('');
  const [silverPurity, setSilverPurity] = useState('999');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [expectedTime, setExpectedTime] = useState(dayjs().add(15, 'day').format('YYYY-MM-DD'));
  const [remark, setRemark] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [patternSearch, setPatternSearch] = useState('');

  const { customers, addOrder, addCustomer } = useWorkshopStore();

  useDidShow(() => {
    const typeParam = router.params?.type as OrderType;
    if (typeParam && ['custom', 'exchange', 'wholesale'].includes(typeParam)) {
      setOrderType(typeParam);
    }
  });

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    return customers.filter(
      (c) => c.name.includes(customerSearch) || c.phone.includes(customerSearch)
    );
  }, [customers, customerSearch]);

  const filteredPatterns = useMemo(() => {
    if (!patternSearch) return patterns;
    return patterns.filter(
      (p) => p.name.includes(patternSearch) || p.meaning.includes(patternSearch)
    );
  }, [patternSearch]);

  const isValid = useMemo(() => {
    return (
      customerId &&
      patternId &&
      productName &&
      silverWeight &&
      parseFloat(silverWeight) > 0 &&
      price &&
      parseFloat(price) > 0
    );
  }, [customerId, patternId, productName, silverWeight, price]);

  const estimatedPrice = useMemo(() => {
    const weight = parseFloat(silverWeight) || 0;
    const purity = parseFloat(silverPurity) / 100 || 0.999;
    const basePrice = weight * purity * 8;
    const craftPrice = weight * 30;
    return Math.round(basePrice + craftPrice);
  }, [silverWeight, silverPurity]);

  const handleSelectCustomer = (customer: any) => {
    setCustomerId(customer.id);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setShowCustomerModal(false);
  };

  const handleSelectPattern = (pattern: any) => {
    setPatternId(pattern.id);
    setPatternName(pattern.name);
    if (!productName) {
      const typeName = orderType === 'custom' ? '定制' : orderType === 'exchange' ? '换购' : '批发';
      setProductName(`${pattern.name}${typeName}`);
    }
    setShowPatternModal(false);
  };

  const handleAddNewCustomer = () => {
    if (!customerName || !customerPhone) {
      Taro.showToast({ title: '请填写客户姓名和电话', icon: 'none' });
      return;
    }
    const newCustomer = addCustomer({
      name: customerName,
      phone: customerPhone,
      level: 'regular',
      note: '新增客户',
    });
    setCustomerId(newCustomer.id);
    setShowCustomerModal(false);
    Taro.showToast({ title: '客户已创建', icon: 'success' });
  };

  const handleSubmit = () => {
    if (!isValid) {
      Taro.showToast({ title: '请完善订单信息', icon: 'none' });
      return;
    }

    const finalPrice = parseFloat(price) || estimatedPrice;
    const finalDeposit = parseFloat(deposit) || 0;

    addOrder({
      customerId,
      customerName,
      type: orderType,
      patternId,
      patternName,
      productName,
      silverWeight: parseFloat(silverWeight),
      silverPurity,
      price: finalPrice,
      deposit: finalDeposit,
      expectedTime,
      remark,
    });

    Taro.showToast({
      title: '订单创建成功',
      icon: 'success',
      duration: 1500,
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const orderTypes = [
    { id: 'custom' as OrderType, name: '专属定制', icon: '✏️' },
    { id: 'exchange' as OrderType, name: '以旧换新', icon: '♻️' },
    { id: 'wholesale' as OrderType, name: '批发订单', icon: '📦' },
  ];

  const currentTypeName = orderTypes.find((t) => t.id === orderType)?.name || '';

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>订单类型</Text>
          </View>
          <View className={styles.typeSelector}>
            {orderTypes.map((type) => (
              <View
                key={type.id}
                className={classNames(styles.typeCard, {
                  [styles.activeType]: orderType === type.id,
                })}
                onClick={() => setOrderType(type.id)}
              >
                <Text className={styles.typeIcon}>{type.icon}</Text>
                <Text className={styles.typeName}>{type.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>客户信息</Text>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择客户
            </Text>
            <View
              className={styles.picker}
              onClick={() => setShowCustomerModal(true)}
            >
              {customerName ? (
                <Text style={{ color: '#333' }}>
                  {customerName} · {customerPhone}
                </Text>
              ) : (
                <Text style={{ color: '#ccc' }}>点击选择或新增客户</Text>
              )}
            </View>
          </View>

          {!customerId && (
            <>
              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>客户姓名
                </Text>
                <Input
                  className={styles.input}
                  placeholder="请输入客户姓名"
                  value={customerName}
                  onInput={(e) => setCustomerName(e.detail.value)}
                />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>联系电话
                </Text>
                <Input
                  className={styles.input}
                  type="number"
                  placeholder="请输入联系电话"
                  value={customerPhone}
                  onInput={(e) => setCustomerPhone(e.detail.value)}
                />
              </View>
              {customerName && customerPhone && !customerId && (
                <View
                  className={styles.picker}
                  style={{
                    background: 'rgba(139, 0, 0, 0.08)',
                    color: '#8B0000',
                    justifyContent: 'center',
                  }}
                  onClick={handleAddNewCustomer}
                >
                  <Text style={{ color: '#8B0000' }}>+ 新增此客户</Text>
                </View>
              )}
            </>
          )}
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>产品信息</Text>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>选择纹样
            </Text>
            <View
              className={styles.picker}
              onClick={() => setShowPatternModal(true)}
            >
              {patternName ? (
                <Text style={{ color: '#333' }}>{patternName}</Text>
              ) : (
                <Text style={{ color: '#ccc' }}>点击选择纹样款式</Text>
              )}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>产品名称
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入产品名称"
              value={productName}
              onInput={(e) => setProductName(e.detail.value)}
            />
          </View>

          <View className={styles.row}>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>银料重量(g)
              </Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder="重量"
                value={silverWeight}
                onInput={(e) => setSilverWeight(e.detail.value)}
              />
            </View>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>成色
              </Text>
              <Picker
                mode="selector"
                range={purityList.map((p) => p.name)}
                onSelect={(e) => {
                  setSilverPurity(purityList[e.detail.value].id);
                }}
              >
                <View className={styles.picker}>
                  {purityList.find((p) => p.id === silverPurity)?.name}
                </View>
              </Picker>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>费用信息</Text>
          </View>

          <View className={styles.row}>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>总价(元)
              </Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder={estimatedPrice > 0 ? `预估 ${estimatedPrice}` : '请输入总价'}
                value={price}
                onInput={(e) => setPrice(e.detail.value)}
              />
            </View>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>定金(元)</Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder="预收定金"
                value={deposit}
                onInput={(e) => setDeposit(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>预计交付日期
            </Text>
            <Picker
              mode="date"
              value={expectedTime}
              start={dayjs().format('YYYY-MM-DD')}
              onChange={(e) => setExpectedTime(e.detail.value)}
            >
              <View className={styles.picker}>{expectedTime}</View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Input
              className={styles.textarea}
              placeholder="填写客户特殊要求..."
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.footerBar}>
        <View
          className={styles.cancelBtn}
          onClick={() => Taro.navigateBack()}
        >
          取消
        </View>
        <View
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          创建{currentTypeName}
        </View>
      </View>

      {showCustomerModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCustomerModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择客户</Text>
              <Text className={styles.modalClose} onClick={() => setShowCustomerModal(false)}>✕</Text>
            </View>
            <Input
              className={styles.searchInput}
              placeholder="搜索客户姓名或电话"
              value={customerSearch}
              onInput={(e) => setCustomerSearch(e.detail.value)}
            />
            <ScrollView className={styles.modalList} scrollY>
              {filteredCustomers.map((customer) => (
                <View
                  key={customer.id}
                  className={styles.customerItem}
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <View className={styles.customerAvatar} style={{
                    backgroundImage: `url(${customer.avatar})`,
                    backgroundSize: 'cover',
                  }} />
                  <View className={styles.customerInfo}>
                    <Text className={styles.customerName}>{customer.name}</Text>
                    <Text className={styles.customerPhone}>{customer.phone}</Text>
                  </View>
                  {customerId === customer.id && (
                    <View className={styles.selectedBadge}>✓</View>
                  )}
                </View>
              ))}
              {filteredCustomers.length === 0 && (
                <View style={{ textAlign: 'center', padding: '48rpx 0', color: '#999' }}>
                  未找到客户，请直接填写新增
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {showPatternModal && (
        <View className={styles.modalOverlay} onClick={() => setShowPatternModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择纹样</Text>
              <Text className={styles.modalClose} onClick={() => setShowPatternModal(false)}>✕</Text>
            </View>
            <Input
              className={styles.searchInput}
              placeholder="搜索纹样名称或寓意"
              value={patternSearch}
              onInput={(e) => setPatternSearch(e.detail.value)}
            />
            <ScrollView className={styles.modalList} scrollY>
              {filteredPatterns.map((pattern) => (
                <View
                  key={pattern.id}
                  className={styles.patternItem}
                  onClick={() => handleSelectPattern(pattern)}
                >
                  <View className={styles.patternImage} style={{
                    backgroundImage: `url(${pattern.image})`,
                    backgroundSize: 'cover',
                  }} />
                  <View className={styles.patternInfo}>
                    <Text className={styles.patternName}>{pattern.name}</Text>
                    <Text className={styles.patternMeaning}>{pattern.meaning}</Text>
                  </View>
                  {patternId === pattern.id && (
                    <View className={styles.selectedBadge}>✓</View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderFormPage;
