import Filters from "@/app/components/filters/filters.component";
import { BookingResponse } from "@/types/booking";

describe('Filters Component', () => {
  it('renders with default filters', () => {
    const onFilterChangeMock = cy.spy().as('onFilterChangeSpy');

    const searchResultsMock: BookingResponse = {
      holidays: [
        {
          hotel: {
            id: 'hotel-id',
            name: 'Hotel Name',
            boardBasis: 'all-inclusive',
            content: {
              name: 'Hotel Name',
              vRating: '4.5',
              hotelDescription: 'Hotel Description',
              atAGlance: ['Hotel At a Glance'],
              parentLocation: '',
              images: [],
              holidayType: [],
              boardBasis: [],
              hotelFacilities: ['Pool', 'Gym', 'Spa'],
              starRating: '5',
              hotelLocation: [],
              accommodationType: [],
              propertyType: '',
            },
          },
          pricePerPerson: 1000,
          totalPrice: 2000,
          flyingClubMiles: 100,
          virginPoints: 500,
          tierPoints: 10,
          departureDate: '', 
          selectedDate: '',
        },
        {
          hotel: {
            id: 'hotel-id',
            name: 'Hotel Name',
            boardBasis: 'all-inclusive',
            content: {
              name: 'Hotel Name',
              vRating: '4.5',
              hotelDescription: 'Hotel Description',
              atAGlance: ['Hotel At a Glance'],
              parentLocation: '',
              images: [],
              holidayType: [],
              boardBasis: [],
              hotelFacilities: ['Pool', 'Gym', 'Spa'],
              starRating: '5',
              hotelLocation: [],
              accommodationType: [],
              propertyType: '',
            },
          },
          pricePerPerson: 800,
          totalPrice: 1600,
          flyingClubMiles: 80,
          virginPoints: 400,
          tierPoints: 8,
          departureDate: '',
          selectedDate: '',
        },
      ],
    };

    cy.mount(<Filters onFilterChange={onFilterChangeMock} searchResults={searchResultsMock} />);

    cy.get('[data-testid="priceRange"]').should('exist');
    cy.get('[data-testid="facilities"]').should('exist');
    cy.get('[data-testid="starRatings"]').should('exist');
  });
});