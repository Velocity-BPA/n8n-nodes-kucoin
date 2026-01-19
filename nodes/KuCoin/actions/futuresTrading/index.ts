/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { ORDER_SIDE_OPTIONS, ORDER_TYPE_OPTIONS } from '../../utils/constants';

export const futuresTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['futuresTrading'] } },
    options: [
      { name: 'Get Contracts', value: 'getContracts', action: 'Get contracts' },
      { name: 'Get Contract Detail', value: 'getContractDetail', action: 'Get contract detail' },
      { name: 'Get Futures Ticker', value: 'getFuturesTicker', action: 'Get futures ticker' },
      { name: 'Get Futures Order Book', value: 'getFuturesOrderBook', action: 'Get futures order book' },
      { name: 'Place Futures Order', value: 'placeFuturesOrder', action: 'Place futures order' },
      { name: 'Cancel Futures Order', value: 'cancelFuturesOrder', action: 'Cancel futures order' },
      { name: 'Cancel All Futures Orders', value: 'cancelAllFuturesOrders', action: 'Cancel all futures orders' },
      { name: 'Get Futures Orders', value: 'getFuturesOrders', action: 'Get futures orders' },
      { name: 'Get Futures Order Detail', value: 'getFuturesOrderDetail', action: 'Get futures order detail' },
      { name: 'Get Futures Fills', value: 'getFuturesFills', action: 'Get futures fills' },
    ],
    default: 'getContracts',
  },
];

export const futuresTradingFields: INodeProperties[] = [
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'XBTUSDTM', displayOptions: { show: { resource: ['futuresTrading'], operation: ['getContractDetail', 'getFuturesTicker', 'getFuturesOrderBook', 'placeFuturesOrder', 'cancelAllFuturesOrders', 'getFuturesOrders', 'getFuturesFills'] } } },
  { displayName: 'Side', name: 'side', type: 'options', options: ORDER_SIDE_OPTIONS, required: true, default: 'buy', displayOptions: { show: { resource: ['futuresTrading'], operation: ['placeFuturesOrder'] } } },
  { displayName: 'Type', name: 'type', type: 'options', options: ORDER_TYPE_OPTIONS, required: true, default: 'limit', displayOptions: { show: { resource: ['futuresTrading'], operation: ['placeFuturesOrder'] } } },
  { displayName: 'Leverage', name: 'leverage', type: 'number', required: true, default: 1, displayOptions: { show: { resource: ['futuresTrading'], operation: ['placeFuturesOrder'] } } },
  { displayName: 'Size', name: 'size', type: 'number', required: true, default: 1, displayOptions: { show: { resource: ['futuresTrading'], operation: ['placeFuturesOrder'] } } },
  { displayName: 'Price', name: 'price', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['futuresTrading'], operation: ['placeFuturesOrder'], type: ['limit'] } } },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['futuresTrading'], operation: ['cancelFuturesOrder', 'getFuturesOrderDetail'] } } },
];

export async function executeFuturesTradingOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getContracts':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/contracts/active', {}, {}, 'futures');
      break;
    case 'getContractDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/contracts/${this.getNodeParameter('symbol', i)}`, {}, {}, 'futures');
      break;
    case 'getFuturesTicker':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/ticker`, {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'getFuturesOrderBook':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/level2/snapshot`, {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'placeFuturesOrder': {
      const body: IDataObject = {
        clientOid: `n8n-${Date.now()}`,
        symbol: this.getNodeParameter('symbol', i),
        side: this.getNodeParameter('side', i),
        type: this.getNodeParameter('type', i),
        leverage: this.getNodeParameter('leverage', i),
        size: this.getNodeParameter('size', i),
      };
      if (body.type === 'limit') body.price = this.getNodeParameter('price', i);
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/orders', body, {}, 'futures');
      break;
    }
    case 'cancelFuturesOrder':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', `/api/v1/orders/${this.getNodeParameter('orderId', i)}`, {}, {}, 'futures');
      break;
    case 'cancelAllFuturesOrders':
      responseData = await kuCoinApiRequest.call(this, 'DELETE', '/api/v1/orders', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'getFuturesOrders':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/orders', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'getFuturesOrderDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/orders/${this.getNodeParameter('orderId', i)}`, {}, {}, 'futures');
      break;
    case 'getFuturesFills':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/fills', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
  }
  return responseData;
}
