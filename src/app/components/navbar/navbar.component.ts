import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SocketWebService } from 'src/app/socket-web.service';

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

  isAuth = false;

  constructor(private router: Router, private authService: AuthService, private socketService: SocketWebService){}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((res) => {
      this.isAuth = res
    })
  }

  homeRedirect(){
    this.router.navigate(['/'])
  }

  closeSession(){
    const userGuid = localStorage.getItem('userGuid') || '';
    this.socketService.emit('logout', { userGuid: userGuid });
    this.authService.logout().subscribe(res => {
      if(res){
        localStorage.clear()
        this.router.navigate(['/login'])
      }
    })
  }
}
