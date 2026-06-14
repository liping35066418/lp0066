const PRODUCT_NAMES = {
  digital: [
    'iPhone 15 Pro Max 256GB', 'MacBook Air M3 13英寸', 'iPad Pro 12.9英寸',
    'AirPods Pro 2代', 'Apple Watch Ultra 2', '华为Mate 60 Pro',
    '小米14 Ultra', '索尼WH-1000XM5耳机', '大疆Osmo Pocket 3', '任天堂Switch OLED',
    '三星Galaxy S24 Ultra', '联想ThinkPad X1 Carbon', '戴尔XPS 15',
    '罗技MX Master 3S鼠标', 'Kindle Paperwhite 5'
  ],
  clothing: [
    '加拿大鹅Expedition派克大衣', '始祖鸟Alpha SV夹克', 'Lululemon Align瑜伽裤',
    'Nike Air Jordan 1 Retro', 'Adidas Yeezy 350 V2', '优衣库U系列圆领T恤',
    '波司登高端羽绒服', '海澜之家经典西装', '安踏KT8篮球鞋',
    '李宁音速11篮球鞋', 'CK经典平角内裤', '维多利亚的秘密文胸',
    'GAP休闲卫衣', 'ZARA时尚风衣', 'H&M牛仔外套'
  ],
  food: [
    '三只松鼠坚果大礼包', '良品铺子每日坚果', '百草味芒果干',
    '周黑鸭鸭脖礼盒', '卫龙辣条大礼包', '涪陵榨菜一箱',
    '五常大米10斤装', '金龙鱼花生油5L', '海天酱油套装',
    '蒙牛特仑苏纯牛奶', '伊利金典有机奶', '星巴克咖啡豆250g',
    '德芙巧克力礼盒', '费列罗榛果威化', '元气森林气泡水整箱'
  ],
  home: [
    '戴森V15吸尘器', '石头G20扫地机器人', '科沃斯T20擦窗机',
    '美的变频空调1.5匹', '格力空气能热水器', '海尔对开门冰箱',
    '小米空气净化器4 Pro', '飞利浦电动牙刷', '松下智能马桶盖',
    '蓝月亮洗衣液套装', '维达卷纸24卷', '舒达乳胶床垫',
    '宜家毕利书架', '无印良品收纳盒', '网易严选乳胶枕'
  ],
  beauty: [
    'SK-II神仙水230ml', '兰蔻小黑瓶肌底精华', '雅诗兰黛小棕瓶',
    '海蓝之谜经典面霜', '资生堂红腰子精华', '赫莲娜绿宝瓶',
    'YSL小金条口红', '迪奥烈艳蓝金唇膏', '香奈儿可可小姐香水',
    '纪梵希散粉', 'MAC子弹头口红', 'NARS腮红',
    '欧莱雅紫熨斗眼霜', '玉兰油小白瓶', '完美日记眼影盘'
  ]
};

const PROVINCES = [
  '北京', '上海', '广东', '江苏', '浙江', '山东', '河南', '四川',
  '湖北', '湖南', '福建', '河北', '安徽', '辽宁', '陕西', '重庆',
  '江西', '广西', '云南', '山西', '贵州', '黑龙江', '吉林', '新疆',
  '甘肃', '内蒙古', '海南', '宁夏', '青海', '西藏', '天津', '台湾',
  '香港', '澳门'
];

const PAYMENT_METHODS = [
  { name: '支付宝', weight: 45 },
  { name: '微信支付', weight: 42 },
  { name: '银行卡', weight: 8 },
  { name: '花呗分期', weight: 3 },
  { name: '京东白条', weight: 2 }
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function weightedRandom(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.name;
  }
  return items[0].name;
}

function getCategoryProducts(category) {
  if (category === 'all') {
    const all = [];
    Object.values(PRODUCT_NAMES).forEach(arr => all.push(...arr));
    return all;
  }
  return PRODUCT_NAMES[category] || PRODUCT_NAMES.digital;
}

function generateKPIData(timeRange, category) {
  const multiplier = {
    today: 1,
    yesterday: 0.95,
    '7days': 6.8,
    '30days': 28.5
  }[timeRange] || 1;

  const categoryFactor = category === 'all' ? 1 : randomFloat(0.15, 0.35);
  const baseClicks = randomBetween(850000, 1200000) * multiplier * categoryFactor;

  const cartRate = randomFloat(28, 38);
  const orderRate = randomFloat(55, 72);
  const payRate = randomFloat(82, 94);
  const avgOrderValue = randomFloat(188, 356);

  const carts = Math.floor(baseClicks * cartRate / 100);
  const orders = Math.floor(carts * orderRate / 100);
  const pays = Math.floor(orders * payRate / 100);
  const gmv = Math.floor(pays * avgOrderValue);

  return {
    clicks: Math.floor(baseClicks),
    cartRate: parseFloat(cartRate.toFixed(1)),
    orderRate: parseFloat(orderRate.toFixed(1)),
    payRate: parseFloat(payRate.toFixed(1)),
    gmv,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
    clicksChange: randomFloat(-8, 15),
    gmvChange: randomFloat(-5, 22)
  };
}

