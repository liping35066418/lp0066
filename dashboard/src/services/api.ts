import axios from 'axios';
import type {
  KPIData,
  FunnelData,
  HourlyData,
  TopProduct,
  RegionData,
  PaymentData,
  TimeRange,
  Category,
  DetailResponse
} from '@/types';

const BASE_URL = 'http://localhost:8756/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.response.use(
  (response) => {
    if (response.data.code === 0) {
      return response.data.data;
    }
    return Promise.reject(new Error(response.data.message || '请求失败'));
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  getKPI: (timeRange: TimeRange, category: Category): Promise<KPIData> =>
    api.get('/kpi', { params: { timeRange, category } }),

  getFunnel: (timeRange: TimeRange, category: Category): Promise<FunnelData[]> =>
    api.get('/funnel', { params: { timeRange, category } }),

  getHourly: (timeRange: TimeRange, category: Category): Promise<HourlyData> =>
    api.get('/hourly', { params: { timeRange, category } }),

  getTopProducts: (timeRange: TimeRange, category: Category, limit = 10): Promise<TopProduct[]> =>
    api.get('/products/top', { params: { timeRange, category, limit } }),

  getRegions: (timeRange: TimeRange, category: Category): Promise<RegionData[]> =>
    api.get('/regions', { params: { timeRange, category } }),

  getPayments: (timeRange: TimeRange, category: Category): Promise<PaymentData[]> =>
    api.get('/payments', { params: { timeRange, category } }),

  getFunnelDetails: (
    stage: string,
    timeRange: TimeRange,
    category: Category,
    page = 1,
    pageSize = 20
  ): Promise<DetailResponse> =>
    api.get('/details/funnel', {
      params: { stage, timeRange, category, page, pageSize }
    }),

  getProductDetails: (
    productId: string,
    timeRange: TimeRange,
    page = 1,
    pageSize = 20
  ): Promise<DetailResponse> =>
    api.get('/details/product', {
      params: { productId, timeRange, page, pageSize }
    }),

  getRegionDetails: (
    region: string,
    timeRange: TimeRange,
    category: Category,
    page = 1,
    pageSize = 20
  ): Promise<DetailResponse> =>
    api.get('/details/region', {
      params: { region, timeRange, category, page, pageSize }
    })
};
