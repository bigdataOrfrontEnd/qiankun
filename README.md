# qiankun

全 react 搭建乾坤

## 主应用搭建

主要是注册 qiankun yarn add qiankun

```js
index.tsx（webpack的入口函数）中引入
import { registerMicroApps, start } from "qiankun";
const menu=[ {
    name: "app-test",
    entry: "//localhost:20000/",
    container: "#root",
    activeRule: "/app-test",
  },]
registerMicroApps(menu);
start()
```

到此著应用搭建完成
剩下的就是 webpack 的配置了----在学习 webpack 后再看

## 子应用配置

主要是判断应用是走 qiankun 过来，还是自己这边过来的

```tsx
import React from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./public-path";

let root: Root;
/** 不是qiankun 聚合的时候进行的加载 */
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

/** 根据参数判断从哪儿获取值 */
function render(props: any) {
  const { container } = props;
  const dom = container
    ? container.querySelector("#root")
    : document.getElementById("root");
  root = createRoot(dom);
  root.render(<App />);
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props: any) {
  console.log("bootstrap", props);
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log("mount", props);
  props.onGlobalStateChange((state: any, prev: any) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log("子项目----start");
    console.log(state, prev);
    console.log("子项目----end");
  });
  // props.setGlobalState(state);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  root.unmount();
}

// 增加 update 钩子以便主应用手动更新微应用
export async function update(props: any) {}
```

创建一个 public-path.js

```js
// //判断是否是qiankun加载
// if (window.__POWERED_BY_QIANKUN__) {
//   __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
// }
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  // __webpack_public_path__ = window.INJECTED_PUBLIC_PATH_BY_QIANKUN;
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

每一步的说明也在上面
要配置 webpack

```js
webpack - overrides.js;
const { name } = require("./package");
const packageName = require("./package.json").name;
module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd";
    config.output.globalObject = "window";
    config.output.chunkLoadingGlobal = `webpackJsonp_${packageName}`;
    // config.output.publicPath = "/";
    return config;
  },
  devServer: (_) => {
    const config = _;

    config.headers = {
      "Access-Control-Allow-Origin": "*",
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;

    return config;
  },
};
```

这个名字的要修改 package 中的启动项 "start": "react-app-rewired start",
