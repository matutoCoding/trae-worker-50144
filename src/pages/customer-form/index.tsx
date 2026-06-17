import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useWorkshopStore } from '@/store/useWorkshopStore';
import { customerLevels } from '@/data/customers';
import styles from './index.module.scss';

const CustomerFormPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('female');
  const [birthday, setBirthday] = useState('');
  const [level, setLevel] = useState('regular');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');

  const { addCustomer } = useWorkshopStore();

  const isValid = useMemo(() => {
    return name && phone && /^1[3-9]\d{9}$/.test(phone);
  }, [name, phone]);

  const handleSubmit = () => {
    if (!isValid) {
      if (!name) {
        Taro.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        Taro.showToast({ title: '请输入正确手机号', icon: 'none' });
        return;
      }
    }

    const customer = addCustomer({
      name,
      phone,
      gender,
      birthday: birthday || undefined,
      level,
      address: address || undefined,
      note: note || undefined,
      tags: tags ? tags.split(/[,，]/).filter(Boolean) : undefined,
    });

    Taro.showToast({
      title: '客户添加成功',
      icon: 'success',
      duration: 1500,
    });

    setTimeout(() => {
      Taro.navigateBack({
        delta: 1,
        success: () => {
          Taro.eventCenter.trigger('customerAdded', customer);
        },
      });
    }, 1500);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>基本信息</Text>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>姓名
            </Text>
            <Input
              className={styles.input}
              placeholder="请输入客户姓名"
              value={name}
              onInput={(e) => setName(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>
              <Text className={styles.required}>*</Text>手机号
            </Text>
            <Input
              className={styles.input}
              type="number"
              placeholder="请输入11位手机号"
              maxlength={11}
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>性别</Text>
            <View className={styles.genderTabs}>
              <View
                className={classNames(styles.genderBtn, { [styles.activeGender]: gender === 'female' })}
                onClick={() => setGender('female')}
              >
                女士
              </View>
              <View
                className={classNames(styles.genderBtn, { [styles.activeGender]: gender === 'male' })}
                onClick={() => setGender('male')}
              >
                先生
              </View>
              <View
                className={classNames(styles.genderBtn, { [styles.activeGender]: gender === 'unknown' })}
                onClick={() => setGender('unknown')}
              >
                保密
              </View>
            </View>
          </View>

          <View className={styles.row}>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>生日</Text>
              <Input
                className={styles.input}
                placeholder="如：1990-01-15"
                value={birthday}
                onInput={(e) => setBirthday(e.detail.value)}
              />
            </View>
            <View className={classNames(styles.formItem, styles.half)}>
              <Text className={styles.label}>客户标签</Text>
              <Input
                className={styles.input}
                placeholder="多个标签用逗号分隔"
                value={tags}
                onInput={(e) => setTags(e.detail.value)}
              />
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>客户等级</Text>
          </View>

          {customerLevels.map((lv) => (
            <View
              key={lv.id}
              className={classNames(styles.levelItem, { [styles.activeLevel]: level === lv.id })}
              onClick={() => setLevel(lv.id)}
            >
              <View className={styles.levelIcon}>{lv.icon}</View>
              <View className={styles.levelInfo}>
                <Text className={styles.levelName}>{lv.name}</Text>
                <Text className={styles.levelDesc}>{lv.desc}</Text>
              </View>
              <View className={styles.levelCheck}>✓</View>
            </View>
          ))}
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.decor} />
            <Text>其他信息</Text>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>联系地址</Text>
            <Input
              className={styles.input}
              placeholder="请输入地址"
              value={address}
              onInput={(e) => setAddress(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Input
              className={styles.textarea}
              placeholder="记录客户喜好、尺寸等..."
              value={note}
              onInput={(e) => setNote(e.detail.value)}
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
          保存客户
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomerFormPage;
