import { Component } from '@angular/core';
import { Component,OnInit,ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import  SignaturePad  from 'signature_pad/';
import {ServicioService} from './servicios/servicio.service';
import { Network, Connection} from '@awesome-cordova-plugins/network/ngx';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { MenuController,Platform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

 @ViewChild('firma',{static:true}) signaturePadElement:any;


  async presentAlert_completo() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Como querra su almuerzo?',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: "Caldo",
          value: 'Caldo',
          handler: () => {
            this.entrada = "Caldo";

          },
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: "Segundo",
          value: 'Segundo',
          handler: () => {
            this.entrada = "Segundo";

          }
        },
        {
          name: 'radio2',
          type: 'radio',
          label: "Completo",
          value: 'Completo',
          handler: () => {
            this.entrada = "Completo";
            ;
          }
        },


      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.obtener_firma()
          }
        }
      ]
    });
    alert.backdropDismiss = false

    await alert.present();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Escoja su almuerzo ',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.opcion_1[this.dia_semana],
          value: 'value1',
          handler: () => {
            this.opcion_escogida = this.opcion_1;
          },
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.opcion_2[this.dia_semana],
          value: 'value2',
          handler: () => {
            this.opcion_escogida = this.opcion_2;
          }
        },


      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.presentAlert_completo()
          }
        }
      ]
    });

    alert.backdropDismiss = false
    await alert.present();
  }




  async presentAlert_atender(titulo,subtitulo,descripcion) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: descripcion,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Si',
          handler: () => {
            this.barcodeScanner.scan().then(barcodeData => {

              this.servicio.ver_id("Usuarios/" + barcodeData.text).then(resp=>{
                if (resp == undefined) {
                  this.presentAlert("No existe","❌","Este usuario no existe, por favor comuniquese con recursos humanos")
                }else{

                  this.indexado++
                  var inde = this.dataSource_2.length + 1
                  var subir = {
                    index:inde + "",
                    dni:resp.any.dni,
                    nombres_apellidos:resp.any.nombres_apellidos,
                    numero_telf:resp.any.numero_telf,
                    hora:this.servicio.hora_actual,
                    reservado:"No"
                  }

                  this.tabla_bloo = false

                  this.dataSource_2.push(subir);
                  setTimeout(() => {this.tabla_bloo = true},300)

                  this.servicio.addInformacion(this.dataSource_2,"Historial consecionaria " + this.consecionaria_entra + "/" + this.servicio.fecha_actual)

                }
              })

            })
          }
        }
      ]
    });
    alert.backdropDismiss = false

    await alert.present();
  }




  async presentAlert_segundo(titulo,subtitulo,descripcion) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: descripcion,
      buttons: [
        {
          text: 'Segundo',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.entrada = "Segundo";
            this.obtener_firma();
          }
        }, {
          text: 'Completo',
          handler: () => {
            this.entrada = "Completo";
            this.obtener_firma();
          }
        }
      ]
    });




    alert.backdropDismiss = false
    await alert.present();

    const { role } = await alert.onDidDismiss();

  }




  async presentAlert(titulo,subtitulo,descripcion) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: descripcion,
      buttons: [  'Aceptar'
    ]
    });
    alert.backdropDismiss = false

    await alert.present();

    const { role } = await alert.onDidDismiss();

  }


  entrada = "Sopa"


  estrellas = 0


  async presentAlert_cancelar(titulo,subtitulo,descripcion) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: descripcion,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        },
        {
        text: 'Si',

        cssClass: 'secondary',
        handler: () => {
         this.cancelar_reserva()
        }
      },
    ]
    });
    alert.backdropDismiss = false

    await alert.present();

    const { role } = await alert.onDidDismiss();

  }




  respuesta_text = ""


  async presentAlert_camara(titulo,subtitulo,descripcion) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      subHeader: subtitulo,
      message: descripcion,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        },
        {
        text: 'Abrir camara',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
         this.abrir_camara()
        }
      },
    ]
    });

    alert.backdropDismiss = false
    await alert.present();

    const { role } = await alert.onDidDismiss();

  }







  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }





  subir_respuestas_encuesta(){

    var ara = {
      dni: this.objeto_encuestadora.dni,
      nombres_apellidos:this.objeto_encuestadora.nombres_apellidos,
      numero_telf:this.objeto_encuestadora.numero_telf,
      pregunta:this.objeto_encuestadora.pregunta,
      almuerzo:this.objeto_encuestadora.almuerzo,
      concesionaria:this.objeto_encuestadora.concesionaria,
      estrellas:this.estrellas,
      respuesta:this.respuesta_text
    }

    var enlace = "Respuestas encuestados bot/" + this.servicio.fecha_actual + "/" + this.objeto_encuestadora.concesionaria + "/calificacion/" + this.estrellas + "/" +  this.objeto_encuestadora.dni

    this.servicio.addInformacion(ara,enlace).then(resp =>{
      this.encuestar_bot = false
    })

  }





  consecionaria_entra = ""
  signaturePad:any;
  contrasena_confirmar = ""
  tabla_bloo = true
  contrasena = ""
  contrasena_consecionaria = ""
  lectores = false
  login_consecionaria = false
  fecha_valor = ""
  width=""
  dataSource_2 = [
  ]

  displayedColumns4 = ['dni', 'nombres_apellidos','almuerzo'];
  displayedColumns = ['index','dni','nombres_apellidos','almuerzo','entrada','importe_total','reservado','descuento_planilla','hora','fecha'];

  onChange(newValue) {

    var año = this.fecha_valor.substring(0,4)
    var mes = this.fecha_valor.substring(5,7)
    var dia = this.fecha_valor.substring(8,10)

    var todo = dia + "-" + mes + "-" + año


    this.buscar__fecha(todo)
}

