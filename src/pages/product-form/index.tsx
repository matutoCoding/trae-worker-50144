import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { patterns } from '@/data/patterns';
import { productCategories, purityList } from '@/data/silver';
import { patterns as patternData } from '@/data/patterns';
import styles from './index.module.scss';

const categoryList = productCategories.filter((c) => c.id !== 'all');

const ProductFormPage: React.FC = () => {
  const [name, setName] = useState('');
  const [patternId, setPatternId] = useState('');
  const [patternName, setPatternName] = useState('');
  const [category, setCategory] = useState('bracelet');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('999');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('1');
  const [description, setDescription] = useState('');
  const [craftsman, setCraftsman] = useState('龙师傅');

  const [showPatternModal, setShowPatternModal] = useState(false);
  const [patternSearch, setPatternSearch] = useState('');

  const { addProduct } = useWorkshopStore();

  const filteredPatterns = useMemo(() => {
    if (!patternSearch) return patterns;
    return patterns.filter(
      (p) => p.name.includes(patternSearch) || p.meaning.includes(patternSearch)
    );
  }, [patternSearch]);

  const isValid = useMemo(() => {
    return (
      name &&
      patternId &&
      weight &&
      parseFloat(weight) > 0 &&
      price &&
      parseFloat(price) > 0
    );
  }, [name, patternId, weight, price]);

  const estimatedPrice = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const p = parseFloat(purity) / 100 || 0.999;
    return Math.round(w * p * 35 + 100);
  }, [weight, purity]);

  const handleSelectPattern = (pattern: any) => {
    setPatternId(pattern.id);
    setPatternName(pattern.name);
    if (!name) {
      const catName = categoryList.find((c) => c.id === category)?.name || '';
      setName(`${pattern.name}${catName}`);
    }
    if (!description) {
      setDescription(pattern.meaning);
    }
    setShowPatternModal(false);
  };

  const handleCategoryChange = (index: number) => {
    const cat = categoryList[index];
    setCategory(cat.id);
    if (patternId && !name.includes(cat.name)) {
      const p = patterns.find((p) => p.id === patternId);
      if (p) {
        setName(`${p.name}${cat.name}`);
      }
    }
  };

  const handleSubmit = () => {
    if (!isValid) {
      Taro.showToast({ title: '请完善产品信息', icon: 'none' });
      return;
    }

    const pattern = patterns.find((p) => p.id === patternId);

    addProduct({
      name,
      patternId,
      patternName: pattern?.name || patternName,
      category,
      weight: parseFloat(weight),
      purity,
      size: size || '标准尺寸',
      price: parseFloat(price),
      cost: parseFloat(cost) || Math.round(parseFloat(weight) * 8),
      stock: parseInt(stock) || 1,
      image: pattern?.image || 'https://picsum.photos/id/102/400/400',
      description: description || pattern?.meaning || '',
      craftsman,
    });

    Taro.showToast({
      title: '成品添加成功',
      icon: 'success',
      duration: 1500,
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.form}>
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
                <Text style={{ color: '#ccc' }}>点击选择纹样</Text>
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
              value={name}
              onInput={(e) => setName(e.detail.value)}
            />
          </View>

          <View className={styles.row}>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>产品类别
              </Text>
              <Picker
                mode="selector"
                range={categoryList.map((c) => c.name)}
                onSelect={(e) => handleCategoryChange(e.detail.value)}
              >
                <View className={styles.picker}>
                  {categoryList.find((c) => c.id === category)?.name}
                </View>
              </Picker>
            </View>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>成色
              </Text>
              <Picker
                mode="selector"
                range={purityList.map((p) => p.name)}
                onSelect={(e) => setPurity(purityList[e.detail.value].id)}
              >
                <View className={styles.picker}>
                  {purityList.find((p) => p.id === purity)?.name}
                </View>
              </Picker>
            </View>
          </View>

          <View className={styles.row}>
            <View className={styles.formItem} style={{ flex: 1 }}>
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
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>尺寸</Text>
              <Input
                className={styles.input}
                placeholder="如：内径58mm"
                value={size}
                onInput={(e) => setSize(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.row}>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>
                <Text className={styles.required}>*</Text>售价(元)
              </Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder={estimatedPrice > 0 ? `预估 ${estimatedPrice}` : '请输入售价'}
                value={price}
                onInput={(e) => setPrice(e.detail.value)}
              />
            </View>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>成本(元)</Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入成本"
                value={cost}
                onInput={(e) => setCost(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.row}>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>库存数量</Text>
              <Input
                className={styles.input}
                type="number"
                placeholder="1"
                value={stock}
                onInput={(e) => setStock(e.detail.value)}
              />
            </View>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>工匠</Text>
              <Input
                className={styles.input}
                placeholder="请输入工匠姓名"
                value={craftsman}
                onInput={(e) => setCraftsman(e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>产品描述</Text>
            <Input
              className={styles.textarea}
              placeholder="请输入产品描述..."
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
          保存成品
        </View>
      </View>

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

export default ProductFormPage;
