const fs = require('fs')
const path = require('path')
const { mkdirSync, sortDefault, getSortRule, getFileContent } = require('./utils')
// 默认根据目录下的README.md文件内容进行排序
function sort(rootDir, target, sortFn) {
    if(!Array.isArray(target)) return target
    const _rules = []
    const sortList = (a, b) => {
        if(sortFn) return sortFn(a, b)
        return sortDefault(a, b)
    }
    target.forEach(item => {
        const fileUrl = item.link
        const filePath = path.resolve(rootDir, '.' + fileUrl, 'README.md')
        const content = getFileContent(filePath)
        let rule = getSortRule(filePath, fileUrl)
        rule.origin = item
        const res = content.match(/---(\n|\s)*autoNavSort:\s*(-?[0-9]*)(\n|\s)*---/)
        if(res) {
            // console.log('sort', fileUrl, Number(res[2]))
            rule.sort = Number(res[2])
        }  
        _rules.push(rule)
    })
    // console.log('rules', _rules)
    _rules.sort(sortList)
    return _rules.map(i => i.origin)
}
function genNavbar(sourceDir, targetPath, target = [], sortFn) {
    if(!sourceDir) throw new Error('sourceDir参数不允许为空')
    if(!targetPath) throw new Error('targetPath参数不允许为空')
    mkdirSync(targetPath)
    // 初始化分级目录，其他级别为子数组
    const files = fs.readdirSync(sourceDir)
    const dirNameList = files.filter(item => item !== 'README.md' && item.indexOf('.') !== 0)
    dirNameList.forEach(key => {
        // 初始化第一级为数组的第一项，参考官方文档   
        target.push({
            activeMatch: `/${encodeURI(key)}/`,
            link: `/${key}/`,
            text: key
        })
    })
    target = sort(sourceDir, target, sortFn)

    // console.log('target', target)
    // 写入文件
    const content = `module.exports = ${JSON.stringify(target, undefined, 2)}`;
    fs.writeFile(targetPath, content, { encoding: 'utf8' }, err => {console.log(err);});     
}

module.exports = genNavbar