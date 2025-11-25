# YJP Blockchain - 纯前端区块链项目

一个完全使用 JavaScript/TypeScript + Vite + React 实现的**纯前端**区块链系统，无需后端服务器！

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.1+-blue.svg)

## ✨ 功能特性

✅ **1. 代币生产** - PoW 挖矿机制，生成新区块并奖励代币  
✅ **2. 用户管理** - 创建钱包地址和管理账户  
✅ **3. 代币转账** - 支持点对点代币转账，ECDSA 签名验证  
✅ **4. 矿工节点** - 工作量证明挖矿系统  
✅ **5. 区块链浏览器** - 查看区块高度、区块详情、交易记录

## 🎯 项目亮点

- ✅ **纯前端实现** - 无需后端服务器
- ✅ **Zustand 状态管理** - 简单高效的状态管理
- ✅ **LocalStorage 持久化** - 数据自动保存
- ✅ **真实加密算法** - SHA-256 + ECDSA
- ✅ **Vite + React** - 现代化前端构建工具
- ✅ **一键启动** - 只需一个命令

## 🚀 快速开始

### 前置要求

- Node.js 18.0+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动项目

```bash
npm run dev
```

访问：**http://localhost:3000**

就这么简单！🎉

## 📁 项目结构

```
yjp-cosmos/
├── src/
│   ├── pages/                   # React 页面
│   │   ├── Home.tsx             # 首页
│   │   ├── Blocks.tsx           # 区块浏览器
│   │   ├── Wallet.tsx           # 钱包管理
│   │   └── Mine.tsx             # 挖矿页面
│   ├── components/              # React组件
│   ├── lib/                     # 区块链核心逻辑
│   │   ├── blockchain/
│   │   │   ├── Block.ts         # 区块类
│   │   │   ├── Blockchain.ts    # 区块链管理
│   │   │   └── Transaction.ts   # 交易处理
│   │   └── wallet/
│   │       └── Wallet.ts        # 钱包生成
│   ├── store/
│   │   └── blockchainStore.ts   # Zustand状态管理
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
├── index.html                   # HTML 入口
├── vite.config.ts               # Vite 配置
├── package.json
└── tsconfig.json
```

## 🔧 技术栈

### 核心技术

- **Vite** - 快速的前端构建工具
- **React 18** - UI 框架
- **React Router** - 路由管理
- **TypeScript** - 类型安全
- **Zustand** - 状态管理
- **TailwindCSS** - 样式框架

### 区块链技术

- **SHA-256** - 哈希算法
- **ECDSA** - 数字签名（secp256k1）
- **PoW** - 工作量证明
- **crypto-js** - 浏览器端加密
- **elliptic** - 椭圆曲线加密

## 💡 使用指南

### 第一步：创建钱包

1. 点击导航栏 "👛 钱包"
2. 点击 "创建新钱包"
3. 保存你的钱包地址和私钥

### 第二步：挖矿获得代币

1. 点击 "⛏️ 挖矿"
2. 输入你的钱包地址
3. 点击 "开始挖矿"
4. 等待挖矿完成（约 2-10 秒）
5. 重复挖矿 2-3 次让奖励到账

### 第三步：转账

1. 创建第二个钱包（可用无痕窗口）
2. 在第一个钱包中发送交易
3. 填写接收地址和金额
4. 提交交易
5. 到挖矿页面确认交易

### 第四步：查看区块

1. 点击 "📦 区块浏览"
2. 查看所有区块和交易记录
3. 验证区块链完整性

## 🎨 页面功能

### 首页 (`/`)

- 实时统计信息
- 区块高度显示
- 最近 3 个区块
- 链完整性验证

### 区块浏览器 (`/blocks`)

- 完整区块列表
- 区块详细信息
- 交易记录查看

### 钱包 (`/wallet`)

- 一键创建钱包
- 余额查询
- 发送交易
- 私钥管理

### 挖矿 (`/mine`)

- 开始挖矿
- 查看待处理交易
- 获得区块奖励

## 📊 区块链特性

- **共识机制**: 工作量证明 (Proof of Work)
- **挖矿难度**: 4（可调节）
- **区块奖励**: 50 代币
- **签名算法**: ECDSA (secp256k1)
- **哈希算法**: SHA-256

## 🔐 数据存储

- **区块链数据**: 浏览器内存 + LocalStorage 持久化
- **钱包信息**: LocalStorage
- **刷新保留**: 数据自动保存，刷新页面不丢失

## ⚠️ 注意事项

1. **教育目的** - 本项目仅用于学习区块链原理
2. **浏览器限制** - 挖矿时可能会卡顿几秒
3. **数据本地** - 所有数据存储在浏览器中
4. **不可用于生产** - 这不是真实的分布式区块链

## 🎓 学习要点

通过这个项目可以学习：

### 区块链技术

- ✅ 区块链数据结构
- ✅ 工作量证明（PoW）
- ✅ 数字签名和验证
- ✅ 交易和账本
- ✅ 链的完整性验证

### 前端开发

- ✅ Next.js 应用开发
- ✅ Zustand 状态管理
- ✅ TypeScript 实践
- ✅ LocalStorage 使用
- ✅ React Hooks

### 密码学

- ✅ SHA-256 哈希
- ✅ ECDSA 数字签名
- ✅ 公钥/私钥系统
- ✅ 浏览器端加密

## 🚀 部署

### 部署到 Vercel

```bash
npm run build
```

然后将`frontend`目录连接到 Vercel，自动部署！

### 部署到静态托管

```bash
npm run build
npm run export  # 生成静态文件
```

将生成的`out`目录部署到任何静态托管服务。

## 🛠️ 开发

### 开发模式

```bash
cd frontend
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

### 调整挖矿难度

编辑 `frontend/src/lib/blockchain/Blockchain.ts`:

```typescript
this.difficulty = 4; // 数字越大越难
```

- 难度 2: 快速（开发测试）
- 难度 4: 适中（演示）
- 难度 6+: 困难（接近真实）

## 📝 常见问题

### Q: 为什么挖矿时页面会卡？

A: 挖矿是 CPU 密集型计算，在浏览器主线程执行。可以降低难度系数。

### Q: 刷新页面数据会丢失吗？

A: 不会！数据已使用 LocalStorage 持久化，刷新后自动恢复。

### Q: 可以多人一起使用吗？

A: 不可以。这是纯前端实现，每个浏览器的数据独立。

### Q: 如何备份钱包？

A: 复制并保存钱包页面显示的私钥。用私钥可以恢复钱包。

### Q: 为什么不用后端？

A: 本项目目标是演示区块链原理，纯前端实现更简单易懂。

## 🎯 下一步扩展

可以添加的功能：

- [ ] Web Worker 挖矿（避免卡 UI）
- [ ] 导入/导出区块链数据
- [ ] 交易历史图表
- [ ] 多钱包管理
- [ ] 交易搜索功能
- [ ] 暗色主题切换
- [ ] 多语言支持

## 📄 许可证

MIT License

## 🙏 致谢

- [Bitcoin 白皮书](https://bitcoin.org/bitcoin.pdf) - 区块链的起源
- [Ethereum](https://ethereum.org) - 智能合约启发
- [Zustand](https://github.com/pmndrs/zustand) - 优秀的状态管理库

---

**开始探索区块链的世界吧！** 🚀

```bash
cd frontend
npm install
npm run dev
```

访问：http://localhost:3000
