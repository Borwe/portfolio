import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  screenWide = true;

  ngOinit(){
    this.onResize(null);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any){
    console.log("Size is @: ",window.innerWidth);
    if(window.innerWidth<=890)
      this.screenWide=false;
  }
}
