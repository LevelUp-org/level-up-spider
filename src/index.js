const Crawler = require("crawler");
const fs = require('fs');
const path = require('path');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
      if(error) {
          console.log(error);
      } else {
        var $ = res.$;
        // $ is Cheerio by default
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
                title: `<h4>${removeLinebreak(node.children[1].data)}</h4>`,
                content: '',
                id: +new Date(),
                status: 0,
                label: 'css',
                category_id: 0,
            };
          }

          if (isValid) {
            if (node.name === 'p') {
                topic.content += `<p>${removeLinebreak(node.children[0].data)}</p>`;
            }

            if (node.name === 'pre') {
                topic.content += `<pre><code>${removeLinebreak(node.children[0].children[0].data)}</code></pre>`;
            }
          }
      });

      fs.writeFileSync(path.resolve(__dirname, 'data', 'css.json'), result);
      console.log('写入完成！');
    }
    done();
  }
});

function removeLinebreak(str) {
  if (!str) return '';
  const temp = replaceAll(str, '\n', '');
  return replaceAll(temp, '\t', '');
}

function replaceAll(str, s1, s2) {
  return str.replace(new RegExp(s1, "gm"), s2);
}

// Queue just one URL, with default callback
c.queue('https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md');

