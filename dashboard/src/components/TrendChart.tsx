import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

export function TrendChart() {
  const { hourlyData } = useDashboardStore();
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    clicks: true,
    carts: true,
    orders: true,
    pays: true
  });

  const toggleSeries = (key: string) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const legendItems = [
    { key: 'clicks', name: '点击量', color: '#00d4ff' },
    { key: 'carts', name: '加购量', color: '#8b5cf6' },
    { key: 'orders', name: '下单量', color: '#ffd93d' },
    { key: 'pays', name: '支付量', color: '#00ff88' },
  ];

  const option = useMemo(() => {
    if (!hourlyData) return {};

    const seriesConfig = [
      { key: 'clicks', name: '点击量', color: '#00d4ff', areaOpacity: 0.15 },
      { key: 'carts', name: '加购量', color: '#8b5cf6', areaOpacity: 0.12 },
      { key: 'orders', name: '下单量', color: '#ffd93d', areaOpacity: 0.1 },
      { key: 'pays', name: '支付量', color: '#00ff88', areaOpacity: 0.15 },
    ];

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(13, 27, 53, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        borderWidth: 1,
        textStyle: { color: '#fff', fontFamily: 'Rajdhani', fontSize: 12 },
        axisPointer: {
          type: 'cross',
          lineStyle: { color: 'rgba(0, 212, 255, 0.4)' },
          crossStyle: { color: 'rgba(0, 212, 255, 0.4)' }
        }
      },
      grid: {
        left: 50,
        right: 30,
        top: 40,
        bottom: 35
      },
      xAxis: {
        type: 'category',
        data: hourlyData.labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.3)' } },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          fontFamily: 'Rajdhani',
          interval: 'auto'
        },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(0, 212, 255, 0.06)', type: 'dashed' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          fontFamily: 'Rajdhani',
          formatter: (val: number) => {
            if (val >= 10000) return (val / 10000).toFixed(1) + 'w';
            return val.toString();
          }
        },
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(0, 212, 255, 0.08)', type: 'dashed' }
        }
      },
      series: seriesConfig
        .filter(cfg => visibleSeries[cfg.key])
        .map(cfg => ({
          name: cfg.name,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          data: (hourlyData as any)[cfg.key],
          lineStyle: {
            width: 2.5,
            color: cfg.color,
            shadowBlur: 10,
            shadowColor: cfg.color
          },
          itemStyle: {
            color: cfg.color,
            borderColor: '#0a1628',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: cfg.color + (Math.floor(cfg.areaOpacity * 255)).toString(16).padStart(2, '0') },
                { offset: 1, color: cfg.color + '00' }
              ]
            }
          },
          emphasis: {
            focus: 'series',
            itemStyle: { symbolSize: 8, shadowBlur: 15, shadowColor: cfg.color }
          }
        }))
    };
  }, [hourlyData, visibleSeries]);

  if (!hourlyData) {
    return (
      <div className="glass-card corner-decor h-full p-5">
        <div className="animate-pulse h-10 bg-white/5 rounded-lg mb-4" />
        <div className="animate-pulse h-[calc(100%-60px)] bg-white/5 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="glass-card corner-decor p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-blue/15 flex items-center justify-center">
            <Activity className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h3 className="tech-title text-base">分时流量趋势</h3>
            <p className="text-xs text-white/45 font-display mt-0.5">
              共 {hourlyData.labels.length} 个数据节点
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {legendItems.map(item => (
            <button
              key={item.key}
              onClick={() => toggleSeries(item.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-display transition-all
                ${visibleSeries[item.key]
                  ? 'bg-white/5 border border-white/10'
                  : 'opacity-40 hover:opacity-70'
                }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: visibleSeries[item.key] ? item.color : 'rgba(255,255,255,0.2)',
                  boxShadow: visibleSeries[item.key] ? `0 0 6px ${item.color}` : 'none'
                }}
              />
              <span style={{ color: visibleSeries[item.key] ? item.color : 'rgba(255,255,255,0.4)' }}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
}
