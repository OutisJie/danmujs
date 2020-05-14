# webpack HMR
模块热替换是 webpack 主要功能之一，它不依赖任何的框架，能在代码更新时自动更新界面而不需要手动刷新页面，


// react-hot-loader利用了 webpack HMR 的 API，它给 React 的每个子组件都使用 hot.accept 封装了一遍，因此可以做到细粒度的热更新，而且还托管了组件的state。
// Hook reloading is relaying on babel plugin! This example don't support hooks reload. If you want to have hook reloading, use typescript with babel.
