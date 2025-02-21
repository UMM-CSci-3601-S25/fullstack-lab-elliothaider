import { TodoCategory } from 'src/app/todos/todo';

export class TodoListPage {
  private readonly baseUrl = '/todos';
  private readonly pageTitle = '.todo-list-title';
  private readonly todoCardSelector = '.todo-cards-container app-todo-card';
  private readonly todoListItemsSelector = '.todo-nav-list .todo-list-item';
  private readonly radioButtonSelector = '[data-test=viewTypeRadio] mat-radio-button';
  private readonly todoCategoryDropdownSelector = '[data-test=todoCategorySelect]';
  private readonly todoStatusDropdownSelector = '[data-test=todoStatusSelect]';
  private readonly dropdownOptionSelector = 'mat-option';
  private readonly addTodoButtonSelector = '[data-test=addTodoButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getTodoTitle() {
    return cy.get(this.pageTitle);
  }

   getTodoCards() {
    return cy.get(this.todoCardSelector);
  }

  /**
   * Get all the `.user-list-item` DOM elements. This will
   * be empty if we're using the card view of the users.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `.user-list-item` DOM elements.
   */
  getTodoListItems() {
    return cy.get(this.todoListItemsSelector);
  }

  changeView(viewType: 'card' | 'list') {
    return cy.get(`${this.radioButtonSelector}[value="${viewType}"]`).click();
  }

  selectCategory(value: TodoCategory) {
    // Find and click the drop down
    cy.get(this.todoCategoryDropdownSelector).click();
    // Select and click the desired value from the resulting menu
    return cy.get(`${this.dropdownOptionSelector}[value="${value}"]`).click();
  }

  selectStatus(value: 'complete' | 'incomplete' ) {
    // Find and click the drop down
    cy.get(this.todoStatusDropdownSelector).click();
    // Select and click the desired value from the resulting menu
    return cy.get(`${this.dropdownOptionSelector}[value="${value}"]`).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}
