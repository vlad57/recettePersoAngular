import { Injectable } from '@angular/core';
import {HttpCallService} from "./http-call.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

interface RecetteUpdate {
  recetteId: number,
  recetteName: string,
  recetteDescription: string,
  ingredient: {
    id: number,
    name: string,
    quantite: string,
    unite: string
  }
}

@Injectable({
  providedIn: 'root'
})

export class RecetteService {

  constructor(private httpCallServices: HttpCallService, private httpClient: HttpClient, public router: Router) { }

  getRecette(idRecette: string): Observable<any> {
    return this.httpClient.get(`http://localhost:8081/api/recette/${idRecette}`, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  editRecette(recette: Array<any>) {
    return this.httpClient.post('http://localhost:8081/api/recette/update/', recette, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        userId: localStorage.getItem('userId'),
      }
    });
  }

  newRecette(recette: Array<any>) {
    return this.httpClient.post('http://localhost:8081/api/recette/create/', recette, {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
    });
  }

  deleteRecette(idRecette) {

    let headers = {
      headers: this.httpCallServices.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      body: {
        'recetteId': idRecette
      }
    };

    console.log(headers)

    return this.httpClient.delete('http://localhost:8081/api/recette/delete/', headers);


  }
}
