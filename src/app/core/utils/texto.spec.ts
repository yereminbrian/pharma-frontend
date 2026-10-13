import { describe, it, expect } from 'vitest';
import { coincide, normalizar } from './texto';

describe('Utilidades de texto para buscadores', () => {
  it('normalizar debe pasar a minúsculas y quitar tildes', () => {
    expect(normalizar('Analgésicos')).toBe('analgesicos');
    expect(normalizar('Huamán')).toBe('huaman');
    expect(normalizar('MARÍA ELENA')).toBe('maria elena');
  });

  it('coincide debe retornar true para coincidencias sin tildes ni mayúsculas', () => {
    expect(coincide('huaman', 'Huamán Torres', 'María Elena')).toBe(true);
    expect(coincide('para 500', 'Paracetamol 500 mg x 100')).toBe(true);
    expect(coincide('73456789', 'Huamán Torres', 'María Elena', '73456789')).toBe(true);
  });

  it('coincide debe retornar false cuando el término no aparece en los campos', () => {
    expect(coincide('inexistente', 'Paracetamol 500 mg')).toBe(false);
    expect(coincide('99999999', 'Huamán Torres', '73456789')).toBe(false);
  });
});
