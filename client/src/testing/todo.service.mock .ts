import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Todo, TodoCategory } from '../app/todos/todo';
import { TodoService } from '../app/todos/todos.service';


@Injectable({
  providedIn: AppComponent
})
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'ba_id',
      owner: 'Ba',
      status: false,
      category: 'video games',
      body: 'deus'
    },
    {
      _id: 'baba_id',
      owner: 'Baba',
      status: true,
      category: 'homework',
      body: 'quid facis?'
    },
    {
      _id: 'bobe_id',
      owner: 'Bobe',
      status: true,
      category: 'software design',
      body: 'magister'
    }
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodos(_filters: { category?: TodoCategory; status?: boolean }): Observable<Todo[]> {

    return of(MockTodoService.testTodos);
  }

  // skipcq: JS-0105
  getTodoById(id: string): Observable<Todo> {
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else if (id === MockTodoService.testTodos[1]._id) {
      return of(MockTodoService.testTodos[1]);
    } else {
      return of(null);
    }
  }
}
