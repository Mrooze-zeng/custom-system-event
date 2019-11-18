# Custom System Event

自定义了一些简单的事件：
- scroll-start web页面滑动开始
- scroll-on web页面处于滑动状态
- scroll-stop web页面由滑动状态转为静止
- screen-rotate 在手机端手机屏幕旋转
- device-portrait 手机屏幕由横屏转为竖屏
- device-landscape 手机屏幕由竖屏转为横屏
- keyboard-raise 手机键盘弹起
- keyboard-down 手机键盘收起

# 使用

在body 里加
```html
<script type="text/javascript" src="lib/index.js"></script>
```

或者
```shell
npm i custom-system-event
```
在主文件中引入
```javascript
import "custom-system-event"
```

# [例子](./example.html)
[example.html](./example.html)