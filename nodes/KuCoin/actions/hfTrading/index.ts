/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { ORDER_SIDE_OPTIONS, ORDER_TYPE_OPTIONS, TIME_IN_FORCE_OPTIONS } from '../../utils/constants';

export const hfTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['hfTrading'] } },
    options: [
      { name: 'Place HF Order', value: 'placeHFOrder', action: 'Place HF order' },
      { name: 'Sync Place HF Order', value: 'syncPlaceHFOrder', action: 'Sync place HF order' },
      { name: 'Cancel HF Order', value: 'cancelHFOrder', action: 'Cancel HF order' },
      { name: 'Cancel All HF Orders', value: 'cancelAllHFOrders', action: 'Cancel all HF orders' },
      { name: 'Get Active HF Orders', value: 'getActiveHFOrders', action: 'Get active HF orders' },
      { name: 'Get HF Order Detail', value: 'getHFOrderDetail', action: 'Get HF order detail' },
      { name: 'Set Auto Cancel', value: 'setAutoCancel', action: 'Set auto cancel' },
    ],
    default: 'placeHFOrder',
  },
];

export const hfTradingFields: INodeProperties[] = [
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'BTC-USDT', displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder', 'cancelAllHFOrders', 'getActiveHFOrders'] } } },
  { displayName: 'Side', name: 'side', type: 'options', options: ORDER_SIDE_OPTIONS, required: true, default: 'buy', displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder'] } } },
  { displayName: 'Type', name: 'type', type: 'options', options: ORDER_TYPE_OPTIONS, required: true, default: 'limit', displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder'] } } },
  { displayName: 'Price', name: 'price', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder'], type: ['limit'] } } },
  { displayName: 'Size', name: 'size', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder'] } } },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['hfTrading'], operation: ['cancelHFOrder', 'getHFOrderDetail'] } } },
  { displayName: 'Timeout (seconds)', name: 'timeout', type: 'number', required: true, default: 30, displayOptions: { show: { resource: ['hfTrading'], operation: ['setAutoCancel'] } } },
  { displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['hfTrading'], operation: ['placeHFOrder', 'syncPlaceHFOrder'] } }, options: [
    { displayName: 'Time In Force', name: 'timeInForce', type: 'options', options: TIME_IN_FORCE_OPTIONS, default: 'GTC' },
    { displayName: 'Post Only', name: 'postOnly', type: 'boolean', default: false },
  ]},
];

export async function executeHFTradingOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'placeHFOrder':
    case 'syncPlaceHFOrder': {
      const body: IDataObject = {
        clientOid: `n8n-${Date.now()}`,
        symbol: this.getNodeParameter('symbol', i),
        side: this.getNodeParameter('side', i),
        type: this.getNodeParameter('type', i),
        size: this.getNodeParameter('size', i),
      };
      if (body.type === 'limit') body.price = this.getNodeParameter('price', i);
      const options = this.getNodeParameter('options', i) as IDataObject;
      Object.assign(body, options);
      const endpoint = operation === 'syncPlaceHFOrder' ? '/api/v1/hf/orders/sync' : '/api/v1/hf/orders';
      responseData = await kuCoinApiRequest.call(this, 'POST', endpoint, body);
      break;
    }
    case 'cancelHFOrder':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', `/api/v1/hf/orders/${this.getNodeParameter('orderId', i)}`);
      break;
    case 'cancelAllHFOrders':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', '/api/v1/hf/orders', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getActiveHFOrders':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/hf/orders/active', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getHFOrderDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/hf/orders/${this.getNodeParameter('orderId', i)}`);
      break;
    case 'setAutoCancel':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/hf/orders/dead-cancel-all/query', { timeout: this.getNodeParameter('timeout', i) });
      break;
  }
  return responseData;
}
