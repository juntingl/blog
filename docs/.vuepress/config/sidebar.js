const sidebar = {
  "/front-end/" : [
    {
      title: 'JavaScript',
      children: [
        '/front-end/js/basic',
        '/front-end/js/in-depth-knowledge.md'
      ]
    },
    {
      title: 'Vue',
      children: [
        ['/front-end/vue/', '介绍'],
        '/front-end/vue/basic',
      ]
    },
    {
      title: 'React',
      children: [
        ['/front-end/react/', '介绍'],
        '/front-end/react/basic',
      ]
    }
  ],
  "/algorithm/": [
    {
      title: '数据结构',
      children: [
        ['/algorithm/', '介绍']
      ]
    }
  ],
  "/books/": [
    ['/books/', '介绍'],
    {
      title: '深入理解 ES6',
      children: [
        '/books/understanding-es6/01-Block-Bindings',
        '/books/understanding-es6/02-Strings-and-Regular-Expressions',
        '/books/understanding-es6/03-Functions',
        '/books/understanding-es6/04-Objects',
        '/books/understanding-es6/05-Destructuring'
      ]
    }
  ],
  "/daily-record/": [
    {
      title: '科技趣闻',
      children: [
        ['/daily-record/', '每日一文']
      ]
    },
    {
      title: '资源索引',
      children: [
        ['/daily-record/resource-index/', '社区资源']
      ]
    }
  ],
  "/fitness/": [
    {
      title: '健身',
      children: [
        ['/fitness/keep/', '相关知识']
      ]
    },
    {
      title: '营养学知识',
      children: [
        ['/fitness/nutriology/', '相关知识']
      ]
    }
  ],
  "/movie-perception/": [
    {
      title: '观影有感',
      children: [
        ['/movie-perception/', '观影记录']
      ]
    }
  ],
  "/anime/": [
    {
      title: '动漫',
      children: [
        ['/anime/', '宅说']
      ]
    }
  ]
};

module.exports = sidebar;
