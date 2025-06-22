# 电影评分平台

一个现代化的电影评论和评分平台，用户可以浏览电影、查看详情、发表评论和评分。

## 功能特性

- 🎬 电影浏览和搜索
- ⭐ 电影评分系统
- 💬 用户评论功能
- 🔍 按类型筛选电影
- 📱 响应式设计
- 🔐 用户认证系统

## 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全

### UI 组件库
- **Chakra UI 2** - 现代化组件库
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
│   │   ├── providers.tsx   # 上下文提供者
│   │   └── theme.ts        # 主题配置
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
  "id": "f11",
  "title": "电影标题",
  "description": "电影描述",
  "genre": ["类型1", "类型2"],
  "releaseDate": 1234567890000,
  "ratingCount": 0,
  "totalRating": 0,
  "averageRating": 0,
  "posterUrl": "/api/posters/movie.jpg"
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

## 部署

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 测试覆盖率

### 当前测试覆盖率

```plaintext
----------------------------------------|---------|----------|---------|---------|-----------------------
File                                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------------------|---------|----------|---------|---------|-----------------------
All files                               |    49.4 |    82.22 |   70.66 |    49.4 |
 film-review-platform                   |       0 |        0 |       0 |       0 |

  next.config.ts                        |       0 |        0 |       0 |       0 | 1-22

  postcss.config.js                     |       0 |        0 |       0 |       0 | 1-6

  tailwind.config.ts                    |       0 |        0 |       0 |       0 | 1-13

 film-review-platform/src/app           |       0 |        0 |       0 |       0 |

  layout.tsx                            |       0 |        0 |       0 |       0 | 1-30

  page.tsx                              |       0 |        0 |       0 |       0 | 1-140

 film-review-platform/src/app/film/[id] |       0 |        0 |       0 |       0 |

  page.tsx                              |       0 |        0 |       0 |       0 | 1-218

 film-review-platform/src/components    |   57.62 |    87.67 |   75.86 |   57.62 |

  error-boundary.tsx                    |   64.83 |       70 |   83.33 |   64.83 | 54-55,74-95,116-128

  film-card.tsx                         |     100 |    66.66 |     100 |     100 | 42

  film-list.tsx                         |     100 |      100 |     100 |     100 |

  header.tsx                            |   94.87 |      100 |      50 |   94.87 | 26-27

  login-modal.tsx                       |   89.61 |    66.66 |     100 |   89.61 | 35-42

  pagination.tsx                        |     100 |      100 |     100 |     100 |

  providers.tsx                         |       0 |        0 |       0 |       0 | 1-14

  rating-form.tsx                       |       0 |        0 |       0 |       0 | 1-260

  search-bar.tsx                        |     100 |      100 |      75 |     100 |

  theme.ts                              |       0 |        0 |       0 |       0 | 1-26

 film-review-platform/src/hooks         |     100 |     97.5 |     100 |     100 |

  useAuth.tsx                           |     100 |      100 |     100 |     100 |

  useFilms.ts                           |     100 |    96.66 |     100 |     100 | 81

 film-review-platform/src/lib           |   73.89 |    72.28 |   69.23 |   73.89 |

  api.ts                                |   83.53 |    71.95 |     100 |   83.53 | ...85,297-299,319-321 
  cache.ts                              |   28.84 |      100 |   11.11 |   28.84 | ...-48,52-57,61-65,73 
 film-review-platform/src/types         |       0 |        0 |       0 |       0 |

  index.ts                              |       0 |        0 |       0 |       0 | 1-46

 film-review-platform/src/utils         |     100 |      100 |     100 |     100 |

  helpers.ts                            |     100 |      100 |     100 |     100 |

----------------------------------------|---------|----------|---------|---------|-----------------------
```

### 测试统计

- **测试文件**: 12 个
- **测试用例**: 109 个
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

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 