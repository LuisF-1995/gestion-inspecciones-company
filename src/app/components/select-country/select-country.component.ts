import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { countries, CountryType } from './countries';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'select-country',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './select-country.component.html',
  styleUrl: './select-country.component.scss'
})

export class SelectCountryComponent{
  countryControl = new FormControl('');
  filteredCountries: Observable<CountryType[]>;
  paises:CountryType[] = countries;
  selectedCountry:CountryType|undefined;
  @Output() countrySelected = new EventEmitter<any>();

  constructor() {
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(country => (country ? this._filterCountries(country) : this.paises.slice())),
    );
  }

  private _filterCountries(value: string): CountryType[] {
    const filterValue = value.toLowerCase();
    const country = this.paises.filter(pais =>
      pais.label.toLowerCase().includes(filterValue)
    );
    if(country.length == 1 && this.countryControl.value == country[0].label){
      this.selectedCountry = country[0];
      this.countrySelected.emit(country[0]);
    }
    return country;
  }

  clear(){
    this._filterCountries('');
    this.selectedCountry=undefined;
  }

}
