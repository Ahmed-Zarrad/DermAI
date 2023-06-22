import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
// @ts-ignore
import {TokenstorageService} from "../../services/tokenstorage/tokenstorage.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  result: any;
  constructor(private tokenstorageService: TokenstorageService){}
  ngOnInit(): void {
    this.tokenstorageService.result.subscribe((value: any)=>{
      this.result = value;
    });
  }
}
