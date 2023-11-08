import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() image: any;
  @Input() skinType: any;
  @Input() probability: any;
  @Input() symptoms: any;
  @Input() howCommon: any;
  @Input() treatments: any;
  @Input() duration: any;
  constructor(){}
  ngOnInit(): void {}
}
