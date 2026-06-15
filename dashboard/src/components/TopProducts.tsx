import { useMemo } from 'react';
import { Trophy, Crown, ShoppingBag, ChevronRight } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import type { TopProduct, ProductSortBy, Category } from '@/types';

const SORT_OPTIONS: { value: ProductSortBy; label: string; color: string }[] = [
  { value: 'gmv', label: '成交额', color: 'neon-orange' },
  { value: 'clicks', label: '点击量', color: 'neon-blue' },
  { value: 'conversionRate', label: '转化率', color: 'neon-green' },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: '全品类',
  digital: '数码电子',
  clothing: '服饰鞋包',
  food: '食品生鲜',
  home: '家居日用',
  beauty: '美妆个护',
};

const RANK_STYLES: Record<number, { bg: string; text: string; icon: any }> = {
  1: { bg: 'bg-gradient-to-br from-yellow-400 to-amber-600', text: 'text-white', icon: Crown },
  2: { bg: 'bg-gradient-to-br from-slate-300 to-slate-500', text: 'text-white', icon: Trophy },
  3: { bg: 'bg-gradient-to-br from-orange-400 to-orange-700', text: 'text-white', icon: Trophy },
};

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  return n.toLocaleString('zh-CN');
}

function formatMoney(n: number) {
  if (n >= 100000000) return '¥' + (n / 100000000).toFixed(2) + '亿';
  if (n >= 10000) return '¥' + (n / 10000).toFixed(1) + 'w';
  return '¥' + n.toLocaleString('zh-CN');
}

