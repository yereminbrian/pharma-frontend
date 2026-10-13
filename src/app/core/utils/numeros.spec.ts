import { describe, it, expect } from 'vitest';
import { redondear } from './numeros';

describe('Utilidad redondear', () => {
  it('debe redondear a dos decimales correctamente', () => {
    expect(redondear(12.555)).toBe(12.56);
    expect(redondear(12.554)).toBe(12.55);
    expect(redondear(10)).toBe(10);
    expect(redondear(0.1 + 0.2)).toBe(0.3);
  });

  it('debe evitar errores de coma flotante en cálculos de subtotales', () => {
    const subtotal = redondear(12.5 * 3);
    expect(subtotal).toBe(37.5);
  });
});
