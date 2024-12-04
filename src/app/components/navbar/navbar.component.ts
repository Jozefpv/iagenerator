import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuOptions = [
    { id: 0, title: 'Animales', avatarImage: 'assets/photos/dog.png' },
    { id: 1, title: 'Superhéroes', avatarImage: 'assets/photos/spiderman.png' },
    { id: 2, title: 'Princesas', avatarImage: 'assets/photos/princess.png' },
    { id: 3, title: 'Coches', avatarImage: 'assets/photos/lambo.png' },
    { id: 4, title: 'Famosos', avatarImage: 'assets/photos/messi.png' },
    { id: 5, title: 'Dibujos Animados', avatarImage: 'assets/photos/serie.png' }
  ]

  constructor(private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    
  }

  homeRedirect(){
    this.router.navigate(['/'])
  }

  closeSession(){
    this.authService.logout().subscribe(res => {
      if(res){
        localStorage.clear()
        this.router.navigate(['/login'])
      }
    })
  }
}
