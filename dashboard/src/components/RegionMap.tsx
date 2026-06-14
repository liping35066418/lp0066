import { useMemo, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { MapPin, Globe } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { RegionData } from '@/types';

const CHINA_GEO_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

export function RegionMap() {
  const { regionData, openDetail, timeRange, category } = useDashboardStore();
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);

  useEffect(() => {
    const loadGeo = async () => {
      try {
        if (!(echarts as any).getMap('china')) {
          const res = await fetch(CHINA_GEO_URL);
          const geoJson = await res.json();
          echarts.registerMap('china', geoJson);
        }
        setGeoLoaded(true);
      } catch (e) {
        console.error('地图数据加载失败:', e);
      }
    };
    loadGeo();
  }, []);

  const topRegions = useMemo(() => {
    return [...regionData].sort((a, b) => b.value - a.value).slice(0, 6);
  }, [regionData]);

  const totalValue = useMemo(() => {
    return regionData.reduce((s, r) => s + r.value, 0);
  }, [regionData]);

  const option = useMemo(() => {
    if (!geoLoaded) return {};

    const maxVal = Math.max(...regionData.map(r => r.value), 1);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(13, 27, 53, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        borderWidth: 1,
        textStyle: { color: '#fff', fontFamily: 'Rajdhani', fontSize: 12 },
        formatter: (params: any) => {
          if (!params.data) return `<b>${params.name}</b><br/>暂无数据`;
          const region = regionData.find(r => r.name === params.name);
          if (!region) return '';
          return `
            <div style="padding:4px 0">
              <div style="font-weight:600;margin-bottom:6px;color:#00d4ff">${region.name}</div>
              <div style="display:grid;gap:3px;font-size:11px;color:rgba(255,255,255,0.75)">
                <div>交易额: <b style="color:#ff6b35">¥${region.value.toLocaleString('zh-CN')}</b></div>
                <div>用户数: <b style="color:#00d4ff">${region.users.toLocaleString('zh-CN')}</b></div>
                <div>订单数: <b style="color:#00ff88">${region.orders.toLocaleString('zh-CN')}</b></div>
                <div>占比: <b style="color:#ffd93d">${((region.value / totalValue) * 100).toFixed(2)}%</b></div>
              </div>
            </div>
          `;
        }
      },
      visualMap: {
        show: false,
        min: 0,
        max: maxVal,
        left: 20,
        bottom: 20,
        inRange: {
          color: [
            'rgba(0, 212, 255, 0.1)',
            'rgba(0, 212, 255, 0.3)',
            'rgba(0, 255, 136, 0.5)',
            'rgba(255, 217, 61, 0.7)',
            'rgba(255, 107, 53, 0.85)'
          ]
        }
      },
      geo: {
        map: 'china',
        roam: false,
        zoom: 1.15,
        center: [104, 36],
        itemStyle: {
          areaColor: 'rgba(0, 212, 255, 0.05)',
          borderColor: 'rgba(0, 212, 255, 0.25)',
          borderWidth: 0.8
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(0, 212, 255, 0.35)',
            borderColor: '#00d4ff',
            borderWidth: 1.5,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          },
          label: { show: false }
        },
        label: { show: false }
      },
      series: [
        {
          name: '地域分布',
          type: 'map',
          map: 'china',
          roam: false,
          zoom: 1.15,
          center: [104, 36],
          itemStyle: {
            borderColor: 'rgba(0, 212, 255, 0.25)',
            borderWidth: 0.8
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
              fontFamily: 'Rajdhani',
              fontWeight: 600,
              fontSize: 12
            }
          },
          label: { show: false },
          data: regionData.map(r => ({ name: r.name, value: r.value }))
        }
      ]
    };
  }, [geoLoaded, regionData, totalValue]);

  return (
    <div className="glass-card corner-decor p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neon-green/15 flex items-center justify-center border border-neon-green/30">
            <Globe className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="tech-title text-base">用户地域分布</h3>
            <p className="text-xs text-white/45 font-display mt-0.5">
              {regionData.length} 个省级地区
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-display">
          <MapPin className="w-3.5 h-3.5 text-neon-orange" />
          <span className="text-white/50">点击省份查看明细</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div
          className="flex-1 relative rounded-xl overflow-hidden bg-white/[0.02] border border-neon-blue/10"
          onClick={(e: any) => {
            if (hoveredRegion) {
              openDetail('region', `${hoveredRegion.name} - 城市明细`, {
                region: hoveredRegion.name,
                timeRange,
                category
              });
            }
          }}
        >
          {!geoLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full" />
            </div>
          ) : (
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              onEvents={{
                mouseover: (params: any) => {
                  const r = regionData.find(x => x.name === params.name);
                  if (r) setHoveredRegion(r);
                },
                mouseout: () => setHoveredRegion(null),
                click: (params: any) => {
                  const region = regionData.find(r => r.name === params.name);
                  if (region) {
                    openDetail('region', `${region.name} - 城市明细`, {
                      region: region.name,
                      timeRange,
                      category
                    });
                  }
                }
              }}
            />
          )}
        </div>

        <div className="w-52 flex-shrink-0 space-y-2 overflow-y-auto scrollbar-custom pr-1 -mr-1">
          {topRegions.map((region, idx) => (
            <div
              key={region.name}
              onClick={() => openDetail('region', `${region.name} - 城市明细`, {
                region: region.name,
                timeRange,
                category
              })}
              className={`group relative p-2.5 rounded-lg cursor-pointer transition-all
                ${hoveredRegion?.name === region.name
                  ? 'bg-neon-blue/15 border border-neon-blue/40'
                  : 'bg-white/[0.03] border border-transparent hover:bg-neon-blue/10'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-neon-blue/15 text-neon-blue text-xs font-tech font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-display text-white/85 group-hover:text-neon-blue transition-colors">
                    {region.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-display">
                <span className="text-white/45">GMV</span>
                <span className="text-neon-orange font-semibold">
                  {region.value >= 10000
                    ? '¥' + (region.value / 10000).toFixed(1) + 'w'
                    : '¥' + region.value.toLocaleString('zh-CN')}
                </span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                  style={{ width: `${(region.value / topRegions[0].value) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
