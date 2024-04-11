"use client";
import { BookingResponse, Holiday } from "@/types/booking";
import isEqual from 'lodash/isEqual';
import { Rooms } from "@/utils/composition.service";
import { useEffect, useState } from "react";
import Filters from "../filters/filters.component";

interface FilterCriteria {
  priceRange?: [number, number];
  facilities?: string[];
  starRatings?: number[];
}


async function getData(params: { [key: string]: string | string[] | undefined }) {
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

export default function SearchResultsComponent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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

    if (filters.starRatings && filters.starRatings?.length > 0) {
      filteredResults = filteredResults.filter(holiday =>
        (filters.starRatings ?? []).includes(Number(holiday.hotel.content.starRating))
      );
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
    return <div>Loading...</div>;
  }

  if (!results || results.holidays.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <>
      <div>{results.holidays.length} results found</div>
      <Filters onFilterChange={handleFilterChange} searchResults={results}/>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((holiday: Holiday, index: number) => (
            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <div><strong>{holiday.hotel.name}</strong></div>
              <div>Price per person: £{holiday.pricePerPerson.toFixed(2)}</div>
              <div>Total price: £{holiday.totalPrice.toFixed(2)}</div>
              <div>Hotel facilities: {holiday.hotel.content.hotelFacilities.join(', ')}</div>
              <div>Star rating: {holiday.hotel.content.starRating}</div>
            </li>
          ))
        ) : (
          <li>No results found for the selected rating.</li>
        )}
      </ul>
    </>
  );
}
