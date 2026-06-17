export default defineAppConfig({
  pages: [
    'pages/pattern/index',
    'pages/order/index',
    'pages/workshop/index',
    'pages/ledger/index',
    'pages/pattern-detail/index',
    'pages/order-detail/index',
    'pages/customer-detail/index',
    'pages/product-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '苗银锻造坊',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F5F5'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#8B0000',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/pattern/index',
        text: '款式库'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      },
      {
        pagePath: 'pages/workshop/index',
        text: '工坊'
      },
      {
        pagePath: 'pages/ledger/index',
        text: '台账'
      }
    ]
  }
})
