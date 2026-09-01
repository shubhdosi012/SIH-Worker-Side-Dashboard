import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 5,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange = null,
  showNumber = false,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            type={interactive ? 'button' : undefined}
            key={index}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`transition-colors ${
              interactive
                ? 'cursor-pointer hover:scale-110 focus:outline-none transition-transform'
                : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 fill-slate-100'
              }`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-xs font-semibold text-slate-700">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
