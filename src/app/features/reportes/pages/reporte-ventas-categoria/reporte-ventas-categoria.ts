import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { mensajeError } from '../../../../core/utils/http-error';
import { redondear } from '../../../../core/utils/numeros';
import { FiltroReporte, VentaPorCategoria } from '../../models/reporte.model';
import { ReporteService } from '../../services/reporte-service';

@Component({
  selector: 'app-reporte-ventas-categoria',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './reporte-ventas-categoria.html',
  styleUrl: './reporte-ventas-categoria.css',
})
export class ReporteVentasCategoria implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly reporteService = inject(ReporteService);

  protected readonly items = signal<VentaPorCategoria[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly ahora = signal(new Date());

  protected readonly filtros = this.fb.group({
    desde: this.fb.control<string | null>(null),
    hasta: this.fb.control<string | null>(null),
  });

  protected readonly totalUnidades = computed(() =>
    this.items().reduce((suma, item) => suma + Number(item.cantidad), 0),
  );

  protected readonly totalMonto = computed(() =>
    redondear(this.items().reduce((suma, item) => suma + Number(item.total), 0)),
  );

  protected resumenFiltros(): string {
    const f = this.filtros.getRawValue();
    const partes = [
      f.desde ? `desde ${f.desde}` : '',
      f.hasta ? `hasta ${f.hasta}` : '',
    ].filter(Boolean);
    return partes.length ? partes.join(' · ') : 'histórico completo (sin filtro de fechas)';
  }

  ngOnInit(): void {
    this.cargar();
  }

  buscar(): void {
    const { desde, hasta } = this.filtros.getRawValue();
    if (desde && hasta && desde > hasta) {
      this.error.set('La fecha «desde» no puede ser posterior a la fecha «hasta».');
      return;
    }
    this.cargar();
  }

  limpiar(): void {
    this.filtros.reset();
    this.buscar();
  }

  imprimir(): void {
    this.ahora.set(new Date());
    setTimeout(() => window.print());
  }

  private cargar(): void {
    const filtro: FiltroReporte = this.filtros.getRawValue();
    this.cargando.set(true);
    this.error.set(null);
    this.reporteService.ventasPorCategoria(filtro).subscribe({
      next: data => {
        this.items.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
