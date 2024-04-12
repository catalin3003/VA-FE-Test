"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import isEqual from 'lodash/isEqual';

import Filters from '../filters/filters.component';
import Loading from '@/app/results/loading';
import styles from './search-results.module.css';
import { Rooms } from '@/utils/composition.service';

import type { BookingResponse, FilterCriteria, Holiday, SearchResultsComponentProps } from "@/types/booking";


async function getData(params: SearchResultsComponentProps["searchParams"]) {
  const body = {
    bookingType: params.bookingType,
    direct: false,
    location: params.location,
    departureDate: params.departureDate,
    duration: params.duration,
    gateway: params.gateway,
    partyCompositions: Rooms.parseAndConvert([params.partyCompositions as string]),
  };

  const res = await fetch(
    "https://www.virginholidays.co.uk/cjs-search-api/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

/**
 * Component to display search results and handle filtering.
 * @param {SearchResultsComponentProps} props - The props for the component.
 */
const SearchResultsComponent: React.FC<SearchResultsComponentProps> = ({ searchParams }) => {
  const [results, setResults] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
  const [filters, setFilters] = useState<FilterCriteria>({
    priceRange: undefined,
    facilities: [],
    starRatings: [],
  });

  // Fetch data on component mount or when searchParams change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const req = await getData(searchParams);
        setResults(req);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  // Apply filters whenever results or filters change
  useEffect(() => {
    if (results) {
      let filteredResults = results.holidays;

    if (filters.priceRange?.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      filteredResults = filteredResults.filter(holiday =>
        holiday.pricePerPerson >= minPrice &&
        holiday.pricePerPerson <= maxPrice
      );
    }
      
    if (filters.facilities && filters.facilities?.length > 0) {
      filteredResults = filteredResults.filter(holiday =>
        (filters.facilities ?? []).every(facility => holiday.hotel.content.hotelFacilities.includes(facility))
      );
    }

    if (filters.starRatings && filters.starRatings.length > 0) {
      filteredResults = filteredResults.filter(holiday => {
        const holidayRating = holiday.hotel.content.starRating;
        return (filters.starRatings ?? []).some(rating =>
          typeof rating === 'number' ? holidayRating === rating.toString() : holidayRating === rating
        );
      });
    }

    setFilteredHolidays(filteredResults);
    }
  }, [results, filters]);

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(prevFilters => {
      // Only update if the filters have actually changed
      if (!isEqual(prevFilters, newFilters)) {
        return { ...prevFilters, ...newFilters };
      }
      return prevFilters;
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!results || results.holidays.length === 0) {
    return <div>No results found.</div>;
  }

  /**
 * Renders a rating as stars or a special symbol/text based on the input.
 *
 * @param {number | string} rating - The rating value which can be a number or a string.
 * @returns {JSX.Element} A JSX Element representing the visual rating.
 */
const renderRating = (rating: number | string): JSX.Element => {
  const numericRating = parseInt(String(rating), 10);

  if (!isNaN(numericRating)) {
    return <span>{'★'.repeat(numericRating)}</span>;
  } else if (typeof rating === 'string' && (rating.toLowerCase() === 'villas' || rating === 'NA')) {
    return <span>🏡 VILLA</span>;
  } else {
    return <span>{rating}</span>;
  }
};

  return (
      <>
      <div className={styles.searchResultsHeader}>
        <h1 className={styles.searchResultsTitle}>Search Results</h1>
        <span className={styles.searchResultsCount}>{filteredHolidays.length} results found</span>
      </div>
      <div className={styles.searchResultsContainer}>
        <Filters onFilterChange={handleFilterChange} searchResults={results}/>
        <ul className={styles.searchResultsList}>
          {filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday: Holiday, index: number) => (
              <li key={index} className={styles.searchResult}>
                <div className={styles.searchResultImage}>
                  <Image
                    src={holiday.hotel.content.images[0].RESULTS_CAROUSEL.url.startsWith('//') ? `https:${holiday.hotel.content.images[0].RESULTS_CAROUSEL.url}` : holiday.hotel.content.images[0].RESULTS_CAROUSEL.url}
                    alt={holiday.hotel.name}
                    width={300}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                <div className={styles.searchResultDetails}>
                  <h3>{holiday.hotel.name}</h3>
                  <p>Price per person: £{holiday.pricePerPerson.toFixed(2)}</p>
                  <p>Total price: £{holiday.totalPrice.toFixed(2)}</p>
                  <p>Hotel facilities: {holiday.hotel.content.hotelFacilities.join(', ')}</p>
                  <p>{holiday.hotel.content.starRating ? renderRating(holiday.hotel.content.starRating) : renderRating(holiday.hotel.content.vRating)}</p>
                </div>
              </li>
            ))
          ) : (
            <li>No results found for the selected filters.</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default SearchResultsComponent;
