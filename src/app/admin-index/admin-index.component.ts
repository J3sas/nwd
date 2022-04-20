import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoBill } from '../model/user.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit {

  allUser !: any
  userInfo !: any
  authValidator  = false
  accountNumUser !: any

  constructor(private _service : UserServiceService,
              private _router : Router ) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('authorization')) {
      this.authValidator = true
    }
    this.callAllNonAdmin()
  }
  callAllNonAdmin(){
    this._service.getMultipleUser()
    .subscribe(data => {
      this.allUser = data.filter(datas => datas.accountType != 'admin'),
      console.log(this.allUser)
    })
  }
  gotoUserInfo(data : any){
    this.userInfo = data
    //console.log(this.userInfo.id)
    sessionStorage.setItem("userInfo" , JSON.stringify(this.userInfo) )
    this._router.navigate([`user/${this.userInfo.id}`])

  }
  logoutCredentials(){
    sessionStorage.removeItem('authorization')
    sessionStorage.removeItem('userInfo')
    this._router.navigate(['/'])
  }
  searchAccount(){
    this.allUser = this.allUser.filter((res: any) => {
      return res.accountNum.match(this.accountNumUser)
    })
  }

}
