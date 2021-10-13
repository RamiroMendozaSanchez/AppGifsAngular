import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'RlS6GsVgwJuKSbdARAwv3mLBWFQjkX3A';
  private URL_BASE:string = 'https://api.giphy.com/v1/gifs'
  private _historial : string[] = [];
  resultados: Gif [] = [];

  get historial(){
    return [...this._historial]
  }

  constructor(private http:HttpClient){
    
    if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }

    if (localStorage.getItem('resultados')) {
      this.resultados= JSON.parse(localStorage.getItem('resultados')!);
    }

  }

  buscarGifs(query: string){

    query = query.trim().toLocaleLowerCase();
  
    if( !this._historial.includes( query ) ){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit','10')
      .set('q',query);

    this.http.get<SearchGifsResponse>(`${this.URL_BASE}/search`,{params})
    .subscribe( (resp) =>{
      console.log(resp.data);
      this.resultados = resp.data;
      localStorage.setItem('resultados',JSON.stringify(resp.data))
    } )
  }


}
