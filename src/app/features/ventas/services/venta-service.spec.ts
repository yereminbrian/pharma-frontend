import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VentaService } from './venta-service';
import { Venta, VentaRequest } from '../models/venta.model';
import { environment } from '../../../../environments/environment';

describe('VentaService', () => {
  let service: VentaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VentaService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(VentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe registrar una venta enviando solo clienteId y detalles con productoId y cantidad', () => {
    const request: VentaRequest = {
      clienteId: 1,
      detalles: [{ productoId: 2, cantidad: 3 }],
    };

    const mockResponse: Venta = {
      id: 10,
      fecha: '2026-10-12T10:00:00',
      clienteId: 1,
      clienteNombre: 'Huamán Torres, María Elena',
      estado: 'REGISTRADA',
      total: 37.5,
      detalles: [
        {
          productoId: 2,
          productoNombre: 'Paracetamol 500 mg',
          cantidad: 3,
          precio: 12.5,
          subtotal: 37.5,
        },
      ],
    };

    service.registrar(request).subscribe(res => {
      expect(res.id).toBe(10);
      expect(res.total).toBe(37.5);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/ventas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('debe buscar ventas enviando solo los filtros con valor', () => {
    service.buscar({ clienteId: 1, estado: 'REGISTRADA', desde: null, hasta: null }, 0, 10).subscribe(res => {
      expect(res.contenido.length).toBe(1);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.apiUrl}/ventas/buscar` &&
      request.params.get('clienteId') === '1' &&
      request.params.get('estado') === 'REGISTRADA' &&
      !request.params.has('desde') &&
      !request.params.has('hasta')
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      contenido: [{ id: 1 }],
      pagina: 0,
      tamanio: 10,
      totalElementos: 1,
      totalPaginas: 1,
      ultima: true,
    });
  });
});
