import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { VALIDATION } from '../constants/app.constants';

/**
 * Custom validators for reactive forms
 */
export class CustomValidators {
  
  /**
   * Validates document number based on document type
   */
  static documentValidator(documentType: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const pattern = VALIDATION.DOCUMENT_PATTERNS[documentType as keyof typeof VALIDATION.DOCUMENT_PATTERNS];
      if (!pattern) return null;
      
      const isValid = pattern.test(control.value);
      return isValid ? null : { invalidDocument: { value: control.value, documentType } };
    };
  }

  /**
   * Validates that password meets minimum requirements
   */
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value;
      const hasMinLength = value.length >= VALIDATION.MIN_PASSWORD_LENGTH;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      const errors: any = {};
      
      if (!hasMinLength) errors.minLength = true;
      if (!hasUpperCase) errors.upperCase = true;
      if (!hasLowerCase) errors.lowerCase = true;
      if (!hasNumber) errors.number = true;
      
      return Object.keys(errors).length ? { passwordRequirements: errors } : null;
    };
  }

  /**
   * Validates positive number
   */
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = parseFloat(control.value);
      return value > 0 ? null : { positiveNumber: true };
    };
  }

  /**
   * Validates that value is within a range
   */
  static range(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = parseFloat(control.value);
      if (value < min || value > max) {
        return { range: { min, max, actual: value } };
      }
      
      return null;
    };
  }

  /**
   * Validates Colombian phone number format
   */
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      // Colombian phone number pattern: +57 followed by 10 digits or just 10 digits
      const phonePattern = /^(\+57)?[0-9]{10}$/;
      return phonePattern.test(control.value.replace(/\s/g, '')) 
        ? null 
        : { phoneNumber: true };
    };
  }
}
