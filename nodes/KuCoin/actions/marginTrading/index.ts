/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { MARGIN_MODE_OPTIONS, TIME_IN_FORCE_OPTIONS } from '../../utils/constants';

export const marginTradingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['marginTrading'] } },
    options: [
      { name: 'Borrow Margin', value: 'borrowMargin', action: 'Borrow margin' },
      { name: 'Repay Margin', value: 'repayMargin', action: 'Repay margin' },
      { name: 'Get Borrow History', value: 'getBorrowHistory', action: 'Get borrow history' },
      { name: 'Get Repay History', value: 'getRepayHistory', action: 'Get repay history' },
      { name: 'Get Margin Account', value: 'getMarginAccount', action: 'Get margin account' },
      { name: 'Get Mark Price', value: 'getMarkPrice', action: 'Get mark price' },
      { name: 'Get Margin Config', value: 'getMarginConfig', action: 'Get margin config' },
    ],
    default: 'getMarginAccount',
  },
];

export const marginTradingFields: INodeProperties[] = [
  { displayName: 'Currency', name: 'currency', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['marginTrading'], operation: ['borrowMargin', 'repayMargin', 'getBorrowHistory', 'getRepayHistory'] } } },
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'BTC-USDT', displayOptions: { show: { resource: ['marginTrading'], operation: ['getMarkPrice'] } } },
  { displayName: 'Size', name: 'size', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['marginTrading'], operation: ['borrowMargin', 'repayMargin'] } } },
  { displayName: 'Margin Mode', name: 'isIsolated', type: 'options', options: MARGIN_MODE_OPTIONS, default: 'cross', displayOptions: { show: { resource: ['marginTrading'], operation: ['borrowMargin', 'repayMargin'] } } },
  { displayName: 'Time In Force', name: 'timeInForce', type: 'options', options: TIME_IN_FORCE_OPTIONS, default: 'IOC', displayOptions: { show: { resource: ['marginTrading'], operation: ['borrowMargin'] } } },
];

export async function executeMarginTradingOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'borrowMargin': {
      const body: IDataObject = {
        currency: this.getNodeParameter('currency', i),
        size: this.getNodeParameter('size', i),
        timeInForce: this.getNodeParameter('timeInForce', i),
        isIsolated: this.getNodeParameter('isIsolated', i) === 'isolated',
      };
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v3/margin/borrow', body);
      break;
    }
    case 'repayMargin': {
      const body: IDataObject = {
        currency: this.getNodeParameter('currency', i),
        size: this.getNodeParameter('size', i),
        isIsolated: this.getNodeParameter('isIsolated', i) === 'isolated',
      };
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v3/margin/repay', body);
      break;
    }
    case 'getBorrowHistory':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v3/margin/borrow', {}, { currency: this.getNodeParameter('currency', i) });
      break;
    case 'getRepayHistory':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v3/margin/repay', {}, { currency: this.getNodeParameter('currency', i) });
      break;
    case 'getMarginAccount':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v3/margin/accounts');
      break;
    case 'getMarkPrice':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/mark-price/${this.getNodeParameter('symbol', i)}/current`);
      break;
    case 'getMarginConfig':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/config');
      break;
  }
  return responseData;
}
