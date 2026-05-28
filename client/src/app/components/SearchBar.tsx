import { LoaderCircle, Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by idol, group, album, or card…',
  isSearching = false,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {isSearching && (
        <LoaderCircle
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-label="Searching"
        />
      )}
    </div>
  );
}
