import { ImageWithFallback } from './ImageWithFallback';

interface GroupCardProps {
  name: string;
  image: string;
  cardCount: number;
}

export function GroupCard({ name, image, cardCount }: GroupCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="aspect-[16/9] bg-muted overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{cardCount.toLocaleString()} cards</p>
      </div>
    </div>
  );
}
