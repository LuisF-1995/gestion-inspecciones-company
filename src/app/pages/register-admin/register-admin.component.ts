import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
//MATERIAL COMPONENTS
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SelectCountryComponent } from '../../components/select-country/select-country.component';

@Component({
  selector: 'register-admin',
  standalone: true,
  imports: [RouterLink, FormsModule, SpinnerComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, SelectCountryComponent],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.scss'
})
export class RegisterAdminPage {
  constructor(private router: Router){}

  registerData={
    nombres:"",
    apellidos: "",
    numeroDocumento: "",
    email: "",
    telefono: "",
    companyName: "",
    country: ""
  }
  showSpinner:boolean = false;
  spinnerMessage:string = '';
  errorMessage:string = "";

  onCountrySelected(country: any): void {
    this.registerData.country = country;
  }

  onRegister(){
    console.log(this.registerData);
  }
}
