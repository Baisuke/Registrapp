import { Component } from '@angular/core';
import { QrService } from '../servicios/qr.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  objetoJson = false
  JsonData : any

  constructor(public qr : QrService) {}

  // Esta funcion se encarga de iniciar el escaneo llamando al metodo StartScan del QrService.
  // Una vez realizado el escaneo parsea qr.scanResult a un objeto JSON .
  // verifica que tenga la propiedad exists con el valor true.
  // si la propiedad y su valor son correctos coloca true en objetoJson y la propiedad data en JsonData
  async Scaneo(){
    this.objetoJson = false
    this.JsonData = undefined
    await this.qr.StartScan() // el await nos indica que hay que esperar el retorno del metodo por mas que sea async
    try{
      let parseResult = JSON.parse(this.qr.scanResult)
      console.log(parseResult)
      if(parseResult.exists){
        this.objetoJson = true
        this.JsonData = parseResult.data
      }

    } catch(e) { console.log(e) }
  }

  // Esta funcion llama al metodo flash del QrService
  Flashlight(){
    this.qr.flash()
  }

}