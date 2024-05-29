import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from './api.service.service';

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
  vistaActual: string = 'todos';  // Variable para controlar la vista actual
  isEditModalOpen: boolean = false;
  isDeletedModalOpen: boolean = false;
  modalTraduccion: any; // Definición de la variable modalTraduccion

  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.cargarTraducciones();
    this.actualizarFechaYHora();
  }

  openEditModal(traduccion: any) {
    this.modalTraduccion = traduccion; // Clonar la traducción seleccionada
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  openModalEliminar(traduccion: any) {
    this.modalTraduccion = traduccion; // Asigna la traducción seleccionada a modalTraduccion
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
        console.log(data);
      },
      error => {
        console.log('Error al cargar las traducciones:', error);
      }
    );
  }

  cargarTraduccionesActivas() {
    this.apiService.getTraduccionesActivas().subscribe(
      data => {
        this.traducciones = data;
        console.log(data);
      },
      error => {
        console.log('Error al cargar las traducciones activas:', error);
      }
    );
  }

  cargarTraduccionesInactivas() {
    this.apiService.getTraduccionesInactivas().subscribe(
      data => {
        this.traducciones = data;
        console.log(data);
      },
      error => {
        console.log('Error al cargar las traducciones inactivas:', error);
      }
    );
  }

  traducirPalabra() {
    this.apiService.traducirPalabra(this.palabra_ingresada).subscribe(
      (response: any) => {
        this.palabra_traducida = response[0].translations[0].text;
        this.apiService.guardarTraduccion(this.palabra_ingresada, this.palabra_traducida).subscribe(
          (data: any) => {
            this.cargarVistaActual();
          },
          error => {
            console.error('Error al guardar la traducción:', error);
          }
        );
      },
      error => {
        console.error('Error al traducir la palabra:', error);
      }
    );
  }

  editarTraduccion(traduccion: any) {
    // Asignar los datos del registro seleccionado a modalTraduccion
    this.modalTraduccion = traduccion;
    // Abrir el modal de edición con los datos de la traducción seleccionada
    this.openEditModal(traduccion);
    console.log(traduccion.id_traducciones_guardadas); // Imprime el ID
    console.log(traduccion.palabra_ingresada); // Imprime la palabra ingresada
    console.log(traduccion.palabra_traducida); // Imprime la palabra traducida
  }

  guardarCambios() {
    // Formatear los datos antes de enviarlos
    const datosActualizados = {
      id_traducciones_guardadas: this.modalTraduccion.id_traducciones_guardadas,
      palabra_ingresada: this.modalTraduccion.palabra_ingresada,
      palabra_traducida: this.modalTraduccion.palabra_traducida,
      estado: this.modalTraduccion.estado
    };

    // Agrega un console.log para ver los datos antes de enviarlos
    console.log('Datos a enviar para actualizar:', datosActualizados);

    // Llama al servicio para actualizar la traducción
    this.apiService.actualizarTraduccion(datosActualizados).subscribe(
      (response) => {
        console.log('Traducción actualizada:', response);
        this.closeEditModal();
      },
      (error) => {
        console.error('Error al actualizar la traducción:', error);
      }
    );
  }


  reactivarTraduccion(id: number) {
    this.apiService.activarTraduccion(id).subscribe(
      () => {
        this.cargarVistaActual();
      },
      error => {
        console.error('Error al reactivar la traducción:', error);
      }
    );
  }

  eliminarTraduccionLogica(id: number) {
    this.apiService.eliminarTraduccionLogica(id).subscribe(
      () => {
        this.cargarVistaActual();
      },
      error => {
        console.error('Error al eliminar la traducción:', error);
      }
    );
  }

  eliminarTraduccionFisica(id: number) {
    this.apiService.eliminarTraduccionFisica(id).subscribe(
      () => {
        this.cargarVistaActual();
        this.closeModal();
      },
      error => {
        console.error('Error al eliminar físicamente la traducción:', error);
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