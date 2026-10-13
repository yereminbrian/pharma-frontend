import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReporteService } from './reporte-service';
import { VentaPorCategoria } from '../models/reporte.model';
import { environment } from '../../../../environments/environment';

describe('ReporteService', () => {
  let service: ReporteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReporteService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe consultar ventas por categoría enviando parámetros desde y hasta cuando estén presentes', () => {
    const mockData: VentaPorCategoria[] = [
      { categoriaId: 1, categoria: 'Analgésicos', cantidad: 10, total: 125.0 },
      { categoriaId: 2, categoria: 'Antibióticos', cantidad: 5, total: 240.0 },
    ];

    service.ventasPorCategoria({ desde: '2026-10-01', hasta: '2026-10-10' }).subscribe(data => {
      expect(data.length).toBe(2);
      expect(data[0].categoria).toBe('Analgésicos');
      expect(data[0].total).toBe(125.0);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.apiUrl}/reportes/ventas-por-categoria` &&
      request.params.get('desde') === '2026-10-01' &&
      request.params.get('hasta') === '2026-10-10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
