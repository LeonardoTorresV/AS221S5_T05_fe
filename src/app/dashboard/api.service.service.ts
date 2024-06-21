import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = 'https://miniature-engine-p46r9qq9xppcrgq5-8080.app.github.dev/traducciones';
  private translationApiUrl = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
  private translationApiKey = 'b328c314264746f885a937ada7680e72';
  private translationLocation = 'eastus';

  constructor(private http: HttpClient) { }

  getTraduccionesGuardadas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTraduccionesActivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active`);
  }

  getTraduccionesInactivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inactive`);
  }

  traducirPalabra(palabra: string, idiomaDestino: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Ocp-Apim-Subscription-Key', this.translationApiKey)
      .set('Ocp-Apim-Subscription-Region', this.translationLocation)
      .set('Content-Type', 'application/json');

    const body = [{ 'Text': palabra }];
    const url = `${this.translationApiUrl}&from=es&to=${idiomaDestino}`;

    return this.http.post<any>(url, body, { headers });
  }

  guardarTraduccion(palabraOriginal: string, palabra_traducida: string): Observable<any> {
    const body = { palabra_ingresada: palabraOriginal, palabra_traducida, estado: 'A' };
    console.log('Solicitud a enviar:', body);
    return this.http.post<any>(this.apiUrl, body);
  }

  actualizarTraduccion(id: string, palabra_ingresada: string, palabra_traducida: string): Observable<any> {
    const body = { palabra_ingresada, palabra_traducida };
    return this.http.put<any>(`${this.apiUrl}/${id}`, body);
  }

  eliminarTraduccionLogica(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activarTraduccion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reactivate/${id}`, {});
  }

  eliminarTraduccionFisica(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/physically/${id}`);
  }
}
