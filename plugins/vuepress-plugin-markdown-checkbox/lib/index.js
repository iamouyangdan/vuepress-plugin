// var taskLists = require('./markdow-it-tasklist');
// var taskLists = require('./demo');
// const taskLists = require('markdown-it-checkbox')
// const taskLists = require('markdown-it-task-checkbox')

const taskLists = require('./core')

// 可接受 autoSort参数和自定义排序函数
// 排序重启项目时生效
const extendsMarkdowCheckbox = ({enabled = true, label = true, labelAfter = false} = {}) => {
    return (app) => {
        console.log('app.dir', app.dir.source())
 
        return {
          name: 'vuepress-plugin-markdown-checkbox',
          extendsMarkdown: (md) => {
            md.use(taskLists, { enabled, label, labelAfter })
          }
          // ...
        }
    }
}

module.exports = extendsMarkdowCheckbox