function ProductRow({ product, onClick, sortBy, maxValue }: { product: TopProduct; onClick: () => void; sortBy: ProductSortBy; maxValue: number }) {
  const progress = (product[sortBy] / maxValue) * 100;
  const style = RANK_STYLES[product.rank];

  return (
    <div
      onClick={onClick}
      className="group relative flex items-center gap-3 px-3 py-3 rounded-xl mb-2 cursor-pointer
        bg-white/[0.02] border border-transparent hover:border-neon-blue/30
        hover:bg-neon-blue/5 transition-all duration-300"
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-tech font-bold text-sm
          ${style ? style.bg + ' ' + style.text : 'bg-white/5 text-white/60 border border-white/10'}`}
      >
        {style ? <style.icon className="w-4 h-4" /> : product.rank}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-neon-blue/70" />
          <span className="text-sm text-white/90 font-display truncate group-hover:text-neon-blue transition-colors">
            {product.name}
          </span>
        </div>

        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: product.rank <= 3
                ? 'linear-gradient(90deg, #ffd93d, #ff6b35)'
                : sortBy === 'gmv' ? 'linear-gradient(90deg, #ff6b35, #ff9f43)'
                : sortBy === 'clicks' ? 'linear-gradient(90deg, #00d4ff, #8b5cf6)'
                : 'linear-gradient(90deg, #10b981, #34d399)'
            }}
          />
        </div>

        <div className="flex items-center gap-4 mt-1.5 text-xs text-white/45 font-display">
          <span>点击 <span className="text-neon-blue">{formatNumber(product.clicks)}</span></span>
          <span>转化 <span className="text-neon-green">{product.conversionRate}%</span></span>
          <span>订单 <span className="text-neon-purple">{formatNumber(product.orders)}</span></span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        {sortBy === "gmv" ? (
          <>
            <div className="kpi-number text-lg text-neon-orange">
              {formatMoney(product.gmv)}
            </div>
            <div className="text-xs text-white/40 font-display mt-0.5">GMV</div>
          </>
        ) : sortBy === "clicks" ? (
          <>
            <div className="kpi-number text-lg text-neon-blue">
              {formatNumber(product.clicks)}
            </div>
            <div className="text-xs text-white/40 font-display mt-0.5">点击量</div>
          </>
        ) : (
          <>
            <div className="kpi-number text-lg text-neon-green">
              {product.conversionRate}%
            </div>
            <div className="text-xs text-white/40 font-display mt-0.5">转化率</div>
          </>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-neon-blue group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}

export function TopProducts() {
  const { topProducts, productSortBy, setProductSortBy, category, openDetail } = useDashboardStore();

  const sortedProducts = useMemo(() => {
    const sorted = [...topProducts].sort((a, b) => {
      if (productSortBy === "conversionRate") {
        return b.conversionRate - a.conversionRate;
      }
      if (productSortBy === "clicks") {
        return b.clicks - a.clicks;
      }
      return b.gmv - a.gmv;
    });
    return sorted.map((p, index) => ({ ...p, rank: index + 1 }));
  }, [topProducts, productSortBy]);

  const maxValue = sortedProducts[0]?.[productSortBy] || 1;

  const totalValue = useMemo(() => {
    if (productSortBy === "gmv") {
      const total = sortedProducts.reduce((sum, p) => sum + p.gmv, 0);
      return formatMoney(total);
    }
    if (productSortBy === "clicks") {
      const total = sortedProducts.reduce((sum, p) => sum + p.clicks, 0);
      return formatNumber(total);
    }
    if (sortedProducts.length === 0) return "0.00";
    const avg = sortedProducts.reduce((sum, p) => sum + p.conversionRate, 0) / sortedProducts.length;
    return avg.toFixed(2);
  }, [sortedProducts, productSortBy]);

  const getSubtitle = () => {
    if (productSortBy === "gmv") {
      return `TOP 10 · 总GMV ${totalValue}`;
    }
    if (productSortBy === "clicks") {
      return `TOP 10 · 总点击 ${totalValue}`;
    }
    return `TOP 10 · 平均转化 ${totalValue}%`;
  };

  if (topProducts.length === 0) {
    return (
      <div className="glass-card corner-decor p-5 h-full">
        <div className="animate-pulse h-10 bg-white/5 rounded-lg mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse h-16 bg-white/5 rounded-lg mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card corner-decor p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-yellow/25 to-neon-orange/25 flex items-center justify-center border border-neon-yellow/30">
            <Trophy className="w-5 h-5 text-neon-yellow" />
          </div>
          <div>
            <h3 className="tech-title text-base">热门商品TOP榜</h3>
            <p className="text-xs text-white/45 font-display mt-0.5">
              {getSubtitle()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-glass-light border border-white/10">
          {SORT_OPTIONS.map(opt => {
            const isActive = productSortBy === opt.value;
            const colorClasses: Record<string, string> = {
              "neon-orange": "bg-neon-orange/15 text-neon-orange border border-neon-orange/30",
              "neon-blue": "bg-neon-blue/15 text-neon-blue border border-neon-blue/30",
              "neon-green": "bg-neon-green/15 text-neon-green border border-neon-green/30",
            };
            return (
              <button
                key={opt.value}
                onClick={() => setProductSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-display transition-all duration-300
                  ${isActive ? colorClasses[opt.color] : "text-white/50 hover:text-white/80"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom pr-1 -mr-1">
        {sortedProducts.map(product => (
          <ProductRow
            key={product.id}
            product={product}
            sortBy={productSortBy}
            maxValue={maxValue}
            onClick={() => openDetail('product', `${product.name} - ${CATEGORY_LABELS[category]}`, { productId: product.id })}
          />
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-neon-blue/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4 text-xs font-display">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-blue" />
            <span className={productSortBy === "clicks" ? "text-neon-blue font-bold" : "text-white/50"}>点击量</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-green" />
            <span className={productSortBy === "conversionRate" ? "text-neon-green font-bold" : "text-white/50"}>转化率</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-orange" />
            <span className={productSortBy === "gmv" ? "text-neon-orange font-bold" : "text-white/50"}>GMV</span>
          </span>
        </div>
        <span className="text-xs text-white/35 font-display">
          点击商品查看明细 →
        </span>
      </div>
    </div>
  );
}
