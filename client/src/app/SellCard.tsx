import { useState } from 'react';
import type { FormEvent, InputHTMLAttributes } from 'react';
import { LoaderCircle, Upload } from 'lucide-react';
import type { ApiCard } from '../api/types';
import { createCardListing } from '../services/cardApi.js';
import { Navbar } from './components/Navbar';
import { PrimaryButton } from './components/PrimaryButton';
import { SecondaryButton } from './components/SecondaryButton';
import { ErrorState } from './components/StatusStates';

const initialForm = {
  group: '',
  idol: '',
  album: '',
  version: '',
  cardType: 'Album photocard',
  rarity: 'Standard',
  condition: 'Near Mint',
  askingPrice: '',
  imageUrl: '',
  aliases: '',
};

type SellCardForm = typeof initialForm;

export default function SellCard() {
  const [form, setForm] = useState<SellCardForm>(initialForm);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<ApiCard | null>(null);

  function updateField(key: keyof SellCardForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function handleImageUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField('imageUrl', String(reader.result));
      setUploadedFileName(file.name);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read image file');
    reader.readAsDataURL(file);
  }

  function clearForm() {
    setForm(initialForm);
    setUploadedFileName('');
    setError(null);
    setCreatedCard(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setCreatedCard(null);

    try {
      const listing = {
        ...form,
        askingPrice: form.askingPrice ? Number(form.askingPrice) : null,
        aliases: form.aliases
          .split(',')
          .map((alias) => alias.trim())
          .filter(Boolean),
      };
      const card = await createCardListing(listing) as ApiCard;

      setCreatedCard(card);
      setForm(initialForm);
      setUploadedFileName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card listing');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Sell a Photocard</h1>
          <p className="mt-2 leading-7 text-muted-foreground">Create a marketplace listing using card details and an image.</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorState message={error} serverHint={error !== 'Please upload an image file' && error !== 'Failed to read image file'} />
          </div>
        )}

        {createdCard && (
          <div className="mb-6 rounded-xl border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700">
            Listing created for {createdCard.group} {createdCard.idol}.{' '}
            <a href={`/cards/${createdCard._id}`} className="font-medium underline">
              View detail page
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Group" value={form.group} onChange={(value) => updateField('group', value)} required />
            <TextField label="Idol" value={form.idol} onChange={(value) => updateField('idol', value)} required />
            <TextField label="Album" value={form.album} onChange={(value) => updateField('album', value)} required />
            <TextField label="Version" value={form.version} onChange={(value) => updateField('version', value)} />
            <TextField label="Card type" value={form.cardType} onChange={(value) => updateField('cardType', value)} />
            <SelectField
              label="Rarity"
              value={form.rarity}
              options={['Standard', 'Common', 'Rare', 'Limited', 'Ultra Rare']}
              onChange={(value) => updateField('rarity', value)}
            />
            <SelectField
              label="Condition"
              value={form.condition}
              options={['Mint', 'Near Mint', 'Excellent', 'Good', 'Played']}
              onChange={(value) => updateField('condition', value)}
            />
            <TextField
              label="Asking price"
              type="number"
              min="0"
              step="0.01"
              value={form.askingPrice}
              onChange={(value) => updateField('askingPrice', value)}
              required
            />
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={(value) => updateField('imageUrl', value)}
              className="md:col-span-2"
            />
            <ImageUploadField
              imageUrl={form.imageUrl}
              fileName={uploadedFileName}
              onUpload={handleImageUpload}
              className="md:col-span-2"
            />
            <TextField
              label="Aliases"
              value={form.aliases}
              onChange={(value) => updateField('aliases', value)}
              placeholder="Comma-separated names, album codes, or search terms"
              className="md:col-span-2"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <SecondaryButton type="button" onClick={clearForm}>
              Clear
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={submitting} className="flex items-center justify-center gap-2">
              {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create Listing
            </PrimaryButton>
          </div>
        </form>
      </main>
    </div>
  );
}

interface ImageUploadFieldProps {
  imageUrl: string;
  fileName: string;
  onUpload: (file: File | undefined) => void;
  className?: string;
}

function ImageUploadField({ imageUrl, fileName, onUpload, className = '' }: ImageUploadFieldProps) {
  return (
    <label
      className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 py-8 text-center transition-colors hover:bg-accent/40 ${className}`}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => onUpload(event.target.files?.[0])}
      />
      {imageUrl ? (
        <div className="flex flex-col items-center gap-3">
          <img src={imageUrl} alt="Uploaded photocard preview" className="h-36 rounded-lg border border-border object-cover" />
          <div>
            <p className="text-sm font-medium">{fileName || 'Image selected'}</p>
            <p className="text-xs text-muted-foreground">Click to choose a different image</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full border border-border p-3">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Upload Image</p>
            <p className="text-xs text-muted-foreground">Choose an image file or paste an Image URL above</p>
          </div>
        </div>
      )}
    </label>
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
