import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { NgModel } from '@angular/forms';
import { SocketWebService } from 'src/app/socket-web.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogLoadingComponent } from './dialog-loading/dialog-loading.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  userInput: string = '';
  imageURL = 'https://cdn.pixabay.com/photo/2024/06/18/13/53/ai-generated-8838122_1280.jpg'

  private socketSubscription: Subscription | undefined;
  private progressSubscription: Subscription | undefined;
  imageProgress: number = 0
  loading = false

  constructor(private mainService: MainService, private socketService: SocketWebService, private dialog: MatDialog, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // this.socketSubscription = this.socketService.listenForImageUrls().subscribe((urls: string[]) => {
    //   this.imageURL = urls[0];
    //   this.loading = false
    // });

    // this.progressSubscription = this.socketService.listenForImageProgress().subscribe((data: any) => {
    //   this.imageProgress = data.progress;
    //   console.log(`Progreso de la imagen ${data.id}: ${this.imageProgress}%`);
    // });

  }

  openDialog(): void {

    this.authService.isAuthenticated().subscribe((res) => {
      if(res){
        const dialogRef = this.dialog.open(DialogLoadingComponent, {
          width: '600px',
          data: { userInput: this.userInput },
          disableClose: true
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.imageURL = result;
          }
        });
      } else {
        const dialogRef = this.dialog.open(DialogLoginComponent, {
          width: '600px',
          data: { userInput: this.userInput },
          disableClose: true
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.imageURL = result;
          }
        });
      }
    })
  }

  showNotification(message: string, action: string = '', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  printPhoto(): void {
    const printContent = document.createElement('div');
    printContent.style.position = 'fixed';
    printContent.style.top = '0';
    printContent.style.left = '0';
    printContent.style.width = '100%';
    printContent.style.height = '100%';
    printContent.style.background = 'white';
    printContent.style.display = 'flex';
    printContent.style.justifyContent = 'center';
    printContent.style.alignItems = 'center';
    printContent.style.zIndex = '9999';
  
    const img = document.createElement('img');
    img.src = this.imageURL;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
  
    printContent.appendChild(img);
    document.body.appendChild(printContent);
  
    window.print();
  
    document.body.removeChild(printContent);
  }

  navigateToRoute(){
    const encodedUrl = encodeURIComponent(this.imageURL);
    this.router.navigate([`/board/${encodedUrl}`]);
  }

}
