import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonDTO, AddPersonDTO, EditPersonDTO, LoginDTO } from '../models/person.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly API_URL = environment.personaApiUrl;

  constructor(private http: HttpClient) {}

  // Public endpoints
  register(person: AddPersonDTO): Observable<string> {
    return this.http.post(`${this.API_URL}/public/register`, person, { 
      responseType: 'text' 
    });
  }

  verifyCredentials(credentials: LoginDTO): Observable<PersonDTO> {
    return this.http.post<PersonDTO>(`${this.API_URL}/public/verifyCredentials`, credentials);
  }

  // Private endpoints
  findPerson(personaId?: number, personaDocumento?: string): Observable<PersonDTO> {
    let params = new HttpParams();
    if (personaId) {
      params = params.set('personaId', personaId.toString());
    }
    if (personaDocumento) {
      params = params.set('personaDocumento', personaDocumento);
    }
    
    return this.http.get<PersonDTO>(`${this.API_URL}/private`, { params });
  }

  findAllPersons(): Observable<PersonDTO[]> {
    return this.http.get<PersonDTO[]>(`${this.API_URL}/private/all`);
  }

  updatePerson(person: EditPersonDTO): Observable<string> {
    return this.http.put(`${this.API_URL}/private/update`, person, { 
      responseType: 'text' 
    });
  }

  deletePerson(personaId: number): Observable<string> {
    const params = new HttpParams().set('personaId', personaId.toString());
    return this.http.delete(`${this.API_URL}/private/delete`, { 
      params, 
      responseType: 'text' 
    });
  }
}
