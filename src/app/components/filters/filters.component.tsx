import { BookingResponse } from '@/types/booking';
import React, { useEffect, useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  searchResults: BookingResponse;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange, searchResults }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | undefined>();
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([]);

  // Extract unique facilities and star ratings from searchResults
  const uniqueFacilities = Array.from(new Set(searchResults.holidays.flatMap((h: any) => h.hotel.content.hotelFacilities)));
  const uniqueStarRatings = Array.from(new Set(searchResults.holidays.map((h: any) => h.hotel.content.starRating))).filter(Boolean);

  // Call onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange({
      priceRange: selectedPriceRange,
      facilities: selectedFacilities,
      starRatings: selectedStarRatings,
    });
  }, [selectedPriceRange, selectedFacilities, selectedStarRatings, onFilterChange]);

  // Handlers for changing filters
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [min, max] = e.target.value.split('-').map(Number);
    setSelectedPriceRange([min, max]);
  };

  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedFacilities(value);
  };

  const handleStarRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(parseInt(options[i].value));
      }
    }
    setSelectedStarRatings(value);
  };

  return (
    <div>
      <select multiple={true} onChange={handleFacilitiesChange}>
        {uniqueFacilities.map(facility => (
          <option key={facility} value={facility}>{facility}</option>
        ))}
      </select>

      <select multiple={true} onChange={handleStarRatingChange}>
        {uniqueStarRatings.map(rating => (
          <option key={rating} value={rating}>{rating} stars</option>
        ))}
      </select>
      <select onChange={handlePriceRangeChange}>
        <option value="0-1000">£0 - £1000</option>
        <option value="1000-2000">£1000 - £2000</option>
        <option value="2000-99999999">more than £2000</option>
      </select>
    </div>
  );
};

export default Filters;
