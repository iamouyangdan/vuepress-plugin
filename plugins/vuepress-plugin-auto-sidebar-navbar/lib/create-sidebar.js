const fs = require('fs')
const path = require('path')
const { mkdirSync, sortDefault, getSortRule, getFileContent } = require('./utils')
// 递归生成目录结构
function genDirStructure(rootDir, targetDir, subDirName, list = []) {
    // 搜索当前目录为所在数组的第几项，若未搜索到，说明为新的目录，此时数组新建一项用来保存新目录
    let i = list.findIndex(i => i.text === subDirName)   
    if(i === -1) i = list.length
    list[i] = list[i] || {
        text: subDirName,
        children: []
    }
    // 读取目录
    const dir = path.resolve(rootDir, targetDir, subDirName)
    const files = fs.readdirSync(dir)
    files.forEach(key => {
        // targetDir为空时表示为第一级目录
        const subPath = !targetDir ? subDirName : `${targetDir}/${subDirName}`
        // 判断是否为目录，若为目录，需要递归处理
        const subDir = path.resolve(dir, key)     
        const res = fs.statSync(subDir)            
        // 当前路径为目录时，递归处理数组
        if(res.isDirectory()){
            genDirStructure(rootDir, subPath, key, list)
            return 
        }    
        // 过滤README.md和非md文件
        if(!/\.md$/.test(key)) return ;
        
        const name = `/${subPath}/${key}`
        list[i].children.push(name)
    })
}


// 对二级菜单项列表排序
function sortSidebar(rootDir, target = {}, sortFn) {
    // 默认依次对sort、name、createTime、updateTime多字段按从小到大的顺序排序
    const sortList = (a, b) => {
        if(sortFn) return sortFn(a, b)
        return sortDefault(a, b)
    }
    Object.keys(target).forEach(key => {
        const items = target[key] || []
        items.forEach(item => {
            const _rules = []
            item.children.forEach(fileUrl => {
                const filePath = path.resolve(rootDir, '.' + fileUrl)
                const content = getFileContent(filePath)
                const rule = getSortRule(filePath, fileUrl)
                const res = content.match(/---(\n|\s)*autoSort:\s*(-?[0-9]*)(\n|\s)*---/)
                // 默认将README置顶
                if(rule.name === 'README.md') rule.sort = -9999

                if(res) {
                    // console.log('sort', fileUrl, Number(res[2]))
                    rule.sort = Number(res[2])
                }              
                _rules.push(rule)
            })
            _rules.sort(sortList)
            item.children = _rules.map(i => i.url)
        })
    })
}

function genSidebar(sourceDir, sidebarPath, target = {}, sortFn) {
    if(!sourceDir) throw new Error('sourceDir参数不允许为空')
    if(!sidebarPath) throw new Error('sidebarPath参数不允许为空')

    mkdirSync(sidebarPath)
    // 初始化分级目录，其他级别为子数组
    const files = fs.readdirSync(sourceDir)
    const dirNameList = files.filter(item => item !== 'README.md' && item.indexOf('.') !== 0)
    dirNameList.forEach(key => {   
        // 初始化第一级为数组的第一项，参考官方文档  
        const children = [{ text: key, children: [] }]
        genDirStructure(sourceDir, '', key, children)  
        target[`/${encodeURI(key)}/`] = children
    })
    sortSidebar(sourceDir, target, sortFn)
    // 写入文件
    const content = `module.exports = ${JSON.stringify(target, undefined, 2)}`;
    fs.writeFile(sidebarPath, content, { encoding: 'utf8' }, err => {console.log(err);});     
}

module.exports = genSidebar