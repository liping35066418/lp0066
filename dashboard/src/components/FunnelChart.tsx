import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';

export function FunnelChart() {
  const { funnelData, openDetail } = useDashboardStore();

  const abnormalStages = funnelData.filter(f => f.isAbnormal);

  const option = useMemo(() => {
    const colors = [
      ['rgba(0, 212, 255, 0.95)', 'rgba(0, 212, 255, 0.35)'],
      ['rgba(139, 92, 246, 0.95)', 'rgba(139, 92, 246, 0.35)'],
      ['rgba(255, 217, 61, 0.95)', 'rgba(255, 217, 61, 0.35)'],
      ['rgba(0, 255, 136, 0.95)', 'rgba(0, 255, 136, 0.35)'],
    ];

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(13, 27, 53, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        borderWidth: 1,
        textStyle: { color: '#fff', fontFamily: 'Rajdhani' },
        formatter: (params: any) => {
          const data = funnelData[params.dataIndex];
          if (!data) return '';
          const abnormalBadge = data.isAbnormal ? '<span style="color:#ff3b5c">⚠ 异常</span>' : '';
          return `
            <div style="padding:4px 0">
              <div style="font-weight:600;font-size:14px;margin-bottom:8px;display:flex;align-items:center;gap:6px">
                ${params.name} ${abnormalBadge}
              </div>
              <div style="display:grid;gap:4px;font-size:12px;color:rgba(255,255,255,0.75)">
                <div>数量: <b style="color:#00d4ff">${data.value.toLocaleString('zh-CN')}</b></div>
                <div>总体转化: <b style="color:#00ff88">${data.rate.toFixed(2)}%</b></div>
                <div>环节转化: <b style="color:#ffd93d">${data.conversionFromPrev.toFixed(1)}%</b></div>
              </div>
            </div>
          `;
        }
      },
      series: [
        {
          name: '转化漏斗',
          type: 'funnel',
          left: '8%',
          right: '8%',
          top: 40,
          bottom: 20,
          minSize: '30%',
          maxSize: '100%',
          gap: 4,
          sort: 'descending',
          label: {
            show: true,
            position: 'inside',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'Rajdhani',
            color: '#fff',
            formatter: (params: any) => {
              const data = funnelData[params.dataIndex];
              return `${params.name}\n${data?.value.toLocaleString('zh-CN') || ''}`;
            }
          },
          labelLine: { show: false },
          itemStyle: {
            borderColor: 'rgba(0, 212, 255, 0.5)',
            borderWidth: 1,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 212, 255, 0.3)'
          },
          emphasis: {
            label: { fontSize: 16 },
            itemStyle: {
              shadowBlur: 40,
              shadowColor: 'rgba(0, 212, 255, 0.6)'
            }
          },
          data: funnelData.map((item, idx) => ({
            name: item.stage,
            value: item.value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: item.isAbnormal ? '#ff3b5c' : colors[idx][0] },
                  { offset: 1, color: item.isAbnormal ? 'rgba(255,59,92,0.4)' : colors[idx][1] }
                ]
              },
              borderColor: item.isAbnormal ? '#ff3b5c' : 'rgba(0, 212, 255, 0.5)',
              shadowColor: item.isAbnormal ? 'rgba(255,59,92,0.6)' : undefined,
              shadowBlur: item.isAbnormal ? 30 : undefined
            }
          }))
        }
      ],
      graphic: funnelData.map((item, idx) => {
        if (idx === 0) return null;
        const prev = funnelData[idx - 1];
        const convRate = item.conversionFromPrev;
        const isAbnormalConv = item.isAbnormal;
        return {
          type: 'text',
          right: 8,
          top: 55 + idx * 58,
          style: {
            text: `转化率 ${convRate.toFixed(1)}%`,
            fontSize: 12,
            fontFamily: 'Rajdhani',
            fontWeight: 700,
            fill: isAbnormalConv ? '#ff3b5c' : '#00ff88'
          }
        };
      }).filter(Boolean)
    };
  }, [funnelData]);

  return (
    <div className="glass-card corner-decor p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="tech-title text-lg">全链路转化漏斗</h3>
          {abnormalStages.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neon-red/15 border border-neon-red/40">
              <AlertTriangle className="w-3.5 h-3.5 text-neon-red" />
              <span className="text-neon-red text-xs font-semibold font-display">
                {abnormalStages.length} 个异常环节
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50 font-display">
          {funnelData.slice(0, -1).map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neon-blue/60" />
              <span>{item.stage}</span>
              <ArrowRight className="w-3 h-3" />
              <span className={funnelData[idx + 1]?.isAbnormal ? 'text-neon-red' : ''}>
                {funnelData[idx + 1]?.conversionFromPrev.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex-1 min-h-0"
        onClick={(e: any) => {
          const chart = e.currentTarget.querySelector('canvas');
          if (chart && funnelData.length > 0) {
            openDetail('funnel', '漏斗转化明细', { stage: funnelData[0].stageKey });
          }
        }}
      >
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%', cursor: 'pointer' }}
          onEvents={{
            click: (params: any) => {
              const data = funnelData[params.dataIndex];
              if (data) {
                openDetail('funnel', `${data.stage} - 明细数据`, { stage: data.stageKey });
              }
            }
          }}
        />
      </div>

      {abnormalStages.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neon-red/20">
          <div className="flex flex-wrap gap-2">
            {abnormalStages.map(stage => (
              <div
                key={stage.stageKey}
                onClick={() => openDetail('funnel', `${stage.stage} - 异常明细`, { stage: stage.stageKey })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/10 border border-neon-red/30 cursor-pointer hover:bg-neon-red/20 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-neon-red animate-pulse" />
                <span className="text-neon-red text-xs font-semibold font-display">{stage.stage}</span>
                <span className="text-neon-red/70 text-xs">
                  转化率 {stage.conversionFromPrev.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
