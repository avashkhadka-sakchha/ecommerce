import { Star } from 'lucide-react';

export default function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={13} 
          style={{ 
            fill: i < Math.round(rating) ? '#FBBF24' : 'none', 
            color: i < Math.round(rating) ? '#FBBF24' : '#D1D5DB' 
          }} 
        />
      ))}
    </div>
  );
}
