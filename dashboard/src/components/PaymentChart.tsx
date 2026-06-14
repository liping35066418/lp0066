import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CreditCard, PieChart } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { PaymentData } from '@/types';

const METHOD_COLORS: Record<string, string> = {
  '支付宝': '#1677ff',
  '微信支付': '#07c160',
  '银行卡': '#ff9500',
  '花呗分期': '#ff4d4f',
  '京东白条': '#e4393c'
};

function formatMoney(n: number) {
  if (n >= 100000000) return '¥' + (n / 100000000).toFixed(2) + '亿';
  if (n >= 10000) return '¥' + (n / 10000).toFixed(1) + '万';
  return '¥' + n.toLocaleString('zh-CN');
}

export function PaymentChart() {
  const { paymentData } = useDashboardStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalValue = useMemo(() => {
    return paymentData.reduce((s, p) => s + p.value, 0);
  }, [paymentData]);

  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(13, 27, 53, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        borderWidth: 1,
        textStyle: { color: '#fff', fontFamily: 'Rajdhani', fontSize: 12 },
        formatter: (params: any) => {
          const data = paymentData[params.dataIndex];
          if (!data) return '';
          return `
            <div style="padding:4px 0">
              <div style="font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:6px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${METHOD_COLORS[data.name] || '#00d4ff'}"></span>
                <span style="color:${METHOD_COLORS[data.name] || '#00d4ff'}">${data.name}</span>
              </div>
              <div style="display:grid;gap:3px;font-size:11px;color:rgba(255,255,255,0.75)">
                <div>金额: <b style="color:#ff6b35">${formatMoney(data.value)}</b></div>
                <div>占比: <b style="color:#00d4ff">${data.percentage}%</b></div>
              </div>
            </div>
          `;
        }
      },
      series: [
        {
          name: '支付方式',
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: 'rgba(10, 22, 40, 0.9)',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 25,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 212, 255, 0.5)'
            },
            label: {
              show: true,
              position: 'center',
              formatter: (params: any) => {
                const data = paymentData[params.dataIndex];
                if (!data) return '';
                return `{name|${data.name}}\n{val|${formatMoney(data.value)}}\n{pct|${data.percentage}%}`;
              },
              rich: {
                name: {
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'Rajdhani',
                  padding: [0, 0, 4, 0]
                },
                val: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#ff6b35',
                  fontFamily: 'Orbitron',
                  padding: [4, 0, 4, 0]
                },
                pct: {
                  fontSize: 12,
                  color: '#00d4ff',
                  fontFamily: 'Rajdhani',
                  padding: [4, 0, 0, 0]
                }
              }
            }
          },
          labelLine: { show: false },
          data: paymentData.map((p, idx) => ({
            name: p.name,
            value: p.value,
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.8,
                colorStops: [
                  { offset: 0, color: METHOD_COLORS[p.name] || '#00d4ff' },
                  { offset: 1, color: (METHOD_COLORS[p.name] || '#00d4ff') + '88' }
                ]
              }
            }
          }))
        }
      ],
      graphic: {
        type: 'group',
        left: 'center',
        top: 'center',
        children: hoveredIndex === null ? [
          {
            type: 'text',
            top: -18,
            style: {
              text: '总金额',
              textAlign: 'center',
              fill: 'rgba(255,255,255,0.45)',
              fontSize: 12,
              fontFamily: 'Rajdhani'
            }
          },
          {
            type: 'text',
            top: 0,
            style: {
              text: formatMoney(totalValue),
              textAlign: 'center',
              fill: '#ff6b35',
              fontSize: 19,
              fontWeight: 700,
              fontFamily: 'Orbitron'
            }
          },
          {
            type: 'text',
            top: 25,
            style: {
              text: `${paymentData.length} 种支付方式`,
              textAlign: 'center',
              fill: 'rgba(255,255,255,0.35)',
              fontSize: 11,
              fontFamily: 'Rajdhani'
            }
          }
        ] : []
      }
    };
  }, [paymentData, totalValue, hoveredIndex]);

  const sortedData = useMemo(() => {
    return [...paymentData].sort((a, b) => b.value - a.value);
  }, [paymentData]);

  return (
    <div className="glass-card corner-decor p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-purple/15 flex items-center justify-center border border-neon-purple/30">
            <PieChart className="w-5 h-5 text-neon-purple" />
          </div>
          <div>
            <h3 className="tech-title text-base">支付方式占比</h3>
            <p className="text-xs text-white/45 font-display mt-0.5">
              总额 {formatMoney(totalValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            onEvents={{
              mouseover: (params: any) => setHoveredIndex(params.dataIndex),
              mouseout: () => setHoveredIndex(null)
            }}
          />
        </div>

        <div className="w-40 flex-shrink-0 flex flex-col justify-center space-y-3">
          {sortedData.map((method, idx) => {
            const origIdx = paymentData.findIndex(p => p.name === method.name);
            const isHovered = hoveredIndex === origIdx;
            return (
              <div
                key={method.name}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-default
                  ${isHovered ? 'bg-white/10' : ''}`}
                style={{
                  transform: isHovered ? 'translateX(4px)' : 'none'
                }}
              >
                <div
                  className="w-3 h-3 rounded-md flex-shrink-0"
                  style={{
                    backgroundColor: METHOD_COLORS[method.name] || '#00d4ff',
                    boxShadow: isHovered ? `0 0 10px ${METHOD_COLORS[method.name] || '#00d4ff'}` : 'none'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display text-white/75 truncate">
                      {method.name}
                    </span>
                    <span
                      className="text-xs font-tech font-bold ml-1"
                      style={{ color: METHOD_COLORS[method.name] || '#00d4ff' }}
                    >
                      {method.percentage}%
                    </span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${method.percentage}%`,
                        backgroundColor: METHOD_COLORS[method.name] || '#00d4ff'
                      }}
                    />
                  </div>
                </div>
                {idx === 0 && (
                  <CreditCard className="w-3 h-3 text-neon-yellow flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
