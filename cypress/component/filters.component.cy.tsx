import Filters from "@/app/components/filters/filters.component";

describe('Filters Component', () => {
  it('renders correctly and calls onFilterChange', () => {
    const onFilterChange = cy.stub();
    const searchResults = [];
    cy.mount(<Filters onFilterChange={onFilterChange} searchResults={searchResults} />);
    cy.get('.filterOption').click();
    cy.wrap(onFilterChange).should('have.been.called');
  });
});
