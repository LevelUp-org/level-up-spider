const Crawler = require("crawler");
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
// const cssHandler = require('./handlers/cssHandler');

const crawler = new Crawler({ maxConnections : 10 });
// Queue just one URL, with default callback
// c.queue('https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md');

const baseUri = `https://cdn.jsdelivr.net/gh/LevelUp-org/Front-End-Interview-Notebook/`;
crawlerFactory(crawler, `${baseUri}JavaScript/JavaScript.md`, `JavaScript`, 2);
crawlerFactory(crawler, `${baseUri}Css/Css.md`, `Css`, 1);
crawlerFactory(crawler, `${baseUri}Html/Html.md`, `Html`, 0);

function crawlerFactory(crawler, uri, fileName, category_id) {
  crawler.queue([{
    uri,
    jQuery: true,
    callback: function (error, res, done) {
      if(error){
          console.log(error);
      } else {
        const topics = res.body.split('####');
        let result = '';
        topics.forEach((topic) => {
          if (!topic.includes('##') && topic.includes('```')) {
            const arr = topic.split('```');
            let title = arr.splice(0, 1)[0];
            const idx = title.indexOf('.');
            title = title.substring(idx + 1, title.length).trim();

            const contentArr = arr.join('\r\n').split('\r\n');
            const reg = new RegExp("[\\u4E00-\\u9FFF]+$","g");
            const contentResult = [];
            contentArr.forEach((ctn) => {
              if (!!ctn) {
                contentResult.push(ctn.trim());
                const lastWord = ctn.trim().substring(ctn.length - 1, ctn.length);
                const blacklist = [',', '，'];
                if (!reg.test(lastWord) && !blacklist.includes(lastWord) && !/^[a-zA-Z0-9]$/.test(lastWord)) { // 以中文结尾
                  contentResult.push('\n');
                }
              }
            })

            const item = {
              title: `#### ${utils.removeLinebreak(title)}`,
              content: contentResult.join(''),
              status: 0,
              label: fileName,
              category_id,
            }
            result = result.concat(JSON.stringify(item)).concat('\n');
          }
        })
        console.log(result);
        fs.writeFileSync(path.resolve(__dirname, 'data', `${fileName}.json`), result);
      }
      done();
    }
  }]);
}
