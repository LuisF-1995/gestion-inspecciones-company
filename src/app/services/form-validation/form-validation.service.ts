import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  validateEmail(email:string): boolean {
    const emailRegex: RegExp = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})$/;
    const coincidencias = email.match(emailRegex);

    if (coincidencias) {
      return true;
    }
    else {
      return false;
    }
  }

  identifyMailErrors(email:string): string {
    const emailParts = email.split('@');

    if (emailParts.length !== 2) {
      return 'Error: El correo electrónico debe contener un solo "@"';
    }

    const [username, domain] = emailParts;

    if (username === '' || domain === '') {
      return 'Error: El nombre de usuario o el dominio no pueden estar vacíos';
    }

    const domainParts = domain.split('.');

    if (domainParts.length < 2) {
      return 'Error: El dominio debe contener al menos un punto (.)';
    }

    const topLevelDomain = domainParts[domainParts.length - 1];

    if (topLevelDomain.length < 2 || topLevelDomain.length > 6) {
      return 'Error: La parte superior del dominio debe tener entre 2 y 6 caracteres';
    }

    return 'Error: Otra condición de validación no cumplida';
  }
}
