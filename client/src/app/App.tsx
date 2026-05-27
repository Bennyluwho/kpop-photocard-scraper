import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchCardFeed, fetchGroups } from '../api/cards';
import type { CardFeedItem, GroupSummary } from '../api/types';
import { cardToPhotocardProps, groupToCardProps } from '../lib/cardDisplay';
import { Navbar } from './components/Navbar';
import { PhotocardCard } from './components/PhotocardCard';
import { GroupCard } from './components/GroupCard';

export default function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cards, setCards] = useState<CardFeedItem[]>([]);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      setLoading(true);
      setError(null);

      try {
        const [feed, groupSummaries] = await Promise.all([
          fetchCardFeed(debouncedSearch),
          fetchGroups(),
        ]);

        if (!cancelled) {
          setCards(feed);
          setGroups(groupSummaries);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load marketplace data');
          setCards([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeed();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const trendingCards = useMemo(() => cards, [cards]);

  const recentlyListed = useMemo(
    () => [...cards].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [cards]
  );

  const marketMovers = useMemo(
    () => cards.filter((card) => card.trend === 'up' && card.trendPercent !== null),
    [cards]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-b from-background to-muted/20 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
            The marketplace for K-pop photocards
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track prices, discover rare cards, and buy or sell photocards from your favorite idols.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by idol, group, album, or card…"
                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 -mt-8 mb-4">
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}. Make sure the API server is running on port 5000.
          </p>
        </div>
      )}

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Trending Photocards</h2>
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading…' : `${trendingCards.length} cards`}
            </span>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading photocards…</p>
          ) : trendingCards.length === 0 ? (
            <p className="text-muted-foreground">No photocards match your search.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingCards.map((card) => (
                <PhotocardCard key={card._id} {...cardToPhotocardProps(card)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Popular Groups</h2>
          </div>
          {groups.length === 0 && !loading ? (
            <p className="text-muted-foreground">No groups found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {groups.map((group) => (
                <GroupCard key={group.name} {...groupToCardProps(group)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recently Listed</h2>
          </div>
          {!loading && recentlyListed.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyListed.slice(0, 4).map((card) => (
                <PhotocardCard key={`recent-${card._id}`} {...cardToPhotocardProps(card)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Market Movers</h2>
          </div>
          {!loading && marketMovers.length === 0 ? (
            <p className="text-muted-foreground">No upward price trends yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {marketMovers.map((card) => (
                <PhotocardCard key={`mover-${card._id}`} {...cardToPhotocardProps(card)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2026 K-Card Market. The marketplace for K-pop photocards.</p>
        </div>
      </footer>
    </div>
  );
}
