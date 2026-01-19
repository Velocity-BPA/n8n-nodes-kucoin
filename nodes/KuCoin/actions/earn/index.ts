/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';

export const earnOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['earn'] } },
    options: [
      { name: 'Get Earn Products', value: 'getEarnProducts', action: 'Get earn products' },
      { name: 'Subscribe Earn', value: 'subscribeEarn', action: 'Subscribe earn' },
      { name: 'Redeem Earn', value: 'redeemEarn', action: 'Redeem earn' },
      { name: 'Get Earn Holdings', value: 'getEarnHoldings', action: 'Get earn holdings' },
      { name: 'Get Redeem Preview', value: 'getRedeemPreview', action: 'Get redeem preview' },
    ],
    default: 'getEarnProducts',
  },
];

export const earnFields: INodeProperties[] = [
  { displayName: 'Currency', name: 'currency', type: 'string', default: '', displayOptions: { show: { resource: ['earn'], operation: ['getEarnProducts', 'getEarnHoldings'] } } },
  { displayName: 'Product ID', name: 'productId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['earn'], operation: ['subscribeEarn', 'getRedeemPreview'] } } },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['earn'], operation: ['redeemEarn'] } } },
  { displayName: 'Amount', name: 'amount', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['earn'], operation: ['subscribeEarn', 'redeemEarn'] } } },
  { displayName: 'Account Type', name: 'accountType', type: 'options', options: [{ name: 'Main', value: 'MAIN' }, { name: 'Trade', value: 'TRADE' }], default: 'MAIN', displayOptions: { show: { resource: ['earn'], operation: ['subscribeEarn'] } } },
];

export async function executeEarnOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getEarnProducts': {
      const currency = this.getNodeParameter('currency', i) as string;
      const query: IDataObject = {};
      if (currency) query.currency = currency;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/earn/saving/products', {}, query);
      break;
    }
    case 'subscribeEarn':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/earn/orders', { productId: this.getNodeParameter('productId', i), amount: this.getNodeParameter('amount', i), accountType: this.getNodeParameter('accountType', i) });
      break;
    case 'redeemEarn':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', '/api/v1/earn/orders', { orderId: this.getNodeParameter('orderId', i), amount: this.getNodeParameter('amount', i) });
      break;
    case 'getEarnHoldings': {
      const currency = this.getNodeParameter('currency', i) as string;
      const query: IDataObject = {};
      if (currency) query.currency = currency;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/earn/hold-assets', {}, query);
      break;
    }
    case 'getRedeemPreview':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/earn/redeem-preview', {}, { orderId: this.getNodeParameter('productId', i) });
      break;
  }
  return responseData;
}
