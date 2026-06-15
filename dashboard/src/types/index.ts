export type TimeRange = 'today' | 'yesterday' | '7days' | '30days';
export type Category = 'all' | 'digital' | 'clothing' | 'food' | 'home' | 'beauty';
export type DetailType = 'funnel' | 'product' | 'region' | null;
export type ProductSortBy = 'gmv' | 'clicks' | 'conversionRate';

export interface FunnelData {
  stage: string;
  stageKey: string;
  value: number;
  rate: number;
  conversionFromPrev: number;
  isAbnormal: boolean;
}

export interface KPIData {
  clicks: number;
  cartRate: number;
  orderRate: number;
  payRate: number;
  gmv: number;
  avgOrderValue: number;
  clicksChange: number;
  gmvChange: number;
}

export interface HourlyData {
  labels: string[];
  clicks: number[];
  carts: number[];
  orders: number[];
  pays: number[];
}

export interface TopProduct {
  rank: number;
  id: string;
  name: string;
  category: string;
  clicks: number;
  conversionRate: number;
  orders: number;
  gmv: number;
  avgPrice: number;
}

export interface RegionData {
  name: string;
  value: number;
  users: number;
  orders: number;
}

export interface PaymentData {
  name: string;
  value: number;
  percentage: number;
}

export interface DetailItem {
  id: string;
  [key: string]: any;
}

export interface DetailResponse {
  items: DetailItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DetailModalState {
  open: boolean;
  type: DetailType;
  title: string;
  params: Record<string, any>;
}

export interface DashboardStore {
  timeRange: TimeRange;
  category: Category;
  productSortBy: ProductSortBy;
  kpiData: KPIData | null;
  funnelData: FunnelData[];
  hourlyData: HourlyData | null;
  topProducts: TopProduct[];
  regionData: RegionData[];
  paymentData: PaymentData[];
  detailModal: DetailModalState;
  lastUpdate: number;
  setTimeRange: (t: TimeRange) => void;
  setCategory: (c: Category) => void;
  setProductSortBy: (s: ProductSortBy) => void;
  fetchAllData: () => Promise<void>;
  openDetail: (type: DetailType, title: string, params: Record<string, any>) => void;
  closeDetail: () => void;
  fetchDetailData: (page?: number) => Promise<DetailResponse | null>;
}
