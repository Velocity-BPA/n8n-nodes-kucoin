/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IHttpRequestMethods,
  IRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';

export interface IKuCoinCredentials {
  apiKey: string;
  apiSecret: string;
  apiPassphrase: string;
  environment: 'production' | 'sandbox';
  baseUrlSpot: string;
  baseUrlFutures: string;
}

export interface IKuCoinResponse {
  code: string;
  msg?: string;
  data?: any;
}

// Log licensing notice once per node load
let licensingNoticeLogged = false;
function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licensingNoticeLogged = true;
  }
}

/**
 * Generate HMAC SHA256 signature for KuCoin API
 */
export function generateSignature(
  secret: string,
  timestamp: string,
  method: string,
  endpoint: string,
  body: string = '',
): string {
  const message = timestamp + method.toUpperCase() + endpoint + body;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(message);
  return hmac.digest('base64');
}

/**
 * Encrypt passphrase for API v2
 */
export function encryptPassphrase(passphrase: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(passphrase);
  return hmac.digest('base64');
}

/**
 * Get base URL based on API type and environment
 */
export function getBaseUrl(
  credentials: IKuCoinCredentials,
  apiType: 'spot' | 'futures' = 'spot',
): string {
  if (credentials.environment === 'sandbox') {
    return 'https://openapi-sandbox.kucoin.com';
  }
  return apiType === 'futures' ? credentials.baseUrlFutures : credentials.baseUrlSpot;
}

/**
 * Build request options with authentication headers
 */
export function buildRequestOptions(
  credentials: IKuCoinCredentials,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  apiType: 'spot' | 'futures' = 'spot',
): IRequestOptions {
  logLicensingNotice();

  const timestamp = Date.now().toString();
  const baseUrl = getBaseUrl(credentials, apiType);
  const bodyString = body && Object.keys(body).length > 0 ? JSON.stringify(body) : '';

  const signature = generateSignature(
    credentials.apiSecret,
    timestamp,
    method,
    endpoint,
    bodyString,
  );

  const encryptedPassphrase = encryptPassphrase(credentials.apiPassphrase, credentials.apiSecret);

  const options: IRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      'KC-API-KEY': credentials.apiKey,
      'KC-API-SIGN': signature,
      'KC-API-TIMESTAMP': timestamp,
      'KC-API-PASSPHRASE': encryptedPassphrase,
      'KC-API-KEY-VERSION': '2',
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  return options;
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: IDataObject): string {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return filteredParams ? `?${filteredParams}` : '';
}

/**
 * Make authenticated API request to KuCoin
 */
export async function kuCoinApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  apiType: 'spot' | 'futures' = 'spot',
): Promise<any> {
  const credentials = await this.getCredentials('kuCoinApi') as IKuCoinCredentials;

  // Build endpoint with query parameters
  const queryString = buildQueryString(query);
  const fullEndpoint = endpoint + queryString;

  const options = buildRequestOptions(credentials, method, fullEndpoint, body, apiType);

  try {
    const response = await this.helpers.request(options) as IKuCoinResponse;

    // Check for KuCoin API errors
    if (response.code && response.code !== '200000') {
      throw new NodeApiError(this.getNode(), {
        message: response.msg || 'Unknown KuCoin API error',
        httpCode: response.code,
      } as any, {
        message: `KuCoin API Error: ${response.msg || 'Unknown error'} (Code: ${response.code})`,
      });
    }

    return response.data !== undefined ? response.data : response;
  } catch (error: any) {
    if (error instanceof NodeApiError) {
      throw error;
    }

    // Handle HTTP errors
    if (error.response) {
      const errorBody = error.response.body || {};
      throw new NodeApiError(this.getNode(), {
        message: errorBody.msg || error.message,
        httpCode: errorBody.code || error.response.statusCode,
      } as any, {
        message: `KuCoin API Error: ${errorBody.msg || error.message}`,
      });
    }

    throw new NodeApiError(this.getNode(), error as any, {
      message: `Request failed: ${error.message}`,
    });
  }
}

/**
 * Make paginated API request
 */
export async function kuCoinApiRequestAllItems(
  this: IExecuteFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  apiType: 'spot' | 'futures' = 'spot',
  propertyName: string = 'items',
): Promise<any[]> {
  const returnData: any[] = [];
  let currentPage = 1;
  const pageSize = 50;

  let response: any;
  do {
    query.currentPage = currentPage;
    query.pageSize = pageSize;

    response = await kuCoinApiRequest.call(this, method, endpoint, body, query, apiType);

    if (Array.isArray(response)) {
      returnData.push(...response);
      break;
    }

    const items = response[propertyName] || response.items || response;
    if (Array.isArray(items)) {
      returnData.push(...items);
    }

    currentPage++;
  } while (
    response &&
    response.totalPage &&
    currentPage <= response.totalPage
  );

  return returnData;
}
