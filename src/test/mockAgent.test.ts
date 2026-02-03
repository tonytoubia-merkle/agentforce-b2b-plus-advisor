import { describe, it, expect } from 'vitest';
import { generateMockResponse } from '@/services/mock/mockAgent';

describe('generateMockResponse', () => {
  it('returns solar panel product for solar query', async () => {
    const response = await generateMockResponse('I need solar panels');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(0);
    expect(response.uiDirective?.payload.products![0].category).toBe('solar-panel');
  });

  it('returns wind turbine products for turbine query', async () => {
    const response = await generateMockResponse('show me wind turbine components');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(0);
  });

  it('returns order tracking response for order query', async () => {
    const response = await generateMockResponse('where is my order');
    expect(response.message).toBeDefined();
    expect(response.suggestedActions!.length).toBeGreaterThan(0);
  });

  it('returns inverter products for inverter query', async () => {
    const response = await generateMockResponse('show me inverters');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.every((p) => p.category === 'inverter')).toBe(true);
  });

  it('returns energy storage for battery query', async () => {
    const response = await generateMockResponse('I need battery storage');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products![0].category).toBe('energy-storage');
  });

  it('returns mounting systems for mounting query', async () => {
    const response = await generateMockResponse('show me mounting rails');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(0);
  });

  it('returns balance of system for transformer query', async () => {
    const response = await generateMockResponse('show me transformers');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(0);
  });

  it('returns pricing info for price query', async () => {
    const response = await generateMockResponse('what are your prices');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.message).toContain('price');
  });

  it('resets scene for goodbye', async () => {
    const response = await generateMockResponse('thanks bye');
    expect(response.uiDirective?.action).toBe('RESET_SCENE');
  });

  it('returns suggested actions for unmatched query', async () => {
    const response = await generateMockResponse('asdfghjkl');
    expect(response.suggestedActions).toBeDefined();
    expect(response.suggestedActions!.length).toBeGreaterThan(0);
    expect(response.uiDirective).toBeUndefined();
  });

  it('returns greeting for hello', async () => {
    const response = await generateMockResponse('hello');
    expect(response.message).toContain('Welcome');
    expect(response.suggestedActions!.length).toBeGreaterThan(0);
  });
});
