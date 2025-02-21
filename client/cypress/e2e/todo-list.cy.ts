import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should show 300 todos in both card and list view', () => {
    page.getTodoCards().should('have.length', 300);
    page.changeView('list');
    page.getTodoListItems().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todo 'Barry'
    cy.get('[data-test=todoOwnerInput]').type('Barry');

    // All of the todo cards should have the owner we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Barry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Barry')
    );
  });

  it('Should type something in the body filter and check that it returned elements', () => {
    // Filter for body "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse."
    cy.get('[data-test=todoBodySelect]').type("In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.");

    page.getTodoCards().should('have.lengthOf.above', 0);

  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });

  it('Should select a category, change the view, and check that it returned elements', () => {
    // Filter for role 'viewer');
    page.selectCategory('homework');

    // Choose the view type "List"
    page.changeView('list');

    // Some of the todos should be listed
    page.getTodoListItems().should('have.lengthOf.above', 0);

  });

  it('Should click add todo and go to the right URL', () => {
    // Click on the button for adding a new todo
    page.addTodoButton().click();

    // The URL should end with '/todos/new'
    cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

    // On the page we were sent to, We should see the right title
    cy.get('.add-todo-title').should('have.text', 'New Todo');
  });

});
