import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserBillInformation, UserInfoBill } from '../model/user.model';
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
  userNotEnoguh !: boolean
  amountPaid = new FormControl();
  consumedBillController = new FormControl();

  dummyJsonPayment = {
    billNo: "",
    billingMonth: "",
    dateOfRdg: "",
    presentRdg: 0,
    consumed: 0,
    currentBillCharges: 0,
    dueDate: ""
  }

   date = new Date();
   fullDate: string = (this.date.getMonth()+1)+'-'+this.date.getDate()+'-'+this.date.getFullYear()
   dueDateFormat: string = (this.date.getMonth()+2)+'-'+this.date.getDate()+'-'+this.date.getFullYear()
   monthName = this.date.toLocaleString('en-us', { month: 'long' });

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
      this.waterRateResidence = data[0].residence
      console.log(this.waterRateResidence)
    })

    
    this.jsonBill()
    console.log(`invalid`,this.jsonBillForPayment(this.dummyJsonPayment,'invalid'))
    }else{
      this.notAuthorized = true
    }
      //console.log(this.generateJsonBillModel('billing'))
  }

  generateJsonBillModel(typeOfGen : string ){
    if(this.countActiveBill() == undefined || this.countActiveBill() <=1 ){
      return  new UserBillInformation(
        this.date.getFullYear()+this.date.getMonth()+1+this.userInfo.id,
        this.monthName + ' ' + this.date.getFullYear(),
        this.fullDate,
        this.presentRdgInt,
        this.readingForMonth,
        this.readingForMonth * this.waterRateResidence,
        this.dueDateFormat,
        typeOfGen,
        this.userInfo.totalCurrBill,
        this.countActiveBill()+1
      )

    
    }else{
      return  null
    }
    
  }
  countActiveBill(){
    return this.userInfoTrueData.billInfo.length
  }


  addBill(){
    this.addBillDiv = true
    this.addBillDivPaymentInput = false
    
  }
  billDone(){
    if(this.getActiveBillTotalCharge('total') == this.amountPaid.value){
      if(this.userInfoTrueData.billInfo[0]){
        this.userInfoTrueData.paidBillInfo.push(this.userInfoTrueData.billInfo[0])
      }
      if(this.userInfoTrueData.billInfo[1]){
        this.userInfoTrueData.paidBillInfo.push(this.userInfoTrueData.billInfo[1])
        this.userInfoTrueData.balancePrevBill = this.userInfoTrueData.billInfo[1].currentBillCharges
        this.userInfoTrueData.prevReading = this.userInfoTrueData.billInfo[1].presentRdg
      }
      
      this.userInfoTrueData.billInfo = []
      this.userInfoTrueData.hasActiveBill = false
      this.userInfoTrueData.hasReqPayment = false
      this.userInfoTrueData.totalCurrBill = 0 
      this.userNotEnoguh = false
      this.addBillDivPaymentInput = false
      this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => {
      console.log(`Updated successfully`)
      this.notifType = `success`
      this.notifMessage = `Successsfully received payment `
    })
    }else{
      this.userNotEnoguh = true
    }
    // if (this.userInfoTrueData.billInfo.length != 0) {
    //   this.userInfoTrueData.paidBillInfo.push(this.userInfoTrueData.billInfo)
    // this.userInfoTrueData.paidBillInfo.push(this.jsonBillForPayment(this.userInfoTrueData.billInfo,'valid'))
    // this.userInfoTrueData.prevRdgDate = this.userInfoTrueData.billInfo.dateOfRdg
    // this.userInfoTrueData.prevReading =  this.userInfoTrueData.prevReading + this.userInfoTrueData.billInfo.presentRdg
    // }
    
    // //console.log(this.userInfoTrueData)
    // if (this.userInfoTrueData.billInfo.length == 0) {
    //   this.userInfoTrueData.paidBillInfo.push(this.jsonBillForPayment(this.dummyJsonPayment,'paymentOnly'))
    // }
    
    // let tempTotal = this.userInfoTrueData.totalCurrBill - this.amountPaid.value // 500
    // this.userInfoTrueData.balancePrevBill = tempTotal
    // this.userInfoTrueData.totalCurrBill = tempTotal
    // this.userInfoTrueData.hasActiveBill = this.userInfoTrueData.totalCurrBill == 0 ? false : true 
    // this.userInfoTrueData.hasReqPayment = false
    
    // this.userInfoTrueData.billInfo = []
    console.log(`bill paid`,this.userInfoTrueData)
    
    // this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    // .subscribe(data => {
    //   console.log(`Updated successfully`)
    //   this.notifType = `success`
    //   this.notifMessage = `Successsfully received payment `
    // })
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

  onSubmit(){
    this.readingForMonth = this.consumedBillController.value - (this.userInfo.prevReading == null || this.userInfo.prevReading == undefined ? 0 : this.userInfo.prevReading)
    this.userInfoTrueData.hasActiveBill = true
    this.presentRdgInt = this.consumedBillController.value
    this.userInfoTrueData.totalCurrBill = (this.readingForMonth * this.waterRateResidence ) +  this.userInfoTrueData.balancePrevBill
    
    if (this.generateJsonBillModel('billing') == null) {
      return null
    }
    this.userInfoTrueData.billInfo.push(this.generateJsonBillModel('billing'))
    if(this.userInfo.billInfo.length != 0){

      this.userInfoTrueData.totalCurrBill = this.getActiveBillTotalCharge('total')
      this.userInfoTrueData.balancePrevBill = this.getActiveBillTotalCharge('pastBill') // cur reading - prev = consumed reading
      this.userInfoTrueData.prevReading = this.userInfoTrueData.billInfo[0].presentRdg
      this.userInfoTrueData.prevRdgDate =  this.userInfo.billInfo[0].dateOfRdg
    }
     console.log(this.userInfoTrueData)
     return this._http.updateUserAddBill(this.userInfoTrueData.id,this.userInfoTrueData)
    .subscribe(data => {
      console.log(`Done success`),
      this.addBillDiv = false
      this.consumedBillController.reset()
    })
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

  getActiveBillTotalCharge(transType : string){
    let tempTotal = 0
    switch (transType) {
      case 'total':
        for (let index = 0; index < this.userInfoTrueData.billInfo.length; index++) {
          tempTotal +=this.userInfoTrueData.billInfo[index].currentBillCharges;
          
        }
        break;
    
      case 'pastBill':
        tempTotal =this.userInfoTrueData.billInfo[0].currentBillCharges
        break;
    }
    
    return tempTotal
  }
 

}
