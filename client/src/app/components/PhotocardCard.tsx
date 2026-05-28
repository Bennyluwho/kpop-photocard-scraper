import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { PriceStat } from './PriceStat';
import {
  addToWatchlist,
  isWatchlisted,
  removeFromWatchlist,
  subscribeToWatchlist,
} from '../watchlistStore.js';

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
  watchlistItem?: {
    id: string;
    image: string;
    group: string;
    idol: string;
    album: string;
    rarity: string;
    lowestAsk?: number | null;
    lastSale?: number | null;
    trend?: 'up' | 'down' | null;
    trendPercent?: number | null;
    estimatedMarketValue?: number | null;
  };
  onRemove?: (id: string) => void;
}

export function PhotocardCard({
  id,
  image,
  group,
  idol,
  album,
  rarity,
  lowestAsk,
  lastSale,
  trend,
  trendPercent,
  watchlistItem,
  onRemove,
}: PhotocardCardProps) {
  const [saved, setSaved] = useState(() => Boolean(id && isWatchlisted(id)));
  const canSave = Boolean(id && watchlistItem);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const updateSavedState = () => setSaved(isWatchlisted(id));
    updateSavedState();
    return subscribeToWatchlist(updateSavedState);
  }, [id]);

  function handleCardClick() {
    if (id) {
      window.location.href = `/cards/${id}`;
    }
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.key === 'Enter' || event.key === ' ') && id) {
      event.preventDefault();
      window.location.href = `/cards/${id}`;
    }
  }

  function handleWatchlistClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!id || !watchlistItem) {
      return;
    }

    if (saved) {
      removeFromWatchlist(id);
      onRemove?.(id);
      return;
    }

    addToWatchlist(watchlistItem);
  }

  const cardContent = (
    <>
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={`${idol} - ${album}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {canSave && (
          <button
            type="button"
            aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={handleWatchlistClick}
            className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              saved ? 'text-primary' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">{group}</p>
            <h3 className="truncate font-medium">{idol}</h3>
            <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{album}</p>
          </div>
          <span className="shrink-0 rounded bg-accent px-2 py-1 text-xs">{rarity}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="mb-1">
            <PriceStat label="Est. Value" value={lowestAsk} />
          </div>
          <PriceStat
            label="Last Sale"
            value={lastSale}
            trend={trend}
            trendPercent={trendPercent}
            valueClassName="text-sm"
          />
        </div>
      </div>
    </>
  );

  return (
    <div
      role={id ? 'link' : undefined}
      tabIndex={id ? 0 : undefined}
      onClick={id ? handleCardClick : undefined}
      onKeyDown={id ? handleCardKeyDown : undefined}
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {cardContent}
    </div>
  );
}
