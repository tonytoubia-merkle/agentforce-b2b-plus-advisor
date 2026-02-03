import { describe, it, expect } from 'vitest';
import { generateMockResponse } from '@/services/mock/mockAgent';

describe('generateMockResponse', () => {
  it('returns polycarbonate product for PC query', async () => {
    const response = await generateMockResponse('I need polycarbonate');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCT');
    expect(response.uiDirective?.payload.products).toHaveLength(1);
    expect(response.uiDirective?.payload.products![0].id).toBe('resin-pc-lexan');
  });

  it('returns engineered resins for product browsing query', async () => {
    const response = await generateMockResponse('show me resins');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(1);
  });

  it('returns order tracking response for order query', async () => {
    const response = await generateMockResponse('where is my order');
    expect(response.message).toBeDefined();
    expect(response.suggestedActions!.length).toBeGreaterThan(0);
  });

  it('returns nylon products for nylon query', async () => {
    const response = await generateMockResponse('show me nylon');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.every((p) => p.category === 'high-performance-polymer' || p.name.toLowerCase().includes('nylon') || p.name.toLowerCase().includes('ultramid'))).toBe(true);
  });

  it('returns PEEK for high performance query', async () => {
    const response = await generateMockResponse('I need PEEK');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCT');
    expect(response.uiDirective?.payload.products![0].id).toBe('resin-peek-victrex');
  });

  it('returns sustainable materials for sustainability query', async () => {
    const response = await generateMockResponse('show me sustainable materials');
    expect(response.uiDirective?.action).toBe('SHOW_PRODUCTS');
    expect(response.uiDirective?.payload.products!.length).toBeGreaterThan(0);
  });

  it('returns elastomers for TPV query', async () => {
    const response = await generateMockResponse('show me elastomers');
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
