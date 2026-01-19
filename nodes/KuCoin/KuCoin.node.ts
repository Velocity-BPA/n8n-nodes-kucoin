/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { accountOperations, accountFields, executeAccountOperation } from './actions/account';
import { subAccountOperations, subAccountFields, executeSubAccountOperation } from './actions/subAccount';
import { spotTradingOperations, spotTradingFields, executeSpotTradingOperation } from './actions/spotTrading';
import { hfTradingOperations, hfTradingFields, executeHFTradingOperation } from './actions/hfTrading';
import { marginTradingOperations, marginTradingFields, executeMarginTradingOperation } from './actions/marginTrading';
import { lendingOperations, lendingFields, executeLendingOperation } from './actions/lending';
import { marketDataOperations, marketDataFields, executeMarketDataOperation } from './actions/marketData';
import { futuresTradingOperations, futuresTradingFields, executeFuturesTradingOperation } from './actions/futuresTrading';
import { futuresPositionOperations, futuresPositionFields, executeFuturesPositionOperation } from './actions/futuresPosition';
import { futuresAccountOperations, futuresAccountFields, executeFuturesAccountOperation } from './actions/futuresAccount';
import { earnOperations, earnFields, executeEarnOperation } from './actions/earn';
import { utilityOperations, utilityFields, executeUtilityOperation } from './actions/utility';

export class KuCoin implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'KuCoin',
    name: 'kuCoin',
    icon: 'file:kucoin.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with KuCoin cryptocurrency exchange API',
    defaults: { name: 'KuCoin' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'kuCoinApi', required: true }],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Earn', value: 'earn' },
          { name: 'Futures Account', value: 'futuresAccount' },
          { name: 'Futures Position', value: 'futuresPosition' },
          { name: 'Futures Trading', value: 'futuresTrading' },
          { name: 'HF Trading', value: 'hfTrading' },
          { name: 'Lending', value: 'lending' },
          { name: 'Margin Trading', value: 'marginTrading' },
          { name: 'Market Data', value: 'marketData' },
          { name: 'Spot Trading', value: 'spotTrading' },
          { name: 'Sub-Account', value: 'subAccount' },
          { name: 'Utility', value: 'utility' },
        ],
        default: 'account',
      },
      ...accountOperations, ...accountFields,
      ...subAccountOperations, ...subAccountFields,
      ...spotTradingOperations, ...spotTradingFields,
      ...hfTradingOperations, ...hfTradingFields,
      ...marginTradingOperations, ...marginTradingFields,
      ...lendingOperations, ...lendingFields,
      ...marketDataOperations, ...marketDataFields,
      ...futuresTradingOperations, ...futuresTradingFields,
      ...futuresPositionOperations, ...futuresPositionFields,
      ...futuresAccountOperations, ...futuresAccountFields,
      ...earnOperations, ...earnFields,
      ...utilityOperations, ...utilityFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;
        switch (resource) {
          case 'account': responseData = await executeAccountOperation.call(this, operation, i); break;
          case 'subAccount': responseData = await executeSubAccountOperation.call(this, operation, i); break;
          case 'spotTrading': responseData = await executeSpotTradingOperation.call(this, operation, i); break;
          case 'hfTrading': responseData = await executeHFTradingOperation.call(this, operation, i); break;
          case 'marginTrading': responseData = await executeMarginTradingOperation.call(this, operation, i); break;
          case 'lending': responseData = await executeLendingOperation.call(this, operation, i); break;
          case 'marketData': responseData = await executeMarketDataOperation.call(this, operation, i); break;
          case 'futuresTrading': responseData = await executeFuturesTradingOperation.call(this, operation, i); break;
          case 'futuresPosition': responseData = await executeFuturesPositionOperation.call(this, operation, i); break;
          case 'futuresAccount': responseData = await executeFuturesAccountOperation.call(this, operation, i); break;
          case 'earn': responseData = await executeEarnOperation.call(this, operation, i); break;
          case 'utility': responseData = await executeUtilityOperation.call(this, operation, i); break;
          default: throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
        }
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: (error as Error).message }), { itemData: { item: i } });
          returnData.push(...executionData);
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}
