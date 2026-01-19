/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import { kuCoinApiRequest } from './transport';

export class KuCoinTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'KuCoin Trigger',
    name: 'kuCoinTrigger',
    icon: 'file:kucoin.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Triggers on KuCoin trading events',
    defaults: { name: 'KuCoin Trigger' },
    inputs: [],
    outputs: ['main'],
    credentials: [{ name: 'kuCoinApi', required: true }],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          { name: 'New Order Fill', value: 'newFill', description: 'Trigger when an order is filled' },
          { name: 'Order Status Change', value: 'orderStatusChange', description: 'Trigger when order status changes' },
          { name: 'Account Balance Change', value: 'balanceChange', description: 'Trigger when account balance changes' },
          { name: 'Price Alert', value: 'priceAlert', description: 'Trigger when price crosses threshold' },
        ],
        default: 'newFill',
        required: true,
      },
      { displayName: 'Symbol', name: 'symbol', type: 'string', default: '', placeholder: 'BTC-USDT', displayOptions: { show: { event: ['newFill', 'orderStatusChange', 'priceAlert'] } } },
      { displayName: 'Currency', name: 'currency', type: 'string', default: '', placeholder: 'BTC', displayOptions: { show: { event: ['balanceChange'] } } },
      { displayName: 'Alert Type', name: 'alertType', type: 'options', options: [{ name: 'Price Above', value: 'above' }, { name: 'Price Below', value: 'below' }], default: 'above', displayOptions: { show: { event: ['priceAlert'] } } },
      { displayName: 'Threshold Price', name: 'thresholdPrice', type: 'number', default: 0, typeOptions: { numberPrecision: 8 }, displayOptions: { show: { event: ['priceAlert'] } } },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const webhookData = this.getWorkflowStaticData('node');
    const event = this.getNodeParameter('event') as string;
    let responseData: IDataObject[] = [];

    switch (event) {
      case 'newFill': {
        const symbol = this.getNodeParameter('symbol', '') as string;
        const query: IDataObject = {};
        if (symbol) query.symbol = symbol;
        const response = await kuCoinApiRequest.call(this, 'GET', '/api/v1/limit/fills', {}, query);
        const fills = (response as IDataObject[]) || [];
        const lastTradeId = webhookData.lastTradeId as string;
        if (lastTradeId) {
          responseData = fills.filter((fill: IDataObject) => fill.tradeId !== lastTradeId);
        } else {
          responseData = fills.slice(0, 10);
        }
        if (fills.length > 0) webhookData.lastTradeId = fills[0].tradeId;
        break;
      }
      case 'orderStatusChange': {
        const symbol = this.getNodeParameter('symbol', '') as string;
        const query: IDataObject = {};
        if (symbol) query.symbol = symbol;
        const response = await kuCoinApiRequest.call(this, 'GET', '/api/v1/orders', {}, query);
        const orders = ((response as IDataObject).items as IDataObject[]) || [];
        const lastOrderCheck = webhookData.lastOrderCheck as number || 0;
        responseData = orders.filter((order: IDataObject) => (order.createdAt as number) > lastOrderCheck || (order.doneAt as number) > lastOrderCheck);
        webhookData.lastOrderCheck = Date.now();
        break;
      }
      case 'balanceChange': {
        const currency = this.getNodeParameter('currency', '') as string;
        const query: IDataObject = {};
        if (currency) query.currency = currency;
        const response = await kuCoinApiRequest.call(this, 'GET', '/api/v1/accounts', {}, query);
        const accounts = (response as IDataObject[]) || [];
        const previousBalances = (webhookData.previousBalances as IDataObject) || {};
        for (const account of accounts) {
          const accountId = account.id as string;
          const currentBalance = account.balance as string;
          const previousBalance = previousBalances[accountId] as string;
          if (previousBalance && previousBalance !== currentBalance) {
            responseData.push({ ...account, previousBalance, changeAmount: (parseFloat(currentBalance) - parseFloat(previousBalance)).toString() });
          }
          previousBalances[accountId] = currentBalance;
        }
        webhookData.previousBalances = previousBalances;
        break;
      }
      case 'priceAlert': {
        const symbol = this.getNodeParameter('symbol') as string;
        const alertType = this.getNodeParameter('alertType') as string;
        const thresholdPrice = this.getNodeParameter('thresholdPrice') as number;
        if (!symbol) throw new Error('Symbol is required for price alerts');
        const response = await kuCoinApiRequest.call(this, 'GET', `/api/v1/market/orderbook/level1?symbol=${symbol}`);
        const currentPrice = parseFloat((response as IDataObject).price as string);
        const wasTriggered = webhookData.priceAlertTriggered as boolean;
        let shouldTrigger = false;
        if (alertType === 'above' && currentPrice > thresholdPrice && !wasTriggered) shouldTrigger = true;
        else if (alertType === 'below' && currentPrice < thresholdPrice && !wasTriggered) shouldTrigger = true;
        if (shouldTrigger) {
          webhookData.priceAlertTriggered = true;
          responseData.push({ symbol, currentPrice, thresholdPrice, alertType, triggeredAt: new Date().toISOString() });
        }
        if ((alertType === 'above' && currentPrice <= thresholdPrice) || (alertType === 'below' && currentPrice >= thresholdPrice)) {
          webhookData.priceAlertTriggered = false;
        }
        break;
      }
    }

    if (responseData.length === 0) return null;
    return [this.helpers.returnJsonArray(responseData)];
  }
}
