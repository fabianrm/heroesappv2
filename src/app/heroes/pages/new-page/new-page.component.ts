import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {


  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });


  publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' },
  ]

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id)),
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');
        return this.heroForm.reset(hero); //Setea los valores que vienen de hero
      })

  }


  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }



  onSubmit(): void {
    // const formHero = this.heroForm.value as Hero

    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        this.router.navigate(['/heroes/list']);
        this.showSnackbar(`${hero.superhero} updated!`)
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe(hero => {
      //TODO: Mostrar un snackbar y navegar a /heroes/edit/ hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} created!`);
    })
  }


  onDeleteHero() {

    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
      })

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id).subscribe(result => {
    //     if (result) {
    //       this.router.navigate(['/heroes']);
    //     }
    //   })
    // });

  }



  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', { duration: 2500 });
  }



}
