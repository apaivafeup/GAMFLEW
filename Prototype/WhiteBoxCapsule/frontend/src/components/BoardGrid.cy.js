import BoardGrid from './BoardGrid.vue'

describe('<BoardGrid />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(BoardGrid)
  })
})