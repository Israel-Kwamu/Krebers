import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ExchangeResponse {
  base_code: string;          
  rates: { [key: string]: number }; 
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {
  
  private apiUrl = 'https://v6.exchangerate-api.com/v6/db257bf728227f0236c5a594/latest/USD';

  constructor(private http: HttpClient) {}

 
  getRates(): Observable<ExchangeResponse> {
    return this.http.get<ExchangeResponse>(this.apiUrl);
  }
}
