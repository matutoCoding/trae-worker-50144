import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { silverTypes, purityList } from '@/data/silver';
import type { SilverType } from '@/types';
import { formatWeight } from '@/utils';
import styles from './index.module.scss';

const SilverFormPage: React.FC = () => {
  const [mode, setMode] = useState<'in' | 'out'>('in');

  const [name, setName] = useState('');
  const [purity, setPurity] = useState('999');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState<SilverType>('ingot');
  const [supplier, setSupplier] = useState('');
  const [inPrice, setInPrice] = useState('');
  const [remark, setRemark] = useState('');

  const [silverId, setSilverId] = useState('');
  const [silverName, setSilverName] = useState('');
  const [outWeight, setOutWeight] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderNo, setOrderNo] = useState('');

  const [showSilverModal, setShowSilverModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [silverSearch, setSilverSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const {
    silverMaterials,
    orders,
    addSilver,
    useSilver,
    getSilverTotalWeight,
    getSilverByType,
  } = useWorkshopStore();

  const totalStock = useMemo(() => getSilverTotalWeight(), [silverMaterials]);
  const ingotStock = useMemo(() => getSilverByType('ingot'), [silverMaterials]);
  const wireStock = useMemo(() => getSilverByType('wire'), [silverMaterials]);
  const sheetStock = useMemo(() => getSilverByType('sheet'), [silverMaterials]);

  const filteredSilver = useMemo(() => {
    if (!silverSearch) return silverMaterials.filter((s) => s.weight > 0);
    return silverMaterials.filter(
      (s) => s.name.includes(silverSearch) && s.weight > 0
    );
  }, [silverMaterials, silverSearch]);

  const filteredOrders = useMemo(() => {
    const pendingOrders = orders.filter(
      (o) => !['finished', 'delivered'].includes(o.status)
    );
    if (!orderSearch) return pendingOrders;
    return pendingOrders.filter(
      (o) => o.orderNo.includes(orderSearch) || o.productName.includes(orderSearch)
    );
  }, [orders, orderSearch]);

  const isValid = useMemo(() => {
    if (mode === 'in') {
      return (
        name &&
        weight &&
        parseFloat(weight) > 0 &&
        inPrice &&
        parseFloat(inPrice) > 0
      );
    } else {
      return (
        silverId &&
        outWeight &&
        parseFloat(outWeight) > 0 &&
        parseFloat(outWeight) <= (silverMaterials.find((s) => s.id === silverId)?.weight || 0)
      );
    }
  }, [mode, name, weight, inPrice, silverId, outWeight, silverMaterials]);

  const handleTypeChange = (t: SilverType) => {
    setType(t);
    if (!name) {
      const purityName = purityList.find((p) => p.id === purity)?.name || purity;
      const typeName = silverTypes.find((st) => st.id === t)?.name || t;
      setName(`${purityName}${typeName}`);
    }
  };

  const handleSelectSilver = (silver: any) => {
    setSilverId(silver.id);
    setSilverName(`${silver.name} (剩余 ${formatWeight(silver.weight)})`);
    setOutWeight('');
    setShowSilverModal(false);
  };

  const handleSelectOrder = (order: any) => {
    setOrderId(order.id);
    setOrderNo(order.orderNo);
    setShowOrderModal(false);
  };

  const handleSubmit = () => {
    if (!isValid) {
      const msg = mode === 'in' ? '请完善入库信息' : '请完善领用信息';
      Taro.showToast({ title: msg, icon: 'none' });
      return;
    }

    if (mode === 'in') {
      addSilver({
        name,
        purity,
        weight: parseFloat(weight),
        unit: 'g',
        type,
        supplier: supplier || '自行采购',
        inPrice: parseFloat(inPrice),
        remark: remark || '',
      });

      Taro.showToast({
        title: '入库成功',
        icon: 'success',
        duration: 1500,
      });
    } else {
      useSilver(silverId, parseFloat(outWeight), orderId || undefined);

      Taro.showToast({
        title: '领用登记成功',
        icon: 'success',
        duration: 1500,
      });
    }

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const selectedSilver = silverMaterials.find((s) => s.id === silverId);
  const maxOutWeight = selectedSilver?.weight || 0;

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.form}>
        <View className={styles.typeTabs}>
          <View
            className={classNames(styles.tabBtn, { [styles.activeTab]: mode === 'in' })}
            onClick={() => setMode('in')}
          >
            银料入库
          </View>
          <View
            className={classNames(styles.tabBtn, { [styles.activeTab]: mode === 'out' })}
            onClick={() => setMode('out')}
          >
            银料领用
          </View>
        </View>

        <View className={styles.stockInfo}>
          <View className={styles.stockRow}>
            <Text className={styles.stockLabel}>总库存</Text>
            <Text className={styles.stockValue}>{formatWeight(totalStock)}</Text>
          </View>
          <View className={styles.stockRow}>
            <Text className={styles.stockLabel}>银锭</Text>
            <Text className={styles.stockValue}>{formatWeight(ingotStock)}</Text>
          </View>
          <View className={styles.stockRow}>
            <Text className={styles.stockLabel}>银丝</Text>
            <Text className={styles.stockValue}>{formatWeight(wireStock)}</Text>
          </View>
          <View className={styles.stockRow}>
            <Text className={styles.stockLabel}>银片</Text>
            <Text className={styles.stockValue}>{formatWeight(sheetStock)}</Text>
          </View>
        </View>

        {mode === 'in' && (
          <View className={styles.formSection}>
            <View className={styles.sectionTitle}>
              <View className={styles.decor} />
              <Text>入库信息</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>材料名称
              </Text>
              <Input
                className={styles.input}
                placeholder="请输入材料名称"
                value={name}
                onInput={(e) => setName(e.detail.value)}
              />
            </View>

            <View className={styles.row}>
              <View className={classNames(styles.formItem, styles.half)}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>成色
                </Text>
                <Picker
                  mode="selector"
                  range={purityList.map((p) => p.name)}
                  onSelect={(e) => {
                    setPurity(purityList[e.detail.value].id);
                    const purityName = purityList[e.detail.value].name;
                    const typeName = silverTypes.find((st) => st.id === type)?.name || '';
                    setName(`${purityName}${typeName}`);
                  }}
                >
                  <View className={styles.picker}>
                    {purityList.find((p) => p.id === purity)?.name}
                  </View>
                </Picker>
              </View>
              <View className={classNames(styles.formItem, styles.half)}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>类型
                </Text>
                <Picker
                  mode="selector"
                  range={silverTypes.map((t) => t.name)}
                  onSelect={(e) => {
                    handleTypeChange(silverTypes[e.detail.value].id as SilverType);
                  }}
                >
                  <View className={styles.picker}>
                    {silverTypes.find((t) => t.id === type)?.name}
                  </View>
                </Picker>
              </View>
            </View>

            <View className={styles.row}>
              <View className={classNames(styles.formItem, styles.half)}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>重量(g)
                </Text>
                <Input
                  className={styles.input}
                  type="digit"
                  placeholder="请输入重量"
                  value={weight}
                  onInput={(e) => setWeight(e.detail.value)}
                />
              </View>
              <View className={classNames(styles.formItem, styles.half)}>
                <Text className={styles.label}>
                  <Text className={styles.required}>*</Text>单价(元/g)
                </Text>
                <Input
                  className={styles.input}
                  type="digit"
                  placeholder="请输入单价"
                  value={inPrice}
                  onInput={(e) => setInPrice(e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>来源/供应商</Text>
              <Input
                className={styles.input}
                placeholder="请输入供应商名称"
                value={supplier}
                onInput={(e) => setSupplier(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>备注</Text>
              <Input
                className={styles.textarea}
                placeholder="填写备注信息..."
                value={remark}
                onInput={(e) => setRemark(e.detail.value)}
              />
            </View>
          </View>
        )}

        {mode === 'out' && (
          <View className={styles.formSection}>
            <View className={styles.sectionTitle}>
              <View className={styles.decor} />
              <Text>领用信息</Text>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>选择银料
              </Text>
              <View
                className={styles.picker}
                onClick={() => setShowSilverModal(true)}
              >
                {silverName ? (
                  <Text style={{ color: '#333' }}>{silverName}</Text>
                ) : (
                  <Text style={{ color: '#ccc' }}>点击选择库存银料</Text>
                )}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>
                领用重量(g)
                {maxOutWeight > 0 && (
                  <Text style={{ color: '#999', fontWeight: 400 }}>
                    {' '}(最多 {maxOutWeight.toFixed(2)}g)
                  </Text>
                )}
              </Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入领用重量"
                value={outWeight}
                onInput={(e) => {
                  const val = parseFloat(e.detail.value);
                  if (val > maxOutWeight) {
                    Taro.showToast({ title: '超出库存', icon: 'none' });
                  }
                  setOutWeight(e.detail.value);
                }}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>关联订单</Text>
              <View
                className={styles.picker}
                onClick={() => setShowOrderModal(true)}
              >
                {orderNo ? (
                  <Text style={{ color: '#333' }}>{orderNo}</Text>
                ) : (
                  <Text style={{ color: '#ccc' }}>选择关联订单（可选）</Text>
                )}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>备注</Text>
              <Input
                className={styles.textarea}
                placeholder="填写领用用途..."
                value={remark}
                onInput={(e) => setRemark(e.detail.value)}
              />
            </View>
          </View>
        )}
      </View>

      <View className={styles.footerBar}>
        <View
          className={styles.cancelBtn}
          onClick={() => Taro.navigateBack()}
        >
          取消
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          {mode === 'in' ? '确认入库' : '确认领用'}
        </View>
      </View>

      {showSilverModal && (
        <View className={styles.modalOverlay} onClick={() => setShowSilverModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>选择银料</Text>
              <Text className={styles.modalClose} onClick={() => setShowSilverModal(false)}>✕</Text>
            </View>
            <Input
              className={styles.searchInput}
              placeholder="搜索银料名称"
              value={silverSearch}
              onInput={(e) => setSilverSearch(e.detail.value)}
            />
            <ScrollView className={styles.modalList} scrollY>
              {filteredSilver.map((silver) => (
                <View
                  key={silver.id}
                  className={styles.silverItem}
                  onClick={() => handleSelectSilver(silver)}
                >
                  <View className={styles.silverInfo}>
                    <Text className={styles.silverName}>{silver.name}</Text>
                    <Text className={styles.silverSpec}>
                      成色 {silver.purity} · 剩余 {formatWeight(silver.weight)} · ¥{silver.inPrice}/g
                    </Text>
                  </View>
                  {silverId === silver.id && (
                    <View className={styles.selectedBadge}>✓</View>
                  )}
                </View>
              ))}
              {filteredSilver.length === 0 && (
                <View style={{ textAlign: 'center', padding: '48rpx 0', color: '#999' }}>
                  暂无可用银料，请先入库
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {showOrderModal && (
        <View className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>关联订单</Text>
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
                  onClick={() => handleSelectOrder(order)}
                >
                  <Text className={styles.orderNo}>{order.orderNo}</Text>
                  <Text className={styles.orderInfo}>
                    {order.productName} · {order.customerName}
                  </Text>
                </View>
              ))}
              {filteredOrders.length === 0 && (
                <View style={{ textAlign: 'center', padding: '48rpx 0', color: '#999' }}>
                  暂无进行中的订单
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SilverFormPage;
