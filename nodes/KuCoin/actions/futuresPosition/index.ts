/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';

export const futuresPositionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['futuresPosition'] } },
    options: [
      { name: 'Get Position', value: 'getPosition', action: 'Get position' },
      { name: 'Get Position List', value: 'getPositionList', action: 'Get position list' },
      { name: 'Set Auto Deposit Margin', value: 'setAutoDepositMargin', action: 'Set auto deposit margin' },
      { name: 'Add Margin', value: 'addMargin', action: 'Add margin' },
      { name: 'Get Max Withdraw Margin', value: 'getMaxWithdrawMargin', action: 'Get max withdraw margin' },
      { name: 'Withdraw Margin', value: 'withdrawMargin', action: 'Withdraw margin' },
      { name: 'Get Funding History', value: 'getFundingHistory', action: 'Get funding history' },
    ],
    default: 'getPositionList',
  },
];

export const futuresPositionFields: INodeProperties[] = [
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'XBTUSDTM', displayOptions: { show: { resource: ['futuresPosition'], operation: ['getPosition', 'setAutoDepositMargin', 'addMargin', 'getMaxWithdrawMargin', 'withdrawMargin', 'getFundingHistory'] } } },
  { displayName: 'Auto Deposit', name: 'autoDeposit', type: 'boolean', required: true, default: false, displayOptions: { show: { resource: ['futuresPosition'], operation: ['setAutoDepositMargin'] } } },
  { displayName: 'Margin', name: 'margin', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['futuresPosition'], operation: ['addMargin', 'withdrawMargin'] } } },
];

export async function executeFuturesPositionOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getPosition':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/position', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'getPositionList':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/positions', {}, {}, 'futures');
      break;
    case 'setAutoDepositMargin':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/position/margin/auto-deposit-status', { symbol: this.getNodeParameter('symbol', i), status: this.getNodeParameter('autoDeposit', i) }, {}, 'futures');
      break;
    case 'addMargin':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/position/margin/deposit-margin', { symbol: this.getNodeParameter('symbol', i), margin: this.getNodeParameter('margin', i), bizNo: `n8n-${Date.now()}` }, {}, 'futures');
      break;
    case 'getMaxWithdrawMargin':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/margin/maxWithdrawMargin', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
    case 'withdrawMargin':
      responseData = await kuCoinApiRequest.call(this, 'POST', '/api/v1/margin/withdrawMargin', { symbol: this.getNodeParameter('symbol', i), withdrawAmount: this.getNodeParameter('margin', i) }, {}, 'futures');
      break;
    case 'getFundingHistory':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/funding-history', {}, { symbol: this.getNodeParameter('symbol', i) }, 'futures');
      break;
  }
  return responseData;
}
