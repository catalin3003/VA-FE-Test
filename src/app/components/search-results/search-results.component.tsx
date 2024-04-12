"use client"; // useState and useEffect are Client Components

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Filters from '../filters/filters.component';
import Loading from '@/app/results/loading';
import styles from './search-results.module.css';

import type { SearchResultsComponentProps, Holiday } from "@/types/booking";
import useHolidays from '@/hooks/use-holidays.hook';

const SearchResultsComponent: React.FC<SearchResultsComponentProps> = ({ searchParams }) => {
  const { loading, results, filteredHolidays, handleFilterChange } = useHolidays(searchParams);

  if (loading) {
    return <Loading />;
  }

  if (!results || results.holidays.length === 0) {
    return <div>No results found.</div>;
  }

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
                  <p>Facilities: {holiday.hotel.content.hotelFacilities.join(', ')}</p>
                  <p>Total price: £{holiday.totalPrice.toFixed(2)}</p>
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
