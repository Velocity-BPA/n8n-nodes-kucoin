/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';
import * as crypto from 'crypto';

/**
 * Generate a unique client order ID
 */
export function generateClientOid(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * Convert timestamp to milliseconds
 */
export function toMilliseconds(timestamp: number | string): number {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (ts < 10000000000) {
    return ts * 1000;
  }
  return ts;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number | string): string {
  const ms = toMilliseconds(timestamp);
  return new Date(ms).toISOString();
}

/**
 * Clean object by removing undefined/null values
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Parse numeric string to number or return original
 */
export function parseNumeric(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Convert boolean string to boolean
 */
export function parseBoolean(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return value.toLowerCase() === 'true';
}

/**
 * Validate symbol format (e.g., BTC-USDT)
 */
export function isValidSymbol(symbol: string): boolean {
  return /^[A-Z0-9]+-[A-Z0-9]+$/.test(symbol.toUpperCase());
}

/**
 * Format price with proper precision
 */
export function formatPrice(price: number | string, precision: number = 8): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(precision);
}

/**
 * Format size with proper precision
 */
export function formatSize(size: number | string, precision: number = 8): string {
  const numSize = typeof size === 'string' ? parseFloat(size) : size;
  return numSize.toFixed(precision);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends IDataObject>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue as any, sourceValue as any);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[keyof T];
    }
  }
  return result;
}
