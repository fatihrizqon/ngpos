import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Order } from '../interfaces/Order';

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

  public newCategory(category: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/category/create', category, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateCategory(category: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.baseURI + 'api/category/update/' + id,
      category,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  public deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURI + 'api/category/delete/' + id, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getAllProducts(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/allproducts');
  }

  public getProducts(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/products');
  }

  public newProduct(product: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/product/create', product, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateProduct(product: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.baseURI + 'api/product/update/' + id,
      product,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  public deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURI + 'api/product/delete/' + id, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getStocks(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/stocks');
  }

  public getSuppliers(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/suppliers');
  }

  public newSupplier(supplier: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/supplier/create', supplier, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateSupplier(supplier: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.baseURI + 'api/supplier/update/' + id,
      supplier,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  public deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURI + 'api/supplier/delete/' + id, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getSupplies(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/supplies');
  }

  public newSupply(supply: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/supply/create', supply, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateSupply(supply: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.baseURI + 'api/supply/update/' + id,
      supply,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  public deleteSupply(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURI + 'api/supply/delete/' + id, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getOrders(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/orders');
  }

  public getTransactions(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/transactions');
  }

  public newOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/order/create', order, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public newTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(
      this.baseURI + 'api/transaction/create',
      transaction,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // public register(user): Observable<any>{
  //   const base = this.http.post(
  //     this.baseUri+'api/auth/signup',user,{headers:{'Content-Type': 'application/json'}}
  //   );
  //   const response = base.pipe(
  //     map((response: TokenResponse) =>{
  //     })
  //   );
  //   return response;
  // }
}
