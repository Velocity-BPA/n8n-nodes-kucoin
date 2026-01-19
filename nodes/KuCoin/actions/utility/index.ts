/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';

export const utilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['utility'] } },
    options: [
      { name: 'Get Server Time', value: 'getServerTime', action: 'Get server time' },
      { name: 'Get Service Status', value: 'getServiceStatus', action: 'Get service status' },
      { name: 'Get Announcements', value: 'getAnnouncements', action: 'Get announcements' },
    ],
    default: 'getServerTime',
  },
];

export const utilityFields: INodeProperties[] = [];

export async function executeUtilityOperation(this: IExecuteFunctions, operation: string, _i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getServerTime':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/timestamp');
      break;
    case 'getServiceStatus':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/status');
      break;
    case 'getAnnouncements':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v3/announcements');
      break;
  }
  return responseData;
}
