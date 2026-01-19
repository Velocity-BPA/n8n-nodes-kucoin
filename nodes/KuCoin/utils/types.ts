/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IKuCoinAccount {
  id: string;
  currency: string;
  type: string;
  balance: string;
  available: string;
  holds: string;
}

export interface IKuCoinOrder {
  id: string;
  symbol: string;
  opType: string;
  type: string;
  side: string;
  price: string;
  size: string;
  funds: string;
  dealFunds: string;
  dealSize: string;
  fee: string;
  feeCurrency: string;
  stp: string;
  stop: string;
  stopTriggered: boolean;
  stopPrice: string;
  timeInForce: string;
  postOnly: boolean;
  hidden: boolean;
  iceberg: boolean;
  visibleSize: string;
  cancelAfter: number;
  channel: string;
  clientOid: string;
  remark: string;
  tags: string;
  isActive: boolean;
  cancelExist: boolean;
  createdAt: number;
  tradeType: string;
}

export interface IKuCoinTicker {
  symbol: string;
  symbolName: string;
  buy: string;
  sell: string;
  changeRate: string;
  changePrice: string;
  high: string;
  low: string;
  vol: string;
  volValue: string;
  last: string;
  averagePrice: string;
  takerFeeRate: string;
  makerFeeRate: string;
  takerCoefficient: string;
  makerCoefficient: string;
}

export interface IKuCoinSymbol {
  symbol: string;
  name: string;
  baseCurrency: string;
  quoteCurrency: string;
  feeCurrency: string;
  market: string;
  baseMinSize: string;
  quoteMinSize: string;
  baseMaxSize: string;
  quoteMaxSize: string;
  baseIncrement: string;
  quoteIncrement: string;
  priceIncrement: string;
  priceLimitRate: string;
  minFunds: string;
  isMarginEnabled: boolean;
  enableTrading: boolean;
}

export interface IKuCoinOrderBook {
  sequence: string;
  time: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface IKuCoinKline {
  time: string;
  open: string;
  close: string;
  high: string;
  low: string;
  volume: string;
  turnover: string;
}

export interface IKuCoinFuturesContract {
  symbol: string;
  rootSymbol: string;
  type: string;
  firstOpenDate: number;
  expireDate: number | null;
  settleDate: number | null;
  baseCurrency: string;
  quoteCurrency: string;
  settleCurrency: string;
  maxOrderQty: number;
  maxPrice: number;
  lotSize: number;
  tickSize: number;
  indexPriceTickSize: number;
  multiplier: number;
  initialMargin: number;
  maintainMargin: number;
  maxRiskLimit: number;
  minRiskLimit: number;
  riskStep: number;
  makerFeeRate: number;
  takerFeeRate: number;
  takerFixFee: number;
  makerFixFee: number;
  settlementFee: number;
  isDeleverage: boolean;
  isQuanto: boolean;
  isInverse: boolean;
  markMethod: string;
  fairMethod: string;
  fundingBaseSymbol: string;
  fundingQuoteSymbol: string;
  fundingRateSymbol: string;
  indexSymbol: string;
  settlementSymbol: string;
  status: string;
}

export interface IKuCoinPosition {
  id: string;
  symbol: string;
  autoDeposit: boolean;
  maintMarginReq: number;
  riskLimit: number;
  realLeverage: number;
  crossMode: boolean;
  delevPercentage: number;
  openingTimestamp: number;
  currentTimestamp: number;
  currentQty: number;
  currentCost: number;
  currentComm: number;
  unrealisedCost: number;
  realisedGrossCost: number;
  realisedCost: number;
  isOpen: boolean;
  markPrice: number;
  markValue: number;
  posCost: number;
  posCross: number;
  posInit: number;
  posComm: number;
  posLoss: number;
  posMargin: number;
  posMaint: number;
  maintMargin: number;
  realisedGrossPnl: number;
  realisedPnl: number;
  unrealisedPnl: number;
  unrealisedPnlPcnt: number;
  unrealisedRoePcnt: number;
  avgEntryPrice: number;
  liquidationPrice: number;
  bankruptPrice: number;
  settleCurrency: string;
}
