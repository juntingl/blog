const nav = require('./config/nav');
const sidebar = require('./config/sidebar');

module.exports = {
  title: '修',
  description: '一步一步，似魔鬼的步伐',
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  // 部署到github相关的配置
  base: '/Blog/',
  markdown: {
    lineNumber: true, // 显示行号
  },
  themeConfig: {
    // 将同时提取 markdown 中 h2 和 h3 标题，显示在侧边栏上。
    sidebarDepth: 0,
    // 文档更新时间：每个文件 git 最后提交的时间
    lastUpdated: 'Last Updated',
    // 导航栏
    nav,
    // 侧边栏
    sidebar
  }
};
