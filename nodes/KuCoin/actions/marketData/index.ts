/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { kuCoinApiRequest } from '../../transport';
import { KLINE_INTERVAL_OPTIONS, ORDER_BOOK_LEVEL_OPTIONS } from '../../utils/constants';

export const marketDataOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['marketData'] } },
    options: [
      { name: 'Get Symbols List', value: 'getSymbolsList', action: 'Get symbols list' },
      { name: 'Get Ticker', value: 'getTicker', action: 'Get ticker' },
      { name: 'Get All Tickers', value: 'getAllTickers', action: 'Get all tickers' },
      { name: 'Get 24Hr Stats', value: 'get24HrStats', action: 'Get 24hr stats' },
      { name: 'Get Order Book', value: 'getOrderBook', action: 'Get order book' },
      { name: 'Get Trade Histories', value: 'getTradeHistories', action: 'Get trade histories' },
      { name: 'Get Klines', value: 'getKlines', action: 'Get klines' },
      { name: 'Get Currencies', value: 'getCurrencies', action: 'Get currencies' },
      { name: 'Get Currency Detail', value: 'getCurrencyDetail', action: 'Get currency detail' },
      { name: 'Get Fiat Price', value: 'getFiatPrice', action: 'Get fiat price' },
      { name: 'Get Server Time', value: 'getServerTime', action: 'Get server time' },
    ],
    default: 'getAllTickers',
  },
];

export const marketDataFields: INodeProperties[] = [
  { displayName: 'Symbol', name: 'symbol', type: 'string', required: true, default: '', placeholder: 'BTC-USDT', displayOptions: { show: { resource: ['marketData'], operation: ['getTicker', 'get24HrStats', 'getOrderBook', 'getTradeHistories', 'getKlines'] } } },
  { displayName: 'Currency', name: 'currency', type: 'string', required: true, default: '', placeholder: 'BTC', displayOptions: { show: { resource: ['marketData'], operation: ['getCurrencyDetail'] } } },
  { displayName: 'Order Book Level', name: 'level', type: 'options', options: ORDER_BOOK_LEVEL_OPTIONS, default: 'level2_20', displayOptions: { show: { resource: ['marketData'], operation: ['getOrderBook'] } } },
  { displayName: 'Interval', name: 'type', type: 'options', options: KLINE_INTERVAL_OPTIONS, required: true, default: '1hour', displayOptions: { show: { resource: ['marketData'], operation: ['getKlines'] } } },
  { displayName: 'Start Time', name: 'startAt', type: 'dateTime', required: true, default: '', displayOptions: { show: { resource: ['marketData'], operation: ['getKlines'] } } },
  { displayName: 'End Time', name: 'endAt', type: 'dateTime', required: true, default: '', displayOptions: { show: { resource: ['marketData'], operation: ['getKlines'] } } },
  { displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['marketData'], operation: ['getFiatPrice'] } }, options: [
    { displayName: 'Base Currency', name: 'base', type: 'string', default: 'USD' },
    { displayName: 'Currencies', name: 'currencies', type: 'string', default: '', description: 'Comma-separated list' },
  ]},
];

export async function executeMarketDataOperation(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject> {
  let responseData: IDataObject = {};
  switch (operation) {
    case 'getSymbolsList':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v2/symbols');
      break;
    case 'getTicker':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/market/orderbook/level1', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getAllTickers':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/market/allTickers');
      break;
    case 'get24HrStats':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/market/stats', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getOrderBook': {
      const level = this.getNodeParameter('level', i) as string;
      const symbol = this.getNodeParameter('symbol', i) as string;
      let endpoint = '/api/v1/market/orderbook/level2_20';
      if (level === 'level2_100') endpoint = '/api/v1/market/orderbook/level2_100';
      if (level === 'level3') endpoint = '/api/v3/market/orderbook/level3';
      responseData = await kuCoinApiRequest.call(this, 'GET', endpoint, {}, { symbol });
      break;
    }
    case 'getTradeHistories':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/market/histories', {}, { symbol: this.getNodeParameter('symbol', i) });
      break;
    case 'getKlines':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/market/candles', {}, { symbol: this.getNodeParameter('symbol', i), type: this.getNodeParameter('type', i), startAt: Math.floor(new Date(this.getNodeParameter('startAt', i) as string).getTime() / 1000), endAt: Math.floor(new Date(this.getNodeParameter('endAt', i) as string).getTime() / 1000) });
      break;
    case 'getCurrencies':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v3/currencies');
      break;
    case 'getCurrencyDetail':
      responseData = await kuCoinApiRequest.call(this, 'GET', `/api/v3/currencies/${this.getNodeParameter('currency', i)}`);
      break;
    case 'getFiatPrice': {
      const options = this.getNodeParameter('options', i) as IDataObject;
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/prices', {}, options);
      break;
    }
    case 'getServerTime':
      responseData = await kuCoinApiRequest.call(this, 'GET', '/api/v1/timestamp');
      break;
  }
  return responseData;
}
