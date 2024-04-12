import Loading from "@/app/results/loading";


describe('Loading Component', () => {
  it('renders correctly', () => {
    cy.mount(<Loading />);
    cy.get('.fullScreenLoader').should('exist');
  });
});
