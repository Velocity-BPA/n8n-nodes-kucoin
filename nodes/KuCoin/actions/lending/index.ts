/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { LENDING_TERM_OPTIONS } from '../../utils/constants';

export const lendingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['lending'] } },
    options: [
      { name: 'Lend', value: 'lend', action: 'Lend' },
      { name: 'Cancel Lend Order', value: 'cancelLendOrder', action: 'Cancel lend order' },
      { name: 'Set Auto Lend', value: 'setAutoLend', action: 'Set auto lend' },
      { name: 'Get Active Lend Orders', value: 'getActiveLendOrders', action: 'Get active lend orders' },
      { name: 'Get Lend History', value: 'getLendHistory', action: 'Get lend history' },
      { name: 'Get Active Lendings', value: 'getActiveLendings', action: 'Get active lendings' },
      { name: 'Get Lend Assets', value: 'getLendAssets', action: 'Get lend assets' },
    ],
    default: 'getActiveLendOrders',
  },
];

export const lendingFields: INodeProperties[] = [
  { displayName: 'Currency', name: 'currency', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['lending'], operation: ['lend', 'setAutoLend', 'getActiveLendOrders', 'getLendHistory', 'getActiveLendings'] } } },
  { displayName: 'Size', name: 'size', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['lending'], operation: ['lend'] } } },
  { displayName: 'Daily Interest Rate', name: 'dailyIntRate', type: 'string', required: true, default: '', description: 'e.g., 0.002 for 0.2%', displayOptions: { show: { resource: ['lending'], operation: ['lend', 'setAutoLend'] } } },
  { displayName: 'Term', name: 'term', type: 'options', options: LENDING_TERM_OPTIONS, required: true, default: 28, displayOptions: { show: { resource: ['lending'], operation: ['lend'] } } },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['lending'], operation: ['cancelLendOrder'] } } },
  { displayName: 'Auto Lend Enabled', name: 'isEnable', type: 'boolean', required: true, default: true, displayOptions: { show: { resource: ['lending'], operation: ['setAutoLend'] } } },
  { displayName: 'Retain Size', name: 'retainSize', type: 'string', default: '', displayOptions: { show: { resource: ['lending'], operation: ['setAutoLend'] } } },
];

export async function executeLendingOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'lend':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/margin/lend', { currency: this.getNodeParameter('currency', i), size: this.getNodeParameter('size', i), dailyIntRate: this.getNodeParameter('dailyIntRate', i), term: this.getNodeParameter('term', i) });
      break;
    case 'cancelLendOrder':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', `/api/v1/margin/lend/${this.getNodeParameter('orderId', i)}`);
      break;
    case 'setAutoLend': {
      const body: IDataObject = { currency: this.getNodeParameter('currency', i), isEnable: this.getNodeParameter('isEnable', i), dailyIntRate: this.getNodeParameter('dailyIntRate', i) };
      const retainSize = this.getNodeParameter('retainSize', i) as string;
      if (retainSize) body.retainSize = retainSize;
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/margin/toggle-auto-lend', body);
      break;
    }
    case 'getActiveLendOrders':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/lend/active', {}, { currency: this.getNodeParameter('currency', i) });
      break;
    case 'getLendHistory':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/lend/done', {}, { currency: this.getNodeParameter('currency', i) });
      break;
    case 'getActiveLendings':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/lend/trade/unsettled', {}, { currency: this.getNodeParameter('currency', i) });
      break;
    case 'getLendAssets':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/lend/assets');
      break;
  }
  return responseData;
}
