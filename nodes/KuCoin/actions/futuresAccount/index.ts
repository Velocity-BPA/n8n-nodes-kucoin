/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';

export const futuresAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['futuresAccount'] } },
    options: [
      { name: 'Get Account Overview', value: 'getAccountOverview', action: 'Get account overview' },
      { name: 'Get Transaction History', value: 'getTransactionHistory', action: 'Get transaction history' },
      { name: 'Transfer to Futures', value: 'transferToFutures', action: 'Transfer to futures' },
      { name: 'Transfer from Futures', value: 'transferFromFutures', action: 'Transfer from futures' },
      { name: 'Get Transfer Records', value: 'getTransferRecords', action: 'Get transfer records' },
    ],
    default: 'getAccountOverview',
  },
];

export const futuresAccountFields: INodeProperties[] = [
  { displayName: 'Currency', name: 'currency', type: 'string', default: 'USDT', displayOptions: { show: { resource: ['futuresAccount'], operation: ['getAccountOverview', 'transferToFutures', 'transferFromFutures'] } } },
  { displayName: 'Amount', name: 'amount', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['futuresAccount'], operation: ['transferToFutures', 'transferFromFutures'] } } },
  { displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['futuresAccount'], operation: ['getTransactionHistory'] } }, options: [
    { displayName: 'Start Time', name: 'startAt', type: 'dateTime', default: '' },
    { displayName: 'End Time', name: 'endAt', type: 'dateTime', default: '' },
    { displayName: 'Type', name: 'type', type: 'string', default: '' },
  ]},
];

export async function executeFuturesAccountOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getAccountOverview':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/account-overview', {}, { currency: this.getNodeParameter('currency', i) }, 'futures');
      break;
    case 'getTransactionHistory': {
      const options = this.getNodeParameter('options', i) as IDataObject;
      const query: IDataObject = {};
      if (options.startAt) query.startAt = new Date(options.startAt as string).getTime();
      if (options.endAt) query.endAt = new Date(options.endAt as string).getTime();
      if (options.type) query.type = options.type;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/transaction-history', {}, query, 'futures');
      break;
    }
    case 'transferToFutures':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v3/transfer-out', { bizNo: `n8n-${Date.now()}`, amount: this.getNodeParameter('amount', i), currency: this.getNodeParameter('currency', i) }, {}, 'futures');
      break;
    case 'transferFromFutures':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v3/transfer-in', { bizNo: `n8n-${Date.now()}`, amount: this.getNodeParameter('amount', i), currency: this.getNodeParameter('currency', i) }, {}, 'futures');
      break;
    case 'getTransferRecords':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/transfer-list', {}, {}, 'futures');
      break;
  }
  return responseData;
}
