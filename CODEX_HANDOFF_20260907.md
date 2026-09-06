# 李昊宇个人站 — Codex 跨电脑交接（2026-09-07）

更新时间：2026-09-07（Asia/Shanghai）

## 接手时先做什么

1. 先完整阅读本文档，再阅读根目录已有的 `CODEX_HANDOFF_20260904.md`；后者记录了 9 月 5–6 日已完成的视觉与交互校准。
2. 不要重建页面、替换现有素材、改变信息架构，也不要恢复已经被用户否定的个人卡版本。
3. 修改前先检查 `index.html`、`portfolio.css`、`portfolio.js`、`nav-overrides.css`。`portfolio.css` 后半段有多轮精确覆盖，必须做最小改动。
4. 每次修改后至少验证 1366×768、1440×900（笔记本 100% 缩放）和 1920×1080。

## 项目与仓库

- 项目名：`leecoding`
- GitHub：<https://github.com/782825307qq-a11y/leecoding>
- 默认分支：`main`
- 2026-09-07 首次完整上传提交：`4833db5 Deploy leecoding portfolio website`
- 网站是纯静态站，根目录就是部署目录，不需要构建命令。
- 远程仓库原名为 `lee-coding`，2026-09-07 已在 GitHub 改为 `leecoding`。

## 本地启动

在项目根目录执行：

```bash
python3 -m http.server 4181 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4181/index.html?rev=20260907-7#top
```

不要用 `file://` 直接双击 `index.html` 验证。3D、模块脚本和部分资源依赖 HTTP 环境，直接打开文件会造成比例异常、资源不加载或开屏扫光缺失。

## 2026-09-07 最新状态

### 1. 顶部导航右侧流体按钮

- 已按用户 Figma 原稿的版式保留头像、`Lee.Coding*` 与 `Logic meets aesthetics`，不是普通系统字体按钮。
- 在原稿基础上增加黑色流体渐变，文字与头像结构没有被替换。
- 按钮位于主导航右侧并与主导航垂直居中；响应式缩放使用整体等比例缩放。
- 只在第一屏出现。下滑离开首屏后渐隐并禁用交互，上滑回到首屏时重新显示。
- 主要代码：`index.html` 的 `.nav-fluid-button`，`portfolio.css` 的流体按钮样式，`portfolio.js` 的 `is-first-screen-hidden` 切换。

### 2. 开屏回看与动画策略

- 首次打开页面时播放线框原型扫光、翻屏和视角回正。
- 用户离开首屏再上滑返回时，只恢复已完成状态的 3D 渲染器，不重新播放完整开屏动画。
- 恢复时会执行 `deactivate()` / `activate()`，等待新控制器和屏幕纹理就绪后直接 `setProgress(1)`，用于修复回看时屏幕变白。
- 扫光与翻屏保持原速度；首次入场后半段视角回正按 `1.25×` 加速。
- 主要代码：`portfolio.js` 的 `restoreMockupRenderer()` 与 `updateHeroStory()`。

### 3. 已保留的用户最终选择

- 个人卡保持原照片正面、作品集封面背面、紫色挂绳及原有摆动物理效果。
- 目录页无拖拽、无左右切换，只保留悬浮散开与单击进入项目。
- 简历→目录、目录→联系均保留柔和向上弥散的章节过渡；联系页顶部必须保持黑色，不能带入目录蓝色。
- 顶部导航图标为 Figma 下载的完整图标组；未选中 70% 透明度，选中 100%。联系图标的外框与省略号必须作为一个整体等比例缩放。
- 项目页顶部留白已统一：精品就业班与悟牛为 `#F2F4F7`；首图从分界点下方开始渐显与轻微模糊，不能出现硬分界线。

### 4. 项目内容映射

- 精品就业班：`case.html?project=employment`，PDF 4–24 页，共 21 页。
- 海豹上岸游记：`seal.html`，原互动页后接 PDF 25–32 页，共 8 页。
- 智能音箱：`case.html?project=speaker`，PDF 33–38 页，共 6 页。
- 悟牛 APP：`case.html?project=wuniu`，PDF 39–52 页，共 14 页。
- 当前网页图片来自用户后来提供的高清 `protfolio.pdf`，保持 2560px 宽导出，不要换回压缩版。

## 当前资源版本

- `portfolio.css?v=20260907-6`
- `nav-overrides.css?v=20260906-5`
- `portfolio.js?v=20260907-7`
- `assets/portfolio/lanyard-island/lanyard.js?v=20260906-4`
- `case-gallery.css?v=20260906-8`
- `case-gallery.js?v=20260906-2`
- `styles.css?v=20260906-7`
- `assets/portfolio/mckp/scene.json?v=20260905-1`

改动后递增对应查询版本号，避免浏览器缓存导致误判。

## 部署说明

- 之前 Vercel 出现 `404 NOT_FOUND` 的根因是上传到 GitHub 的仓库只有 `.gitattributes`，没有网站文件。
- 2026-09-07 已通过 GitHub Desktop 完整提交并推送网站文件，GitHub Desktop 显示 `push complete`。
- GitHub 仓库随后从 `lee-coding` 改名为 `leecoding`。如果 Vercel 没有自动跟随改名，需要在 Vercel 项目设置中重新选择 `782825307qq-a11y/leecoding`，并确认 Root Directory 为仓库根目录、Build Command 为空、Output Directory 留空。
- 部署验证必须检查首页、四个项目入口、`seal.html`、高清项目图与 3D 开屏资源，不能只看首页状态码。

## 继续开发的最低验证顺序

1. 新标签从 `#top` 冷启动，确认线框扫光只播放一次，3D 屏幕不是白屏。
2. 下滑离开首屏，确认右侧流体按钮消失；上滑回来按钮恢复，但开屏动画不重播。
3. 检查封面→简历→目录→联系的过渡，不能出现横向硬线或突然闪黑。
4. 检查目录四卡只有 hover 与单击，无拖拽/滑动/方向键切换。
5. 逐张点击四个项目，确认页数为 21 / 8 / 6 / 14，且返回目录可用。
6. 检查 100% 浏览器缩放下的 1366×768、1440×900 和 1920×1080 布局。
7. 检查控制台没有新增 error。若长时间反复重载出现 WebAssembly 内存或 WebGL context lost，关闭测试标签并新开，不要先删素材或改第三方运行时。

## 同步纪律

- GitHub 的 `main` 是唯一主版本；另一台 Codex 开始前先拉取，结束后提交并推送。
- 不要让两台 Codex 同时修改 `portfolio.css` 或 `portfolio.js`。
- 每次交付都更新本文件中的日期、资源版本、提交号与未完成事项。
