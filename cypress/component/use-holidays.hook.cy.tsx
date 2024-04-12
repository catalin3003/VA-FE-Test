import useHolidays from '@/hooks/use-holidays.hook';
import { SearchResultsComponentProps } from '@/types/booking';
import React from 'react';


function TestComponent({ searchParams }: { searchParams: SearchResultsComponentProps['searchParams'] }) {
  const { loading, results, filteredHolidays, handleFilterChange } = useHolidays(searchParams);
  if (loading) return <div>Loading...</div>;
  if (filteredHolidays.length > 0) {
    return (
      <ul>
        {filteredHolidays.map((holiday, index) => (
          <li key={index}>{holiday.hotel.name}</li>
        ))}
      </ul>
    );
  }
  return null;
}

describe('useHolidays Hook', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://www.virginholidays.co.uk/cjs-search-api/search', {
      fixture: 'holidays.json'
    }).as('getHolidays');
  });

  it('fetches and filters holidays', () => {
    const searchParams = {};
    cy.mount(<TestComponent searchParams={searchParams} />);
    cy.wait('@getHolidays');
    cy.get('ul').children().should('have.length.greaterThan', 0);
  });
});
