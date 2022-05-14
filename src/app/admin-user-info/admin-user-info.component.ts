import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
  billInfoPayment !: any
  billInfoSe !: UserInfoBill
  readingForMonth  = 0
  addBillDiv = false
  waterRateResidence !: number
  presentRdgInt !: any
  userHasPaymentReq !: any
  userIsLoggedIn !: any
  notifType !: string
  notifMessage !: string
  notAuthorized = false
  addBillDivPaymentInput !: any
  amountPaid = new FormControl();
  
  dummyJsonPayment = {
    billNo: "",
    billingMonth: "",
    dateOfRdg: "",
    presentRdg: 0,
    consumed: 0,
    currentBillCharges: 0,
    dueDate: ""
  }
  constructor(private _http : UserServiceService,
            private route : ActivatedRoute,
            private fb : FormBuilder,
            private router : Router) { }

  
  ngOnInit(): void {

    if (sessionStorage.getItem('authorization')) {
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
    console.log(`invalid`,this.jsonBillForPayment(this.dummyJsonPayment,'invalid'))
    }else{
      this.notAuthorized = true
    }

    
      
  }


  addBill(){
    this.addBillDiv = true
    this.addBillDivPaymentInput = false
    
  }
  billDone(){
    if (this.userInfoTrueData.billInfo.length != 0) {
      this.userInfoTrueData.paidBillInfo.push(this.userInfoTrueData.billInfo)
    this.userInfoTrueData.paidBillInfo.push(this.jsonBillForPayment(this.userInfoTrueData.billInfo,'valid'))
    this.userInfoTrueData.prevRdgDate = this.userInfoTrueData.billInfo.dateOfRdg
    this.userInfoTrueData.prevReading =  this.userInfoTrueData.prevReading + this.userInfoTrueData.billInfo.presentRdg
    }
    
    //console.log(this.userInfoTrueData)
    if (this.userInfoTrueData.billInfo.length == 0) {
      this.userInfoTrueData.paidBillInfo.push(this.jsonBillForPayment(this.dummyJsonPayment,'paymentOnly'))
    }
    
    let tempTotal = this.userInfoTrueData.totalCurrBill - this.amountPaid.value // 500
    this.userInfoTrueData.balancePrevBill = tempTotal
    this.userInfoTrueData.totalCurrBill = tempTotal
    this.userInfoTrueData.hasActiveBill = this.userInfoTrueData.totalCurrBill == 0 ? false : true 
    this.userInfoTrueData.hasReqPayment = false
    
    this.userInfoTrueData.billInfo = []
    console.log(`bill paid`,this.userInfoTrueData)
    
    this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => {
      console.log(`Updated successfully`)
      this.notifType = `success`
      this.notifMessage = `Successsfully received payment `
    })
    this.amountPaid.reset()
  }
  jsonBillForPayment(formerData :any,actionType : any){
    let date = new Date();
    let fullDate: string = (date.getMonth()+1)+'-'+date.getDate()+'-'+date.getFullYear()
    if (actionType == 'invalid') {
      this.billInfoPayment = this.fb.group({
        billNo : '',
        billingMonth : '',
        dateOfRdg : '',
        presentRdg : '',
        consumed :  '',
        currentBillCharges : '',
        dueDate : '',
        typeOfTransaction : '',
        billBalance : 0,
      })
      return this.billInfoPayment.value
    }else if(actionType == 'paymentOnly'){
      this.billInfoPayment = this.fb.group({
        billNo : '',
        billingMonth : fullDate,
        dateOfRdg : '',
        presentRdg : '',
        consumed :  '',
        currentBillCharges : '',
        dueDate : '',
        typeOfTransaction : 'payment',
        billBalance : this.userInfo.totalCurrBill - this.amountPaid.value
      })
      return this.billInfoPayment.value

    }else{
      this.billInfoPayment = this.fb.group({
        billNo : formerData.billNo,
        billingMonth : formerData.billingMonth,
        dateOfRdg : formerData.dateOfRdg,
        presentRdg : formerData.presentRdg,
        consumed :  formerData.consumed,
        currentBillCharges : formerData.currentBillCharges,
        dueDate : formerData.dueDate,
        typeOfTransaction : 'payment',
        billBalance : this.userInfo.totalCurrBill - this.amountPaid.value
      })
      return this.billInfoPayment.value
    }
    
  }

  showPaymentInput(){
    this.addBillDivPaymentInput = true

  }
  jsonBill(){
    let date = new Date();
    let fullDate: string = (date.getMonth()+1)+'-'+date.getDate()+'-'+date.getFullYear()
    let dueDateFormat: string = (date.getMonth()+2)+'-'+date.getDate()+'-'+date.getFullYear()
    
    let monthName = date.toLocaleString('en-us', { month: 'long' });
    //let dueDate = date.toLocaleString('en-us', { month: 'long' });
    //console.log(`this.userInfo.prevReading`,this.userInfoTrueData)
    this.billInfo = this.fb.group({
      billNo : date.getFullYear()+date.getMonth()+1+this.userInfo.id,
      billingMonth : monthName + ' ' + date.getFullYear(),
      dateOfRdg : fullDate,
      presentRdg : this.presentRdgInt,
      consumed :  this.readingForMonth,
      currentBillCharges : this.readingForMonth * this.waterRateResidence,
      dueDate : dueDateFormat,
      typeOfTransaction : 'billing',
      billBalance : this.userInfo.totalCurrBill 
    })
    return this.billInfo.value
  }

  onSubmit(data : any){
    if (this.userInfo.billInfo.length != 0 ) {
      console.log(`has active bill`)
      this.userInfoTrueData.paidBillInfo.push(this.userInfo.billInfo)
      this.readingForMonth = data.value.presentRdg - this.userInfo.prevReading // cur reading - prev = consumed reading
      this.userInfoTrueData.balancePrevBill = this.userInfo.totalCurrBill 
      this.userInfoTrueData.prevReading = this.userInfo.prevReading + this.userInfo.billInfo.consumed
      this.userInfoTrueData.prevRdgDate =  this.userInfo.billInfo.dateOfRdg
      // this.userInfoTrueData.hasActiveBill = true
      // this.userInfoTrueData.totalCurrBill = (this.readingForMonth * this.waterRateResidence ) +  this.userInfoTrueData.balancePrevBill
    }
    this.readingForMonth = data.value.presentRdg - this.userInfo.prevReading
    this.userInfoTrueData.hasActiveBill = true
    this.presentRdgInt = data.value.presentRdg
    this.userInfoTrueData.totalCurrBill = (this.readingForMonth * this.waterRateResidence ) +  this.userInfoTrueData.balancePrevBill
    
    
    this.userInfoTrueData.billInfo = this.jsonBill()
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
  logoutCredentials(){
    sessionStorage.removeItem('authorization')
    sessionStorage.removeItem('userInfo')
    this.router.navigate(['/'])
  }
 

}
