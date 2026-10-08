# Ninja Relay PWA 3

手机安装入口：https://d123450.github.io/ninja-relay-pwa/

3.0 使用 **同一局域网内的 Windows 客户端信令**，不再依赖 VDO.Ninja 公网信令、STUN 或 TURN。需要 Windows 3.0 配套客户端；旧二维码不能用于本版本，请重新扫描。

首次从 Windows“配对”页扫码，按本地页面完成电脑 HTTPS 证书信任。返回页面后配对信息自动带入，核对电脑名再确认。Safari 添加到主屏幕，等“已完整缓存”。手机应用提供“查找电脑”和内置扫码，配对后保存地址。Safari 无法在信任前任意广播扫描整个局域网，因此首次使用系统相机二维码引导。

GitHub 只提供程序静态文件，不接收音视频、配对密钥或信令。Windows 也提供相同的离线 PWA，本地入口完成设置后可完全不连接外网。建议使用电脑二维码提供的本地入口。

SDK、UI、二维码和扫码实现、工作线程、图标及许可全部缓存。以后启动读取本地资源；“设置 → 离线资源与版本”页手动检查、下载、启用或回退。不会自动启用新版本。Safari 清理网站数据后需要重新缓存。

此仓库只发布静态资源，release.json 包含 SHA-256 与长度。保留旧版目录，同一版本资源不可变。网页自身不能创建 Windows 虚拟设备。

第三方：
- VDO.Ninja SDK，Steve Seguin，MPL-2.0，固定提交 2a846f37512e711ca3ab9be8fb391a867d0614e9。未修改源码与许可随每版提供。
- qrcode 1.5.4，MIT。
- jsQR 1.4.0，MIT。

配套 Windows：Ninja Relay Camera 为 Windows 11 会话式 MF 摄像头；麦克风复用 VB-Audio 的 CABLE Output。关闭客户端时移除摄像头、停用线缆端点，内核音频驱动保留。