function generateFunnelData(timeRange, category) {
  const kpi = generateKPIData(timeRange, category);
  const carts = Math.floor(kpi.clicks * kpi.cartRate / 100);
  const orders = Math.floor(carts * kpi.orderRate / 100);
  const pays = Math.floor(orders * kpi.payRate / 100);

  const abnormalStage = Math.random() < 0.3 ? randomBetween(1, 3) : -1;

  return [
    {
      stage: '商品浏览',
      stageKey: 'browse',
      value: kpi.clicks,
      rate: 100,
      conversionFromPrev: 100,
      isAbnormal: abnormalStage === 0
    },
    {
      stage: '加入购物车',
      stageKey: 'cart',
      value: carts,
      rate: parseFloat(((carts / kpi.clicks) * 100).toFixed(2)),
      conversionFromPrev: kpi.cartRate,
      isAbnormal: abnormalStage === 1 || kpi.cartRate < 30
    },
    {
      stage: '提交订单',
      stageKey: 'order',
      value: orders,
      rate: parseFloat(((orders / kpi.clicks) * 100).toFixed(2)),
      conversionFromPrev: kpi.orderRate,
      isAbnormal: abnormalStage === 2 || kpi.orderRate < 58
    },
    {
      stage: '完成支付',
      stageKey: 'pay',
      value: pays,
      rate: parseFloat(((pays / kpi.clicks) * 100).toFixed(2)),
      conversionFromPrev: kpi.payRate,
      isAbnormal: abnormalStage === 3 || kpi.payRate < 85
    }
  ];
}

function generateHourlyData(timeRange, category) {
  const points = timeRange === 'today' || timeRange === 'yesterday' ? 24 :
                 timeRange === '7days' ? 7 : 30;
  
  const labels = [];
  const clicksArr = [];
  const cartsArr = [];
  const ordersArr = [];
  const paysArr = [];

  const categoryFactor = category === 'all' ? 1 : randomFloat(0.15, 0.35);

  for (let i = 0; i < points; i++) {
    let label;
    if (timeRange === 'today' || timeRange === 'yesterday') {
      label = `${String(i).padStart(2, '0')}:00`;
    } else if (timeRange === '7days') {
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      label = days[i];
    } else {
      label = `${i + 1}日`;
    }
    labels.push(label);

    let hourlyFactor = 1;
    if (timeRange === 'today' || timeRange === 'yesterday') {
      if (i >= 0 && i < 6) hourlyFactor = 0.1;
      else if (i >= 6 && i < 9) hourlyFactor = 0.5;
      else if (i >= 9 && i < 12) hourlyFactor = 1.1;
      else if (i >= 12 && i < 14) hourlyFactor = 1.3;
      else if (i >= 14 && i < 18) hourlyFactor = 1.0;
      else if (i >= 18 && i < 22) hourlyFactor = 1.5;
      else hourlyFactor = 0.8;
    } else if (timeRange === '7days') {
      hourlyFactor = i >= 5 ? 1.3 : 1.0;
    }

    const baseClicks = randomBetween(30000, 55000) * hourlyFactor * categoryFactor;
    const clicks = Math.floor(baseClicks);
    const carts = Math.floor(clicks * randomFloat(28, 38) / 100);
    const orders = Math.floor(carts * randomFloat(55, 72) / 100);
    const pays = Math.floor(orders * randomFloat(82, 94) / 100);

    clicksArr.push(clicks);
    cartsArr.push(carts);
    ordersArr.push(orders);
    paysArr.push(pays);
  }

  return { labels, clicks: clicksArr, carts: cartsArr, orders: ordersArr, pays: paysArr };
}

function generateTopProducts(timeRange, category, limit = 10) {
  const multiplier = {
    today: 1,
    yesterday: 0.95,
    '7days': 6.8,
    '30days': 28.5
  }[timeRange] || 1;

  const products = getCategoryProducts(category);
  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, limit);
  const categoryFactor = category === 'all' ? 1 : randomFloat(0.8, 1.2);

  return shuffled.map((name, idx) => {
    const rank = idx + 1;
    const rankFactor = 1 + (limit - rank) * 0.08;
    const baseClicks = randomBetween(25000, 85000) * multiplier * categoryFactor * rankFactor;
    const conversionRate = randomFloat(2, 8);
    const orders = Math.floor(baseClicks * conversionRate / 100);
    const avgPrice = randomFloat(89, 1299);
    const gmv = Math.floor(orders * avgPrice);
    
    let prodCategory = category;
    if (category === 'all') {
      const keys = Object.keys(PRODUCT_NAMES);
      prodCategory = keys[randomBetween(0, keys.length - 1)];
    }

    return {
      rank,
      id: `PROD_${String(idx + 1000).padStart(6, '0')}`,
      name,
      category: prodCategory,
      clicks: Math.floor(baseClicks),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      orders,
      gmv,
      avgPrice: parseFloat(avgPrice.toFixed(2))
    };
  }).sort((a, b) => b.gmv - a.gmv).map((p, idx) => ({ ...p, rank: idx + 1 }));
}

