import Loading from "@/app/results/loading";

describe('Loading Component', () => {
  it('renders the loading animation', () => {
    cy.mount(<Loading />);

    const loading = cy.get('[data-testid="fullScreenLoader"]');
    expect(loading).to.exist;

    const loadingBar = cy.get('[data-testid="loadingBar"]');
    expect(loadingBar).to.exist;

    const bgImages = cy.get('[data-testid="backgroundImages"]');
    expect(bgImages).to.exist;
  });
});