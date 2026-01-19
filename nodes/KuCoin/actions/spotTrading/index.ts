/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { ORDER_SIDE_OPTIONS, ORDER_TYPE_OPTIONS, TIME_IN_FORCE_OPTIONS } from '../../utils/constants';

export const spotTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['spotTrading'] } },
    options: [
      { name: 'Place Order', value: 'placeOrder', action: 'Place order' },
      { name: 'Cancel Order', value: 'cancelOrder', action: 'Cancel order' },
      { name: 'Cancel All Orders', value: 'cancelAllOrders', action: 'Cancel all orders' },
      { name: 'Get Order List', value: 'getOrderList', action: 'Get order list' },
      { name: 'Get Order Detail', value: 'getOrderDetail', action: 'Get order detail' },
      { name: 'Get Fill List', value: 'getFillList', action: 'Get fill list' },
    ],
    default: 'placeOrder',
  },
];

export const spotTradingFields: INodeProperties[] = [
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'BTC-USDT', displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder', 'cancelAllOrders', 'getOrderList', 'getFillList'] } } },
  { displayName: 'Side', name: 'side', type: 'options', options: ORDER_SIDE_OPTIONS, required: true, default: 'buy', displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder'] } } },
  { displayName: 'Type', name: 'type', type: 'options', options: ORDER_TYPE_OPTIONS, required: true, default: 'limit', displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder'] } } },
  { displayName: 'Price', name: 'price', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder'], type: ['limit'] } } },
  { displayName: 'Size', name: 'size', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder'] } } },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['spotTrading'], operation: ['cancelOrder', 'getOrderDetail'] } } },
  { displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['spotTrading'], operation: ['placeOrder'] } }, options: [
    { displayName: 'Time In Force', name: 'timeInForce', type: 'options', options: TIME_IN_FORCE_OPTIONS, default: 'GTC' },
    { displayName: 'Post Only', name: 'postOnly', type: 'boolean', default: false },
    { displayName: 'Hidden', name: 'hidden', type: 'boolean', default: false },
    { displayName: 'Remark', name: 'remark', type: 'string', default: '' },
  ]},
];

export async function executeSpotTradingOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'placeOrder': {
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
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/orders', body);
      break;
    }
    case 'cancelOrder':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', `/api/v1/orders/${this.getNodeParameter('orderId', i)}`);
      break;
    case 'cancelAllOrders':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', '/api/v1/orders', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getOrderList':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/orders', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getOrderDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/orders/${this.getNodeParameter('orderId', i)}`);
      break;
    case 'getFillList':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/fills', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
  }
  return responseData;
}
