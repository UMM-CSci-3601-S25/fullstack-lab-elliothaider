import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { TodoCategory } from './todo';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  readonly todoUrl: string = `${environment.apiUrl}todos`;

  private readonly statusKey = 'status';
  private readonly categoryKey = 'category';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { category?: TodoCategory; status?: boolean }): Observable<Todo[]> {

    let httpParams: HttpParams = new HttpParams();
    if (filters) {

      if (filters.category) {
        httpParams = httpParams.set(this.categoryKey, filters.category);
      }
      if (filters.status) {
        httpParams = httpParams.set(this.statusKey, filters.status);
      }
    }

    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }


  filterTodos(todos: Todo[], filters: { owner?: string, body?: string }): Todo[] {
    let filteredTodos = todos;

    // Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

    // Filter by body
    if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    return filteredTodos;
  }

  getTodoById(id: string): Observable<Todo> {
    // The input to get could also be written as (this.userUrl + '/' + id)
    return this.httpClient.get<Todo>(`${this.todoUrl}/${id}`);
  }

  addTodo(newTodo: Partial<Todo>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(response => response.id));
  }

}
