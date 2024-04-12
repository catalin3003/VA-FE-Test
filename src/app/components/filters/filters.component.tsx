import React, { useEffect, useMemo, useState } from 'react';

import type { FiltersProps, StarRating } from '@/types/booking';
import styles from './filters.module.css';

/**
 * Component for selecting filters to apply to search results.
 * @param {FiltersProps} props - The props for the component.
 */
const Filters: React.FC<FiltersProps> = ({ onFilterChange, searchResults }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | undefined>();
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState<StarRating[]>([]);

  // Memoize unique facilities, star ratings, and price range
  const { uniqueFacilities, uniqueStarRatings, priceRange } = useMemo(() => {
    const facilitiesSet = new Set<string>();
    const starRatingsSet = new Set<StarRating>();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    searchResults.holidays.forEach(holiday => {
      holiday.hotel.content.hotelFacilities.forEach(facility => facilitiesSet.add(facility));
      
      const starRating = Number(holiday.hotel.content.starRating);
      if (!isNaN(starRating)) {
        starRatingsSet.add(starRating);
      }

      minPrice = Math.min(minPrice, holiday.pricePerPerson);
      maxPrice = Math.max(maxPrice, holiday.pricePerPerson);

      if (holiday.hotel.content.starRating === 'Villas') {
        starRatingsSet.add('Villas');
      }
    });

    return {
      uniqueFacilities: Array.from(facilitiesSet).sort(),
      uniqueStarRatings: Array.from(starRatingsSet).sort((a, b) => {
        if (typeof a === 'string' || typeof b === 'string') {
          return String(a).localeCompare(String(b));
        }
        return a - b;
      }),
      priceRange: minPrice !== Infinity ? [minPrice, maxPrice] : undefined,
    };
  }, [searchResults]);

  // Call onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange({
      priceRange: selectedPriceRange,
      facilities: selectedFacilities,
      starRatings: selectedStarRatings,
    });
  }, [selectedPriceRange, selectedFacilities, selectedStarRatings, onFilterChange]);

  // Handlers for changing filters
  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const facility = e.target.value;
    setSelectedFacilities(prev =>
      e.target.checked ? [...prev, facility] : prev.filter(f => f !== facility)
    );
  };
  
  const handleStarRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ratingValue = e.target.value;
    let rating: StarRating = isNaN(parseInt(ratingValue)) ? ratingValue : parseInt(ratingValue);
  
    setSelectedStarRatings(prev => {
      if (e.target.checked) {
        // Add the rating if it's not already in the array
        return prev.includes(rating) ? prev : [...prev, rating];
      } else {
        // Remove the rating if it exists in the array
        return prev.filter(r => r !== rating);
      }
    });
  };
  
  return (
    <div className={styles.filters}>
      {/* Price Range Filter */}
      <div className={styles.filterGroup} data-testid="priceRange">
        <label className={styles.filterLabel}>Price Range:</label>
        {priceRange && (
          <>
            <input
              className={styles.rangeInput}
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={selectedPriceRange ? selectedPriceRange[1] : priceRange[1]}
              onChange={(e) => setSelectedPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <span className={styles.priceValue}>Max: £{selectedPriceRange ? selectedPriceRange[1] : priceRange[1]}</span>
          </>
        )}
      </div>

      {/* Facilities Filter */}
      <div className={styles.filterGroup} data-testid="facilities">
        <label className={styles.filterLabel}>Facilities:</label>
        {uniqueFacilities.map((facility) => (
          <div key={facility} className={styles.filterFacility}>
            <input
              className={styles.filterInput}
              type="checkbox"
              id={`facility-${facility}`}
              name="facilities"
              value={facility}
              checked={selectedFacilities.includes(facility)}
              onChange={handleFacilitiesChange}
            />
            <label htmlFor={`facility-${facility}`}>{facility}</label>
          </div>
        ))}
      </div>

      {/* Star Ratings Filter */}
      <div className={styles.filterGroup} data-testid="starRatings">
        <label className={styles.filterLabel}>Star Ratings:</label>
        {uniqueStarRatings.map((rating) => (
          <div key={String(rating)} className={styles.filterFacility}>
            <input
              className={styles.filterInput}
              type="checkbox"
              id={`star-${rating}`}
              name="starRatings"
              value={rating}
              checked={selectedStarRatings.includes(rating)}
              onChange={handleStarRatingChange}
            />
            <label htmlFor={`star-${rating}`}>
              {typeof rating === 'number' ? `${rating} Star${rating > 1 ? 's' : ''}` : rating}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
