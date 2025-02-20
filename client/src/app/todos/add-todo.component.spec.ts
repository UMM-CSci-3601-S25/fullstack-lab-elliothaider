import { Location } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoProfileComponent } from './todo-profile.component';
import { TodoService } from './todos.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Todo } from './todo';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(TodoService, { useValue: new MockTodoService() });
    TestBed.configureTestingModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterModule,
        AddTodoComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('The owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodoComponent.addTodoForm.controls.owner;
    });


    it('should not allow empty owner', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with "Chris Smith"', () => {
      ownerControl.setValue('Chris Smith');
      expect(ownerControl.valid).toBeTruthy();
    });
  });

  describe('The body field', () => {
    it('should allow empty values', () => {
      const companyControl = addTodoForm.controls.company;
      companyControl.setValue('');
      expect(companyControl.valid).toBeTruthy();
    });
  });

  describe('The category field', () => {
    let categoryControl: AbstractControl;

    beforeEach(() => {
      categoryControl = addTodoForm.controls.role;
    });

    it('should not allow empty values', () => {
      categoryControl.setValue('');
      expect(categoryControl.valid).toBeFalsy();
      expect(categoryControl.hasError('required')).toBeTruthy();
    });

    it('should allow "software design"', () => {
      categoryControl.setValue('software design');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should allow "homework"', () => {
      categoryControl.setValue('homework');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should allow "video games"', () => {
      categoryControl.setValue('video games');
      expect(categoryControl.valid).toBeTruthy();
    });

    it('should not allow "groceries"', () => {
      categoryControl.setValue('groceries');
      expect(categoryControl.valid).toBeFalsy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      let controlName: keyof typeof addTodoComponent.addTodoValidationMessages = 'owner';
      addTodoComponent.addTodoForm.get(controlName).setErrors({'required': true});
      expect(addTodoComponent.getErrorMessage(controlName)).toEqual('Owner is required');

      controlName = 'category';
      addTodoComponent.addTodoForm.get(controlName).setErrors({'required': true});
      expect(addTodoComponent.getErrorMessage(controlName)).toEqual('Category is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof addTodoComponent.addTodoValidationMessages = 'owner';
      addTodoComponent.addTodoForm.get(controlName).setErrors({'unknown': true});
      expect(addTodoComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  })
});

describe('AddTodoComponent#submitForm()', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoService: TodoService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(TodoService, { useValue: new MockTodoService() });
    TestBed.configureTestingModule({
    imports: [ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: 'todos/1', component: TodoProfileComponent }
        ]),
        AddTodoComponent, TodoProfileComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    location = TestBed.inject(Location);
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.addTodoForm.controls.owner.setValue('Chris Smith');
    component.addTodoForm.controls.status.setValue("Complete");
    component.addTodoForm.controls.category.setValue('homework');
    component.addTodoForm.controls.body.setValue('quid facis?');
  });

  it('should call addTodo() and handle success response', fakeAsync(() => {
    fixture.ngZone.run(() => {
      const addTodoSpy = spyOn(todoService, 'addTodo').and.returnValue(of('1'));
      component.submitForm();
      const newTodo: Partial<Todo> = { owner: component.addTodoForm.value.owner, status: component.addTodoForm.value.status === 'Complete', category: component.addTodoForm.value.category, body: component.addTodoForm.value.body};
      expect(addTodoSpy).toHaveBeenCalledWith(newTodo);
      tick();
      expect(location.path()).toBe('/todos/1');
      flush();
    });
  }));

  it('should call addTodo() and handle error response', () => {
    const path = location.path();
    const errorResponse = { status: 500, message: 'Server error' };
    const addTodoSpy = spyOn(todoService, 'addTodo')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    const newTodo: Partial<Todo> = { owner: component.addTodoForm.value.owner, status: component.addTodoForm.value.status === 'Complete', category: component.addTodoForm.value.category, body: component.addTodoForm.value.body};
    expect(addTodoSpy).toHaveBeenCalledWith(newTodo);
    expect(location.path()).toBe(path);
  });
});
