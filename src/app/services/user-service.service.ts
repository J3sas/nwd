import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, WaterInfoBill } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  link = 'https://6107e4c3d73c6400170d36f2.mockapi.io/chilldb/nwd-users'
  waterLink = 'https://6107e4c3d73c6400170d36f2.mockapi.io/chilldb/waterDb'

  nwdUsersApi = 'https://beapi-all.herokuapp.com/nwd'
  waterRateApi = 'https://beapi-all.herokuapp.com/water'
  
  constructor(private http: HttpClient) { }


  getUser(id : any): Observable<User>{
    return this.http.get<User>(this.nwdUsersApi+'/'+id)
  }
  getWaterResidence(): Observable<WaterInfoBill[]>{
    return this.http.get<WaterInfoBill[]>(this.waterRateApi)
  }
  getMultipleUser(): Observable<User[]>{
    return this.http.get<User[]>(this.nwdUsersApi)
  }
  updateUserAddBill(id : number,data : any){
    let complteLink = this.link+'/'+id
    return this.http.patch(this.nwdUsersApi,data)
  }

  addUser(data : any){
    return this.http.post(this.nwdUsersApi,data)
  }
}
