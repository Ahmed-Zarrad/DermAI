import {Component, OnInit} from '@angular/core';
import {Claim} from 'src/app/models/Claim';
import {ClaimService} from 'src/app/services/Claim/claim.service';
import {StateClaim_Order} from "../../models/StateClaim_Order";

@Component({
  selector: 'app-claim-administrator',
  templateUrl: './claim-administrator.component.html',
  styleUrls: ['./claim-administrator.component.css']
})
export class ClaimAdministratorComponent implements OnInit {
  ListClaim:Claim[] = [{idClaim:0,titleClaim:"Acknowledgement",descriptionClaim:"This application is awesome",stateClaim: StateClaim_Order.treated, dateClaim:"Dec 2, 2023, 09:40 AM"},{idClaim:1,titleClaim:"Thanks",descriptionClaim:"This application is great",stateClaim: StateClaim_Order.untreated, dateClaim:"Dec 2, 2023, 09:30 AM"}];
  show:boolean = false;
addclaim:boolean = false;
//claim : Claim = new Claim();
  claim?:Claim;
  constructor(private ClaimService:ClaimService) {
    this.ClaimService.retreiveAllClaims().subscribe(res=>{console.log(res);
      this.ListClaim=res});
  }

  ngOnInit(): void {
  }



  ViewClaim(){
    this.show=true;
    this.addclaim=false;
  }

  AddClaimshow(){
    this.show=false;
    this.addclaim=true;
  }

  DeleteClaim(id:number){
    this.ClaimService.DeleteClaim(id).subscribe(()=>this.ClaimService.retreiveAllClaims().subscribe(res=>{this.ListClaim=res}));
  }


}
