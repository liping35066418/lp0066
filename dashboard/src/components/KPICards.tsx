import { useEffect, useState } from 'react';
import { MousePointer2, ShoppingCart, FileCheck, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className = '', duration = 1000 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * easeOut;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = display.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return <span className={`animate-number ${className}`}>{prefix}{formatted}{suffix}</span>;
}

interface KPIConfig {
  key: string;
  label: string;
  getValue: (data: any) => number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: any;
  showChange?: boolean;
  getChange?: (data: any) => number;
}

const KPIS: KPIConfig[] = [
  {
    key: 'clicks',
    label: '商品点击量',
    getValue: d => d.clicks,
    color: 'text-neon-blue',
    icon: MousePointer2,
    showChange: true,
    getChange: d => d.clicksChange
  },
  {
    key: 'cartRate',
    label: '加购转化率',
    getValue: d => d.cartRate,
    decimals: 1,
    suffix: '%',
    color: 'text-neon-purple',
    icon: ShoppingCart
  },
  {
    key: 'orderRate',
    label: '下单转化率',
    getValue: d => d.orderRate,
    decimals: 1,
    suffix: '%',
    color: 'text-neon-yellow',
    icon: FileCheck
  },
  {
    key: 'payRate',
    label: '支付成功率',
    getValue: d => d.payRate,
    decimals: 1,
    suffix: '%',
    color: 'text-neon-green',
    icon: CreditCard
  },
  {
    key: 'gmv',
    label: '成交金额 (GMV)',
    getValue: d => d.gmv,
    prefix: '¥',
    color: 'text-neon-orange',
    icon: TrendingUp,
    showChange: true,
    getChange: d => d.gmvChange
  }
];

export function KPICards() {
  const { kpiData } = useDashboardStore();

  if (!kpiData) {
    return (
      <div className="grid grid-cols-5 gap-4 px-6 mb-6">
        {KPIS.map(kpi => (
          <div key={kpi.key} className="glass-card h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4 px-6 mb-6">
      {KPIS.map((kpi, idx) => {
        const Icon = kpi.icon;
        const value = kpi.getValue(kpiData);
        const changeVal = kpi.showChange && kpi.getChange ? kpi.getChange(kpiData) : null;
        const isPositive = changeVal !== null && changeVal >= 0;

        return (
          <div
            key={kpi.key}
            className="glass-card corner-decor p-5 hover:scale-[1.02] transition-transform cursor-default"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.color} bg-white/5`}>
                <Icon className="w-6 h-6" style={{ filter: `drop-shadow(0 0 8px currentColor)` }} />
              </div>
              {kpi.showChange && changeVal !== null && (
                <div className={`flex items-center gap-1 text-xs font-display font-semibold px-2 py-1 rounded-md
                  ${isPositive ? 'bg-neon-green/15 text-neon-green' : 'bg-neon-red/15 text-neon-red'}`}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{isPositive ? '+' : ''}{changeVal.toFixed(1)}%</span>
                </div>
              )}
            </div>

            <div className={`kpi-number text-3xl ${kpi.color} mb-1`}>
              <AnimatedNumber
                value={value}
                decimals={kpi.decimals || 0}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
              />
            </div>
            <div className="text-sm text-white/55 font-display">{kpi.label}</div>
          </div>
        );
      })}
    </div>
  );
}
