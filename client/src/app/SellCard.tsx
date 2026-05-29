import { useEffect, useState } from 'react';
import type { FormEvent, InputHTMLAttributes } from 'react';
import { Check, LoaderCircle, Search } from 'lucide-react';
import type { ApiCard, ApiListing } from '../api/types';
import { formatAlbumLabel, getCardImage } from '../lib/cardDisplay';
import { createListing, getCards } from '../services/cardApi.js';
import { ImageWithFallback } from './components/ImageWithFallback';
import { Navbar } from './components/Navbar';
import { PrimaryButton } from './components/PrimaryButton';
import { SecondaryButton } from './components/SecondaryButton';
import { SearchBar } from './components/SearchBar';
import { EmptyState, ErrorState } from './components/StatusStates';

const initialListingForm = {
  sellerName: '',
  price: '',
  condition: 'Near Mint',
  userImageUrl: '',
  description: '',
};

type ListingForm = typeof initialListingForm;

export default function SellCard() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<ApiCard | null>(null);
  const [form, setForm] = useState<ListingForm>(initialListingForm);
  const [loadingCards, setLoadingCards] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdListing, setCreatedListing] = useState<ApiListing | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function loadCards() {
      setLoadingCards(true);
      setError(null);

      try {
        const results = await getCards(debouncedSearch) as ApiCard[];

        if (!cancelled) {
          setCards(results.slice(0, 12));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to search cards');
          setCards([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingCards(false);
        }
      }
    }

    loadCards();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  function updateField(key: keyof ListingForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function clearForm() {
    setForm(initialListingForm);
    setSelectedCard(null);
    setCreatedListing(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCard) {
      setError('Select an official card before creating a listing');
      return;
    }

    setSubmitting(true);
    setError(null);
    setCreatedListing(null);

    try {
      const listing = await createListing({
        cardId: selectedCard._id,
        sellerName: form.sellerName,
        price: Number(form.price),
        condition: form.condition,
        userImageUrl: form.userImageUrl,
        description: form.description,
      }) as ApiListing;

      setCreatedListing(listing);
      setForm(initialListingForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Sell a Photocard</h1>
          <p className="mt-2 leading-7 text-muted-foreground">
            Search the official catalog first, then create a listing for your copy.
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorState message={error} serverHint={error !== 'Select an official card before creating a listing'} />
          </div>
        )}

        {createdListing && (
          <div className="mb-6 rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700">
            Listing created for {createdListing.cardId.group} {createdListing.cardId.idol}.{' '}
            <a href={`/cards/${createdListing.cardId._id}`} className="font-medium underline">
              View card detail
            </a>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Choose Official Card</h2>
            </div>

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by idol, group, album, version, or photocard"
              size="compact"
              isSearching={loadingCards && Boolean(search)}
            />

            <div className="mt-4 grid gap-3">
              {loadingCards ? (
                <div className="flex items-center gap-2 rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Searching official cards
                </div>
              ) : cards.length === 0 ? (
                <EmptyState title="No official cards found" message="Try another idol, group, album, or alias." />
              ) : (
                cards.map((card) => (
                  <CardSearchResult
                    key={card._id}
                    card={card}
                    selected={selectedCard?._id === card._id}
                    onSelect={() => {
                      setSelectedCard(card);
                      setCreatedListing(null);
                    }}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 font-semibold">Listing Details</h2>

            {selectedCard ? (
              <div className="mb-5 rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Selected official card</p>
                <p className="font-medium">{selectedCard.group} · {selectedCard.idol}</p>
                <p className="text-sm text-muted-foreground">{formatAlbumLabel(selectedCard)}</p>
              </div>
            ) : (
              <div className="mb-5 rounded-lg border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                Select an official card from search results before entering listing details.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <TextField label="Seller name" value={form.sellerName} onChange={(value) => updateField('sellerName', value)} required />
                <TextField
                  label="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(value) => updateField('price', value)}
                  required
                />
                <SelectField
                  label="Condition"
                  value={form.condition}
                  options={['Mint', 'Near Mint', 'Excellent', 'Good', 'Played']}
                  onChange={(value) => updateField('condition', value)}
                />
                <TextField
                  label="Your image URL"
                  value={form.userImageUrl}
                  onChange={(value) => updateField('userImageUrl', value)}
                />
                <TextAreaField
                  label="Description"
                  value={form.description}
                  onChange={(value) => updateField('description', value)}
                  placeholder="Official card, sleeved since pulled."
                />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <SecondaryButton type="button" onClick={clearForm}>
                  Clear
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={submitting || !selectedCard} className="flex items-center justify-center gap-2">
                  {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Create Listing
                </PrimaryButton>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function CardSearchResult({
  card,
  selected,
  onSelect,
}: {
  card: ApiCard;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected ? 'border-primary bg-accent/50' : 'border-border bg-background'
      }`}
    >
      <ImageWithFallback
        src={getCardImage(card)}
        alt={`${card.idol} - ${formatAlbumLabel(card)}`}
        className="aspect-[3/4] w-full rounded border border-border object-cover"
      />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{card.group}</p>
        <p className="truncate font-medium">{card.idol}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{formatAlbumLabel(card)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{card.activeListingCount ?? 0} active listings</p>
      </div>
      {selected && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TextField({ label, value, onChange, className = '', ...props }: TextFieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
        {...props}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
