import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ChangePasswordDto } from "../dto/change-password.dto";

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

  changePassword(changePasswordDto: ChangePasswordDto) {
    return this.http.put(`${this.BASE_URL}/password`, changePasswordDto);
  }
}
