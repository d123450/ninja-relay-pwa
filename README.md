# Ninja Relay PWA

手机入口：**https://d123450.github.io/ninja-relay-pwa/**

在 iPhone Safari 打开，等待“已完整缓存”，然后用分享菜单“添加到主屏幕”。使用 Windows 接收端生成的配对链接；如果是旧版的局域网链接，把完整链接粘贴到手机应用的“连接”页即可，不需要访问那个局域网地址。

GitHub Pages 提供公开 HTTPS 程序资源，不存储摄像头画面、麦克风音频或配对密钥。配对内容放在 URL 的 `#pair=` 片段，只在设备端解析。媒体使用 VDO.Ninja 信令协商 WebRTC 连接。

首次安装保存并校验整个发布版本，包括 SDK、界面、图标及音频工作线程。以后离线可打开；连接设备和推流仍需网络。手机应用“版本”页依次选择“检查新版本 → 下载并校验 → 启用并重启”，不会自动下载应用更新。更新失败保留当前版本，启动失败可回退。

本仓库只包含已构建的 PWA 静态文件。`main` 分支根目录通过 GitHub Pages 发布，`.nojekyll` 保留普通静态文件处理。`release.json` 为版本及资源 SHA-256 清单。发布时保留旧版本目录，先上传完整新版本，再更新清单；同一版本号的资源不可变。

## 第三方组件

- [VDO.Ninja SDK](https://github.com/steveseguin/ninjasdk)：MPL-2.0，固定提交 `2a846f37512e711ca3ab9be8fb391a867d0614e9`。未修改源码和许可证随各版本放在 `releases/<版本>/vendor/vdoninja-sdk.js` 与 `vendor/LICENSE`。
- [node-qrcode](https://github.com/soldair/node-qrcode)：MIT，1.5.4，许可证随各版本放在 `vendor/qrcode-LICENSE.txt`。

Windows 虚拟摄像头与麦克风由配套 C# 接收端及 UnityCapture / VB-CABLE 提供，网页本身不能注册 Windows 虚拟设备。
