# n8n-nodes-kucoin

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with the [KuCoin](https://www.kucoin.com/) cryptocurrency exchange. This node provides full access to KuCoin's API v2, enabling automated trading workflows for spot, margin, futures, and high-frequency trading operations with 12 resources and 90+ operations.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## Features

- **Account Management**: View balances, ledgers, and transfer funds between accounts
- **Sub-Account Management**: Create and manage sub-accounts with API keys
- **Spot Trading**: Place limit/market orders, batch orders, and manage order lifecycle
- **High-Frequency (HF) Trading**: Ultra-low latency sync operations with dead man's switch
- **Margin Trading**: Cross and isolated margin with auto-borrow/repay
- **Lending**: Manage lending orders and auto-lend configuration
- **Market Data**: Tickers, order books, K-lines, trade history, and fiat prices
- **Futures Trading**: Trade perpetual and delivery contracts
- **Futures Positions**: Manage positions with auto-deposit margin
- **Futures Account**: Account overview and transfer management
- **Earn Products**: Subscribe and redeem earn products
- **Utility**: Server time, service status, and announcements
- **Triggers**: Poll-based triggers for fills, order status, balance changes, and price alerts

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-kucoin`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-kucoin

# Restart n8n
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-kucoin.zip
cd n8n-nodes-kucoin

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-kucoin

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-kucoin %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your KuCoin API key | Yes |
| API Secret | Your KuCoin API secret | Yes |
| Passphrase | Your KuCoin API passphrase | Yes |
| Environment | Production or Sandbox | Yes |

### Getting API Credentials

1. Log in to [KuCoin](https://www.kucoin.com/)
2. Go to **API Management**
3. Create a new API key with required permissions:
   - **General**: For market data and account info
   - **Trade**: For spot/margin trading
   - **Futures**: For futures trading
4. Set IP restrictions for security (recommended)
5. Note your API Key, Secret, and Passphrase

## Resources & Operations

### Account (7 operations)
- Get Account Summary
- Get Account List
- Get Account Detail
- Get Account Ledgers
- Get Transferable Balance
- Transfer Between Accounts
- Flex Transfer

### Sub-Account (4 operations)
- Get Sub-Accounts
- Create Sub-Account
- Get Sub-Account Balance
- Sub-Account Transfer

### Spot Trading (6 operations)
- Place Order
- Cancel Order
- Cancel All Orders
- Get Order List
- Get Order Detail
- Get Fill List

### HF Trading (7 operations)
- Place HF Order
- Sync Place HF Order
- Cancel HF Order
- Cancel All HF Orders
- Get Active HF Orders
- Get HF Order Detail
- Set Auto Cancel

### Margin Trading (7 operations)
- Borrow Margin
- Repay Margin
- Get Borrow History
- Get Repay History
- Get Margin Account
- Get Mark Price
- Get Margin Config

### Lending (7 operations)
- Lend
- Cancel Lend Order
- Set Auto Lend
- Get Active Lend Orders
- Get Lend History
- Get Active Lendings
- Get Lend Assets

### Market Data (11 operations)
- Get Symbols List
- Get Ticker
- Get All Tickers
- Get 24Hr Stats
- Get Order Book
- Get Trade Histories
- Get Klines
- Get Currencies
- Get Currency Detail
- Get Fiat Price
- Get Server Time

### Futures Trading (10 operations)
- Get Contracts
- Get Contract Detail
- Get Futures Ticker
- Get Futures Order Book
- Place Futures Order
- Cancel Futures Order
- Cancel All Futures Orders
- Get Futures Orders
- Get Futures Order Detail
- Get Futures Fills

### Futures Position (7 operations)
- Get Position
- Get Position List
- Set Auto Deposit Margin
- Add Margin
- Get Max Withdraw Margin
- Withdraw Margin
- Get Funding History

### Futures Account (5 operations)
- Get Account Overview
- Get Transaction History
- Transfer to Futures
- Transfer from Futures
- Get Transfer Records

### Earn (5 operations)
- Get Earn Products
- Subscribe Earn
- Redeem Earn
- Get Earn Holdings
- Get Redeem Preview

### Utility (3 operations)
- Get Server Time
- Get Service Status
- Get Announcements

## Trigger Node

The **KuCoin Trigger** node supports poll-based events:

| Event | Description |
|-------|-------------|
| New Order Fill | Triggers when a spot order is filled |
| Order Status Change | Triggers when order status changes |
| Account Balance Change | Triggers when account balance changes |
| Price Alert | Triggers when price crosses threshold |

## Usage Examples

### Place a Spot Order

1. Add a **KuCoin** node to your workflow
2. Select **Resource**: Spot Trading
3. Select **Operation**: Place Order
4. Configure:
   - **Symbol**: BTC-USDT
   - **Side**: Buy
   - **Type**: Limit
   - **Price**: 40000
   - **Size**: 0.001

### Get Account Balances

1. Add a **KuCoin** node
2. Select **Resource**: Account
3. Select **Operation**: Get Account List
4. Optionally filter by currency or account type

### Price Alert Trigger

1. Add a **KuCoin Trigger** node
2. Select **Event**: Price Alert
3. Configure:
   - **Symbol**: BTC-USDT
   - **Alert Type**: Price Above
   - **Threshold Price**: 50000

## Error Handling

Common KuCoin API error codes:

| Code | Description |
|------|-------------|
| 400001 | Invalid parameter or missing API header |
| 400002 | Timestamp invalid |
| 400003 | API key not found |
| 400004 | Passphrase error |
| 400005 | Signature error |
| 400100 | Parameter error |
| 411100 | User is frozen |
| 500000 | Internal server error |

Enable **Continue On Fail** to handle errors gracefully in your workflows.

## Security Best Practices

1. **Use IP Whitelisting**: Restrict API access to specific IPs
2. **Minimal Permissions**: Only enable required API permissions
3. **Secure Passphrase**: Use a strong, unique passphrase
4. **Test in Sandbox**: Always test in sandbox before production
5. **Monitor API Usage**: Regularly review API activity

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-kucoin/issues)
- **Documentation**: [KuCoin API Docs](https://docs.kucoin.com/)
- **Commercial Support**: [licensing@velobpa.com](mailto:licensing@velobpa.com)

## Acknowledgments

- [KuCoin](https://www.kucoin.com/) for their comprehensive API
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for inspiration and support

## Disclaimer

This is an unofficial community integration. It is not affiliated with, endorsed by, or connected to KuCoin in any way. Use at your own risk. Always test thoroughly with the sandbox environment before using in production.

**Trading cryptocurrencies involves significant risk. Never trade with funds you cannot afford to lose.**
