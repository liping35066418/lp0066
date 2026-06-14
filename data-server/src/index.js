import express from 'express';
import cors from 'cors';
import {
  generateKPIData,
  generateFunnelData,
  generateHourlyData,
  generateTopProducts,
  generateRegionData,
  generatePaymentData,
  generateDetailData
} from './generators/index.js';

const app = express();
const PORT = 8756;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const validTimeRanges = ['today', 'yesterday', '7days', '30days'];
const validCategories = ['all', 'digital', 'clothing', 'food', 'home', 'beauty'];

function getQueryParams(req) {
  const timeRange = validTimeRanges.includes(req.query.timeRange) ? req.query.timeRange : 'today';
  const category = validCategories.includes(req.query.category) ? req.query.category : 'all';
  return { timeRange, category };
}

function successResponse(data, message = 'success') {
  return {
    code: 0,
    message,
    timestamp: Date.now(),
    data
  };
}

app.get('/api/health', (req, res) => {
  res.json(successResponse({ status: 'online', port: PORT, uptime: process.uptime() }));
});

app.get('/api/kpi', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const data = generateKPIData(timeRange, category);
  res.json(successResponse(data));
});

app.get('/api/funnel', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const data = generateFunnelData(timeRange, category);
  res.json(successResponse(data));
});

app.get('/api/hourly', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const data = generateHourlyData(timeRange, category);
  res.json(successResponse(data));
});

app.get('/api/products/top', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const data = generateTopProducts(timeRange, category, limit);
  res.json(successResponse(data));
});

app.get('/api/regions', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const data = generateRegionData(timeRange, category);
  res.json(successResponse(data));
});

app.get('/api/payments', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const data = generatePaymentData(timeRange, category);
  res.json(successResponse(data));
});

app.get('/api/details/funnel', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const stage = req.query.stage || '';
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, parseInt(req.query.pageSize) || 20);
  const data = generateDetailData('funnel', { stage, category, timeRange }, page, pageSize);
  res.json(successResponse(data));
});

app.get('/api/details/product', (req, res) => {
  const { timeRange } = getQueryParams(req);
  const productId = req.query.productId || '';
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, parseInt(req.query.pageSize) || 20);
  const data = generateDetailData('product', { productId, timeRange }, page, pageSize);
  res.json(successResponse(data));
});

app.get('/api/details/region', (req, res) => {
  const { timeRange, category } = getQueryParams(req);
  const region = req.query.region || '';
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, parseInt(req.query.pageSize) || 20);
  const data = generateDetailData('region', { region, category, timeRange }, page, pageSize);
  res.json(successResponse(data));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`  数据运算服务已启动`);
  console.log(`  端口: ${PORT}`);
  console.log(`  健康检查: http://localhost:${PORT}/api/health`);
  console.log(`  启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`========================================`);
});

export default app;
