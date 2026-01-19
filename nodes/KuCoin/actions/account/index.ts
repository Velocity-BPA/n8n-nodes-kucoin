/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { ACCOUNT_TYPE_OPTIONS } from '../../utils/constants';

export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['account'] } },
    options: [
      { name: 'Get Account Detail', value: 'getAccountDetail', description: 'Get account detail by ID', action: 'Get account detail' },
      { name: 'Get Account Ledgers', value: 'getAccountLedgers', description: 'Get account ledgers', action: 'Get account ledgers' },
      { name: 'Get Account List', value: 'getAccountList', description: 'Get all accounts', action: 'Get account list' },
      { name: 'Get Account Summary', value: 'getAccountSummary', description: 'Get account summary info', action: 'Get account summary' },
      { name: 'Get Transferable', value: 'getTransferable', description: 'Get transferable balance', action: 'Get transferable balance' },
      { name: 'Flex Transfer', value: 'flexTransfer', description: 'Flex transfer between accounts', action: 'Flex transfer' },
      { name: 'Transfer Between Accounts', value: 'transferBetweenAccounts', description: 'Internal transfer', action: 'Transfer between accounts' },
    ],
    default: 'getAccountList',
  },
];

export const accountFields: INodeProperties[] = [
  { displayName: 'Account ID', name: 'accountId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['account'], operation: ['getAccountDetail'] } }, description: 'The account ID' },
  { displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['account'], operation: ['getAccountList', 'getAccountLedgers'] } }, options: [
    { displayName: 'Currency', name: 'currency', type: 'string', default: '' },
    { displayName: 'Account Type', name: 'type', type: 'options', options: ACCOUNT_TYPE_OPTIONS, default: 'trade' },
  ]},
  { displayName: 'Currency', name: 'currency', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['account'], operation: ['getTransferable', 'transferBetweenAccounts', 'flexTransfer'] } } },
  { displayName: 'Account Type', name: 'type', type: 'options', required: true, options: ACCOUNT_TYPE_OPTIONS, default: 'trade', displayOptions: { show: { resource: ['account'], operation: ['getTransferable'] } } },
  { displayName: 'From Account', name: 'from', type: 'options', required: true, options: ACCOUNT_TYPE_OPTIONS, default: 'main', displayOptions: { show: { resource: ['account'], operation: ['transferBetweenAccounts', 'flexTransfer'] } } },
  { displayName: 'To Account', name: 'to', type: 'options', required: true, options: ACCOUNT_TYPE_OPTIONS, default: 'trade', displayOptions: { show: { resource: ['account'], operation: ['transferBetweenAccounts', 'flexTransfer'] } } },
  { displayName: 'Amount', name: 'amount', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['account'], operation: ['transferBetweenAccounts', 'flexTransfer'] } } },
];

export async function executeAccountOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getAccountSummary':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v2/user-info');
      break;
    case 'getAccountList': {
      const options = this.getNodeParameter('options', i) as IDataObject;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/accounts', {}, options);
      break;
    }
    case 'getAccountDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/accounts/${this.getNodeParameter('accountId', i)}`);
      break;
    case 'getAccountLedgers': {
      const options = this.getNodeParameter('options', i) as IDataObject;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/accounts/ledgers', {}, options);
      break;
    }
    case 'getTransferable':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/accounts/transferable', {}, { currency: this.getNodeParameter('currency', i), type: this.getNodeParameter('type', i) });
      break;
    case 'transferBetweenAccounts':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v2/accounts/inner-transfer', { clientOid: `n8n-${Date.now()}`, currency: this.getNodeParameter('currency', i), from: this.getNodeParameter('from', i), to: this.getNodeParameter('to', i), amount: this.getNodeParameter('amount', i) });
      break;
    case 'flexTransfer':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v3/accounts/universal-transfer', { clientOid: `n8n-${Date.now()}`, currency: this.getNodeParameter('currency', i), from: this.getNodeParameter('from', i), to: this.getNodeParameter('to', i), amount: this.getNodeParameter('amount', i) });
      break;
  }
  return responseData;
}
