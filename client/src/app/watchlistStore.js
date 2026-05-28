const WATCHLIST_KEY = 'k-card-market-watchlist';
const WATCHLIST_EVENT = 'watchlistchange';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizeItem(item) {
  return {
    id: item.id,
    image: item.image,
    group: item.group,
    idol: item.idol,
    album: item.album,
    rarity: item.rarity,
    lowestAsk: item.lowestAsk ?? null,
    lastSale: item.lastSale ?? null,
    trend: item.trend ?? null,
    trendPercent: item.trendPercent ?? null,
    estimatedMarketValue: item.estimatedMarketValue ?? item.lowestAsk ?? null,
    savedAt: item.savedAt ?? new Date().toISOString(),
  };
}

function notifyWatchlistChanged() {
  window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT));
}

export function getWatchlist() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(WATCHLIST_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id).map(normalizeItem) : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items.map(normalizeItem)));
  notifyWatchlistChanged();
}

export function isWatchlisted(cardId) {
  return getWatchlist().some((item) => item.id === cardId);
}

export function addToWatchlist(item) {
  const watchlist = getWatchlist();
  const nextItem = normalizeItem(item);
  const nextWatchlist = [nextItem, ...watchlist.filter((savedItem) => savedItem.id !== nextItem.id)];
  saveWatchlist(nextWatchlist);
  return nextWatchlist;
}

export function removeFromWatchlist(cardId) {
  const nextWatchlist = getWatchlist().filter((item) => item.id !== cardId);
  saveWatchlist(nextWatchlist);
  return nextWatchlist;
}

export function subscribeToWatchlist(listener) {
  const handleStorageChange = (event) => {
    if (event.key === WATCHLIST_KEY) {
      listener();
    }
  };

  window.addEventListener(WATCHLIST_EVENT, listener);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener(WATCHLIST_EVENT, listener);
    window.removeEventListener('storage', handleStorageChange);
  };
}
