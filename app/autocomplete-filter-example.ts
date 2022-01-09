import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MockService } from './services/mock.service';

export class Country {
  id: number;
  name: string;
}
export class State {
  id: number;
  name: string;
  countryId: number;
}
export class City {
  id: number;
  name: string;
  stateId: number;
}
/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'autocomplete-filter-example',
  templateUrl: 'autocomplete-filter-example.html',
  styleUrls: ['autocomplete-filter-example.css'],
})
export class AutocompleteFilterExample implements OnInit {
  country = new FormControl();
  state = new FormControl();
  city = new FormControl();

  countryData: Country[];
  stateData: State[];
  cityData: City[];

  filteredCountryOptions: Observable<Country[]>;
  filteredStateOptions: Observable<State[]>;
  filteredCityOptions: Observable<City[]>;

  constructor(private countryService: MockService) {}

  ngOnInit() {
    this.countryService.getCountry().subscribe((s) => (this.countryData = s));
    this.countryService.getState().subscribe((s) => (this.stateData = s));
    this.countryService.getCity().subscribe((s) => (this.cityData = s));

    this.country.valueChanges
      .pipe(
        startWith<string | Country>(),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterCountry(name) : this.countryData?.slice()
        )
      )
      .subscribe((s) => {
        this.filteredCountryOptions = of(s);
        this.filteredStateOptions = of(
          this.stateData.filter((f) => f.countryId === s[0].id)
        );
      });

    this.state.valueChanges
      .pipe(
        startWith<string | State>(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterState(name) : this.stateData?.slice()
        )
      )
      .subscribe((s) => {
        this.filteredStateOptions = of(s);
        this.filteredCityOptions = of(
          this.cityData.filter((f) => f.stateId === s[0].id)
        );
      });

    this.city.valueChanges
      .pipe(
        startWith<string | City>(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filterCity(name) : this.cityData?.slice()))
      )
      .subscribe((s) => (this.filteredCityOptions = of(s)));
  }

  private _filterCountry(name: string): Country[] {
    const filterValue = name?.toLowerCase();

    return this.countryData?.filter(
      (option) => option?.name?.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterState(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.stateData?.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterCity(value: string): City[] {
    const filterValue = value.toLowerCase();

    return this.cityData?.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayCountryFn(country?: Country): string | undefined {
    return country ? country.name : undefined;
  }

  displayStateFn(state?: State): string | undefined {
    return state ? state.name : undefined;
  }

  displayCityFn(city?: City): string | undefined {
    return city ? city.name : undefined;
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
