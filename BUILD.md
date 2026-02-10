# n8n-nodes-mailflow 编译与运行说明

## 项目概述

本项目是 n8n 的自定义社区节点包，提供 Mailflow API 集成功能，包含两个核心功能：

- **Webhook Mapping**：解析 Webhook 推送的邮件数据（from、to、subject、text 等字段）
- **Notification**：通过 Mailflow API 发送通知

## 项目结构

```
n8n-nodes-mailflow/
├── credentials/
│   └── MailflowApi.credentials.ts    # API Key 凭证定义
├── nodes/
│   └── Mailflow/
│       └── Mailflow.node.ts          # 节点主逻辑
├── icons/                            # 节点图标
├── dist/                             # 编译输出目录（编译后生成）
├── package.json                      # 包配置 & n8n 节点注册
├── tsconfig.json                     # TypeScript 编译配置
└── BUILD.md                          # 本文件
```

## 环境要求

- **Node.js** >= v20
- **npm**
- **Docker** & **Docker Compose**（用于运行 n8n）

## 编译步骤

### 1. 安装依赖

```bash
cd /root/n8n/n8n-nodes-mailflow
npm install
```

### 2. 编译 TypeScript

```bash
npm run build
```

编译成功后，会在 `dist/` 目录下生成：

```
dist/
├── credentials/
│   └── MailflowApi.credentials.js    # 凭证（编译后）
└── nodes/
    └── Mailflow/
        └── Mailflow.node.js          # 节点（编译后）
```

## 运行方式

本项目通过 Docker Compose 与 n8n 集成运行。`docker-compose.yml` 中已配置卷映射：

```yaml
volumes:
  - ./n8n-nodes-mailflow:/home/node/.n8n/nodes/node_modules/n8n-nodes-mailflow
```

### 启动 n8n（首次）

```bash
cd /root/n8n
docker compose up -d
```

### 重启 n8n（代码更新后）

每次修改源码并重新编译后，需重启 n8n 容器以加载新代码：

```bash
cd /root/n8n
docker compose restart n8n
```

### 访问 n8n

浏览器打开：`http://<服务器IP>:5678`

在工作流编辑器中搜索 **Mailflow** 即可找到自定义节点。

## 日常开发流程

修改 `.ts` 源码后，执行以下命令使改动生效：

```bash
# 1. 编译
cd /root/n8n/n8n-nodes-mailflow
npm run build

# 2. 重启 n8n 容器
cd /root/n8n
docker compose restart n8n
```

或者一行命令完成：

```bash
cd /root/n8n/n8n-nodes-mailflow && npm run build && cd /root/n8n && docker compose restart n8n
```

## 查看日志

如果节点加载失败或运行异常，可查看 n8n 容器日志：

```bash
docker logs n8n --tail 100 -f
```

## 相关服务

| 服务 | 端口 | 说明 |
|------|------|------|
| n8n | 5678 | 工作流引擎 |
| PostgreSQL | 5432（内部） | n8n 数据库 |
| Baserow | 5080 | 数据表服务 |

## 注意事项

1. **编译是必须的**：n8n 运行时只加载 `dist/` 下的 `.js` 文件，不会直接读取 `.ts` 源码
2. **重启才生效**：n8n 在启动时加载节点，修改代码后必须重启容器
3. **社区节点开关**：`docker-compose.yml` 中已设置 `N8N_COMMUNITY_PACKAGES_ENABLED=true`，确保自定义节点可被识别
4. **凭证配置**：使用 Notification 功能前，需在 n8n 中配置 Mailflow API Key 凭证

---

## 发布到 npm（让其他用户可搜索安装）

发布后，全球 n8n 用户可在 **设置 > 社区节点** 中搜索 `n8n-nodes-mailflow` 一键安装。

### 前置条件

- 已有 GitHub 账号（`shwanShare`）
- 已有 [npm](https://www.npmjs.com/) 账号（如没有，前往注册）

### 步骤 1：推送代码到 GitHub

```bash
cd /root/n8n/n8n-nodes-mailflow

# 初始化 Git 仓库
git init
git add .
git commit -m "feat: initial release v0.1.0"

# 关联远程仓库（需先在 GitHub 上创建同名仓库 n8n-nodes-mailflow）
git remote add origin https://github.com/shwanShare/n8n-nodes-mailflow.git
git branch -M main
git push -u origin main
```

> **提示**：推送时如果提示认证，可使用 GitHub Personal Access Token（PAT）。
> 前往 https://github.com/settings/tokens 创建 Token，推送时用 Token 作为密码。

### 步骤 2：登录 npm

```bash
npm login
```

按提示输入 npm 用户名、密码和邮箱。

### 步骤 3：发布到 npm

```bash
cd /root/n8n/n8n-nodes-mailflow
npm publish
```

`package.json` 中已配置 `"prepublishOnly": "npm run build"`，发布时会自动先编译。

### 步骤 4：验证发布

发布成功后，访问以下地址确认：

```
https://www.npmjs.com/package/n8n-nodes-mailflow
```

### 步骤 5（可选）：申请 n8n 官方认证

前往 [n8n Creator Portal](https://creators.n8n.io/nodes) 提交认证申请。
通过后节点将获得认证标记，在 n8n 节点面板中直接展示。

### 版本更新

后续更新版本时：

```bash
# 1. 修改 package.json 中的 version（如 0.1.0 -> 0.2.0）
# 2. 提交代码
git add .
git commit -m "feat: update to v0.2.0"
git push

# 3. 重新发布
npm publish
```
