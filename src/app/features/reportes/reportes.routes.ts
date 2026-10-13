import { Routes } from '@angular/router';
import { ReporteVentasCategoria } from './pages/reporte-ventas-categoria/reporte-ventas-categoria';

export const REPORTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ventas-por-categoria' },
  {
    path: 'ventas-por-categoria',
    component: ReporteVentasCategoria,
    title: 'Reporte de ventas por categoría',
  },
];
