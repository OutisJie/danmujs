# danmujs
webpack+react hooks+TS 从零配置的项目，配置了 less，ts,lint。可作为模板使用

## run
```
  npm run install
  npm run start
```

## scripts
```
  npm run biuld // 打包
  npm run eslint-fix 
  precommit-msg // git commit 时自动校验 message 格式
```

## style
本项目使用 less + css modules,

## 数据状态管理
使用 hooks 实现的 east-store 来做状态管理，源码在my_modules/east-store。
样例可以在 page/doc/store 看到，也可以实现全局 store，后续更新

## mini pack
只打包需要运行的页面。。。

## webpack HMR
模块热替换是 webpack 主要功能之一，它不依赖任何的框架，能在代码更新时自动更新界面而不需要手动刷新页面，


// react-hot-loader利用了 webpack HMR 的 API，它给 React 的每个子组件都使用 hot.accept 封装了一遍，因此可以做到细粒度的热更新，而且还托管了组件的state。
// Hook reloading is relaying on babel plugin! This example don't support hooks reload. If you want to have hook reloading, use typescript with babel.
