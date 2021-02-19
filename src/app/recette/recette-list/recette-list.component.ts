import { Component, OnInit } from '@angular/core';
import {HttpCallService} from "../../services/http-call.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {RecetteService} from "../../services/recette.service";

@Component({
  selector: 'app-recette-list',
  templateUrl: './recette-list.component.html',
  styleUrls: ['./recette-list.component.css']
})
export class RecetteListComponent implements OnInit {

  httpCallService: HttpCallService;

  listRecettes: Observable<any>;
  p: number = 1;
  total: number;
  loading: boolean;
  perPage: number = 10;

  constructor(public _httpCallService: HttpCallService, private httpClient: HttpClient, public recetteService: RecetteService ) {
    this.httpCallService = _httpCallService;
  }

  ngOnInit(): void {
    //console.log(localStorage.getItem('tokenAuth'));

    this.getPage(1, this.perPage);
  }

  getPage(page:number, perPage: number) {
    this.loading = true;
    this.listRecettes = this.getRecetteList(page, perPage).pipe(tap(res => {

      this.total = res.totalRecette;
      this.p = page;
      this.loading = false;
    }), map(res => res.resultRecettes)
    );
  }

  getRecetteList(page: number, perPage: number): Observable<any> {

    let start = (page * perPage) - perPage;

    return this.httpClient.get('http://localhost:8081/api/recette/list/',  {
      headers: this.httpCallService.getHeader(localStorage.getItem('tokenAuth'), 'application/json'),
      params: {
        offset: start.toString(),
        limit: perPage.toString(),
        userId: localStorage.getItem('userId'),
      }
    });
      /*.subscribe(data => {
        let anyData: any = data;

        console.log(anyData);
      });*/
  }

  deleteRecette(idRecette, page, perPage) {

    page = this.p;
    perPage = this.perPage;

    this.recetteService.deleteRecette(idRecette).subscribe(data => {
      let dataReturned: any = data;

      if (dataReturned.success) {
        this.listRecettes.subscribe(dataRecette => {
          this.listRecettes = this.getRecetteList(page, perPage).pipe(tap(res => {

              this.total = res.totalRecette;
              this.p = page;
              this.loading = false;
            }), map(res => res.resultRecettes)
          );
        });
      }
    });

  }

}
