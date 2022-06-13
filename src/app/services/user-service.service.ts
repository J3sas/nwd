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

  
  
  constructor(private http: HttpClient) { }


  getUser(id : any): Observable<User>{
    return this.http.get<User>(this.link+'/'+id)
  }
  getWaterResidence(): Observable<WaterInfoBill>{
    return this.http.get<WaterInfoBill>(this.waterLink+'/'+1)
  }
  getMultipleUser(): Observable<User[]>{
    return this.http.get<User[]>(this.link)
  }
  updateUserAddBill(id : number,data : any){
    let complteLink = this.link+'/'+id
    return this.http.put(complteLink,data)
  }

  addUser(data : any){
    return this.http.post(this.link,data)
  }
}
