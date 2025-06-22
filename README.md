# Film Review Platform

A modern film review and rating platform where users can browse movies, view details, post reviews, and rate films.

## Features

- 🎬 Movie browsing and search
- ⭐ Movie rating system
- 💬 User review functionality
- 🔍 Filter movies by genre
- 📱 Responsive design
- 🔐 User authentication system
- 📊 Real-time rating updates

## Tech Stack

### Frontend Framework

- **Next.js 15** - React full-stack framework
- **React 19** - User interface library
- **TypeScript** - Type safety

### UI Component Library

- **Chakra UI 3** - Modern component library
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend Service

- **JSON Server** - Mock REST API service

### Development Tools

- **Vitest** - Unit testing framework
- **ESLint** - Code quality checking
- **Prettier** - Code formatting
- **Husky** - Git hooks management

## Quick Start

### Prerequisites

- Node.js v18+
- pnpm v8+

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

1. Start JSON Server (backend API service):

```bash
pnpm json-server
```

2. In another terminal, start Next.js development server:

```bash
pnpm dev
```

3. Access the application:
   - Frontend app: http://localhost:3000
   - API service: http://localhost:3001

### Test Users

You can use the following test accounts to login:

- Username: alice, bob, charlie, diana, edward
- Password: 123456

## Project Structure

```
film-review-platform/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── film/           # Film-related pages
│   │       └── [id]/       # Film detail page
│   ├── components/         # Reusable components
│   │   ├── header.tsx      # Page header
│   │   ├── film-card.tsx   # Film card
│   │   ├── film-list.tsx   # Film list
│   │   ├── search-bar.tsx  # Search bar
│   │   ├── rating-form.tsx # Rating form
│   │   ├── login-modal.tsx # Login modal
│   │   ├── pagination.tsx  # Pagination component
│   │   ├── error-boundary.tsx # Error boundary
│   │   └── providers.tsx   # Context providers
│   ├── hooks/              # Custom Hooks
│   │   ├── useAuth.tsx     # Authentication related
│   │   └── useFilms.ts     # Film data management
│   ├── lib/                # Utility libraries
│   │   ├── api.ts          # API client
│   │   └── cache.ts        # Cache management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── __tests__/          # Test files
├── db.json                 # JSON Server database
├── package.json            # Project configuration
└── README.md              # Project documentation
```

## Development Guide

### Adding New Movies

Add new movie data to the `films` array in `db.json`:

```json
{
  "id": "f15",
  "movieName": "Movie Title",
  "des": "Movie description",
  "sort": ["Genre1", "Genre2"],
  "publichTime": 1234567890000,
  "commentCount": 0,
  "totalCommentNum": 0,
  "fraction": 0,
  "posterUrl": "/movie-poster.jpeg"
}
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm coverage
```

### Code Formatting

```bash
pnpm lint
```

## Test Coverage

### Current Test Coverage Report

```plaintext
--------------------------------------------|---------|----------|---------|---------|-------------------
File                                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------------|---------|----------|---------|---------|-------------------
All files                                   |   49.06 |    80.18 |   68.42 |   49.06 |
 film-review-platform                 |       0 |        0 |       0 |       0 |

  next.config.ts                            |       0 |        0 |       0 |       0 | 1-22

  postcss.config.js                         |       0 |        0 |       0 |       0 | 1-6

  tailwind.config.ts                        |       0 |        0 |       0 |       0 | 1-13

 film-review-platform/src/app         |       0 |        0 |       0 |       0 |

  layout.tsx                                |       0 |        0 |       0 |       0 | 1-30

  page.tsx                                  |       0 |        0 |       0 |       0 | 1-117

 ...review-platform/src/app/film/[id] |       0 |        0 |       0 |       0 |

  page.tsx                                  |       0 |        0 |       0 |       0 | 1-212

 film-review-platform/src/components  |   53.86 |    84.21 |   67.85 |   53.86 |

  error-boundary.tsx                        |      72 |    83.33 |   57.14 |      72 | ...6,76-78,93-105
  film-card.tsx                             |     100 |       40 |     100 |     100 | 39,93

  film-list.tsx                             |     100 |      100 |     100 |     100 |

  header.tsx                                |   92.45 |       50 |     100 |   92.45 | 52-55

  login-modal.tsx                           |     100 |      100 |     100 |     100 |

  pagination.tsx                            |   79.27 |     87.5 |      80 |   79.27 | 68-92,125

  providers.tsx                             |       0 |        0 |       0 |       0 | 1-14

  rating-form.tsx                           |       0 |        0 |       0 |       0 | 1-333

  search-bar.tsx                            |   94.44 |      100 |    62.5 |   94.44 | 32-35,89

 film-review-platform/src/hooks       |     100 |    86.53 |     100 |     100 |

  useAuth.tsx                               |     100 |      100 |     100 |     100 |

  useFilms.ts                               |     100 |    83.33 |     100 |     100 | ...94,113,115-116
 film-review-platform/src/lib         |   74.91 |    74.39 |   69.23 |   74.91 |

  api.ts                                    |   85.46 |    74.07 |     100 |   85.46 | ...77-279,299-301
  cache.ts                                  |   28.84 |      100 |   11.11 |   28.84 | ...52-57,61-65,73
 film-review-platform/src/test        |     100 |      100 |     100 |     100 |

  test-utils.tsx                            |     100 |      100 |     100 |     100 |

 film-review-platform/src/types       |       0 |        0 |       0 |       0 |

  index.ts                                  |       0 |        0 |       0 |       0 | 1-60

 film-review-platform/src/utils       |     100 |      100 |     100 |     100 |

  helpers.ts                                |     100 |      100 |     100 |     100 |

--------------------------------------------|---------|----------|---------|---------|-------------------
```

