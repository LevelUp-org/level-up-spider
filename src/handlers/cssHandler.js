const fs = require('fs');
const path = require('path');
const utils = require('../utils');

exports.cssHandler = function($) {
  const content = Array.from($(".markdown-body").children());
  let isValid = false;
  let result = '';
  let topic = {
    title: '',
    content: '',
    id: 0,
  };
  content.forEach((node) => {
    // 从第一个H4标签开始向下查找
    if (node.name === 'h4') {
      if (topic.title && topic.content) {
        result = result.concat(JSON.stringify(topic)).concat('\n');
      }
      isValid = true;

      topic = {
          title: `<h4>${utils.removeLinebreak(node.children[1].data)}</h4>`,
          content: '',
          id: +new Date(),
          status: 0,
          label: 'css',
          category_id: 0,
      };
    }

    if (isValid) {
      if (node.name === 'p') {
          topic.content += `<p>${utils.removeLinebreak(node.children[0].data)}</p>`;
      }

      if (node.name === 'pre') {
          topic.content += `<pre><code>${utils.removeLinebreak(node.children[0].children[0].data)}</code></pre>`;
      }
    }
  });

  fs.writeFileSync(path.resolve(__dirname, 'data', 'css.json'), result);
  console.log('写入完成！');
}