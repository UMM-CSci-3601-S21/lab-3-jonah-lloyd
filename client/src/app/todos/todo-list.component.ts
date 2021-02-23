import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: []
})

export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  // This is left out because it is used in server side I believe
  // public todoOwner: string;
  public todoOwner: string;
  public todoStatus: boolean;
  public todoCompany: string;
  public todoBody: string;
  public todoCategory: string;
  public viewType: 'card' | 'list' = 'card';

  // Inject the UserService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.
  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {

  }

  getTodosFromServer() {
    this.todoService.getTodos({
      owner: this.todoOwner,
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      // If there was an error getting the users, display
      // a message.
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
      // I (Nic) feel like we should throw an error here, but
      // I can't figure out how to test that at the moment,
      // so I'm going to leave it out. If someone knows
      // how to make this work that would be great.
      //
      // Now throw an error, which will show up in the browser
      // JavaScript console and allow us to examine the stack
      // trace.
      //
      // throw new Error('Failed to connect to the server: ' + err);
    });
  }

  public updateFilter() {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { owner: this.todoOwner });
  }

  /**
   * Starts an asynchronous operation to update the users list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }
}
