# Hardhat Demo 项目

这是一个基于 Hardhat 的以太坊智能合约演示项目，包含两个主要合约：Counter（计数器）和 Vault（保险库）。

## 项目结构

```
hardhatdemo/
├── contracts/          # 智能合约源码
│   ├── Counter.sol     # 计数器合约
│   └── Vault.sol       # 保险库合约
├── scripts/            # 部署脚本
│   └── deploy.js       # 合约部署脚本
├── test/              # 测试文件
│   ├── Counter.test.js
│   └── Vault.test.js
├── hardhat.config.js  # Hardhat 配置文件
└── package.json       # 项目依赖配置
```

## 合约介绍

### Counter 合约
一个功能丰富的计数器合约，支持：
- 基础计数功能（增加/减少）
- 付费增加计数功能
- 用户交互记录
- 所有者管理功能

主要功能：
- `increment()` - 免费增加计数
- `decrement()` - 减少计数
- `paidIncrement()` - 付费增加计数
- `reset()` - 重置计数为 0
- `getCount()` - 获取当前计数
- `withdraw()` - 所有者提取合约余额

### Vault 合约
一个简单的 ETH 存储库合约，支持：
- ETH 存款
- ETH 提取
- 授权他人提取
- 查询余额和存款者信息

主要功能：
- `deposit()` - 存入 ETH
- `withdraw(uint256 amount)` - 提取指定数量的 ETH
- `approve(address spender, uint256 amount)` - 授权他人提取
- `withdrawFrom(address from, uint256 amount)` - 从授权账户提取
- `getBalance(address account)` - 查询账户余额

## 安装和使用

### 1. 安装依赖
```bash
npm install
```

### 2. 编译合约
```bash
npm run compile
```

### 3. 运行测试
```bash
npm test
```

### 4. 部署合约
```bash
npm run deploy
```

### 5. 启动本地节点
```bash
npm run node
```

## 开发环境

- **Hardhat**: ^2.26.2
- **Solidity**: ^0.8.19
- **Node.js**: 推荐使用最新 LTS 版本

## 许可证

ISC License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进此项目。