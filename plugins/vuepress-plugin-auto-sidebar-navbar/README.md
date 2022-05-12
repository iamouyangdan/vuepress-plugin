# vuepress-plugin-auto-sidebar-navbar
## 介绍（Introduction）
这是为 vuepress v2 自动生成侧边栏和导航栏的插件。 插件支持功能如下：

1. 自动生成sidebar和navbar。
2. 根据文件内容自动排序。
3. 支持自定义排序方法。

## 安装（Install）

```bash
## vuepress v2
npm i vuepress-plugin-auto-sidebar-navbar -D
```
## 快速使用（Usage）

VuePress v2](https://v2.vuepress.vuejs.org/zh/) 不再支持插件修改 sidebar，所以你需要在`.vuepress/config.js`自行引入生成的 `sidebar.js` 和`navbar.js`文件。

```js
const { defaultTheme } = require('@vuepress/theme-default')
const navbar = require('./navbar.js')
const sidebar = require('./sidebar.js')
module.exports = {
  plugins: [
    ...,
    require('vuepress-plugin-auto-sidebar-navbar')({})
  ],
  theme: defaultTheme({
    ...,
    navbar, 
    sidebar, 
  })
}
```
## 自动排序

1. `sidebar`（侧边栏）根据md文件内容排序，排序规则为：`autoSort: {number}`中的`number`从小到大排序，其中`number`默认为 0。
2. `navbar`（导航栏）根据目录中的README.md文件内容排序，排序规则为：`autoNavSort: {number}`中的`number`从小到大排序，其中`number`默认为 0。

以`sidebar`为例，`a.md`内容如下：

```md
---
autoSort: -1
---
# 文件a
```

`b.md`内容如下：

```md
## 文件b
```

则`sidebar`显示内容：

```html
文件a
文件b
```

## 自定义规则排序

在`.vuepress/config.js`中传入参数sortFn：

```js
module.exports = {
  ...,
  plugins: [
    ...,
  	require('vuepress-plugin-auto-sidebar-navbar')({
  		sortFn: (a, b) => {
  		if (a.sort !== b.sort) return a.sort < b.sort ? -1 : 1
        	if (a.name !== b.name) return a.name < b.name ? -1 : 1
        	else if (a.createTime !== b.createTime) return a.createTime < b.createTime ? -1 : 1
        	else if (a.updateTime !== b.updateTime) return a.updateTime < b.updateTime ? -1 : 1
		},
	})
  ],
}
```

