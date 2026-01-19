/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';

export const subAccountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['subAccount'] } },
    options: [
      { name: 'Create Sub-Account', value: 'createSubAccount', action: 'Create sub account' },
      { name: 'Get Sub-Accounts', value: 'getSubAccounts', action: 'Get sub accounts' },
      { name: 'Get Sub-Account Balance', value: 'getSubAccountBalance', action: 'Get sub account balance' },
      { name: 'Sub-Account Transfer', value: 'subAccountTransfer', action: 'Sub account transfer' },
    ],
    default: 'getSubAccounts',
  },
];

export const subAccountFields: INodeProperties[] = [
  { displayName: 'Sub-User ID', name: 'subUserId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subAccount'], operation: ['getSubAccountBalance', 'subAccountTransfer'] } } },
  { displayName: 'Password', name: 'password', type: 'string', typeOptions: { password: true }, required: true, default: '', displayOptions: { show: { resource: ['subAccount'], operation: ['createSubAccount'] } } },
  { displayName: 'Sub-Account Name', name: 'subName', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subAccount'], operation: ['createSubAccount'] } } },
  { displayName: 'Currency', name: 'currency', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subAccount'], operation: ['subAccountTransfer'] } } },
  { displayName: 'Amount', name: 'amount', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subAccount'], operation: ['subAccountTransfer'] } } },
  { displayName: 'Direction', name: 'direction', type: 'options', options: [{ name: 'To Sub-Account', value: 'OUT' }, { name: 'From Sub-Account', value: 'IN' }], default: 'OUT', displayOptions: { show: { resource: ['subAccount'], operation: ['subAccountTransfer'] } } },
];

export async function executeSubAccountOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getSubAccounts':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v2/sub/user');
      break;
    case 'createSubAccount':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v2/sub/user/created', { password: this.getNodeParameter('password', i), subName: this.getNodeParameter('subName', i) });
      break;
    case 'getSubAccountBalance':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v1/sub-accounts/${this.getNodeParameter('subUserId', i)}`);
      break;
    case 'subAccountTransfer':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v2/accounts/sub-transfer', { clientOid: `n8n-${Date.now()}`, currency: this.getNodeParameter('currency', i), amount: this.getNodeParameter('amount', i), direction: this.getNodeParameter('direction', i), subUserId: this.getNodeParameter('subUserId', i) });
      break;
  }
  return responseData;
}
