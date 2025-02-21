import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Todo, TodoCategory } from './todo';
import { TodoCardComponent } from './todo-card.component';
import { TodoService } from './todos.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

/**
 * A component that displays a list of users, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TodoCardComponent,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {
  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoCategory = signal<TodoCategory | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);

  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);


  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  private todoCategory$ = toObservable(this.todoCategory);
  private todoStatus$ = toObservable(this.todoStatus);

  // We ultimately `toSignal` this to be able to access it synchronously, but we do all the RXJS operations
  // "inside" the `toSignal()` call processing and transforming the observables there.
  serverFilteredTodos =
    // This `combineLatest` call takes the most recent values from these two observables (both built from
    // signals as described above) and passes them into the following `.pipe()` call. If either of the
    // `userRole` or `userAge` signals change (because their text fields get updated), then that will trigger
    // the corresponding `userRole$` and/or `userAge$` observables to change, which will cause `combineLatest()`
    // to send a new pair down the pipe.
    toSignal(
      combineLatest([this.todoCategory$, this.todoStatus$]).pipe(
        // `switchMap` maps from one observable to another. In this case, we're taking `role` and `age` and passing
        // them as arguments to `userService.getUsers()`, which then returns a new observable that contains the
        // results.
        switchMap(([category, status]) =>
          this.todoService.getTodos({
            category,
            status,
          })
        ),

        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg.set(
              `Problem in the client – Error: ${err.error.message}`
            );
          } else {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          // `catchError` needs to return the same type. `of` makes an observable of the same type, and makes the array still empty
          return of<Todo[]>([]);
        }),
        // Tap allows you to perform side effects if necessary
        tap(() => {
          // A common side effect is printing to the console.
          // You don't want to leave code like this in the
          // production system, but it can be useful in debugging.
          // console.log('Users were filtered on the server')
        })
      )
    );

  // No need for fancy RXJS stuff. We do the fancy RXJS stuff where we call `toSignal`, i.e., up in
  // the definition of `serverFilteredUsers` above.
  // `computed()` takes the value of one or more signals (`serverFilteredUsers` in this case) and
  // _computes_ the value of a new signal (`filteredUsers`). Angular recognizes when any signals
  // in the function passed to `computed()` change, and will then call that function to generate
  // the new value of the computed signal.
  // In this case, whenever `serverFilteredUsers` changes (e.g., because we change `userName`), then `filteredUsers`
  // will be updated by rerunning the function we're passing to `computed()`.
  filteredTodos = computed(() => {
    const serverFilteredTodos = this.serverFilteredTodos();
    return this.todoService.filterTodos(serverFilteredTodos, {
      owner: this.todoOwner(),
      body: this.todoBody(),
    });
  });
}
