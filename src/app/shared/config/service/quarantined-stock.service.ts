import { Injectable } from '@angular/core';
import { Global } from 'src/app/global';
import { StockQuarantined } from '../model/Stock-quarantined.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuarantinedStockService {
  private saveQuarantineStockUrl = this.global.baseUrl + '/api/quarantined-stock/save';
  private submitQuarantineStockUrl = this.global.baseUrl + '/api/quarantined-stock/submit';
  private getAvailableStockUrl = this.global.baseUrl + '/api/quarantined-stock/get?branchId=';
  private getAllAvailableStockByActiveUrl = this.global.baseUrl + '/api/quarantined-stock/get-by-active';
  private getAvailableStockByDateUrl = this.global.baseUrl + '/api/quarantined-stock/get-by-date';

constructor(private http: HttpClient, private global: Global) { }

public save(item: StockQuarantined): Observable<any> {
  return this.http.post<StockQuarantined>(this.saveQuarantineStockUrl, item);
}

public submit(item: StockQuarantined): Observable<any> {
  return this.http.post<StockQuarantined>(this.submitQuarantineStockUrl, item);
}

public getAvailableStock(branchId): Observable<any> {
  return this.http.get<any>(this.getAvailableStockUrl + branchId);
}
public getAvailableStockByActive(): Observable<any> {
  return this.http.get<any>(this.getAllAvailableStockByActiveUrl);
}
public getAvailableStockByDate(item): Observable<any> {
  return this.http.post<any>(this.getAvailableStockByDateUrl, item);
}

}
