/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class KuCoinApi implements ICredentialType {
  name = 'kuCoinApi';
  displayName = 'KuCoin API';
  documentationUrl = 'https://docs.kucoin.com/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'API Passphrase',
      name: 'apiPassphrase',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        { name: 'Production', value: 'production' },
        { name: 'Sandbox', value: 'sandbox' },
      ],
      default: 'production',
    },
    {
      displayName: 'Spot API Base URL',
      name: 'baseUrlSpot',
      type: 'hidden',
      default: 'https://api.kucoin.com',
    },
    {
      displayName: 'Futures API Base URL',
      name: 'baseUrlFutures',
      type: 'hidden',
      default: 'https://api-futures.kucoin.com',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.environment === "sandbox" ? "https://openapi-sandbox.kucoin.com" : $credentials.baseUrlSpot}}',
      url: '/api/v1/timestamp',
      method: 'GET',
    },
  };
}
