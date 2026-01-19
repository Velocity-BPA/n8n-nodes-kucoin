/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  generateClientOid,
  toMilliseconds,
  formatTimestamp,
  cleanObject,
  parseNumeric,
  parseBoolean,
  isValidSymbol,
  formatPrice,
  formatSize,
  sleep,
  chunkArray,
  deepMerge,
} from '../nodes/KuCoin/utils/helpers';

describe('Helper Functions', () => {
  describe('generateClientOid', () => {
    it('should generate a unique client order ID', () => {
      const oid1 = generateClientOid();
      const oid2 = generateClientOid();
      expect(oid1).toBeDefined();
      expect(typeof oid1).toBe('string');
      expect(oid1).not.toBe(oid2);
    });

    it('should not contain dashes', () => {
      const oid = generateClientOid();
      expect(oid).not.toContain('-');
    });

    it('should be 32 characters long', () => {
      const oid = generateClientOid();
      expect(oid.length).toBe(32);
    });
  });

  describe('toMilliseconds', () => {
    it('should convert seconds to milliseconds', () => {
      expect(toMilliseconds(1234567890)).toBe(1234567890000);
    });

    it('should keep milliseconds as is', () => {
      expect(toMilliseconds(1234567890000)).toBe(1234567890000);
    });

    it('should handle string timestamps', () => {
      expect(toMilliseconds('1234567890')).toBe(1234567890000);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp to ISO string', () => {
      const formatted = formatTimestamp(1609459200000);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle seconds timestamp', () => {
      const formatted = formatTimestamp(1609459200);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const obj = { a: 1, b: undefined, c: 'test' };
      const cleaned = cleanObject(obj);
      expect(cleaned).toEqual({ a: 1, c: 'test' });
    });

    it('should remove null values', () => {
      const obj = { a: 1, b: null, c: 'test' };
      const cleaned = cleanObject(obj);
      expect(cleaned).toEqual({ a: 1, c: 'test' });
    });

    it('should remove empty string values', () => {
      const obj = { a: 1, b: '', c: 'test' };
      const cleaned = cleanObject(obj);
      expect(cleaned).toEqual({ a: 1, c: 'test' });
    });

    it('should keep zero and false values', () => {
      const obj = { a: 0, b: false, c: 'test' };
      const cleaned = cleanObject(obj);
      expect(cleaned).toEqual({ a: 0, b: false, c: 'test' });
    });
  });

  describe('parseNumeric', () => {
    it('should parse numeric string', () => {
      expect(parseNumeric('123.45')).toBe(123.45);
    });

    it('should return number as is', () => {
      expect(parseNumeric(123.45)).toBe(123.45);
    });

    it('should return undefined for undefined', () => {
      expect(parseNumeric(undefined)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(parseNumeric('')).toBeUndefined();
    });

    it('should return undefined for invalid string', () => {
      expect(parseNumeric('abc')).toBeUndefined();
    });
  });

  describe('parseBoolean', () => {
    it('should parse "true" string', () => {
      expect(parseBoolean('true')).toBe(true);
    });

    it('should parse "false" string', () => {
      expect(parseBoolean('false')).toBe(false);
    });

    it('should return boolean as is', () => {
      expect(parseBoolean(true)).toBe(true);
      expect(parseBoolean(false)).toBe(false);
    });

    it('should return undefined for undefined', () => {
      expect(parseBoolean(undefined)).toBeUndefined();
    });

    it('should be case insensitive', () => {
      expect(parseBoolean('TRUE')).toBe(true);
      expect(parseBoolean('True')).toBe(true);
    });
  });

  describe('isValidSymbol', () => {
    it('should validate correct symbol format', () => {
      expect(isValidSymbol('BTC-USDT')).toBe(true);
      expect(isValidSymbol('ETH-BTC')).toBe(true);
    });

    it('should reject invalid symbol format', () => {
      expect(isValidSymbol('BTCUSDT')).toBe(false);
      expect(isValidSymbol('BTC_USDT')).toBe(false);
      expect(isValidSymbol('btc-usdt')).toBe(true); // case insensitive check
    });
  });

  describe('formatPrice', () => {
    it('should format price with default precision', () => {
      expect(formatPrice(123.456789012)).toBe('123.45678901');
    });

    it('should format price with custom precision', () => {
      expect(formatPrice(123.456, 2)).toBe('123.46');
    });

    it('should handle string input', () => {
      expect(formatPrice('123.456', 2)).toBe('123.46');
    });
  });

  describe('formatSize', () => {
    it('should format size with default precision', () => {
      expect(formatSize(1.23456789012)).toBe('1.23456789');
    });

    it('should format size with custom precision', () => {
      expect(formatSize(1.234, 4)).toBe('1.2340');
    });
  });

  describe('sleep', () => {
    it('should wait for specified milliseconds', async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });
  });

  describe('chunkArray', () => {
    it('should chunk array into smaller arrays', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const chunks = chunkArray(arr, 3);
      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty array', () => {
      expect(chunkArray([], 3)).toEqual([]);
    });

    it('should handle array smaller than chunk size', () => {
      expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 4, d: 3, e: 5 }, f: 6 };
      const result = deepMerge(target, source as any);
      expect(result).toEqual({ a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 });
    });

    it('should not mutate original objects', () => {
      const target = { a: 1 };
      const source = { a: 2 };
      deepMerge(target, source);
      expect(target).toEqual({ a: 1 });
    });

    it('should handle undefined values in source', () => {
      const target = { a: 1, b: 2 };
      const source = { a: undefined };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });
});
