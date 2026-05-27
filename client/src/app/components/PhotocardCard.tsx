import { TrendingUp, TrendingDown } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface PhotocardCardProps {
  id?: string;
  image: string;
  group: string;
  idol: string;
  album: string;
  rarity: string;
  lowestAsk?: number | null;
  lastSale?: number | null;
  trend?: 'up' | 'down' | null;
  trendPercent?: number | null;
}

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) {
    return '—';
  }

  return `$${value}`;
}

export function PhotocardCard({
  image,
  group,
  idol,
  album,
  rarity,
  lowestAsk,
  lastSale,
  trend,
  trendPercent,
}: PhotocardCardProps) {
  const hasTrend = trend && trendPercent !== null && trendPercent !== undefined;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="aspect-[3/4] bg-muted overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={`${idol} - ${album}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{group}</p>
            <h3 className="font-medium">{idol}</h3>
            <p className="text-sm text-muted-foreground">{album}</p>
          </div>
          <span className="text-xs bg-accent px-2 py-1 rounded">{rarity}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Est. Value</span>
            <span className="font-semibold">{formatPrice(lowestAsk)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last Sale</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">{formatPrice(lastSale)}</span>
              {hasTrend && (
                <div
                  className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{trendPercent}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
