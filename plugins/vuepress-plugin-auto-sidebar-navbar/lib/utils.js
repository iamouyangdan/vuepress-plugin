const fs = require('fs')
const path = require('path')
const mkdirSync = (url) => {
    console.log('url', url)       
    const dirPath = path.resolve(url, '..')
   
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath);
        } catch(e) {
            mkdirSync(dirPath)
        }    
    }
}

const sortDefault = (a, b) => {
    if (a.sort !== b.sort) return a.sort < b.sort ? -1 : 1
    if (a.name !== b.name) return a.name < b.name ? -1 : 1
    else if (a.createTime !== b.createTime) return a.createTime < b.createTime ? -1 : 1
    else if (a.updateTime !== b.updateTime) return a.updateTime < b.updateTime ? -1 : 1
}

const getSortRule = (filePath, fileUrl) => {           
    const fileStat = fs.statSync(filePath)
    const rule = {url: fileUrl, name: fileUrl.slice(fileUrl.lastIndexOf('/') + 1, fileUrl.length),  sort: 0, createTime: fileStat.birthtime, updateTime: fileStat.mtime}
    return rule
}

const getFileContent = (filePath) => {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' })  
    return content
}
module.exports = {
    mkdirSync,
    sortDefault,
    getSortRule,
    getFileContent
}