dataSource_r = []

buscar__fecha(fecha) {{
  var enlacer = "Reservaciones/" + fecha + "/" + this.consecionaria_entra
  this.servicio.ver_nube(enlacer).subscribe(resp=>{
    for (let i = 0; i < resp.length; i++) {
      var con_1 = []
      for (let i = 0; i < resp.length; i++) {
          con_1.push(resp[i].any)
      }

      this.dataSource_r = con_1



    }
  })
}}











  indexado = 0





  abrir_lectora()
  {
    this.barcodeScanner.scan().then(barcodeData => {
      this.presentLoading()
    this.servicio.ver_id("Reservaciones/" + this.servicio.fecha_actual + "/" + this.consecionaria_entra + "/" + barcodeData.text ).then(resp =>{

      if (resp == undefined) {

        this.servicio.ver_id("Reservaciones/" + this.servicio.fecha_actual + "/" + this.concesionaria_2 + "/" + barcodeData.text ).then(resp_2 =>{
          this.loadingController.dismiss()
          if (resp_2 == undefined) {
            this.presentAlert_atender("No encontrado","❌","Este usuario no reservo un almuerzo ¿Desea atenderlo?")

          }else{
            this.presentAlert("Aqui no es","⚠️","Este usuario reservo su almuerzo en otra consecionaria ")
          }

        })


      }else{
        this.loadingController.dismiss()
        var listo = "false"

        for (let i = 0; i < this.dataSource_2.length; i++) {

          if (barcodeData.text == this.dataSource_2[i].dni) {
            listo = "true"
            this.presentAlert("Ya registrado","⚠️","Este usuario ya recibio un almuerzo")

          }

        }

        if (listo == "false" ) {
          this.indexado++
          var inde = this.dataSource_2.length + 1
          var array = {
            index:inde + "",
            dni:resp.any.dni,
            nombres_apellidos:resp.any.nombres_apellidos,
            hora:this.servicio.hora_actual,
            reservado:"Si"
          }

          this.tabla_bloo = false

          this.dataSource_2.push(array);

          setTimeout(() => {this.tabla_bloo = true},300)

          this.servicio.addInformacion(this.dataSource_2,"Historial consecionaria " + this.consecionaria_entra + "/" + this.servicio.fecha_actual)

        }
      }
    })
    })
  }






  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);

  }






  firma:any
  firma_bloo = "none"




  horarios_consecionarias:any




  obtener_firma()
  {

    if(window.navigator.onLine == true)
    {
      var data = new Date()
      var hora = data.getHours() + ""
      var min_prueba = data.getMinutes() + ""
      var min = ""
      if (min_prueba.length == 1) {
        min = "0" + min_prueba

      }else{
        min = min_prueba
      }

      var todo_h = hora + min


      var hora_config_f = this.config.hora_fin.substring(0,2)
      var min_config_f = this.config.hora_fin.substring(3,5 )
      var hora_config_i = this.config.hora_inicio.substring(0,2)
      var min_config_i = this.config.hora_inicio.substring(3,5)
      var todo_fin = hora_config_f + min_config_f
      var todo_inicio = hora_config_i + min_config_i




      if (parseFloat(todo_h) < parseFloat(todo_fin) && parseFloat(todo_h) > parseFloat(todo_inicio)) {

      var subir = {

        dni:this.usuario_comprobado.any.dni,
        nombres_apellidos:this.usuario_comprobado.any.nombres_apellidos,
        numero_telf:this.usuario_comprobado.any.numero_telf,
        almuerzo:this.opcion_escogida[this.dia_semana],
        concesionaria:this.opcion_escogida.nombre,
        entrada:this.entrada,
        fecha:this.servicio.fecha_actual,
        importe_total: this.importe_total,
        reservado: "Si"

      }

      var consess =  this.opcion_escogida.nombre
      var enlace = "Reservaciones/"+ this.servicio.fecha_actual + "/" + consess + "/" + this.dni

      console.log( this.opcion_escogida.nombre)
      if(this.usuario_comprobado.any.turno == "Noche"){
         enlace = "Reservaciones cenas/"+ this.servicio.fecha_actual + "/" + consess + "/" + this.dni

      }
      var enn = "Usuarios/" + this.dni + "/historial de consumo/" + this.servicio.fecha_actual
      this.presentLoading()


      this.servicio.addInformacion(subir,enlace).then(resp =>{

        this.loadingController.dismiss()
        this.blur = false
        this.b_reservar = false
        this.b_cancelar = true
        this.importe_total = this.config.precio_caldo
        this.firma_bloo = "none"

        this.entrada = "Caldo";




      })
    }else{
      this.presentAlert("se paso el tiempo","💔","Se acabo el tiempo para poder hacer una reserva")

    }

    }else{
      this.presentAlert("Sin internet","","No se puede hacer reservaciones sin internet")
    }




  }





  constructor( private platform: Platform,private network: Network,private menu: MenuController,public loadingController:LoadingController,public alertController: AlertController,private barcodeScanner: BarcodeScanner,private firestore:AngularFirestore,private servicio:ServicioService) { }






  title = 'alimentacion';

  blur = false
  blur2 = false
  login = true
  registro = false
  reservar = false
  asistencia = false
  numero_telf = ""
  b_reservar = false
  b_cancelar = false
  historial_reservaciones = false

  almuerzo_1 = true
  almuerzo_2 = false



  almuerzo_seleccionado = ""


  dni = ""
  nombres_apellidos = ""


  cancelar()
  {
    this.presentAlert_cancelar("¿Esta seguro?","⚠️","¿Esta seguro de cancelar su reservacion?")
  }





  cancelar_reserva()
  {

    if (window.navigator.onLine == true) {
      var data = new Date()
      var hora = data.getHours() + ""
      var min_prueba = data.getMinutes() + ""
      var min = ""
      if (min_prueba.length == 1) {
        min = "0" + min_prueba

      }else{
        min = min_prueba
      }

      var todo_h = hora + min


      var hora_config_f = this.config.hora_fin.substring(0,2)
      var min_config_f = this.config.hora_fin.substring(3,5 )
      var hora_config_i = this.config.hora_inicio.substring(0,2)
      var min_config_i = this.config.hora_inicio.substring(3,5)
      var todo_fin = hora_config_f + min_config_f
      var todo_inicio = hora_config_i + min_config_i


      if (parseFloat(todo_h) < parseFloat(todo_fin) && parseFloat(todo_h) > parseFloat(todo_inicio)) {

      this.presentLoading()

      var enlace = "Reservaciones/" + this.servicio.fecha_actual + "/"+ this.concesionaria_1 +"/" + this.dni
      this.firestore.doc(enlace).delete().then(resp =>{
        var enns = "Usuarios/" + this.dni + "/historial de consumo/" + this.servicio.fecha_actual

        this.firestore.doc(enns).delete().then(resp2 =>{
          this.blur2 = false
          this.b_reservar = true
          this.loadingController.dismiss()
          this.b_cancelar = false

        })


      })


      var enlace2 = "Reservaciones/" + this.servicio.fecha_actual + "/"+ this.concesionaria_2 +"/" + this.dni
      this.firestore.doc(enlace2).delete().then(resp =>{
          this.blur2 = false
          this.b_reservar = true
          this.b_cancelar = false
          this.loadingController.dismiss()
      })

    }else{
      this.presentAlert("se paso el tiempo","💔","Se acabo el tiempo para poder hacer una reserva")

    }

    }else{
      this.presentAlert("Sin internet","","No se puede canselar sin internet")
    }


  }





  abrir_camara()
  {
    this.barcodeScanner.scan().then(barcodeData => {

      if (barcodeData.text == this.servicio.fecha_actual) {
        var object = {
          dni: this.usuario_comprobado.any.dni,
          nombres_apellidos: this.usuario_comprobado.any.nombres_apellidos,
          numero_telf: this.usuario_comprobado.any.numero_telf,
        }

        this.servicio.addInformacion(object,'asistencia/' + this.servicio.fecha_actual + "/dni/" + this.dni).then(resp => {
          this.asistencia = false
          this.reservar = true
          this.b_reservar = true
        })
      }else{
        this.presentAlert("Incorrecto","⚠️","El codigo leido no es el correcto, por favor contactese con recursos humanos")
      }


     }).catch(err => {

     });
  }







  registrar()
  {

    this.barcodeScanner.scan().then(barcodeData => {

      var objeto_registro = {
        dni: barcodeData.text,
        nombres_apellidos : this.nombres_apellidos,
        numero_telf:this.numero_telf,
        contrasena:this.contrasena,
      }

      this.servicio.addInformacion(objeto_registro,"Usuarios/" + this.dni);


    })


  }







  cambiar_contra = false
  contra_actual = ""
  contra_nueva = ""
  usuario_comprobado:any





  cambiar_contrasenaa()
  {
    this.presentLoading()
    this.servicio.ver_id("Usuarios/" +this.usuario_comprobado.any.dni).then(resp=>{
      if (this.contra_actual == resp.any.contrasena)
      {

          var sub = {
            dni:this.usuario_comprobado.any.dni,
            contrasena:this.contra_nueva,
            nombres_apellidos:this.usuario_comprobado.any.nombres_apellidos,
            numero_telf:this.usuario_comprobado.any.numero_telf
          }

          this.servicio.addInformacion(sub,"Usuarios/" + this.usuario_comprobado.any.dni).then(resp=>{
            this.loadingController.dismiss()
            this.presentAlert("Exelente","✔️","Se cambio correctamente su contraseña")
            this.cambiar_contra = false;
          })



      }else{
        this.loadingController.dismiss()
        this.presentAlert("Error","❌","La contraseña actual no es correcta por favor contactese con recursos humanos")
      }
    })
  }


  form_reservar = false
  importe_total = 0


  calcular_importe(){
    if (this.entrada == 'Caldo') {

      this.importe_total = this.config.precio_caldo
    }

    if (this.entrada == 'Segundo') {

      this.importe_total = this.config.precio_segundo
    }

    if (this.entrada == 'Completo') {

      this.importe_total = this.config.precio_completo
    }
  }

  ver_historial_consumo(){
    var enns = "Usuarios/" + this.dni + "/historial de consumo"

    var subs = this.servicio.ver_nube(enns).subscribe(respii => {

      var bofe = []

     for (let i = 0; i < respii.length; i++) {

      var año = respii[i].any.fecha.substring(6,10)
    var mes = respii[i].any.fecha.substring(3,5)
    var dia = respii[i].any.fecha.substring(0,2)
    var todo = año + "/" + mes + "/" + dia

      var arra_ = {
        dni: respii[i].any.dni,
        almuerzo: respii[i].any.almuerzo,
        entrada: respii[i].any.entrada,
        hora: respii[i].any.hora,
        fecha:new Date(todo),
        nombres_apellidos:respii[i].any.nombres_apellidos,
        descuento_planilla: respii[i].any.descuento_planilla,
        reserva: respii[i].any.reservado,
        importe_total:respii[i].any.importe_total,
      }


      bofe.push(arra_)


     }

     bofe.sort(function(a, b) {
      return b.fecha.getTime() - a.fecha.getTime()
    });


    var todo_calcu = []
    for (let i = 0; i < bofe.length; i++) {

      var datos_f = bofe[i].fecha

      var fecha_actual = String(datos_f.getDate()).padStart(2, '0') + '-' + String(datos_f.getMonth() + 1).padStart(2, '0') + '-' + datos_f.getFullYear();

      var array = {
        dni: bofe[i].dni,
        almuerzo: bofe[i].almuerzo,
        entrada: bofe[i].entrada,
        hora: bofe[i].hora,
        fecha:fecha_actual,
        nombres_apellidos:bofe[i].nombres_apellidos,
        descuento_planilla: bofe[i].descuento_planilla,
        reserva: bofe[i].reservado,
        importe_total:bofe[i].importe_total,

      }

      todo_calcu.push(array)

    }


      this.arra_consumo = todo_calcu


      subs.unsubscribe()

    })

  }




  encuestar_bot = false
  objeto_encuestadora:any

  mondal = false



  arra_consumo = []

  texto_cambiante = ""
  sopess = true
  comprobar_usuario()
  {

    if (window.navigator.onLine == true) {
      this.presentLoading()



      if (this.dni.length > 5 ) {

        var enlace = "Usuarios/" + this.dni

        this.servicio.ver_id(enlace).then(resp => {

          if (resp == undefined) {

           this.loadingController.dismiss()
           this.presentAlert("Usuario incorrecto","❌","El usuario no existe por favor contactese con recursos humanos")

          }else{

            if (this.contrasena == resp.any.contrasena) {
              this.usuario_comprobado = resp;


              if (this.usuario_comprobado.any.turno == "Noche") {

                this.sopess = false
                this.texto_cambiante = "Cena"
                this.clase_icono == "fa-cloud-moon"

                this.reservar = false

                setTimeout(() => {this.reservar = true},300)

                this.servicio.ver_nube("Configuraciones").subscribe(resp=>{

                  var arrayt = {
                    hora_fin:resp[0].any.hora_fin_cena,
                    hora_inicio: resp[0].any.hora_inicio_cena,
                    precio_caldo:resp[0].any.precio_caldo_cena,
                    precio_segundo:resp[0].any.precio_segundo_cena,
                    precio_completo:resp[0].any.precio_completo_cena,
                  }
                  this.config = arrayt

                  this.importe_total = this.config.precio_completo
                })



             var sisss =  this.servicio.ver_nube("Usuarios consecionarias").subscribe(resp_t => {

              sisss.unsubscribe()

                  this.array_usuarios_consecionarias = resp_t



                  var toduss = []
                 for (let i = 0; i < this.array_usuarios_consecionarias.length; i++) {
                  var enlace = this.array_usuarios_consecionarias[i].any.nombre + "/horario cenas"

                  this.servicio.ver_id(enlace).then(resqq =>{
                    if (resqq == undefined) {

                    }else{
                      toduss.push(resqq.any)

                      this.array_consecionarias_horarios = toduss
                      this.opcion_escogida =  toduss[0]
                    }

                  })
                 }


                 var boleano_c = "false"



                 for (let i = 0; i < this.array_usuarios_consecionarias.length; i++) {


                   var enlace = "Reservaciones cenas/"+ this.servicio.fecha_actual + "/"+ this.array_usuarios_consecionarias[i].any.nombre + "/" + this.dni
                   this.servicio.ver_id(enlace).then(resp2 =>{

                     this.loadingController.dismiss()

                     if (resp2 == undefined && boleano_c == "false") {

                     this.login = false
                     this.reservar = true
                     this.mondal = true
                     this.b_reservar = true
                     this.b_cancelar = false

                     }else{
                       this.login = false
                       boleano_c = "true"
                       this.reservar = true
                       this.b_reservar = false
                       this.b_cancelar = true
                     }
                     })

                 }



                })

                const dias = [
                  'domingo',
                  'lunes',
                  'martes',
                  'miercoles',
                  'jueves',
                  'viernes',
                  'sabado',
                ];

                const numeroDia = new Date(this.fecha_actual + " 08:02:15").getDay();
                const nombreDia = dias[numeroDia];
                this.dia_semana =  nombreDia

             }



             if(this.usuario_comprobado.any.turno == "Dia"){
              this.texto_cambiante = "Tipo de almuerzo"

              this.sopess = true
              this.clase_icono == "fa-cloud-sun"

              this.reservar = false

               setTimeout(() => {this.reservar = true},300)


              this.servicio.ver_nube("Configuraciones").subscribe(resp=>{
                this.config = resp[0].any


                this.importe_total = this.config.precio_caldo
              })


          var sisi =   this.servicio.ver_nube("Usuarios consecionarias").subscribe(resp_t => {

                this.array_usuarios_consecionarias = resp_t

                sisi.unsubscribe()

                var toduss = []

               for (let i = 0; i < this.array_usuarios_consecionarias.length; i++) {

                if (this.array_usuarios_consecionarias[i].any.nombre == "Zuñiga") {

                }else{
                var enlace = this.array_usuarios_consecionarias[i].any.nombre + "/horario"

                this.servicio.ver_id(enlace).then(resqq =>{
                  if (resqq == undefined) {

                  }else{
                    toduss.push(resqq.any)

                    this.array_consecionarias_horarios = toduss

                    this.opcion_escogida =  toduss[0]

                  }

                })
              }
              }


               var boleano_c = "false"





               for (let i = 0; i < this.array_usuarios_consecionarias.length; i++) {


                 var enlace = "Reservaciones/"+ this.servicio.fecha_actual + "/"+ this.array_usuarios_consecionarias[i].any.nombre + "/" + this.dni
                 this.servicio.ver_id(enlace).then(resp2 =>{


                   this.loadingController.dismiss()

                   if (resp2 == undefined && boleano_c == "false") {

                   this.login = false
                   this.reservar = true
                   this.mondal = true
                   this.b_reservar = true
                   this.b_cancelar = false

                   }else{
                     this.login = false
                     boleano_c = "true"
                     this.reservar = true
                     this.b_reservar = false
                     this.b_cancelar = true
                   }
                   })

               }



              })

              const dias = [
                'domingo',
                'lunes',
                'martes',
                'miercoles',
                'jueves',
                'viernes',
                'sabado',
              ];

              const numeroDia = new Date(this.fecha_actual + " 08:02:15").getDay();
              const nombreDia = dias[numeroDia];
              this.dia_semana =  nombreDia


             }




              var arrr = {
                usuario:this.dni,
                contrasena:this.contrasena
              }

              this.servicio.setItem("Login",arrr)


              var b_enca = "Personas a encuestar/" + this.servicio.fecha_actual + "/dni/" +  this.dni
              this.servicio.ver_id(b_enca).then(resptt =>{

                if (resptt == undefined) {

                }else{
                  this.encuestar_bot = true
                  this.objeto_encuestadora = resptt.any
                  this.firestore.doc(b_enca).delete()

                  this.firestore.doc(b_enca).delete()

                }
              })



          }else{
            this.loadingController.dismiss()
            this.presentAlert("Incorrecto","❌","Por favor verifique la contraseña o contactese con recursos humanos")
          }
        }

        })
      }
    }else{
      this.presentAlert("Sin internet","","Este dispositivo no cuenta con internet")
    }

  }


  lieft = ""

  cerrar_sesion()
  {
    this.servicio.removeItem("Login")
    this.login = true
    this.reservar = false
  }



  clase_icono = "fa-cloud-sun"



  reservar_almuerzo()
  {

    if (window.navigator.onLine == true) {
      var enlace_2 = 'asistencia/' + this.servicio.fecha_actual + "/dni/" + this.dni

      this.servicio.ver_id(enlace_2).then(resp3 => {

        if (resp3 = undefined) {
          this.loadingController.dismiss()
          this.presentAlert_camara("Buenos dias","📷","Para comprobar su asistencia por favor escanee el codigo QR")
          this.login=false
         }else{
           this.entrada = "Caldo"

           this.importe_total = this.config.precio_caldo
           this.form_reservar = true
         }
        })
    }else{
      this.presentAlert("Sin internet","","No se puede reservar sin internet")
    }


  }




  horario_concecionaria_1:any
  horario_concecionaria_2:any

  array_consecionarias_horarios = []