### Current Test Statistics

- **Test Files**: 12 files
- **Test Cases**: 85 tests
- **Pass Rate**: 100%
- **Core Logic Coverage**: High (hooks, utils, core components)
- **UI Component Coverage**: Medium (some components untested)

### Test Coverage Focus

✅ **Covered**:

- Core business logic (hooks, utils)
- API client and error handling
- Main UI components (FilmCard, FilmList, SearchBar, Pagination)
- Authentication system
- Error boundary handling
- Login modal functionality

### Test Files Structure

```
src/
├── __tests__/              # Example tests
├── components/__tests__/    # Component tests
│   ├── components.test.tsx
│   ├── error-boundary.test.tsx
│   ├── film-card.test.tsx
│   ├── film-list.test.tsx
│   ├── login-modal.test.tsx
│   ├── pagination.test.tsx
│   └── search-bar.test.tsx
├── hooks/__tests__/         # Hook tests
│   ├── useAuth.test.tsx
│   └── useFilms.test.tsx
├── lib/__tests__/          # API tests
│   └── api.test.ts
└── utils/__tests__/        # Utility tests
    └── helpers.test.ts
```

## Deployment

### Build Production Version

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Data Models

### Film

```typescript
interface Film {
  id: string;
  movieName: string;
  des: string;
  sort: string[];
  publichTime: number;
  commentCount: number;
  totalCommentNum: number;
  fraction: number;
  posterUrl: string;
}
```

### User

```typescript
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}
```

### Review

