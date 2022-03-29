用户卡顿，崩溃，白屏，不流畅等一些列问题

1. 页面整体加载时间
2. 用户可操作时间
3. 平滑和交互性
4. 可感知
5. 性能测定

常见的优化

长列表使用虚拟列表
基于 Service work、web worker 的 cache
webpack analyze 分析 js 包大小
优化 css 动画
Gzip 压缩
图片压缩

聊天框卡顿
拖拽卡顿
首屏渲染优化

react 组件优化 减少层级

FCP
First Contentful Paint (FCP)
TTFB
Time to First Byte (TTFB)
LCP
Largest Contentful Paint (LCP): 衡量加载性能。为了提供一个好的用户体验，LCP 应该在 2.5 秒内。

FID
First Input Delay (FID): 衡量可交互性。为了提供一个好的用户体验，FID 应该在 100 毫秒内。

例如，Time to First Byte (TTFB) 和 First Contentful Paint (FCP) 都是关于加载性能的，两者都有助于诊断 LCP (缓慢的服务端响应，或者渲染阻塞的资源)。

同上，Total Blocking Time (TBT) 和 Time to Interactive (TTI) 则是影响 FID 的实验性指标，他们不属于核心，因为不能测试现场数据，不能反映用户为核心的关键结果。

FP 是时间线上的第一个“时间点”，是指浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间，简而言之就是浏览器第一次发生变化的时间。

FCP（全称“First Contentful Paint”，翻译为“首次内容绘制”），是指浏览器从响应用户输入网络地址，在页面首次绘制文本，图片（包括背景图）、非白色的 canvas 或者 SVG 才算做 FCP，有些文章说 FCP 是首屏渲染事件，这其实是不对的。

TTI，翻译为“可交互时间”表示网页第一次完全达到可交互状态的时间点。可交互状态指的是页面上的 UI 组件是可以交互的（可以响应按钮的点击或在文本框输入文字等），不仅如此，此时主线程已经达到“流畅”的程度，主线程的任务均不超过 50 毫秒。在一般的管理系统中，TTI 是一个很重要的指标。

FMP（全称“First Meaningful Paint”，翻译为“首次有效绘制”表示页面的“主要内容”开始出现在屏幕上的时间点，它以前是我们测量用户加载体验的主要指标。本质上是通过一个算法来猜测某个时间点可能是 FMP，但是最好的情况也只有 77%的准确率，在 lighthouse6.0 的时候废弃掉了这个指标，取而代之的是 LCP 这个指标。

LCP（全称“Largest Contentful Paint”）表示可视区“内容”最大的可见元素开始出现在屏幕上的时间点。

https://mp.weixin.qq.com/s/rA2gv3nKoUfcchdYBAdykg
