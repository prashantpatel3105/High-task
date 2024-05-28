import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { finalize } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-todo',
    templateUrl: './add-todo.component.html',
    styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent implements OnInit {

    todoForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        dueDate: new FormControl(new Date(), [Validators.required]),
        attachment: new FormControl('')
    });
    userId: string | null = '';
    isUpdate: boolean = false;
    imageUrl: string = '';
    data: any;

    constructor(
        private db: AngularFirestore, 
        private storage: AngularFireStorage, 
        private modelService:NgbModal
        ) { }

    ngOnInit(): void {
        if (this.data && this.data.id) {
            this.isUpdate = true;
            this.todoForm.patchValue({
                title: this.data.title,
                description: this.data.description,
                dueDate: new Date(this.data.dueDate.toDate()),
                attachment: this.data.attachment
            });
        }

        if (localStorage.getItem('userId')) {
            this.userId = localStorage.getItem('userId');
        }
    }

    add() {
        if (!this.isUpdate) {
            const { title, description, dueDate, attachment } = this.todoForm.getRawValue();
            this.db.collection('high-task').add({ title, description, dueDate: dueDate, userId: this.userId }).then((data: any) => {
            this.modelService.dismissAll();

            });
        } else {
            const { title, description, dueDate, attachment } = this.todoForm.getRawValue();
            this.db.collection('high-task').doc(this.data.id).update({ title, description, dueDate: dueDate }).then((data: any) => {
            this.modelService.dismissAll();
                
            })
        }
    }



}
