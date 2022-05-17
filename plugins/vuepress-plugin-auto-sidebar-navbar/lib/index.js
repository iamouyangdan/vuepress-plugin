const genSidebar = require('./create-sidebar')
const genNavbar = require('./create-navbar')
const path = require('path')
// 可接受 autoSort参数和自定义排序函数
// 排序重启项目时生效
const createSidebar = (options = {}) => {
    return (app) => {
        console.log('app.dir', app.dir.source())
        const sourceDir = app.dir.source()
        const sidebarUrl = options.sidebarUrl || '.vuepress/sidebar.js'
        const navbarUrl = options.navbarUrl || '.vuepress/navbar.js'
        const sidebarPath = path.resolve(sourceDir, sidebarUrl)
        const navbarPath = path.resolve(sourceDir, navbarUrl)
        if(!options.skipSidebar) {
          genSidebar(sourceDir, sidebarPath, {}, options.sortFn)
        }
        if(!options.skipNavbar) {
          genNavbar(sourceDir, navbarPath, [], options.sortFn)
        }
        return {
          name: 'vuepress-plugin-auto-sidebar-navbar',
          // ...
        }
    }
}

module.exports = createSidebar