import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Todo } from '../interfaces/todo.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    todos: Todo[] = [];
    originalTodos: any = [];
    userId: string | null = '';
    searchText: string = '';

    constructor(
    private db: AngularFirestore,
    private _bottomSheet: MatBottomSheet, 
    private auth: AngularFireAuth, 
    private router: Router,
    private modelService:NgbModal,
    ) {}

    ngOnInit(): void {
       
        
        if (localStorage.getItem('userId')) {
            this.userId = localStorage.getItem('userId');
            if (this.userId) {
                this.getTodos();
            }
        }
    }

    getTodos() {
        this.db.collection('high-task', ref => ref.where('userId', '==', this.userId)).valueChanges({ idField: 'id' }).subscribe((data: any) => {
            this.todos = data;
            this.originalTodos = data;
        });
    }

    addTodo(): void {
        this.modelService.open(AddTodoComponent);

    }

    updateTodo(todo: Todo) {
       const modelRef= this.modelService.open(AddTodoComponent);
       modelRef.componentInstance.data = (todo);
    }

    deleteTodo(todo: Todo) {
        this.db.collection('high-task').doc(todo.id).delete();
    }

    getDate(date: any) {
        return date.toDate()
    }

    search() {
        this.todos = this.originalTodos.filter((data: Todo) => data.title.toLowerCase().includes(this.searchText.toLowerCase()) || data?.description?.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    logout() {
        this.auth.signOut().then(() => {
            localStorage.clear();
            this.router.navigate(['login']);
        });
    }
}
