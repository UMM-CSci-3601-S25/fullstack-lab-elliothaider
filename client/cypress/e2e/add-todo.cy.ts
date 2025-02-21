import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('Ba');
    page.addTodoButton().should('be.enabled');
    page.getFormField('body').type('quid facis?');
    page.addTodoButton().should('be.enabled');
  });
});
