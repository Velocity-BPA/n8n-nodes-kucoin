/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  generateSignature,
  encryptPassphrase,
  getBaseUrl,
  buildQueryString,
  buildRequestOptions,
} from '../nodes/KuCoin/transport';

describe('Transport Layer', () => {
  describe('generateSignature', () => {
    const secret = 'test-secret-key';
    const timestamp = '1234567890000';
    const method = 'GET';
    const endpoint = '/api/v1/accounts';

    it('should generate a valid HMAC SHA256 signature', () => {
      const signature = generateSignature(secret, timestamp, method, endpoint);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should include body in signature when provided', () => {
      const body = JSON.stringify({ currency: 'BTC' });
      const signatureWithBody = generateSignature(secret, timestamp, 'POST', endpoint, body);
      const signatureWithoutBody = generateSignature(secret, timestamp, 'POST', endpoint);
      expect(signatureWithBody).not.toBe(signatureWithoutBody);
    });

    it('should produce different signatures for different methods', () => {
      const getSignature = generateSignature(secret, timestamp, 'GET', endpoint);
      const postSignature = generateSignature(secret, timestamp, 'POST', endpoint);
      expect(getSignature).not.toBe(postSignature);
    });

    it('should produce consistent signatures for same inputs', () => {
      const sig1 = generateSignature(secret, timestamp, method, endpoint);
      const sig2 = generateSignature(secret, timestamp, method, endpoint);
      expect(sig1).toBe(sig2);
    });
  });

  describe('encryptPassphrase', () => {
    it('should encrypt passphrase using HMAC SHA256', () => {
      const passphrase = 'my-passphrase';
      const secret = 'my-secret';
      const encrypted = encryptPassphrase(passphrase, secret);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should produce consistent encryption for same inputs', () => {
      const passphrase = 'test-passphrase';
      const secret = 'test-secret';
      const enc1 = encryptPassphrase(passphrase, secret);
      const enc2 = encryptPassphrase(passphrase, secret);
      expect(enc1).toBe(enc2);
    });

    it('should produce different encryption for different passphrases', () => {
      const secret = 'same-secret';
      const enc1 = encryptPassphrase('passphrase1', secret);
      const enc2 = encryptPassphrase('passphrase2', secret);
      expect(enc1).not.toBe(enc2);
    });
  });

  describe('getBaseUrl', () => {
    const productionCredentials = {
      apiKey: 'key',
      apiSecret: 'secret',
      apiPassphrase: 'pass',
      environment: 'production' as const,
      baseUrlSpot: 'https://api.kucoin.com',
      baseUrlFutures: 'https://api-futures.kucoin.com',
    };

    const sandboxCredentials = {
      ...productionCredentials,
      environment: 'sandbox' as const,
    };

    it('should return production spot URL for production environment', () => {
      const url = getBaseUrl(productionCredentials, 'spot');
      expect(url).toBe('https://api.kucoin.com');
    });

    it('should return production futures URL for production environment', () => {
      const url = getBaseUrl(productionCredentials, 'futures');
      expect(url).toBe('https://api-futures.kucoin.com');
    });

    it('should return sandbox URL for sandbox environment', () => {
      const url = getBaseUrl(sandboxCredentials, 'spot');
      expect(url).toBe('https://openapi-sandbox.kucoin.com');
    });

    it('should return sandbox URL for futures in sandbox environment', () => {
      const url = getBaseUrl(sandboxCredentials, 'futures');
      expect(url).toBe('https://openapi-sandbox.kucoin.com');
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from parameters', () => {
      const params = { currency: 'BTC', type: 'trade' };
      const queryString = buildQueryString(params);
      expect(queryString).toContain('currency=BTC');
      expect(queryString).toContain('type=trade');
      expect(queryString.startsWith('?')).toBe(true);
    });

    it('should return empty string for empty params', () => {
      const queryString = buildQueryString({});
      expect(queryString).toBe('');
    });

    it('should filter out undefined and null values', () => {
      const params = { currency: 'BTC', type: undefined, amount: null, size: '' };
      const queryString = buildQueryString(params);
      expect(queryString).toBe('?currency=BTC');
    });

    it('should encode special characters', () => {
      const params = { query: 'test value' };
      const queryString = buildQueryString(params);
      expect(queryString).toBe('?query=test%20value');
    });
  });

  describe('buildRequestOptions', () => {
    const credentials = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      apiPassphrase: 'test-passphrase',
      environment: 'production' as const,
      baseUrlSpot: 'https://api.kucoin.com',
      baseUrlFutures: 'https://api-futures.kucoin.com',
    };

    it('should build request options with correct headers', () => {
      const options = buildRequestOptions(credentials, 'GET', '/api/v1/accounts');
      expect(options.headers).toBeDefined();
      expect(options.headers!['KC-API-KEY']).toBe('test-api-key');
      expect(options.headers!['KC-API-KEY-VERSION']).toBe('2');
      expect(options.headers!['Content-Type']).toBe('application/json');
    });

    it('should include body for POST requests', () => {
      const body = { currency: 'BTC', amount: '1.0' };
      const options = buildRequestOptions(credentials, 'POST', '/api/v1/orders', body);
      expect(options.body).toEqual(body);
    });

    it('should use correct base URL for futures', () => {
      const options = buildRequestOptions(credentials, 'GET', '/api/v1/contracts/active', {}, 'futures');
      expect(options.url).toContain('api-futures.kucoin.com');
    });
  });
});
