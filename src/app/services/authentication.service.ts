import { Injectable } from '@angular/core';
import {HttpCallService} from "./http-call.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  httpCallService: HttpCallService;

  constructor(httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) {
    this.httpCallService = httpCallServices;
  }

  login(email: string, password: string) {
    this.httpClient.post('http://localhost:8081/api/user/login/', {
      'email': email,
      'password': password
    },  {
      headers: this.httpCallService.getHeader(null, 'application/json')
    })
      .subscribe(data => {
        let anyData: any = data;

        if ((Number.isInteger(anyData.userId) && anyData.userId) && (anyData.token)) {
          localStorage.setItem('tokenAuth', anyData.token);
          localStorage.setItem('userId', anyData.userId);
          this.router.navigate(['/recette/list']).then(r => null);
        }
      });
  }

  async amIAuth(token): Promise<boolean> {
    return await this.retAmIAuth(token).then(data => {
      let returnedData: any = data;

      if (returnedData.isAuth) {
        return true;
      } else {
        this.router.navigate(['/login']).then(r => null);
        return false;
      }
    }).catch(error => {
      this.router.navigate(['/login']).then(r => null);
      return false;
    });
  }

  retAmIAuth(token) {
    return this.httpClient.post('http://localhost:8081/api/amIAuth', {
      'token': token,
    },  {
      headers: this.httpCallService.getHeader(null, 'application/json')
    }).toPromise();
  }


}
