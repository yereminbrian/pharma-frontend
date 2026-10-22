import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;

  listar(
    pagina = 0,
    tamanio = 10,
    ordenarPor: 'id' | 'dni' | 'nombres' | 'apellidos' | 'email' = 'apellidos',
    direccion: 'asc' | 'desc' = 'asc',
  ): Observable<PaginaResponse<Cliente>> {
    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('ordenarPor', ordenarPor)
      .set('direccion', direccion);

    return this.http.get<PaginaResponse<Cliente> | Cliente[]>(this.url, { params }).pipe(
      map((respuesta) => {
        if (!Array.isArray(respuesta)) {
          return respuesta;
        }

        const clientes = [...respuesta].sort((a, b) => {
          const valorA = String(a[ordenarPor]);
          const valorB = String(b[ordenarPor]);

          const resultado =
            ordenarPor === 'id'
              ? Number(a.id) - Number(b.id)
              : valorA.localeCompare(valorB, 'es', {
                  sensitivity: 'base',
                });

          return resultado * (direccion === 'asc' ? 1 : -1);
        });

        const totalPaginas = Math.ceil(clientes.length / tamanio);

        return {
          contenido: clientes.slice(pagina * tamanio, (pagina + 1) * tamanio),
          pagina,
          tamanio,
          totalElementos: clientes.length,
          totalPaginas,
          ultima: pagina >= totalPaginas - 1,
        };
      }),
    );
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  crear(datos: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, datos);
  }

  actualizar(id: number, datos: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
