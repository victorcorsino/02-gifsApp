import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  
  private apiKey: string = 'h78MvWlBNyqMV1EPxyAiOqEOEFxA8Jyn';

  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  
  private _historial: string[] = [];

  //TODO: Cambiar any por su tipo
  public resultados: Gif[] = [];
  
  get historial() {
    return [...this._historial];
  }
  
  constructor( private http: HttpClient ) {

    //historial
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    //resultados
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    // if ( localStorage.getItem('historial') ) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! )
    // }

  }

  
  buscarGifs( query: string ) {

    query = query.trim().toLocaleLowerCase();
    
    if ( !this._historial.includes( query ) ) {

      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial) );
      
    }
    
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=h78MvWlBNyqMV1EPxyAiOqEOEFxA8Jyn&q=dragon ball z&limit=10')
    // .then( resp => {
      //   resp.json().then(data => {
        //     console.log(data)
        //   })
        // })

    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '10').set('q', query);
      
    // console.log(params.toString())

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( ( resp ) => {

        console.log( resp.data )
        this.resultados = resp.data;

        localStorage.setItem('resultados', JSON.stringify(this.resultados) );
    });


    // console.log(this._historial)
  }

}
