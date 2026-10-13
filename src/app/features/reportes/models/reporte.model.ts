export interface VentaPorCategoria {
  categoriaId: number;
  categoria: string;
  cantidad: number; // unidades vendidas
  total: number; // monto total en soles
}

export interface FiltroReporte {
  desde: string | null;
  hasta: string | null;
}
