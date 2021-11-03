import { ViewChild } from '@angular/core';
import { Component, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') sideNav!: MatSidenav;
  screenWide = true;
  navBarOpenStatus = false;

  constructor(private router:Router){}

  ngOinit(){
    this.onResize(null);
  }

  toggleSideNav(event: Event){
    if(this.sideNav.opened){
      this.sideNav.close().finally(()=>this.navBarOpenStatus=false)
    }else if(this.screenWide==false && !this.sideNav.opened){
      this.sideNav.open().finally(()=>this.navBarOpenStatus=true)
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any){
    console.log("Size is @: ",window.innerWidth);
    if(window.innerWidth<=710){
      this.screenWide=false;
      if(this.navBarOpenStatus==true)
        this.sideNav.open().finally(()=>this.navBarOpenStatus=true)
    }else{
      this.screenWide=true;
      if(this.sideNav.opened)
        this.sideNav.close();
    }
  }
}
