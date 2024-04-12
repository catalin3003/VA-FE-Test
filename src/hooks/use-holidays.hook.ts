import { useState, useEffect } from 'react'
import isEqual from 'lodash/isEqual'

import { Rooms } from '@/utils/composition.service'

import type {
  BookingResponse,
  FilterCriteria,
  Holiday,
  SearchResultsComponentProps,
} from '@/types/booking'

const useHolidays = (
  searchParams: SearchResultsComponentProps['searchParams']
) => {
  const [results, setResults] = useState<BookingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([])
  const [filters, setFilters] = useState<FilterCriteria>({
    priceRange: undefined,
    facilities: [],
    starRatings: [],
  })

  // Fetch data on component mount or when searchParams change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const body = {
          bookingType: searchParams.bookingType,
          direct: false,
          location: searchParams.location,
          departureDate: searchParams.departureDate,
          duration: searchParams.duration,
          gateway: searchParams.gateway,
          partyCompositions: Rooms.parseAndConvert([
            searchParams.partyCompositions as string,
          ]),
        }

        const res = await fetch(
          'https://www.virginholidays.co.uk/cjs-search-api/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        )

        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }

        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  // Apply filters whenever results or filters change
  useEffect(() => {
    if (results) {
      let filteredResults = results.holidays

      if (filters.priceRange?.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange
        filteredResults = filteredResults.filter(
          (holiday) =>
            holiday.pricePerPerson >= minPrice &&
            holiday.pricePerPerson <= maxPrice
        )
      }

      if (filters.facilities && filters.facilities.length > 0) {
        filteredResults = filteredResults.filter((holiday) =>
          (filters.facilities ?? []).every((facility) =>
            holiday.hotel.content.hotelFacilities.includes(facility)
          )
        )
      }

      if (filters.starRatings && filters.starRatings.length > 0) {
        filteredResults = filteredResults.filter((holiday) => {
          const holidayRating = holiday.hotel.content.starRating
          return (filters.starRatings ?? []).some((rating) =>
            typeof rating === 'number'
              ? holidayRating === rating.toString()
              : holidayRating === rating
          )
        })
      }

      setFilteredHolidays(filteredResults)
    }
  }, [results, filters])

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters((prevFilters) => {
      // Only update if the filters have actually changed
      if (!isEqual(prevFilters, newFilters)) {
        return { ...prevFilters, ...newFilters }
      }
      return prevFilters
    })
  }

  return { loading, results, filteredHolidays, handleFilterChange }
}

export default useHolidays