function generateRegionData(timeRange, category) {
  const multiplier = {
    today: 1,
    yesterday: 0.95,
    '7days': 6.8,
    '30days': 28.5
  }[timeRange] || 1;

  const categoryFactor = category === 'all' ? 1 : randomFloat(0.15, 0.35);

  return PROVINCES.map(name => {
    let regionFactor = 1;
    if (['广东', '江苏', '浙江', '上海', '北京', '山东'].includes(name)) {
      regionFactor = randomFloat(2.2, 3.5);
    } else if (['河南', '四川', '湖北', '湖南', '福建', '河北'].includes(name)) {
      regionFactor = randomFloat(1.2, 2.0);
    } else {
      regionFactor = randomFloat(0.3, 1.0);
    }

    const users = Math.floor(randomBetween(8000, 65000) * multiplier * categoryFactor * regionFactor);
    const orders = Math.floor(users * randomFloat(18, 38) / 100);
    const value = Math.floor(orders * randomFloat(180, 320));

    return { name, value, users, orders };
  }).sort((a, b) => b.value - a.value);
}

function generatePaymentData(timeRange, category) {
  const multiplier = {
    today: 1,
    yesterday: 0.95,
    '7days': 6.8,
    '30days': 28.5
  }[timeRange] || 1;

  const categoryFactor = category === 'all' ? 1 : randomFloat(0.15, 0.35);
  const totalGMV = randomBetween(45000000, 78000000) * multiplier * categoryFactor;

  let totalWeight = PAYMENT_METHODS.reduce((sum, p) => sum + p.weight, 0);
  let cumulative = 0;

  return PAYMENT_METHODS.map(p => {
    const value = Math.floor(totalGMV * p.weight / totalWeight);
    cumulative += p.weight;
    return {
      name: p.name,
      value,
      percentage: parseFloat((p.weight / totalWeight * 100).toFixed(1))
    };
  });
}

function generateDetailData(type, params, page = 1, pageSize = 20) {
  const items = [];
  const total = randomBetween(150, 480);

  for (let i = 0; i < pageSize; i++) {
    const globalIdx = (page - 1) * pageSize + i;
    if (globalIdx >= total) break;

    if (type === 'funnel') {
      items.push({
        id: `EVT_${Date.now()}_${i}`,
        userId: `U${String(randomBetween(100000, 999999))}`,
        userName: ['用户小明', '快乐购物狂', '剁手党', '理性消费者', 'VIP会员888'][randomBetween(0, 4)],
        stage: params.stage || '加购',
        productName: getCategoryProducts(params.category || 'all')[randomBetween(0, 70)],
        time: `${randomBetween(0, 23).toString().padStart(2, '0')}:${String(randomBetween(0, 59)).padStart(2, '0')}:${String(randomBetween(0, 59)).padStart(2, '0')}`,
        device: ['iOS', 'Android', 'PC', '小程序'][randomBetween(0, 3)],
        duration: `${randomBetween(5, 600)}秒`
      });
    } else if (type === 'product') {
      items.push({
        id: `ORD_${Date.now()}_${i}`,
        orderNo: `DD${20260615}${String(randomBetween(100000, 999999))}`,
        userId: `U${String(randomBetween(100000, 999999))}`,
        specs: ['标准版', '豪华版', '套装版', '限定版'][randomBetween(0, 3)],
        quantity: randomBetween(1, 5),
        unitPrice: randomBetween(89, 2999),
        status: ['待付款', '已付款', '已发货', '已完成', '已退款'][randomBetween(0, 4)],
        payMethod: weightedRandom(PAYMENT_METHODS),
        orderTime: `2026-06-${String(randomBetween(1, 15)).padStart(2, '0')} ${String(randomBetween(0, 23)).padStart(2, '0')}:${String(randomBetween(0, 59)).padStart(2, '0')}`
      });
    } else if (type === 'region') {
      items.push({
        id: `REG_${Date.now()}_${i}`,
        city: ['市辖区', '郊区', '县级市', '开发区', '高新区'][randomBetween(0, 4)],
        district: ['朝阳区', '海淀区', '天河区', '南山区', '浦东新区', '西湖区'][randomBetween(0, 5)],
        newUsers: randomBetween(100, 2500),
        activeUsers: randomBetween(5000, 35000),
        orders: randomBetween(800, 12000),
        avgOrderValue: randomBetween(150, 480),
        conversionRate: parseFloat(randomFloat(1.5, 7.8).toFixed(2))
      });
    }
  }

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

export {
  generateKPIData,
  generateFunnelData,
  generateHourlyData,
  generateTopProducts,
  generateRegionData,
  generatePaymentData,
  generateDetailData
};
