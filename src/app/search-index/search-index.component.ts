import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  notReadyApi = true

  constructor(private __userService : UserServiceService,
              private router :Router) { }
  
  ngOnInit(): void {
    this.__userService.getMultipleUser()
    .subscribe(data => {
      this.userModelData = data,
      this.checkIfDataLoaded(),
      console.log(this.userModelData)
      setTimeout(()=>{
        document.getElementById('acc-num-search')?.focus()
      },500)
    })
  }

  validateName(){
    if (this.userVerifiedData.password == this.nameAccControl.value) {
      if (this.userVerifiedData.accountType == 'User') {
        console.log('if')
        console.log(`You have succesfully user `)
        sessionStorage.setItem('authorization' , 'User')
        this.router.navigate([`/user/${this.userVerifiedData.id}`])
        
      }else if(this.userVerifiedData.accountType == 'Admin'){
        console.log('else if ')
        console.log('else',this.userVerifiedData.name);
        this.router.navigate([`admin`])
        console.log(`You have succesfully admin `)
        sessionStorage.setItem('authorization' , 'Admin')
        this.router.navigate([`/admin`])
      }
      
    }else{
        console.log('else')
        this.notifControl = true
        this.typeOfNotif = `danger`
        this.messageOnNotif = 'Error , wrong password'
      }
  }

  resetNotif(){
    setTimeout(() => this.notifControl = false,4000);
  }

  checkIfDataLoaded(){
    if (this.userModelData) {
      this.notReadyApi = false
    }
  }

  onSubAccNum(){
    //console.log(this.userModelData.length)
    for (let index = 0; index < this.userModelData.length+1; index++) {
      if (this.userModelData[index].accountNum == this.accNumControl.value) {
        //console.log(this.userModelData[index].accountNum == this.accNumControl.value)
        this.userVerifiedData = this.userModelData[index]
        this.foundAccNum = true
        this.notifControl = true
        this.typeOfNotif = `success`
        this.messageOnNotif = `Success , now please input the Account name to verify`
        this.resetNotif()
        setTimeout(()=>{
          document.getElementById('acc-name-search')?.focus()
        },500)
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
