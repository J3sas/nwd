import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoBill } from '../model/user.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './admin-user-add.component.html',
  styleUrls: ['./admin-user-add.component.css']
})
export class AdminUserAddComponent implements OnInit {

  userInfoJson !: any
  empArray : UserInfoBill[] = []
  date = new Date();

  notifType !: string 
  notifMessage !: string 

  constructor(private _http : UserServiceService,
              private _fb : FormBuilder,
              private router : Router) { }

  ngOnInit(): void {
    
    this.jsonBill()
  }


  jsonBill(){
      this.userInfoJson = this._fb.group({
      name : ['',Validators.required],
      address : ['',Validators.required],
      accountNum : this.date.getFullYear()+'-'+Math.floor(Math.random() * 1000)+'-'+Math.floor(Math.random() * 100), // should be auto generated 
      rateClass :  'Residential',
      meterNum : ['',Validators.required], 
      prevRdgDate : '',
      balancePrevBill : 0,
      totalCurrBill : 0,
      accountType : 'User',
      billInfo : [[]],
      prevReading : 0
    })
    return this.userInfoJson.value
  }

  onSubmitUser(userInfo : any){
    console.log(userInfo)
    if (userInfo.status == `INVALID`) {
        this.notifType = `danger`
      this.notifMessage = `ERROR, something is wrong with your inputs`
      this.resetNotif()
    }else if(userInfo.status == `VALID`){
    this._http.addUser(userInfo.value)
    .subscribe(data => {
      this.notifType = `success`
      this.notifMessage = `Successfully added`
      this.userInfoJson.reset()
      this.resetNotif()

    })
    }
  }

  resetNotif(){
    setTimeout(() => this.notifType = ``,2500);
  }

  

}
