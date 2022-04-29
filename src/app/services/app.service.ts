import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Order } from '../interfaces/Order';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

/**
 * php artisan serve --host=192.168.43.165 --port=8000
 * ng serve --host 192.168.43.165
 */
export class AppService {
  public baseURI: String = 'http://127.0.0.1:8000/';
  constructor(private http: HttpClient) {}

  getURI() {
    return this.baseURI;
  }

  public login(user: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/auth/login', user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public profile(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/profile', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateProfile(user: any): Observable<any> {
    return this.http.put<any>(this.baseURI + 'api/profile/update', user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public logout(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/auth/logout');
  }

  public register(user: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/auth/register', user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getCategories(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/categories');
  }

  public importCategories(categories: any): Observable<any> {
    return this.http.post<any>(
      this.baseURI + 'api/category/import',
      categories,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
    return this.http.delete<any>(this.baseURI + 'api/category/delete/' + id);
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

  public importProducts(products: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/product/import', products, {
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
    return this.http.delete<any>(this.baseURI + 'api/product/delete/' + id);
  }

  public getStocks(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/stocks');
  }

  public getSuppliers(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/suppliers');
  }

  public importSuppliers(suppliers: any): Observable<any> {
    return this.http.post<any>(
      this.baseURI + 'api/supplier/import',
      suppliers,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
    return this.http.delete<any>(this.baseURI + 'api/supplier/delete/' + id);
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

  public getTransactionsData(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/transactions/data');
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

  public getCashflows(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/cashflows');
  }

  public newCashflow(cashflow: any): Observable<any> {
    return this.http.post<any>(this.baseURI + 'api/cashflow/create', cashflow, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public updateCashflow(cashflow: any, id: number): Observable<any> {
    return this.http.put<any>(
      this.baseURI + 'api/cashflow/update/' + id,
      cashflow,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  public deleteCashflow(id: number): Observable<any> {
    return this.http.delete<any>(this.baseURI + 'api/cashflow/delete/' + id);
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/users');
  }

  public getUser(id: number): Observable<any> {
    return this.http.get<any>(this.baseURI + 'api/user/view/' + id);
  }

  public updateUser(user: any, id: number): Observable<any> {
    return this.http.put<any>(this.baseURI + 'api/user/update/' + id, user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
