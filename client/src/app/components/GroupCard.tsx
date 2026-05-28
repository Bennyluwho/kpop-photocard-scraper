import { ImageWithFallback } from './ImageWithFallback';

interface GroupCardProps {
  name: string;
  image: string;
  cardCount: number;
}

export function GroupCard({ name, image, cardCount }: GroupCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{cardCount.toLocaleString()} cards</p>
      </div>
    </div>
  );
}
