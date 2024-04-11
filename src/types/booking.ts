export interface BookingRequest {
  bookingType: string
  location: string
  direct: boolean
  departureDate: string
  duration: string
  gateway: string
  partyCompositions: PartyComposition[]
}

export interface BookingResponse {
  holidays: Holiday[]
}

export interface Holiday {
  totalPrice: number
  pricePerPerson: number
  flyingClubMiles: number
  virginPoints: number
  tierPoints: number
  departureDate: string
  selectedDate: string
  hotel: Hotel
}

export interface PartyComposition {
  adults: number
  childAges: number[]
  infants: number
}

export interface Hotel {
  id: string
  name: string
  boardBasis: string
  content: HotelContent
}

export interface HotelContent {
  name: string
  vRating: number | string
  hotelDescription: string
  atAGlance: string[]
  parentLocation: string
  images: HotelImage[]
  holidayType: string[]
  boardBasis: string[]
  hotelLocation: string[]
  accommodationType: string[]
  hotelFacilities: string[]
  starRating: StarRating
  propertyType: string
}

export interface HotelImage {
  RESULTS_CAROUSEL: Image
}

export interface Image {
  url: string
}

export interface SearchResultsComponentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export type StarRating = number | string

export interface FilterCriteria {
  priceRange?: [number, number]
  facilities?: string[]
  starRatings?: StarRating[]
}

export interface FiltersProps {
  onFilterChange: (filters: FilterCriteria) => void
  searchResults: BookingResponse
}
