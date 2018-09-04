# naruhodo
Mercari hackathon 2018 prototype

### Note

*   模型在Three.js的scene里是这样组织的: 每个marker是scene的子节点，是一个group对象，可以给这个group添加子节点。当现实世界的marker移动之后，这个marker group的坐标会发生变化，从而子节点也会发生变化。
*   几何光学实验:
    *   平行光源、点光源、凸透镜、凹透镜、凸面镜、凹面镜
    *   光源由两个marker确定方向，可以射出很多光线
*   单缝衍射、双缝干涉实验:
    *   线光源、可调的双缝。不需要接收屏，因为接收屏的位置不影响观察结果，可由双缝位置确定。
    *   只有一个缝的时候，实验变成单缝实验。
    *   需要在接收屏上方增加亮度曲线。

### To-do list

* [ ] @bug: 有时候识别marker会上下颠倒。对于单一的marker，这个是无解的，两种方向在现实中都可以解释通。感觉只能强行靠其他marker规定方向。
* [ ] 对每个光学元件，使用两个marker确保可靠?
* [ ] 增加一个双缝干涉实验?

### Development log

*   9.1
    *   确定使用AR做桌上实验模拟
    *   调研AR的开源工具，确定可行性
*   9.2
    *   建立github仓库
    *   打印各种marker
    *   尝试marker识别的demo
*   9.3
    *   支持使用barcode
    *   支持使用多个marker
    *   增加截图功能
    *   增加grid的绘制
*   9.4
    *   绘制光线、同步光线坐标系与marker坐标系
    *   ​