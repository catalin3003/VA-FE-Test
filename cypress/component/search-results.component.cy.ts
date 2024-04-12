import SearchResultsComponent from '@app/components/search-results/search-results.component'

describe('SearchResultsComponent', () => {
  it('renders loading state', () => {
    cy.mount(<SearchResultsComponent searchParams={{}} />)
    cy.get('.loadingState').should('exist')
  })

  it('renders results', () => {
    cy.mount(<SearchResultsComponent searchParams={{}} />)
    cy.get('.results').should('exist')
  })
})
