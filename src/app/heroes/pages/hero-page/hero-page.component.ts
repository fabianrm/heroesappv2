import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  hero?: Hero;

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    this.getHeroeById()
  }

  getHeroeById() {
    this.activatedRoute.params
      .pipe(
        delay(1000),
        switchMap(({ id }) => this.heroService.getHeroById(id))
      ).subscribe(hero => {
        if (!hero) return this.router.navigate(['/heroes/list']);
        //console.log({ hero });
        return this.hero = hero;
      })
  }

  goBack() {
    this.router.navigateByUrl("heroes/list")
  }


}
