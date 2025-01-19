import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SocketWebService } from 'src/app/socket-web.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
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
