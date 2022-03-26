import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public baseURI: String = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {}

  getURI() {
    return this.baseURI;
  }

  public getCategories(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/categories');
  }

  public getProducts(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/products');
  }
}
