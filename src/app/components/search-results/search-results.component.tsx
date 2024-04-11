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

  return (
    <>
      <div className={styles.searchResults}>{results.holidays.length} results found</div>
      <Filters onFilterChange={handleFilterChange} searchResults={results}/>
      {/* This needs to be a separate component */}
      <ul className={styles.searchResultsContainer}>
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((holiday: Holiday, index: number) => (
            <li key={index} className={styles.searchResults} >
              <div><strong>{holiday.hotel.name}</strong></div>
              <div>Price per person: £{holiday.pricePerPerson.toFixed(2)}</div>
              <div>Total price: £{holiday.totalPrice.toFixed(2)}</div>
              <div>Hotel facilities: {holiday.hotel.content.hotelFacilities.join(', ')}</div>
              <div>Star rating: {holiday.hotel.content.starRating}</div>
              <Image
                src={holiday.hotel.content.images[0].RESULTS_CAROUSEL.url.startsWith('//') ? `https:${holiday.hotel.content.images[0].RESULTS_CAROUSEL.url}` : holiday.hotel.content.images[0].RESULTS_CAROUSEL.url}
                alt={holiday.hotel.name}
                width={200}
                height={200}
              />
            </li>
          ))
        ) : (
          <li>No results found for the selected rating.</li>
        )}
      </ul>
    </>
  );
}

export default SearchResultsComponent;
