# 微信访问限制解决方案

## 问题说明
微信对 GitHub Pages (github.io) 域名有访问限制，导致扫码后无法直接访问。

## 解决方案

### 方案1：使用 Vercel 部署（推荐，免费且快速）

**优点：**
- 完全免费
- 部署简单，几分钟完成
- 支持自定义域名
- 国内访问速度快
- 微信通常不会拦截

**步骤：**
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 导入你的 GitHub 仓库 `wangshark/maotai-dealers`
5. 点击 "Deploy"
6. 等待部署完成，获得新地址（如：`https://maotai-dealers.vercel.app`）
7. 用新地址生成二维码

### 方案2：使用 Netlify 部署（推荐，免费）

**优点：**
- 完全免费
- 部署简单
- 支持自定义域名
- 微信通常不会拦截

**步骤：**
1. 访问 https://www.netlify.com
2. 使用 GitHub 账号登录
3. 点击 "Add new site" -> "Import an existing project"
4. 选择你的 GitHub 仓库
5. 点击 "Deploy site"
6. 等待部署完成，获得新地址（如：`https://maotai-dealers.netlify.app`）
7. 用新地址生成二维码

### 方案3：使用自定义域名（需要购买域名）

**优点：**
- 完全控制
- 专业形象
- 微信不会拦截自己的域名

**步骤：**
1. 购买域名（如：`maotai-dealers.com`）
2. 在 GitHub Pages 设置中添加自定义域名
3. 配置 DNS 解析
4. 用自定义域名生成二维码

### 方案4：使用国内 CDN 服务

**选项：**
- 阿里云 OSS + CDN
- 腾讯云 COS + CDN
- 七牛云

**优点：**
- 国内访问速度快
- 微信不会拦截

**缺点：**
- 需要实名认证
- 可能需要付费

## 推荐方案

**最推荐：使用 Vercel 或 Netlify**
- 免费
- 部署简单
- 微信通常不会拦截
- 几分钟就能完成

## 注意事项

1. 部署到新平台后，需要更新二维码
2. 如果使用自定义域名，需要配置 SSL 证书（Vercel/Netlify 自动提供）
3. 建议同时保留 GitHub Pages 作为备份
