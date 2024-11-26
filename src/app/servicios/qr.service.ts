import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  scan : boolean = false
  scanResult : any = ""
  flashOn : boolean = false

  constructor() { }

  // Verifica los permisos de la camara, de igual manera los fuerza en true (igualmente es necesario que esten permitidos)
  async CheckPermission() {
    try
    {
      const status = await BarcodeScanner.checkPermission({force:true}); 
      if(status.granted) {
        return true;
      }

      return false;

    }
    catch(e)
    {
      return undefined;
    }
  }

  //Inicia el escaneo si: no se esta escaneando y si: se tienen los permisos de la camara
  async StartScan() {
    if(!this.scan) {
      this.scan = true;
      try 
      {
        const permission = await this.CheckPermission();
        if(!permission) {
          alert("No hay permisos de camara. Activelos manualmente en información de la aplicación")
          this.scan = false
          this.scanResult = "Error. No hay Permisos"
        }else {
          await BarcodeScanner.hideBackground(); // oculta el fondo
          document.querySelector('body')?.classList.add('scanner-active');// agrega una clase al global.scss para ocultar el body principal
          const result = await BarcodeScanner.startScan();
          console.log("Resultado del escaneo: ", result) //Vemos el resultado
          BarcodeScanner.showBackground(); // vuelve a mostrar el fondo
          document.querySelector('body')?.classList.remove('scanner-active');// elimina la clase que nos oculta el body principal
          this.scan = false;
          if(result?.hasContent) { // verifica la exitencia de contenido ( el '?' se utiliza para verificar que la variable no sea null o undefined)
            this.scanResult = result.content;
          }
        }
      }
      catch(e)
      {
          console.log(e);
      }
    } else {
      this.StopScan();
    }
  }

  // Parab el escaneo (cierra la camara)
  StopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.scan = false;
    this.scanResult = ""
  }

  // Maneja el flash o linterna del telefono al tener acceso a la camara incluso estando abierta
  flash(){
    if(!this.flashOn){
      BarcodeScanner.enableTorch() // prende luz
      this.flashOn = true
    } else {
      BarcodeScanner.disableTorch() // apaga luz
      this.flashOn = false
    }
  }


}