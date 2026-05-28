const filterGroups = ['Group', 'Rarity', 'Price range', 'Trend'];

export function FilterSidebar() {
  return (
    <aside className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="font-semibold">Filters</h2>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </div>
      <div className="space-y-3">
        {filterGroups.map((label) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm text-muted-foreground opacity-70"
          >
            <span>{label}</span>
            <span>Any</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
