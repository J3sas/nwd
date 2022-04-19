import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-search-index',
  templateUrl: './search-index.component.html',
  styleUrls: ['./search-index.component.css']
})
export class SearchIndexComponent implements OnInit {


  userModelData !: any
  playerName !: string;
  accNumControl = new FormControl();
  nameAccControl = new FormControl();
  foundAccNum  = false
  notifControl = false
  typeOfNotif !: string
  messageOnNotif !: string
  userVerifiedData !: any

  constructor(private __userService : UserServiceService,
              private router :Router) { }

  ngOnInit(): void {
    this.__userService.getMultipleUser()
    .subscribe(data => {
      this.userModelData = data,
      console.log(this.userModelData)
    })
  }

  validateName(){
    if (this.userVerifiedData.name == this.nameAccControl.value) {
      if (this.userVerifiedData.accountType == `User`) {
        console.log(`You have succesfully user `)
        sessionStorage.setItem('authorization' , 'User')
        this.router.navigate([`/user/${this.userVerifiedData.id}`])
        
      }else if(this.userVerifiedData.accountType == `Admin`){
        this.router.navigate([`admin`])
        console.log(`You have succesfully admin `)
        sessionStorage.setItem('authorization' , 'Admin')
        this.router.navigate([`/admin`])
      }
      
    }
  }

  resetNotif(){
    setTimeout(() => this.notifControl = false,2500);
  }

  onSubAccNum(){
    //console.log(this.userModelData.length)
    for (let index = 0; index < this.userModelData.length+1; index++) {
      console.log(this.userModelData[index].accountNum)
      if (this.userModelData[index].accountNum == this.accNumControl.value) {
        //console.log(this.userModelData[index].accountNum == this.accNumControl.value)
        this.userVerifiedData = this.userModelData[index]
        this.foundAccNum = true
        this.notifControl = true
        this.typeOfNotif = `success`
        this.messageOnNotif = `Please input the Account name to verify`
        this.resetNotif()
        break
      }else{
        // console.log(this.userModelData[index].accountNum)
        // console.log(this.accNumControl.value)
        this.notifControl = true
        this.typeOfNotif = `danger`
        this.messageOnNotif = `Sorry the account you're trying to access is not registered`
        this.resetNotif()
        
        
      }
      
    }
    
  }

}
