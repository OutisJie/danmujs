/* eslint-disable no-use-before-define */
/* eslint-disable no-cond-assign */

/**
 * 必需由 npm 来启动 script 命令才能获取到此参数
 * npm run watch-client-mini [...要编译的页面路径, 从'pages/'后面开始]
 * eg: npm run watch-client-mini nofity banner // 生成 routes.mini.tmp.js 结果如下
 *
  import React from 'react';
  import { Route } from 'react-router';
  import Container from './container';
  import * as notify from './pages/notify';
  import * as banner from './pages/banner';

  const routes = (
    <Route path="/" component={Container}>
      <Route path="notify/list" component={notify.list} />
      <Route path="notify/regularList" component={notify.regularList} />
      <Route path="notify/draftList" component={notify.draftList} />
      <Route path="notify/category" component={notify.categoryList} />
      <Route path="notify/checkList" component={notify.checkList} />
      <Route path="banner/list" component={banner.list} />
    </Route>
  );
  export default routes;
 */

console.log('*** 请使用 npm 运行脚本 ***');

const fs = require('fs')
const path = require('path')

// 获取需要编译的页面
let pages = [];
try {
  const argvs = JSON.parse(process.env.npm_config_argv);
  if (Array.isArray(argvs.remain) && argvs.remain.length > 0) {
    pages = argvs.remain;
    console.log('传入的页面参数:', pages);
  } else {
    exit('没有参入页面参数或未使用 npm 运行脚本');
  }
} catch (e) {
  exit(e.message);
}

const filePathFnc = p => path.resolve(__dirname, '../src/common', p);
const filePath = {
  index: [filePathFnc('../client/index.js'), filePathFnc('../client/index.mini.tmp.js')],
  app: [filePathFnc('app.js'), filePathFnc('app.mini.tmp.js')],
  routes: [filePathFnc('routes.js'), filePathFnc('routes.mini.tmp.js')],
};

// 生成 app.mini.tmp.js
function geneMiniIndexJs() {
  const file = fs.readFileSync(filePath.index[0], { encoding: 'utf-8' });
  const fileStr = file.replace(/\/common\/app/g, '/common/app.mini.tmp');
  fs.writeFileSync(filePath.index[1], fileStr, { encoding: 'utf-8' });
  console.log('生成 index.mini.tmp.js');
}
geneMiniIndexJs();

// 生成 app.mini.tmp.js
function geneMiniAppJs() {
  const file = fs.readFileSync(filePath.app[0], { encoding: 'utf-8' });
  const fileStr = file.replace(/\/routes/, '/routes.mini.tmp');
  fs.writeFileSync(filePath.app[1], fileStr, { encoding: 'utf-8' });
  console.log('生成 app.mini.tmp.js');
}
geneMiniAppJs();

const ruotesFile = fs.readFileSync(filePath.routes[0], { encoding: 'utf-8' });
const Regs = {
  import: {
    text: pagePath => new RegExp(`import .*? from .*?${pagePath}(/.*?)?["']`, 'g'),
  },
  component: {
    name: /import.*? (\S+)\s+from/,
    route: compName => new RegExp(`<Route.*?component={${compName}\\s*[}\\.].*?/>`, 'g'),
  },
};
const routesJsTpl = `
  import React from 'react';
  import { Route } from 'react-router';
  import Container from './container';
  {{IMPORT_VAR}}

  const routes = (
    <Route path="/" component={Container}>
      {{COMP_VAR}}
    </Route>
  );
  export default routes;
`;

// 生成 routes.mini.tmp.js
function geneMiniRoutesJs() {
  let insertImp = '';
  let insertComp = '';

  const [impTexts, compTextsArr] = getRoutesText();
  insertImp += `${impTexts.map(i => i.join('\n')).join('\n')}\n`;
  insertComp += `${compTextsArr.map(i => i.join('\n')).join('\n')}\n`;

  const content = routesJsTpl
    .replace('{{IMPORT_VAR}}', insertImp)
    .replace('{{COMP_VAR}}', insertComp);
  fs.writeFileSync(filePath.routes[1], content, { encoding: 'utf-8' });
  console.log('生成 routes.mini.tmp.js');
}
geneMiniRoutesJs();

// 获取 routes 内需要加入的语句
function getRoutesText() {
  const res = [[], []];
  pages.forEach((pagePath) => {
    console.log('-', pagePath);

    // 获取页面 import 语句
    const impTextArr = [];
    const impReg = Regs.import.text(pagePath);
    let tmp1;
    while ((tmp1 = impReg.exec(ruotesFile))) {
      impTextArr.push(tmp1[0]);
    }
    if (impTextArr.length === 0) {
      exit(' * 未匹配到页面 import 语句');
    }
    console.log(` * 页面 import 语句 (${impTextArr.length}句):`, impTextArr);

    // 获取 react 组件名称
    const compNames = []
    impTextArr.forEach((impText) => {
      const compName = Regs.component.name.exec(impText);
      // if (!compName || !compName[1]) {
      //   exit(' * 未获取到页面对应的组件名称');
      // }
      compNames.push(compName[1])// 组件名
    })
    console.log(` * 页面组件名称 (${compNames.length}个):`, compNames);

    // 获取组件对应 route 组件语句
    const compArr = [];
    compNames.forEach((compName) => {
      const compReg = Regs.component.route(compName);
      let tmp2;
      while ((tmp2 = compReg.exec(ruotesFile))) {
        compArr.push(tmp2[0]);
      }
    })
    if (compArr.length === 0) {
      exit(' * 未获取到路由组件');
    }
    console.log(` * 页面组件路由 (${compArr.length}句):`, compArr);

    res[0].push(impTextArr);
    res[1].push(compArr);
  });
  return res;
}

function exit(msg) {
  console.log(msg);
  process.exit(1);
}
