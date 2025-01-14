import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit{


  constructor(
       @Inject(MAT_DIALOG_DATA) public data: any,
       private dialogRef: MatDialogRef<DialogLoginComponent>,
       private router: Router

  ){}

  ngOnInit(): void {
    
  }

  closeDialogWithResult(): void {
      this.dialogRef.close();
  }

  login(): void {
    this.router.navigate(['login'])
    this.dialogRef.close();
  }
}