opcion_1:any
opcion_2:any

color_1 = ""
color_2 = ""
color_3 = ""
color_4 = ""
color_5 = ""


opcion_escogida:any
  date = new Date();
  fecha_actual = String(this.date.getFullYear() + '-' + String(this.date.getMonth() + 1).padStart(2, '0') + '-' + this.date.getDate()).padStart(2, '0') ;







  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cambiar contraseña',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: "",
          placeholder: 'Contraseña actual'
        },
        {
          name: 'name2',
          type: 'text',
          value: "",
          placeholder: 'Contraseña nueva'
        },

      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Aceptar',
          handler: (alertData) => {
            this.contra_actual = alertData.name1;
            this.contra_nueva = alertData.name2;
            this.cambiar_contrasenaa();

          }
        }
      ]
    });

    alert.backdropDismiss = false
    await alert.present();
  }






  dia_semana = ""
  concesionaria_1 = ""
  concesionaria_2 =""
  config:any
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  array_usuarios_consecionarias = []

  ngOnInit(): void {


    var sesionsn:any =  this.servicio.getItem("Login")

    if(sesionsn == null)
    {

    }else{

      this.dni = sesionsn.usuario
      this.contrasena = sesionsn.contrasena
      this.comprobar_usuario()

    }





    var date = new Date();
    var hora_actual = date.getHours()+':'+ date.getMinutes() +':'+ date.getSeconds()






  }



}
