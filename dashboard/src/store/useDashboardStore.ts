import { create } from 'zustand';
import { apiService } from '@/services/api';
import type { DashboardStore, TimeRange, Category, DetailType, DetailResponse } from '@/types';

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  timeRange: 'today',
  category: 'all',
  kpiData: null,
  funnelData: [],
  hourlyData: null,
  topProducts: [],
  regionData: [],
  paymentData: [],
  detailModal: {
    open: false,
    type: null,
    title: '',
    params: {}
  },
  lastUpdate: 0,

  setTimeRange: (t: TimeRange) => {
    set({ timeRange: t });
    get().fetchAllData();
  },

  setCategory: (c: Category) => {
    set({ category: c });
    get().fetchAllData();
  },

  fetchAllData: async () => {
    const { timeRange, category } = get();
    try {
      const [kpi, funnel, hourly, products, regions, payments] = await Promise.all([
        apiService.getKPI(timeRange, category),
        apiService.getFunnel(timeRange, category),
        apiService.getHourly(timeRange, category),
        apiService.getTopProducts(timeRange, category, 10),
        apiService.getRegions(timeRange, category),
        apiService.getPayments(timeRange, category)
      ]);
      set({
        kpiData: kpi,
        funnelData: funnel,
        hourlyData: hourly,
        topProducts: products,
        regionData: regions,
        paymentData: payments,
        lastUpdate: Date.now()
      });
    } catch (err) {
      console.error('数据加载失败:', err);
    }
  },

  openDetail: (type: DetailType, title: string, params: Record<string, any>) => {
    set({
      detailModal: {
        open: true,
        type,
        title,
        params
      }
    });
  },

  closeDetail: () => {
    set({
      detailModal: {
        open: false,
        type: null,
        title: '',
        params: {}
      }
    });
  },

  fetchDetailData: async (page = 1): Promise<DetailResponse | null> => {
    const { detailModal, timeRange, category } = get();
    const { type, params } = detailModal;
    if (!type) return null;

    try {
      if (type === 'funnel') {
        return await apiService.getFunnelDetails(
          params.stage || '',
          timeRange,
          category,
          page,
          10
        );
      } else if (type === 'product') {
        return await apiService.getProductDetails(
          params.productId || '',
          timeRange,
          page,
          10
        );
      } else if (type === 'region') {
        return await apiService.getRegionDetails(
          params.region || '',
          timeRange,
          category,
          page,
          10
        );
      }
      return null;
    } catch (err) {
      console.error('明细数据加载失败:', err);
      return null;
    }
  }
}));
