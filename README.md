# Release Village

一个服务于中国的 Github Release Mirror 下载服务，用于给那些没有翻墙条件或者懒得翻墙的人下载 Github Release 文件的能力。

## Feature

- 默认缓存到国内的云存储商，依托国内云存储的优势，加快下载能力
- 易于操作，只需要在 Github Release 界面将 `https://github.com` 地址替换为 `https://relv.xgheaven.com.cn` 即可使用。（不排除后续更换简易域名的可能性）
- 支持集群部署，在仅需要一个数据库的情况下保证高可用和高并发

## Usage

1. 找到你想要下载的 Github Release 地址
2. 将 `https://github.com` 替换为 `https://relv.xgheaven.com.cn`
3. 选择需要下载的文件，点击 `mirrorDownloadLink` 地址即可下载

PS: 如果这个文件是第一次被下载，那么可能会下载缓慢（需要一遍缓存一遍发送给你），请耐心等待下载或者等待缓存完毕只有再尝试下载。

## Installation

当然，同样提供私有化部署方案，只需要 clone 本项目，并按照如下操作即可启动私有化版本：

（请设置好对应的环境变量）

```bash
$ npm install
$ npm run build
$ npm run start:prod
```

或者直接使用构建完成的 Docker 镜像：`xgheaven/release-village`

## Support

如果你觉得很有帮助，欢迎 Star，反馈以及提意见。

## Thanks for

感谢 [Nestjs](https://nestjs.com) 框架
