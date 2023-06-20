import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// @ts-ignore
import {TokenstorageService} from "../../services/tokenstorage/tokenstorage.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent {
  public router: Router;
  showWindow: boolean = true;
  hideWindow: boolean = true;
  constructor(router: Router,private tokenStorageService:TokenstorageService, private route: ActivatedRoute) {
    this.router = router;
  }
  ngOnInit(): void {
  }
  public hidewindow(){
    this.hideWindow=!this.hideWindow;
    this.tokenStorageService.setHideWindow(this.hideWindow);
  }
}
