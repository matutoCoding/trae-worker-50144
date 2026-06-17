import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { incomeCategories, expenseCategories } from '@/data/ledger';
import type { LedgerCategory } from '@/types';
import { formatCurrency } from '@/utils';
import styles from './index.module.scss';

const LedgerFormPage: React.FC = () => {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<LedgerCategory>('custom');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [description, setDescription] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');
  const [relatedOrderNo, setRelatedOrderNo] = useState('');

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');

  const { ledgerRecords, orders, addLedgerRecord } = useWorkshopStore();

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;
  const currentCategory = currentCategories.find((c) => c.id === category);

  const totalIncome = useMemo(
    () => ledgerRecords.filter((r) => r.type === 'income').reduce((sum, r) => sum + r.amount, 0),
    [ledgerRecords]
  );
  const totalExpense = useMemo(
    () => ledgerRecords.filter((r) => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0),
    [ledgerRecords]
  );
  const balance = totalIncome - totalExpense;

  const filteredOrders = useMemo(() => {
    if (!orderSearch) return orders;
    return orders.filter(
      (o) => o.orderNo.includes(orderSearch) || o.productName.includes(orderSearch)
    );
  }, [orders, orderSearch]);

  const isValid = useMemo(() => {
    return amount && parseFloat(amount) > 0 && category;
  }, [amount, category]);

  const handleCategorySelect = (cat: any) => {
    setCategory(cat.id as LedgerCategory);
    setCategoryName(cat.name);
    if (!description) {
      setDescription(cat.name);
    }
  };

  const handleOrderSelect = (order: any) => {
    setRelatedOrderId(order.id);
    setRelatedOrderNo(order.orderNo);
    if (!description) {
      setDescription(`${order.productName} - ${type === 'income' ? '收款' : '退款'}`);
    }
    setShowOrderModal(false);
  };

  const handleSubmit = () => {
    if (!isValid) {
      if (!amount || parseFloat(amount) <= 0) {
        Taro.showToast({ title: '请输入正确金额', icon: 'none' });
        return;
      }
      Taro.showToast({ title: '请完善登记信息', icon: 'none' });
      return;
    }

    addLedgerRecord({
      type,
      category,
      categoryName: currentCategory?.name || categoryName,
      amount: parseFloat(amount),
      paymentMethod,
      description: description || currentCategory?.name || '',
      relatedOrderId: relatedOrderId || undefined,
      relatedOrderNo: relatedOrderNo || undefined,
    });

    Taro.showToast({
      title: '登记成功',
      icon: 'success',
      duration: 1500,
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const paymentMethods = [
    { id: 'cash', name: '现金' },
    { id: 'wechat', name: '微信' },
    { id: 'alipay', name: '支付宝' },
    { id: 'bank', name: '银行转账' },
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.form}>
        <View className={styles.typeTabs}>
          <View
            className={classNames(styles.tabBtn, { [styles.activeTab]: type === 'income' })}
            onClick={() => {
              setType('income');
              setCategory('custom');
              setCategoryName('');
            }}
          >
            收入
          </View>
          <View
            className={classNames(styles.tabBtn, { [styles.activeTab]: type === 'expense' })}
            onClick={() => {
              setType('expense');
              setCategory('custom');
              setCategoryName('');
            }}
          >
            支出
          </View>
        </View>

        <View className={styles.summaryInfo}>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>总收入</Text>
            <Text className={classNames(styles.summaryValue, styles.incomeValue)}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>总支出</Text>
            <Text className={classNames(styles.summaryValue, styles.expenseValue)}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>结余</Text>
            <Text className={styles.summaryValue}>{formatCurrency(balance)}</Text>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>{type === 'income' ? '收入类型' : '支出类型'}</Text>
          </View>

          <View className={styles.categoryGrid}>
            {currentCategories.map((cat) => (
              <View
                key={cat.id}
                className={classNames(styles.categoryItem, {
                  [styles.activeCategory]: category === cat.id,
                })}
                onClick={() => handleCategorySelect(cat)}
              >
                <View className={styles.categoryIcon}>{cat.icon}</View>
                <Text className={styles.categoryName}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>金额</Text>
          </View>

          <View className={styles.formItem}>
            <View className={styles.amountInput}>
              <Text className={styles.amountPrefix}>¥</Text>
              <Input
                type="digit"
                placeholder="0.00"
                value={amount}
                onInput={(e) => setAmount(e.detail.value)}
                style={{
                  flex: 1,
                  fontSize: '48rpx',
                  fontWeight: 700,
                  color: '#333',
                }}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>支付方式</Text>
            <Picker
              mode="selector"
              range={paymentMethods.map((p) => p.name)}
              onSelect={(e) => setPaymentMethod(paymentMethods[e.detail.value].id)}
            >
              <View className={styles.picker}>
                {paymentMethods.find((p) => p.id === paymentMethod)?.name}
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>关联订单（可选）</Text>
            <View
              className={styles.picker}
              onClick={() => setShowOrderModal(true)}
            >
              {relatedOrderNo ? (
                <Text style={{ color: '#333' }}>{relatedOrderNo}</Text>
              ) : (
                <Text style={{ color: '#ccc' }}>点击选择关联订单</Text>
              )}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注说明</Text>
            <Input
              className={styles.textarea}
              placeholder="填写收支说明..."
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
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
        <View className={styles.submitBtn} onClick={handleSubmit}>
          确认登记
        </View>
      </View>

      {showOrderModal && (
        <View
          className={styles.modalOverlay}
          onClick={() => setShowOrderModal(false)}
        >
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择关联订单</Text>
              <Text className={styles.modalClose} onClick={() => setShowOrderModal(false)}>✕</Text>
            </View>
            <Input
              className={styles.searchInput}
              placeholder="搜索订单号或产品名称"
              value={orderSearch}
              onInput={(e) => setOrderSearch(e.detail.value)}
            />
            <ScrollView className={styles.modalList} scrollY>
              {filteredOrders.map((order) => (
                <View
                  key={order.id}
                  className={styles.orderItem}
                  onClick={() => handleOrderSelect(order)}
                >
                  <Text className={styles.orderNo}>{order.orderNo}</Text>
                  <Text className={styles.orderInfo}>
                    {order.productName} · {order.customerName} · ¥{order.price}
                  </Text>
                </View>
              ))}
              {filteredOrders.length === 0 && (
                <View style={{ textAlign: 'center', padding: '48rpx 0', color: '#999' }}>
                  暂无订单
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default LedgerFormPage;
