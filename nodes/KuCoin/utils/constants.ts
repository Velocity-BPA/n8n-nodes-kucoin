/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

// Account Type Options
export const ACCOUNT_TYPE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Main', value: 'main' },
  { name: 'Trade (Spot)', value: 'trade' },
  { name: 'Trade HF', value: 'trade_hf' },
  { name: 'Margin', value: 'margin' },
  { name: 'Pool (Earn)', value: 'pool' },
];

// Trade Type Options
export const TRADE_TYPE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Spot Trade', value: 'TRADE' },
  { name: 'Margin Trade', value: 'MARGIN_TRADE' },
  { name: 'Isolated Margin Trade', value: 'MARGIN_ISOLATED_TRADE' },
];

// Order Side Options
export const ORDER_SIDE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Buy', value: 'buy' },
  { name: 'Sell', value: 'sell' },
];

// Order Type Options
export const ORDER_TYPE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Limit', value: 'limit' },
  { name: 'Market', value: 'market' },
];

// Time In Force Options
export const TIME_IN_FORCE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Good Till Cancelled (GTC)', value: 'GTC' },
  { name: 'Good Till Time (GTT)', value: 'GTT' },
  { name: 'Immediate Or Cancel (IOC)', value: 'IOC' },
  { name: 'Fill Or Kill (FOK)', value: 'FOK' },
];

// Self Trade Prevention Options
export const STP_OPTIONS: INodePropertyOptions[] = [
  { name: 'Decrease and Cancel (DC)', value: 'DC' },
  { name: 'Cancel Oldest (CO)', value: 'CO' },
  { name: 'Cancel Newest (CN)', value: 'CN' },
  { name: 'Cancel Both (CB)', value: 'CB' },
];

// Stop Type Options
export const STOP_TYPE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Loss', value: 'loss' },
  { name: 'Entry', value: 'entry' },
];

// Margin Mode Options
export const MARGIN_MODE_OPTIONS: INodePropertyOptions[] = [
  { name: 'Cross', value: 'cross' },
  { name: 'Isolated', value: 'isolated' },
];

// Kline Interval Options
export const KLINE_INTERVAL_OPTIONS: INodePropertyOptions[] = [
  { name: '1 Minute', value: '1min' },
  { name: '3 Minutes', value: '3min' },
  { name: '5 Minutes', value: '5min' },
  { name: '15 Minutes', value: '15min' },
  { name: '30 Minutes', value: '30min' },
  { name: '1 Hour', value: '1hour' },
  { name: '2 Hours', value: '2hour' },
  { name: '4 Hours', value: '4hour' },
  { name: '6 Hours', value: '6hour' },
  { name: '8 Hours', value: '8hour' },
  { name: '12 Hours', value: '12hour' },
  { name: '1 Day', value: '1day' },
  { name: '1 Week', value: '1week' },
];

// Lending Term Options
export const LENDING_TERM_OPTIONS: INodePropertyOptions[] = [
  { name: '7 Days', value: 7 },
  { name: '14 Days', value: 14 },
  { name: '28 Days', value: 28 },
];

// Order Book Level Options
export const ORDER_BOOK_LEVEL_OPTIONS: INodePropertyOptions[] = [
  { name: 'Level 2 - 20', value: 'level2_20' },
  { name: 'Level 2 - 100', value: 'level2_100' },
  { name: 'Level 3 (Full)', value: 'level3' },
];

// Aliases for compatibility
export const KLINE_INTERVALS = KLINE_INTERVAL_OPTIONS;
export const ORDERBOOK_LEVELS = ORDER_BOOK_LEVEL_OPTIONS;
export const ORDERBOOK_LEVEL_OPTIONS = ORDER_BOOK_LEVEL_OPTIONS;

// Error Codes
export const KUCOIN_ERROR_CODES: Record<string, string> = {
  '200000': 'Success',
  '400001': 'Any of KC-API-KEY, KC-API-SIGN, KC-API-TIMESTAMP, KC-API-PASSPHRASE is missing',
  '400002': 'KC-API-TIMESTAMP Invalid',
  '400003': 'KC-API-KEY not exists',
  '400004': 'KC-API-PASSPHRASE error',
  '400005': 'Signature error',
  '400006': 'The requested ip address is not in the api whitelist',
  '400007': 'Access Denied',
  '400100': 'Parameter Error',
  '400200': 'Forbidden to place an order',
  '400500': 'Your located country/region is currently not supported',
  '400600': 'Validation failed',
  '400700': 'Invalid trade password',
  '411100': 'User is frozen',
  '500000': 'Internal Server Error',
};
