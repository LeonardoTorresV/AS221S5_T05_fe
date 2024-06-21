import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './api.service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  traducciones: any[] = [];
  horaActual: string = '';
  fechaActual: string = '';
  palabra_ingresada: string = '';
  palabra_traducida: string = '';
  vistaActual: string = 'todos';
  isEditModalOpen: boolean = false;
  isDeletedModalOpen: boolean = false;
  modalTraduccion: any;
  idiomas: { codigo: string, nombre: string }[] = [
    { codigo: 'af', nombre: 'Afrikáans' },
    { codigo: 'ar', nombre: 'Árabe' },
    { codigo: 'bn', nombre: 'Bengalí' },
    { codigo: 'bg', nombre: 'Búlgaro' },
    { codigo: 'ca', nombre: 'Catalán' },
    { codigo: 'zh-Hans', nombre: 'Chino Simplificado' },
    { codigo: 'zh-Hant', nombre: 'Chino Tradicional' },
    { codigo: 'hr', nombre: 'Croata' },
    { codigo: 'cs', nombre: 'Checo' },
    { codigo: 'da', nombre: 'Danés' },
    { codigo: 'nl', nombre: 'Holandés' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'et', nombre: 'Estonio' },
    { codigo: 'fi', nombre: 'Finlandés' },
    { codigo: 'fr', nombre: 'Francés' },
    { codigo: 'de', nombre: 'Alemán' },
    { codigo: 'el', nombre: 'Griego' },
    { codigo: 'gu', nombre: 'Guyaratí' },
    { codigo: 'he', nombre: 'Hebreo' },
    { codigo: 'hi', nombre: 'Hindi' },
    { codigo: 'hu', nombre: 'Húngaro' },
    { codigo: 'is', nombre: 'Islandés' },
    { codigo: 'id', nombre: 'Indonesio' },
    { codigo: 'it', nombre: 'Italiano' },
    { codigo: 'ja', nombre: 'Japonés' },
    { codigo: 'kn', nombre: 'Canarés' },
    { codigo: 'ko', nombre: 'Coreano' },
    { codigo: 'lv', nombre: 'Letón' },
    { codigo: 'lt', nombre: 'Lituano' },
    { codigo: 'ms', nombre: 'Malayo' },
    { codigo: 'ml', nombre: 'Malayalam' },
    { codigo: 'mt', nombre: 'Maltés' },
    { codigo: 'mr', nombre: 'Marathi' },
    { codigo: 'nb', nombre: 'Noruego' },
    { codigo: 'fa', nombre: 'Persa' },
    { codigo: 'pl', nombre: 'Polaco' },
    { codigo: 'pt', nombre: 'Portugués' },
    { codigo: 'pa', nombre: 'Punjabi' },
    { codigo: 'ro', nombre: 'Rumano' },
    { codigo: 'ru', nombre: 'Ruso' },
    { codigo: 'sr', nombre: 'Serbio' },
    { codigo: 'sk', nombre: 'Eslovaco' },
    { codigo: 'sl', nombre: 'Esloveno' },
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'sw', nombre: 'Swahili' },
    { codigo: 'sv', nombre: 'Sueco' },
    { codigo: 'ta', nombre: 'Tamil' },
    { codigo: 'te', nombre: 'Telugu' },
    { codigo: 'th', nombre: 'Tailandés' },
    { codigo: 'tr', nombre: 'Turco' },
    { codigo: 'uk', nombre: 'Ucraniano' },
    { codigo: 'ur', nombre: 'Urdu' },
    { codigo: 'vi', nombre: 'Vietnamita' },
    { codigo: 'cy', nombre: 'Galés' },
    // Agrega más idiomas según tus necesidades
  ];
  idiomaSeleccionado: string = 'es';

  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.cargarTraducciones();
    this.actualizarFechaYHora();
  }

  openEditModal(traduccion: any) {
    this.modalTraduccion = { ...traduccion };
    this.idiomaSeleccionado = this.modalTraduccion.idioma; // Si idioma es parte de traduccion
    this.traducirPalabraParaEdicion(this.modalTraduccion.palabra_ingresada);
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  openModalEliminar(traduccion: any) {
    this.modalTraduccion = traduccion;
    this.isDeletedModalOpen = true;
  }

  closeModal() {
    this.isDeletedModalOpen = false;
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.cargarVistaActual();
  }

  cargarVistaActual() {
    if (this.vistaActual === 'activos') {
      this.cargarTraduccionesActivas();
    } else if (this.vistaActual === 'inactivos') {
      this.cargarTraduccionesInactivas();
    } else {
      this.cargarTraducciones();
    }
  }

  cargarTraducciones() {
    this.apiService.getTraduccionesGuardadas().subscribe(
      data => {
        this.traducciones = data;
      },
      error => {
        console.error('Error al cargar las traducciones:', error);
        Swal.fire('Error', 'Error al cargar las traducciones', 'error');
      }
    );
  }

  cargarTraduccionesActivas() {
    this.apiService.getTraduccionesActivas().subscribe(
      data => {
        this.traducciones = data;
      },
      error => {
        console.error('Error al cargar las traducciones activas:', error);
        Swal.fire('Error', 'Error al cargar las traducciones activas', 'error');
      }
    );
  }

  cargarTraduccionesInactivas() {
    this.apiService.getTraduccionesInactivas().subscribe(
      data => {
        this.traducciones = data;
      },
      error => {
        console.error('Error al cargar las traducciones inactivas:', error);
        Swal.fire('Error', 'Error al cargar las traducciones inactivas', 'error');
      }
    );
  }

  traducirPalabra() {
    this.apiService.traducirPalabra(this.palabra_ingresada, this.idiomaSeleccionado).subscribe(
      response => {
        this.palabra_traducida = response[0].translations[0].text;
        this.apiService.guardarTraduccion(this.palabra_ingresada, this.palabra_traducida).subscribe(
          data => {
            this.cargarVistaActual();
            Swal.fire('Éxito', 'Traducción guardada con éxito', 'success');
            this.limpiarCampos(); // Limpiar los campos después de guardar
          },
          error => {
            console.error('Error al guardar la traducción:', error);
            Swal.fire('Error', 'Error al guardar la traducción', 'error');
          }
        );
      },
      error => {
        console.error('Error al traducir la palabra:', error);
        Swal.fire('Error', 'Error al traducir la palabra', 'error');
      }
    );
  }

  limpiarCampos() {
    this.palabra_ingresada = '';
    this.palabra_traducida = '';
  }

  traducirPalabraParaEdicion(palabra: string) {
    if (!palabra || !this.modalTraduccion.idioma) {
      return;
    }
  
    this.apiService.traducirPalabra(palabra, this.modalTraduccion.idioma).subscribe(
      response => {
        this.modalTraduccion.palabra_traducida = response[0].translations[0].text;
      },
      error => {
        console.error('Error al traducir la palabra:', error);
        Swal.fire('Error', 'Error al traducir la palabra', 'error');
      }
    );
  }


  guardarCambios() {
    this.apiService.actualizarTraduccion(
      this.modalTraduccion.id_traducciones_guardadas,
      this.modalTraduccion.palabra_ingresada,
      this.modalTraduccion.palabra_traducida
    ).subscribe(
      response => {
        this.closeEditModal();
        this.cargarVistaActual();
        Swal.fire('Éxito', 'Cambios guardados con éxito', 'success');
      },
      error => {
        console.error('Error al actualizar la traducción:', error);
        Swal.fire('Error', 'Error al actualizar la traducción', 'error');
      }
    );
  }

  reactivarTraduccion(id: number) {
    this.apiService.activarTraduccion(id).subscribe(
      () => {
        this.cargarVistaActual();
        Swal.fire('Éxito', 'Traducción reactivada con éxito', 'success');
      },
      error => {
        console.error('Error al reactivar la traducción:', error);
        Swal.fire('Error', 'Error al reactivar la traducción', 'error');
      }
    );
  }

  eliminarTraduccionLogica(id: number) {
    this.apiService.eliminarTraduccionLogica(id).subscribe(
      () => {
        this.cargarVistaActual();
        Swal.fire('Éxito', 'Traducción eliminada lógicamente', 'success');
      },
      error => {
        console.error('Error al eliminar la traducción:', error);
        Swal.fire('Error', 'Error al eliminar la traducción', 'error');
      }
    );
  }

  eliminarTraduccionFisica(id: number) {
    this.apiService.eliminarTraduccionFisica(id).subscribe(
      () => {
        this.cargarVistaActual();
        this.closeModal();
        Swal.fire('Éxito', 'Traducción eliminada permanentemente', 'success');
      },
      error => {
        console.error('Error al eliminar físicamente la traducción:', error);
        Swal.fire('Error', 'Error al eliminar físicamente la traducción', 'error');
      }
    );
  }

  actualizarFechaYHora() {
    setInterval(() => {
      const ahora = new Date();
      const diaSemana = this.obtenerNombreDiaSemana(ahora.getDay());
      const dia = ahora.getDate();
      const mes = this.obtenerNombreMes(ahora.getMonth());
      const año = ahora.getFullYear();
      const hora = ahora.toLocaleTimeString();
      this.horaActual = hora;
      this.fechaActual = `${diaSemana} ${dia} de ${mes} de ${año}`;
    }, 1000);
  }

  obtenerNombreDiaSemana(dia: number): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[dia];
  }

  obtenerNombreMes(mes: number): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes];
  }
}
