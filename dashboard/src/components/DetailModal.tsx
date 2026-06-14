import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { DetailItem, DetailResponse } from '@/types';

const FUNNEL_COLUMNS = [
  { key: 'userId', label: '用户ID' },
  { key: 'userName', label: '用户昵称' },
  { key: 'productName', label: '商品名称' },
  { key: 'device', label: '设备' },
  { key: 'duration', label: '停留时长' },
  { key: 'time', label: '发生时间' },
];

const PRODUCT_COLUMNS = [
  { key: 'orderNo', label: '订单号' },
  { key: 'userId', label: '用户ID' },
  { key: 'specs', label: '规格' },
  { key: 'quantity', label: '数量' },
  { key: 'unitPrice', label: '单价(¥)' },
  { key: 'payMethod', label: '支付方式' },
  { key: 'status', label: '状态' },
  { key: 'orderTime', label: '下单时间' },
];

const REGION_COLUMNS = [
  { key: 'city', label: '城市/区域' },
  { key: 'district', label: '区县' },
  { key: 'newUsers', label: '新增用户' },
  { key: 'activeUsers', label: '活跃用户' },
  { key: 'orders', label: '订单数' },
  { key: 'avgOrderValue', label: '客单价(¥)' },
  { key: 'conversionRate', label: '转化率(%)' },
];

function getColumns(type: string) {
  switch (type) {
    case 'funnel': return FUNNEL_COLUMNS;
    case 'product': return PRODUCT_COLUMNS;
    case 'region': return REGION_COLUMNS;
    default: return [];
  }
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    '待付款': 'bg-neon-yellow/15 text-neon-yellow border-neon-yellow/30',
    '已付款': 'bg-neon-blue/15 text-neon-blue border-neon-blue/30',
    '已发货': 'bg-neon-purple/15 text-neon-purple border-neon-purple/30',
    '已完成': 'bg-neon-green/15 text-neon-green border-neon-green/30',
    '已退款': 'bg-neon-red/15 text-neon-red border-neon-red/30',
  };
  return map[status] || 'bg-white/10 text-white/60';
}

export function DetailModal() {
  const { detailModal, closeDetail, fetchDetailData } = useDashboardStore();
  const { open, type, title, params } = detailModal;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DetailResponse | null>(null);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (open && type) {
      setPage(1);
      loadData(1);
    }
  }, [open, type, JSON.stringify(params)]);

  const loadData = async (p: number) => {
    setLoading(true);
    setPage(p);
    const result = await fetchDetailData(p);
    setData(result);
    setLoading(false);
  };

  const filteredItems = (data?.items || []).filter(item => {
    if (!searchText.trim()) return true;
    const search = searchText.toLowerCase();
    return Object.values(item).some(v =>
      String(v).toLowerCase().includes(search)
    );
  });

  if (!open) return null;

  const columns = getColumns(type || '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeDetail}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="relative w-full max-w-6xl max-h-[85vh] glass-card corner-decor flex flex-col"
        style={{
          animation: 'modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none overflow-hidden opacity-40">
          <div
            className="absolute inset-0 bg-gradient-to-b from-neon-blue/20 to-transparent animate-scan"
          />
        </div>

        <div className="flex items-center justify-between px-6 py-5 border-b border-neon-blue/15 flex-shrink-0">
          <div>
            <h2 className="tech-title text-xl">{title}</h2>
            {data && (
              <p className="text-xs text-white/45 font-display mt-1">
                共 <span className="text-neon-blue">{data.total}</span> 条记录 · 
                第 <span className="text-neon-green">{page}</span> / {data.totalPages} 页
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="搜索结果..."
                className="pl-9 pr-4 py-2 rounded-lg bg-glass-light border border-neon-blue/20 text-sm
                  font-display text-white placeholder:text-white/30 outline-none
                  focus:border-neon-blue/50 focus:shadow-neon transition-all w-56"
              />
            </div>

            <button
              onClick={closeDetail}
              className="w-9 h-9 rounded-lg bg-glass-light border border-white/10 flex items-center justify-center
                text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-custom px-6 py-4 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/40">
              <Search className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-display text-sm">暂无匹配数据</p>
            </div>
          ) : (
            <table className="w-full data-table text-sm">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="text-left w-12">#</th>
                  {columns.map(col => (
                    <th key={col.key} className="text-left">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="text-white/40 font-tech text-xs">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    {columns.map(col => {
                      const val = item[col.key];
                      if (col.key === 'status') {
                        return (
                          <td key={col.key}>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold border ${getStatusColor(String(val))}`}>
                              {val}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td key={col.key} className="font-display">
                          {typeof val === 'number' ? val.toLocaleString('zh-CN') : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neon-blue/15 flex-shrink-0">
            <div className="text-xs text-white/45 font-display">
              显示 {(page - 1) * 10 + 1} - {Math.min(page * 10, data.total)} 条
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadData(page - 1)}
                disabled={page <= 1 || loading}
                className="btn-glass text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一页</span>
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let p: number;
                  if (data.totalPages <= 5) {
                    p = i + 1;
                  } else if (page <= 3) {
                    p = i + 1;
                  } else if (page >= data.totalPages - 2) {
                    p = data.totalPages - 4 + i;
                  } else {
                    p = page - 2 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => loadData(p)}
                      className={`w-9 h-9 rounded-md text-sm font-tech font-bold transition-all
                        ${page === p
                          ? 'bg-neon-blue/30 border border-neon-blue/50 text-neon-blue shadow-neon'
                          : 'bg-glass-light border border-transparent text-white/60 hover:text-white hover:border-white/20'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => loadData(page + 1)}
                disabled={page >= data.totalPages || loading}
                className="btn-glass text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>下一页</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
