import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  readonly todoUrl: string = `${environment.apiUrl}todos`;

  private readonly statusKey = 'status';
  private readonly ownerKey = 'owner';
  private readonly bodyKey = 'contains';
  private readonly categoryKey = 'category';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { status?: boolean; owner?: string; body?: string; category?: string }): Observable<Todo[]> {

    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set(this.statusKey, filters.status);
      }
      if (filters.owner) {
        httpParams = httpParams.set(this.ownerKey, filters.owner);
      }
      if (filters.body) {
        httpParams = httpParams.set(this.bodyKey, filters.body);
      }
      if (filters.category) {
        httpParams = httpParams.set(this.categoryKey, filters.category);
      }
    }

    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }


  filterTodos(todos: Todo[], filters: { status?: boolean }): Todo[] { // skipcq: JS-0105
    let filteredTodos = todos;

    // Filter by status
    if (filters.status) {
      filteredTodos = filteredTodos.filter(todo => todo.status == filters.status);
    }

    return filteredTodos;
  }

}
