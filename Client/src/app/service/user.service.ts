import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = "http://localhost:8080/api/user"

  constructor(private http: HttpClient) {
  }

  getAllUsers() {
    return this.http.get<string[]>(this.BASE_URL);
  }
}
