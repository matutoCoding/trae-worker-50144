import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

export const formatMoney = (amount: number, decimals = 2) => {
  return amount.toFixed(decimals);
};

export const formatWeight = (weight: number) => {
  return `${weight.toFixed(2)}g`;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: '#F57C00',
    melting: '#1565C0',
    drawing: '#2E7D32',
    engraving: '#7B1FA2',
    welding: '#8B0000',
    polishing: '#D4AF37',
    finished: '#2E7D32',
    delivered: '#666666',
  };
  return colorMap[status] || '#666666';
};

export const getLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    normal: '#666666',
    vip: '#D4AF37',
    svip: '#8B0000',
  };
  return colorMap[level] || '#666666';
};

export const getDifficultyText = (difficulty: string) => {
  const textMap: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return textMap[difficulty] || difficulty;
};

export const getDifficultyColor = (difficulty: string) => {
  const colorMap: Record<string, string> = {
    easy: '#2E7D32',
    medium: '#F57C00',
    hard: '#C62828',
  };
  return colorMap[difficulty] || '#666666';
};