```typescript
interface Review {
  id: string;
  userId: string;
  filmId: string;
  score: number;
  comment: string;
  timestamp: number;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

# 电影评分平台

一个现代化的电影评论和评分平台，用户可以浏览电影、查看详情、发表评论和评分。

## 功能特性

- 🎬 电影浏览和搜索
- ⭐ 电影评分系统
- 💬 用户评论功能
- 🔍 按类型筛选电影
- 📱 响应式设计
- 🔐 用户认证系统
- 📊 实时评分更新

## 技术栈

### 前端框架

- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全

### UI 组件库

- **Chakra UI 3** - 现代化组件库
- **Tailwind CSS 4** - 实用优先的CSS框架

### 后端服务

- **JSON Server** - 模拟REST API服务

### 开发工具

- **Vitest** - 单元测试框架
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks管理

## 快速开始

### 环境要求

- Node.js v18+
- pnpm v8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

1. 启动 JSON Server（后端API服务）：

```bash
pnpm json-server
```

2. 在另一个终端启动 Next.js 开发服务器：

```bash
pnpm dev
```

3. 访问应用：
   - 前端应用：http://localhost:3000
   - API服务：http://localhost:3001

### 测试用户

可以使用以下测试账户登录：

- 用户名：alice, bob, charlie, diana, edward
- 密码：123456

## 项目结构

```
film-review-platform/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # 首页
│   │   ├── layout.tsx      # 根布局
│   │   ├── globals.css     # 全局样式
│   │   └── film/           # 电影相关页面
│   │       └── [id]/       # 电影详情页
│   ├── components/         # 可复用组件
│   │   ├── header.tsx      # 页面头部
│   │   ├── film-card.tsx   # 电影卡片
│   │   ├── film-list.tsx   # 电影列表
│   │   ├── search-bar.tsx  # 搜索栏
│   │   ├── rating-form.tsx # 评分表单
│   │   ├── login-modal.tsx # 登录模态框
│   │   ├── pagination.tsx  # 分页组件
│   │   ├── error-boundary.tsx # 错误边界
│   │   └── providers.tsx   # 上下文提供者
│   ├── hooks/              # 自定义Hooks
│   │   ├── useAuth.tsx     # 认证相关
│   │   └── useFilms.ts     # 电影数据
│   ├── lib/                # 工具库
│   │   ├── api.ts          # API客户端
│   │   └── cache.ts        # 缓存管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── __tests__/          # 测试文件
├── db.json                 # JSON Server数据库
├── package.json            # 项目配置
└── README.md              # 项目说明
```

## 开发指南

### 添加新电影

在 `db.json` 文件的 `films` 数组中添加新的电影数据：

```json
{
  "id": "f15",
  "movieName": "电影标题",
  "des": "电影描述",
  "sort": ["类型1", "类型2"],
  "publichTime": 1234567890000,
  "commentCount": 0,
  "totalCommentNum": 0,
  "fraction": 0,
  "posterUrl": "/movie-poster.jpeg"
}
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm coverage
```

### 代码格式化

```bash
pnpm lint
```

## 测试覆盖率

### 当前测试覆盖率报告

```plaintext
--------------------------------------------|---------|----------|---------|---------|-------------------
File                                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------------|---------|----------|---------|---------|-------------------
All files                                   |   49.06 |    80.18 |   68.42 |   49.06 |
 film-review-platform                 |       0 |        0 |       0 |       0 |

  next.config.ts                            |       0 |        0 |       0 |       0 | 1-22

  postcss.config.js                         |       0 |        0 |       0 |       0 | 1-6

  tailwind.config.ts                        |       0 |        0 |       0 |       0 | 1-13

 film-review-platform/src/app         |       0 |        0 |       0 |       0 |

  layout.tsx                                |       0 |        0 |       0 |       0 | 1-30

  page.tsx                                  |       0 |        0 |       0 |       0 | 1-117

 ...review-platform/src/app/film/[id] |       0 |        0 |       0 |       0 |

  page.tsx                                  |       0 |        0 |       0 |       0 | 1-212

 film-review-platform/src/components  |   53.86 |    84.21 |   67.85 |   53.86 |

  error-boundary.tsx                        |      72 |    83.33 |   57.14 |      72 | ...6,76-78,93-105
  film-card.tsx                             |     100 |       40 |     100 |     100 | 39,93

  film-list.tsx                             |     100 |      100 |     100 |     100 |

  header.tsx                                |   92.45 |       50 |     100 |   92.45 | 52-55

  login-modal.tsx                           |     100 |      100 |     100 |     100 |

  pagination.tsx                            |   79.27 |     87.5 |      80 |   79.27 | 68-92,125

  providers.tsx                             |       0 |        0 |       0 |       0 | 1-14

  rating-form.tsx                           |       0 |        0 |       0 |       0 | 1-333

  search-bar.tsx                            |   94.44 |      100 |    62.5 |   94.44 | 32-35,89

 film-review-platform/src/hooks       |     100 |    86.53 |     100 |     100 |

  useAuth.tsx                               |     100 |      100 |     100 |     100 |

  useFilms.ts                               |     100 |    83.33 |     100 |     100 | ...94,113,115-116
 film-review-platform/src/lib         |   74.91 |    74.39 |   69.23 |   74.91 |

  api.ts                                    |   85.46 |    74.07 |     100 |   85.46 | ...77-279,299-301
  cache.ts                                  |   28.84 |      100 |   11.11 |   28.84 | ...52-57,61-65,73
 film-review-platform/src/test        |     100 |      100 |     100 |     100 |

  test-utils.tsx                            |     100 |      100 |     100 |     100 |

 film-review-platform/src/types       |       0 |        0 |       0 |       0 |

  index.ts                                  |       0 |        0 |       0 |       0 | 1-60

 film-review-platform/src/utils       |     100 |      100 |     100 |     100 |

  helpers.ts                                |     100 |      100 |     100 |     100 |

--------------------------------------------|---------|----------|---------|---------|-------------------
```

### 当前测试统计

- **测试文件**: 12 个
- **测试用例**: 85 个
- **通过率**: 100%
- **核心逻辑覆盖率**: 高（hooks, utils, 核心组件）
- **UI 组件覆盖率**: 中等（部分组件未测试）

### 测试重点

✅ **已覆盖**:

- 核心业务逻辑 (hooks, utils)
- API 客户端和错误处理
- 主要 UI 组件 (FilmCard, FilmList, SearchBar, Pagination)
- 认证系统
- 错误边界处理
- 登录模态框功能

### 测试文件结构

```
src/
├── __tests__/              # 示例测试
├── components/__tests__/    # 组件测试
│   ├── components.test.tsx
│   ├── error-boundary.test.tsx
│   ├── film-card.test.tsx
│   ├── film-list.test.tsx
│   ├── login-modal.test.tsx
│   ├── pagination.test.tsx
│   └── search-bar.test.tsx
├── hooks/__tests__/         # Hook测试
│   ├── useAuth.test.tsx
│   └── useFilms.test.tsx
├── lib/__tests__/          # API测试
│   └── api.test.ts
└── utils/__tests__/        # 工具函数测试
    └── helpers.test.ts
```

## 部署

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 数据模型

### 电影

```typescript
interface Film {
  id: string;
  movieName: string;
  des: string;
  sort: string[];
  publichTime: number;
  commentCount: number;
  totalCommentNum: number;
  fraction: number;
  posterUrl: string;
}
```

### 用户

```typescript
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}
```

### 评论

```typescript
interface Review {
  id: string;
  userId: string;
  filmId: string;
  score: number;
  comment: string;
  timestamp: number;
}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证。
