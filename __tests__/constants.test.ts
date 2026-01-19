/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  ACCOUNT_TYPE_OPTIONS,
  TRADE_TYPE_OPTIONS,
  ORDER_SIDE_OPTIONS,
  ORDER_TYPE_OPTIONS,
  TIME_IN_FORCE_OPTIONS,
  STP_OPTIONS,
  STOP_TYPE_OPTIONS,
  MARGIN_MODE_OPTIONS,
  KLINE_INTERVAL_OPTIONS,
  LENDING_TERM_OPTIONS,
  ORDER_BOOK_LEVEL_OPTIONS,
  KLINE_INTERVALS,
  ORDERBOOK_LEVELS,
  KUCOIN_ERROR_CODES,
} from '../nodes/KuCoin/utils/constants';

describe('Constants', () => {
  describe('ACCOUNT_TYPE_OPTIONS', () => {
    it('should contain all required account types', () => {
      const values = ACCOUNT_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('main');
      expect(values).toContain('trade');
      expect(values).toContain('margin');
    });

    it('should have name and value for each option', () => {
      ACCOUNT_TYPE_OPTIONS.forEach(opt => {
        expect(opt).toHaveProperty('name');
        expect(opt).toHaveProperty('value');
        expect(typeof opt.name).toBe('string');
        expect(typeof opt.value).toBe('string');
      });
    });
  });

  describe('TRADE_TYPE_OPTIONS', () => {
    it('should contain trade types', () => {
      const values = TRADE_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('TRADE');
      expect(values).toContain('MARGIN_TRADE');
    });
  });

  describe('ORDER_SIDE_OPTIONS', () => {
    it('should contain buy and sell', () => {
      const values = ORDER_SIDE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('buy');
      expect(values).toContain('sell');
      expect(values.length).toBe(2);
    });
  });

  describe('ORDER_TYPE_OPTIONS', () => {
    it('should contain limit and market', () => {
      const values = ORDER_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('limit');
      expect(values).toContain('market');
    });
  });

  describe('TIME_IN_FORCE_OPTIONS', () => {
    it('should contain all time in force options', () => {
      const values = TIME_IN_FORCE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('GTC');
      expect(values).toContain('GTT');
      expect(values).toContain('IOC');
      expect(values).toContain('FOK');
    });
  });

  describe('STP_OPTIONS', () => {
    it('should contain self trade prevention options', () => {
      const values = STP_OPTIONS.map(opt => opt.value);
      expect(values).toContain('DC');
      expect(values).toContain('CO');
      expect(values).toContain('CN');
      expect(values).toContain('CB');
    });
  });

  describe('STOP_TYPE_OPTIONS', () => {
    it('should contain loss and entry', () => {
      const values = STOP_TYPE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('loss');
      expect(values).toContain('entry');
    });
  });

  describe('MARGIN_MODE_OPTIONS', () => {
    it('should contain cross and isolated', () => {
      const values = MARGIN_MODE_OPTIONS.map(opt => opt.value);
      expect(values).toContain('cross');
      expect(values).toContain('isolated');
    });
  });

  describe('KLINE_INTERVAL_OPTIONS', () => {
    it('should contain various intervals', () => {
      const values = KLINE_INTERVAL_OPTIONS.map(opt => opt.value);
      expect(values).toContain('1min');
      expect(values).toContain('1hour');
      expect(values).toContain('1day');
      expect(values).toContain('1week');
    });
  });

  describe('LENDING_TERM_OPTIONS', () => {
    it('should contain lending terms', () => {
      const values = LENDING_TERM_OPTIONS.map(opt => opt.value);
      expect(values).toContain(7);
      expect(values).toContain(14);
      expect(values).toContain(28);
    });
  });

  describe('ORDER_BOOK_LEVEL_OPTIONS', () => {
    it('should contain order book levels', () => {
      const values = ORDER_BOOK_LEVEL_OPTIONS.map(opt => opt.value);
      expect(values).toContain('level2_20');
      expect(values).toContain('level2_100');
      expect(values).toContain('level3');
    });
  });

  describe('Aliases', () => {
    it('KLINE_INTERVALS should equal KLINE_INTERVAL_OPTIONS', () => {
      expect(KLINE_INTERVALS).toBe(KLINE_INTERVAL_OPTIONS);
    });

    it('ORDERBOOK_LEVELS should equal ORDER_BOOK_LEVEL_OPTIONS', () => {
      expect(ORDERBOOK_LEVELS).toBe(ORDER_BOOK_LEVEL_OPTIONS);
    });
  });

  describe('KUCOIN_ERROR_CODES', () => {
    it('should contain common error codes', () => {
      expect(KUCOIN_ERROR_CODES['200000']).toBe('Success');
      expect(KUCOIN_ERROR_CODES['400001']).toBeDefined();
      expect(KUCOIN_ERROR_CODES['500000']).toBeDefined();
    });

    it('should be a valid object structure', () => {
      expect(typeof KUCOIN_ERROR_CODES).toBe('object');
      Object.entries(KUCOIN_ERROR_CODES).forEach(([code, message]) => {
        expect(typeof code).toBe('string');
        expect(typeof message).toBe('string');
      });
    });
  });
});
