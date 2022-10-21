const nav = [
  { text: '前端', link: '/front-end/' },
  { text: '算法', link: '/algorithm/' },
  { text: '书', link: '/books/' },
  {
    text: '旅途',
    items: [
      { text: '每日记录', link: '/daily-record/' },
      { text: '健身&营养学', link: '/fitness/' },
      { text: '观影有感', link: '/movie-perception/' },
      { text: '动漫', link: '/anime/' }
    ]
  },
  {
    text: '关于我',
    items: [
      {
        text: '介绍',
        link: '/about-me/'
      },
      {
        text: '简历',
        link: 'https://juntingliu.github.io/resume/'
      }
    ]
  },
  { text: 'GitHub', link: 'https://github.com/JuntingLiu' }
];

module.exports = nav;
