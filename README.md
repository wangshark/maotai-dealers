# 茅台经销商信息展示系统

## 项目概述
本项目旨在通过二维码为用户提供云南省茅台经销商信息查询服务。用户扫描定制矿泉水瓶身上的二维码后，可以浏览所有云南省的茅台经销商信息，并支持一键导航到经销商地址和一键拨打经销商电话。

## 功能特点
- 列表形式展示云南省所有茅台经销商信息
- 按地区筛选经销商信息（昆明市、大理、丽江、西双版纳等）
- 搜索经销商名称或地址
- 一键导航到经销商地址
- 一键拨打经销商电话
- 响应式设计，适配各种移动设备
- 收藏功能，方便用户保存常用经销商信息
- 浏览历史记录，记录用户最近查看的经销商
- 经销商详情页，展示更多信息和服务
- 地图功能，在地图上显示所有经销商位置

## 实现方案
经过分析，我们选择使用**静态网页 + JSON数据文件**的方式实现该项目，原因如下：
1. 开发周期短，实现简单
2. 无需后端服务器，降低维护成本
3. 可部署在任何静态网页托管服务上
4. 数据更新方便，只需修改JSON文件
5. 兼容性好，适配各种移动设备

## 技术栈
- HTML5 + CSS3 + JavaScript
- Font Awesome 图标库
- 高德地图API（用于地图展示和导航）
- 本地存储（localStorage，用于保存收藏和历史记录）
- 静态网页托管：GitHub Pages（免费）

## 项目结构
```
|- index.html           # 主页面
|- detail.html          # 经销商详情页
|- map.html             # 地图页面
|- about.html           # 关于页面
|- css/                 # 样式文件
|  |- style.css         # 主样式
|  |- detail.css        # 详情页样式
|  |- map.css           # 地图页样式
|  |- about.css         # 关于页样式
|- js/                  # 脚本文件
|  |- app.js            # 应用主逻辑
|  |- detail.js         # 详情页逻辑
|  |- map.js            # 地图页逻辑
|- data/                # 数据文件
|  |- dealers.json      # 经销商信息数据
|- images/              # 图片资源
|  |- logo.png          # 项目logo
|  |- banner.jpg        # 顶部横幅图片
|  |- marker.svg        # 地图标记图标
|  |- products/         # 产品图片
|- DEPLOY.md            # 部署指南
```

## 界面设计
- **简洁现代界面**：清晰展示经销商信息，突出重要内容
- **列表展示**：以列表形式展示经销商信息，每项包含序号、名称、地址、电话
- **筛选功能**：顶部提供地区筛选标签，方便用户快速筛选
- **搜索功能**：支持按名称或地址搜索经销商
- **快捷操作**：每个经销商条目右侧提供导航和拨打电话的快捷按钮
- **收藏功能**：用户可以收藏常用的经销商信息
- **历史记录**：自动记录用户浏览过的经销商
- **详情页**：点击经销商可查看详细信息、服务和推荐产品

## 使用说明
1. 扫描矿泉水瓶身上的二维码
2. 浏览云南省茅台经销商列表
3. 可通过顶部筛选标签按地区筛选经销商
4. 可通过搜索框搜索经销商名称或地址
5. 点击导航图标可打开地图并导航到经销商位置
6. 点击电话图标可直接拨打经销商电话
7. 点击心形图标可收藏/取消收藏经销商
8. 点击"我的收藏"标签查看已收藏的经销商
9. 点击"浏览历史"标签查看最近浏览的经销商
10. 点击经销商可查看详情页
11. 点击"查看地图"按钮可在地图上查看所有经销商位置

## 二维码生成
二维码内容为本项目部署后的URL地址，可使用任意二维码生成工具生成。

## 项目维护
经销商信息更新只需修改`data/dealers.json`文件即可，格式示例：
```json
[
  {
    "name": "昆明市五华区茅台专卖店",
    "address": "云南省昆明市五华区人民中路17号",
    "phone": "0871-63612345",
    "location": {
      "latitude": 25.042609,
      "longitude": 102.704206
    }
  }
]
```

## 项目优化计划
1. **数据丰富**：
   - 添加经销商营业时间、特色服务等更多信息
   - 添加经销商实景照片
   - 提供更多茅台产品信息和价格

2. **个性化功能**：
   - 添加用户备注功能
   - 支持自定义排序
   - 添加提醒功能

3. **性能优化**：
   - 实现数据缓存，减少网络请求
   - 图片懒加载，提高页面加载速度
   - 代码压缩和合并，减小文件体积

4. **数据分析**：
   - 添加访问统计功能，记录用户行为
   - 生成热门经销商排行榜
   - 提供数据分析报表，帮助经销商改进服务

## 当前版本
v1.1.0 - 功能增强版本（2023年12月20日）
- 新增经销商详情页，展示更多信息
- 新增收藏功能，方便保存常用经销商
- 新增浏览历史功能，记录最近查看的经销商
- 优化UI界面，提升用户体验

v1.0.0 - 基础功能版本（2023年12月15日）
- 实现经销商列表展示
- 支持按地区筛选和搜索
- 提供一键导航和拨打电话功能
