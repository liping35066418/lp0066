import { useEffect } from 'react';
import { Particles } from '@/components/Particles';
import { Header } from '@/components/Header';
import { KPICards } from '@/components/KPICards';
import { FunnelChart } from '@/components/FunnelChart';
import { TrendChart } from '@/components/TrendChart';
import { TopProducts } from '@/components/TopProducts';
import { RegionMap } from '@/components/RegionMap';
import { PaymentChart } from '@/components/PaymentChart';
import { DetailModal } from '@/components/DetailModal';
import { useDashboardStore } from '@/store/useDashboardStore';

export default function Home() {
  const { fetchAllData, detailModal } = useDashboardStore();

  useEffect(() => {
    fetchAllData();
    const timer = setInterval(() => {
      if (!detailModal.open) {
        fetchAllData();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-grid-pattern bg-[size:40px_40px]">
      <Particles />

      <div className="relative z-10 min-h-screen flex flex-col py-6">
        <Header />
        <KPICards />

        <main className="flex-1 px-6 pb-6 grid grid-cols-12 gap-4" style={{ minHeight: 0 }}>
          <section className="col-span-5 flex flex-col gap-4">
            <div className="flex-1 min-h-[380px]">
              <FunnelChart />
            </div>
            <div className="flex-1 min-h-[380px]">
              <PaymentChart />
            </div>
          </section>

          <section className="col-span-4 flex flex-col gap-4">
            <div className="flex-[1.2] min-h-[450px]">
              <RegionMap />
            </div>
            <div className="flex-1 min-h-[320px]">
              <TrendChart />
            </div>
          </section>

          <section className="col-span-3">
            <div className="h-full min-h-[780px]">
              <TopProducts />
            </div>
          </section>
        </main>

        <footer className="px-6 pb-2">
          <div className="glass-card px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-white/45 font-display">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                数据运算服务: 8756 端口 已连接
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                大屏服务: 3756 端口
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/35 font-display">
              <span>数据自动刷新: 5 秒</span>
              <span>© 2026 电商数据中心</span>
            </div>
          </div>
        </footer>
      </div>

      <DetailModal />
    </div>
  );
}
