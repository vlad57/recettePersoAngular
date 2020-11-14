import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {RecetteService} from "../../services/recette.service";

@Component({
  selector: 'app-recette-detail',
  templateUrl: './recette-detail.component.html',
  styleUrls: ['./recette-detail.component.css']
})
export class RecetteDetailComponent implements OnInit {


  recette = new FormGroup({
    recetteId: new FormControl(''),
    recetteName: new FormControl(''),
    recetteDescription: new FormControl(''),
    ingredient: new FormArray([]),
  });

  ingredients = this.recette.get("ingredient") as FormArray;
  idRecette = null;



  constructor(private route: ActivatedRoute, public recetteService: RecetteService, public router: Router) { }


  ngOnInit(): void {
    this.idRecette = +this.route.snapshot.paramMap.get('id');

    if (this.idRecette) {
      this.recetteService.getRecette(this.idRecette.toString()).subscribe(data => {

        let dataReturned: any = data;

        this.recette.controls['recetteId'].setValue(dataReturned.id);
        this.recette.controls['recetteName'].setValue(dataReturned.name);
        this.recette.controls['recetteDescription'].setValue(dataReturned.description);

        for (let ingredient of dataReturned.Ingredients) {
          this.ingredients.push(
            new FormGroup({
              id: new FormControl(ingredient.id),
              name: new FormControl(ingredient.name),
              quantite: new FormControl(ingredient.quantite),
              unite: new FormControl(ingredient.unite)
            })
          );
        }
      });
    }

  }


  addIngredient() {
    const ingredient = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      quantite: new FormControl(''),
      unite: new FormControl('')
    });

    this.ingredients.push(ingredient);

    return false;
  }

  deleteIngredient(indexArray) {
    this.ingredients.removeAt(indexArray);
  }

  onSubmit() {
    if (this.idRecette) {
      this.recetteService.editRecette(this.recette.value).subscribe(data => {
        let dataReturned: any = data;
        if (dataReturned.isUpdated) {
          this.router.navigate(['/recette/list']).then(r => null);
        }
      });
    } else {
      this.recetteService.newRecette(this.recette.value).subscribe(data => {
        let dataReturned: any = data;

        if (dataReturned.isCreated) {
          this.router.navigate(['/recette/list']).then(r => null);
        }
      });
    }

  }

}
