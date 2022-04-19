import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoBill } from '../model/user.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-admin-user-info',
  templateUrl: './admin-user-info.component.html',
  styleUrls: ['./admin-user-info.component.css']
})
export class AdminUserInfoComponent implements OnInit {

  userInfo !: any
  userInfoTrueData !: any
  billInfo !: any
  billInfoSe !: UserInfoBill
  readingForMonth  = 0
  addBillDiv = false
  waterRateResidence !: number
  presentRdgInt !: any
  userHasPaymentReq !: any
  userIsLoggedIn !: any
  notifType !: string
  notifMessage !: string

  constructor(private _http : UserServiceService,
            private route : ActivatedRoute,
            private fb : FormBuilder) { }

  
  ngOnInit(): void {
    this.userInfo = this.route.snapshot.paramMap.get('id')

    if ( sessionStorage.getItem('authorization')  == 'User') {
      this.userIsLoggedIn = `User`
    }else if(sessionStorage.getItem('authorization')  == 'Admin'){
      this.userIsLoggedIn = `Admin`
    }
    
    this._http.getUser(this.userInfo)
    .subscribe(data => {
      this.userInfo = data,
      this.userInfoTrueData = data
      sessionStorage.setItem('userInfo',JSON.stringify(this.userInfo))
    })

    this._http.getWaterResidence()
    .subscribe(data => {
      this.waterRateResidence = data.residence
    })

    
    this.jsonBill()
      
  }


  addBill(){
    this.addBillDiv = true
    console.log(`I am adding a bill`)
  }
  billDone(){
    this.userInfoTrueData.prevReading = this.userInfoTrueData.billInfo.presentRdg
    this.userInfoTrueData.prevRdgDate = this.userInfoTrueData.billInfo.dateOfRdg
    this.userInfoTrueData.totalCurrBill = 0
    this.userInfoTrueData.balancePrevBill = 0
    this.userInfoTrueData.hasActiveBill = false
    this.userInfoTrueData.hasReqPayment = false
    this.userInfoTrueData.billInfo = []
    console.log(`bill paid`,this.userInfoTrueData)
    this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => {
      console.log(`Updated successfully`)
      this.notifType = `success`
      this.notifMessage = `Successsfully received payment `
    })
  }

  jsonBill(){
    let date = new Date();
    let fullDate: string = (date.getMonth()+1)+'-'+date.getDate()+'-'+date.getFullYear()
    let dueDateFormat: string = (date.getMonth()+2)+'-'+date.getDate()+'-'+date.getFullYear()
    
    let monthName = date.toLocaleString('en-us', { month: 'long' });
    //let dueDate = date.toLocaleString('en-us', { month: 'long' });
    //console.log(`this.userInfo.prevReading`,this.userInfoTrueData)
    this.billInfo = this.fb.group({
      billingMonth : monthName + ' ' + date.getFullYear(),
      dateOfRdg : fullDate,
      presentRdg : this.presentRdgInt,
      consumed :  this.readingForMonth,
      currentBillCharges : this.readingForMonth * this.waterRateResidence,
      dueDate : dueDateFormat,
    })
    return this.billInfo.value
  }

  onSubmit(data : any){
    this.readingForMonth = data.value.presentRdg - this.userInfo.prevReading
    this.userInfoTrueData.hasActiveBill = true
    this.presentRdgInt = data.value.presentRdg
    this.userInfoTrueData.totalCurrBill = (this.readingForMonth * this.waterRateResidence ) +  this.userInfoTrueData.balancePrevBill
    //this.billInfo.presentRdg = data.value.presentRdg
    console.log(this.userInfoTrueData.billInfo = this.jsonBill())
    console.log(`Data`,this.userInfoTrueData)
    this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => {
      console.log(`Done success`)
    })
    this.addBillDiv = false
  }
  reqConfirmationPayment(){
    this.userInfoTrueData.hasReqPayment = true
    this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => 
      {
        console.log(`Done `,data)
      })
  }
 

}
