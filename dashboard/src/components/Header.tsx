import { useState, useEffect } from 'react';
import { Clock, Calendar, LayoutGrid, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { TimeRange, Category } from '@/types';

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: '7days', label: '近7天' },
  { value: '30days', label: '近30天' },
];

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'all', label: '全品类' },
  { value: 'digital', label: '数码电子' },
  { value: 'clothing', label: '服饰鞋包' },
  { value: 'food', label: '食品生鲜' },
  { value: 'home', label: '家居日用' },
  { value: 'beauty', label: '美妆个护' },
];

export function Header() {
  const { timeRange, category, setTimeRange, setCategory, lastUpdate, funnelData } = useDashboardStore();
  const [now, setNow] = useState(new Date());
  const [showCategory, setShowCategory] = useState(false);

  const abnormalCount = funnelData.filter(f => f.isAbnormal).length;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('zh-CN', { hour12: false });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
  };

  return (
    <header className="relative z-10 px-6 py-4">
      <div className="glass-card corner-decor px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-neon">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="tech-title text-2xl">全链路转化监控大屏</h1>
                <p className="text-xs text-white/50 font-display mt-0.5">REAL-TIME CONVERSION DASHBOARD</p>
              </div>
            </div>

            {abnormalCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-red/15 border border-neon-red/40 abnormal-highlight ml-4">
                <AlertTriangle className="w-4 h-4 text-neon-red" />
                <span className="text-neon-red text-sm font-semibold font-display">
                  {abnormalCount} 个转化异常节点
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-glass-light border border-neon-green/30">
              <RefreshCw className="w-4 h-4 text-neon-green animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-neon-green text-sm font-display">
                实时更新 · {formatTime(new Date(lastUpdate))}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neon-blue" />
              <div className="text-right">
                <div className="font-tech text-xl text-neon-blue leading-none tracking-wider">
                  {formatTime(now)}
                </div>
                <div className="flex items-center gap-1 text-xs text-white/60 font-display mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(now)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-neon-blue/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60 font-display mr-2">统计时段:</span>
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`btn-glass text-sm ${timeRange === opt.value ? 'btn-glass-active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCategory(!showCategory)}
              className="btn-glass flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span>{CATEGORY_OPTIONS.find(c => c.value === category)?.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showCategory ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCategory && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategory(false)} />
                <div className="absolute top-full right-0 mt-2 w-44 z-50 glass-card py-2 shadow-neon-lg">
                  {CATEGORY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setCategory(opt.value);
                        setShowCategory(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-display transition-colors
                        ${category === opt.value
                          ? 'bg-neon-blue/25 text-neon-blue'
                          : 'text-white/70 hover:bg-neon-blue/10 hover:text-white'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
