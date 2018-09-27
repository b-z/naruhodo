# Naruhodo!

<img src="img/logo-black-light.png" width="150px">

Champion project of Mercari Hackathon 2018

https://b-z.github.io/naruhodo

![](img-doc/hackathon.jpg)

***

### What is this?

**Naruhodo!** means "I see!" or "Aha moment" in Japanese.

This application is designed for students, using AR technology to help them do some wonderful scientific experiments at home.

Currently, it provides a simple optical experiment for demonstration. Users are free to use lenses, mirrors, etc. in it.

![29](img-doc/naruhodo.big.jpg)

### Why do you do this?

Education is the foundation of a country. **Equal and quality education** is very important. The imbalance of educational resources is a common problem between China and Japan. In a top school, students receive the best education and can do research in the laboratory, which is not possible for students in other schools.

I was born in a poor city. In my student days, I enjoyed to do interesting scientific experiments at home. For example, give me a copper wire (Cu), I will heat it on the fire to get copper oxide (CuO), then put the copper oxide into vinegar (CH~3~COOH), I will finally get a beautiful blue copper acetate (Cu(CH~3~COO)~2~) solution. But a serious problem is that my home cannot always provide the right experiment tools. And it is not safe to do some experiments at home.

AR ([Augmented Reality](https://en.wikipedia.org/wiki/Augmented_reality)) is a new technology which can mix the real world and the virtual world. I hope to use this technology to help students who are interested in science, to do interesting experiments at home.

### How can I play with it?

First, you should print some markers (`naruhodo/markers-print/print.pdf`):

<img src="markers-print/print-preview.png" width="400px">

The last two together constitute a light source, and the other four markers are convex lens, concave lens, spherical mirror and plane mirror, respectively.

Place these markers on your desk and play!

### How does it work?

Currently, the core of **Naruhodo!** is designed as a three-layer structure:

*   Layer-3 is the basic layer. It captures video through the camera of the user's device. `AR.js` analyzes the position and orientation of the markers relative to the camera from the video stream.
*   Layer-2 is the logical layer. In this layer, the light source and other optical instruments are generated from the markers, and the result of the interaction of the light with the optical instruments is calculated.
*   And Layer-1 is the visualization layer. It uses `three.js` to render the calculated models on the web page.

Here, Ar.js and three.js are two famous open-source libraries. They provide basic AR and model rendering capabilities, respectively. Since they only provide very basic APIs, I still have a lot of work to do. For example, to make the detection more robust in Layer-3, and to generate 3D models and light sources in Layer-1.

### How can I deploy?

*   **Naruhodo!** should be visited through an `https` website, otherwise it has no permission to open the camera of your iOS device.

*   To set-up a simple https server, you can do this:

   ```bash
   npm install -g http-server
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
   http-server -S -C cert.pem -o -c-1
   ```

* Then, open https://localhost:8080.

### Advantages

*   No special experiment tools are required. All you need to prepare is a phone (or tablet) and some markers.
*   You can see the light path. Even in laboratory, it is hard to visualize the light path in an optical experiment.
*   You can adjust the parameters of every experiment equipment. For example, the focal length of a lens.
*   It combines the virtual and reality, so that you can feel the scale of each object in reality.

### Disadvantages

*   Simulating the glass material of the lens as realistically as possible will make the display look better, but on a web page, computing resources are not enough to achieve such a function.
*   ARToolKit is not stable enough. Position of a marker may be ambiguous.

### Your inspiration?

My inspiration comes from Nintendo LABO and teamLab:star: 's exhibitions. I think an educational application should not be limited to virtual, but should be combined with the reality.

| ![labo](img-doc/labo.jpg) | ![teamlab](img-doc/teamlab.jpeg) |
| :-----------------------: | :------------------------------: |
|       Nintendo LABO       |          teamLab:star:           |

### What will you do next?

*   Make it work better.
*   Design a simple game about it.

### Images

![1](img-doc/1.png)

:arrow_up_small: Test the detection of the markers

![2](img-doc/2.png)

:arrow_up_small: Add a plane according to the average position & rotation of the markers (deprecated now)

![3](img-doc/3.png)

:arrow_up_small: Add a light to the scene

![4](img-doc/4.png)

![5](img-doc/5.png)

:arrow_up_small: Draw a thick laser between two points

![6](img-doc/6.png)

:arrow_up_small: A point light :tada:

![7](img-doc/7.png)

:arrow_up_small: Add GUI to the prototype. (Mobile & Computer)

![8](img-doc/8.png)

:arrow_up_small: Emmmmm...An invisible concave mirror.

![9](img-doc/9.png)

:arrow_up_small: The concave mirror is shown both on mobile and computer

![10](img-doc/10.png)

:arrow_up_small: A invisible convex lens

![11](img-doc/11.png)

:arrow_up_small: The concave mirror is now visible :tada:

![12](img-doc/12.jpg)

:arrow_up_small: Some notes

![13](img-doc/13.png)

:arrow_up_small: Draw a lemon :lemon: (误

![15](img-doc/15.png)

:arrow_up_small: Test the refraction (deprecated now)

![16](img-doc/16.png)

![17](img-doc/17.png)

:arrow_up_small: Test complex cases

![18](img-doc/18.png)

:arrow_up_small: Add a texture to the mirror (deprecated now) and support colorful lasers

![19](img-doc/19.png)

:arrow_up_small: Add some textures to the elements

![20](img-doc/20.png)

:arrow_up_small: Use average rotation and height among the markers

![21](img-doc/21.png)

:arrow_up_small: Draw a base under each element

![26](img-doc/26.jpg)

![27](img-doc/27.jpg)

![23](img-doc/23.jpg)

![24](img-doc/24.png)

:arrow_up_small: Turn markers into bricks

![26](img-doc/26.png)

:arrow_up_small: Draw shadows:tada:

![27](img-doc/27.png)

:arrow_up_small: Draw a logo under the light source

![29](img-doc/29.png)

:arrow_up_small: The final version:tada:

![](img-doc/pre.jpg)

:arrow_up_small: The presentation



***

### To-do list

* [ ] ~~@bug: 有时候识别marker会上下颠倒。对于单一的marker，这个是无解的，两种方向在现实中都可以解释通。感觉只能强行靠其他marker规定方向。~~
* [x] 对每个光学元件，使用两个marker确保可靠?
      * [x] 插值光源位置
      * [ ] ~~插值其他器件~~
* [ ] ~~增加一个双缝干涉实验?~~
* [ ] 做得尽量像教科书的
* [x] 在marker旁边标注一些图、文字
* [x] @bug: 反射光线从反射点射出来的时候会和镜面本身有交点，需要将这个点排除(交点距离光源长度应大于$\varepsilon$)
* [ ] 使用mathjax显示相关公式
* [x] 允许设置光线数量
* [x] 允许设置光线发散程度
* [x] 注意一下控制台冒出来的警告⚠️?
      *  是因为光线从玻璃射出的时候发生了全反射，导致折射公式求解失败
* [ ] ~~对渲染使用后处理，看起来更酷炫点~~ 性能代价太大了 放弃
* [ ] 在修改元件参数时，在AR场景中绘制相关辅助信息
* [ ] 加入游戏关卡设置
* [x] 调整元件参数时，动态改变mesh的形状
* [x] 支持多种颜色的光线
      * [ ] ~~是否要做渐变的光线? 比如opacity越来越高~~
* [x] 增加平面镜
* [x] ~~不显示透镜内部的光线，以加速~~
* [x] 与光学元件求交之后，对所有潜在交点排序
* [x] 去除双缝实验，改为自由模式与游戏模式
* [ ] ~~增加音效~~
* [x] 做成积木块
* [x] 元件换个颜色，现在丑爆了，弄一个这种材质? https://www.etsy.com/jp/listing/627682478/detroit-become-human-cyberlife-tote-bag?ref=shop_home_active_5
* [ ] ~~凹透镜外围封起来~~
* [x] 强制让所有marker共面!
* [x] 调整元件参数，改为调整焦距，并在上面标出球半径，与长度单位
* [ ] ~~除了点光源可以调整角度之外，平行光源也可以调整~~ 显得比较冗杂
* [x] 绘制元件的底座
* [x] 绘制光源
* [ ] ~~绘制text，需要始终面向用户~~ 代价可能比较大
* [x] 光线的颜色与元件颜色统一
* [x] 在光源底座上绘制logo
* [x] 调整页面布局，视频窗口放大点

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
    *   加入UI
*   9.5
    *   修复手机浏览器上UI不正常的问题(非常坑)
    *   画了个icon
    *   美化UI
    *   添加球面镜元件，但有bug
*   9.6
    *   修复反射光线抖动的bug
    *   支持自定义参数
        *   球面镜的球半径
        *   点光源/平行光源
        *   光源光线数量
        *   点光源发散度
    *   光源使用双marker，插值增加稳定性，缺失一个也可以工作
    *   实现凸透镜
*   9.7
    *   修复全反射导致的bug
    *   显示凸透镜、球面镜的mesh
    *   支持动态调整mesh的参数
    *   光源由"球体"修改成"圆周"的
    *   美化封面
*   9.8
    *   支持透明材质
*   9.9
    *   支持凹透镜
*   9.10
    *   支持平面镜
    *   支持不同颜色的光
    *   更换了一种显示的材质
*   9.11
    *   调整半径改为调整焦距，球半径会自动根据焦距计算
    *   平均各个marker坐标系的位置及朝向
*   9.12
    *   绘制元件底座
*   9.15
    *   做成积木块
    *   添加阴影
    *   绘制手电筒:flashlight:
*   9.16
    *   在光源底座上绘制logo

### 光线与光学器件求交

**和凸透镜、凹透镜、球面镜求交均可以看成和球面镜求交**

分两步:

1.  和球面镜所在的球求交
2.  判断交点合法性

假设光线由$(x_0, y_0, z_0)$射出，方向为$(a, b, c)$，那么光线可以表示为

$$(x_0, y_0, z_0) + t(a, b, c), t>\varepsilon$$，

假设球是$(x-x_b)^2+(y-y_b)^2+(z-z_b)^2=R^2$，那么相交时有

$$(x_0+ta-x_b)^2+(y_0+tb-y_b)^2+(z_0+tc-z_b)^2=R^2$$，

得到关于$t$的二次方程:

$$(a^2+b^2+c^2)t^2+\\2(a(x_0-x_b)+b(y_0-y_b)+c(z_0-z_b))t+\\((x_0-x_b)^2+(y_0-y_b)^2+(z_0-z_b)^2-R^2)=0$$

可由此解出$t$，并进一步得到交点。判断交点合法性可以求交点到镜面中心的距离是否在合法范围。

```javascript
function testIntersectionToSpherePart(src, dir, center, R, r, e_center) {
	var p = testIntersectionToSphere(src, dir, center, R);
	for (var q of p) {
		var d = q.distanceTo(e_center);
		var t = Math.sqrt(sqr(r) + sqr(R - Math.sqrt(sqr(R) - sqr(r))));
		if (d <= t) {
			var norm = center.clone().sub(q).normalize();
			return {
				pos: q,
				norm: norm
			};
		}
	}
	return null;
}

function testIntersectionToSphere(src, dir, center, R) {
	var a = dir.dot(dir);
	var sub = src.clone().sub(center);
	var b = 2 * dir.dot(sub);
	var c = sub.dot(sub) - R * R;

	var delta = b * b - 4 * a * c;
	var result = [];
	if (delta >= 0) {
		delta = Math.sqrt(delta);
		var t1 = (-b - delta) / a / 2;
		var t2 = (-b + delta) / a / 2;
		if (t1 > epsilon) result.push(src.clone().add(dir.clone().multiplyScalar(t1)));
		if (t2 > epsilon) result.push(src.clone().add(dir.clone().multiplyScalar(t2)));
	}
	return result;
}
```

**和平面镜求交**

平面镜的空间表示是一个中心点c加上x、y方向两个正交向量的线性组合，也就是说，

$$src+t\cdot dir=c+a\cdot x+b\cdot y$$

满足$-1\le a\le 1$，$-1\le b\le 1$，$t>\varepsilon$。

其中$a$、$b$、$t$是标量的未知数，其他向量可以挪到等号一边，变成三元一次方程，对三阶矩阵求逆即可。

```javascript
function testIntersectionToPlanePart(src, dir, c, x, y, norm) {
	var a1 = x.x; var a2 = x.y; var a3 = x.z;
	var b1 = y.x; var b2 = y.y; var b3 = y.z;
	var c1 = -dir.x; var c2 = -dir.y; var c3 = -dir.z;
	var det = a1 * (b2 * c3 - c2 * b3) - a2 * (b1 * c3 - c1 * b3) + a3 * (b1 * c2 - c1 * b2);
	if (Math.abs(det) < epsilon) return null;
	var pa = new THREE.Vector3(b2 * c3 - c2 * b3, c1 * b3 - b1 * c3, b1 * c2 - c1 * b2);
	var pb = new THREE.Vector3(c2 * a3 - a2 * c3, a1 * c3 - c1 * a3, c1 * a2 - a1 * c2);
	var pt = new THREE.Vector3(a2 * b3 - b2 * a3, b1 * a3 - a1 * b3, a1 * b2 - b1 * a2);
	var s = src.clone().sub(c);
	var a = pa.dot(s) / det;
	var b = pb.dot(s) / det;
	var t = pt.dot(s) / det;
	if (t < epsilon) return null;
	if (a > 1 || b > 1 || a < -1 || b < -1) return null;
	var pos = c.clone().add(x.clone().multiplyScalar(a)).add(y.clone().multiplyScalar(b));
	return {
		pos: pos,
		norm: norm
	}
}
```

### 光线投射

首先对所有元件求交，在所有交点中取最近的。

然后针对不同元件做进一步处理:

*   镜面: 找到交点、按此处法线反射
*   透镜: 找到交点、法线，按折射公式折射，需要处理全反射的情况

如果经过元件变换进一步生成了新的光线，那么继续投射这根新的光线。

### Marker位置、朝向的均衡

看起来简单但实际非常复杂。。

**朝向均衡**

https://zh.wikipedia.org/wiki/%E5%9B%9B%E5%85%83%E6%95%B0%E4%B8%8E%E7%A9%BA%E9%97%B4%E6%97%8B%E8%BD%AC

要让所有元件的坐标系的y轴方向统一。

尝试了多种方案，最后可行的方法是，求出每个元件坐标系下(0, 1, 0)的世界坐标v[i]，求它们的均值dir，归一化。

对于每个元件，用v[i]叉乘dir得到旋转轴，点乘得到旋转角，再绕着这个轴转即可。

**位置均衡**

朝向均衡之后，各个元件坐标系的y轴变得平行。位置均衡可以确保各个元件的$xOz$平面在同一平面上。

首先在第一个元件的坐标系下，表示出(1, 0, 0) (0, 1, 0) (0, 0, 1)三个正交单位向量:

```javascript
var x = new THREE.Vector3(1, 0, 0);
var y = new THREE.Vector3(0, 1, 0);
var z = new THREE.Vector3(0, 0, 1);
x.applyMatrix4(m[0].matrixWorld).sub(m[0].position);
y.applyMatrix4(m[0].matrixWorld).sub(m[0].position);
z.applyMatrix4(m[0].matrixWorld).sub(m[0].position);
```

然后这三个向量写成列向量再并起来所构成的方阵，右边乘上列向量$(a, b, c)^T$能得到在一号元件坐标系下，坐标(a, b, c)在世界坐标系中的表示。假设这个世界坐标系的坐标是(p, q, r)，那么可以在这个坐标左边乘上上面那个方阵的逆矩阵，就得到了在一号元件坐标系下的坐标。

现在，我们用这种方法，把所有元件的坐标系原点放在一号元件坐标系下表示。然后求它们的y坐标的均值，用y的均值更新原有的y，就得到了均衡之后的坐标。

### 阴影效果

需要加一个能cast出阴影的光源，可以是点光源或者平行光源。对性能要求较高。

每个阴影光源相当于一个相机，需要设置各种相机参数，以及shadowmap的分辨率。分辨率、相机可视范围、软件性能需要做一个权衡。

这里使用的设计是阴影光源固定在场景中，使用平行光源，投射方向也是固定的。根据marker所在平面位置，生成一个接收影子的透明材质，可以比较真实地模拟桌面。

### 关卡设计

*   用平面镜等，将平行光源反射到旁边某个指定的圈里


*   平行光->凸透镜->凹透镜->变成很细的一束平行光，经过平面镜反射到目标，目标check这束光是否足够细且平行

### Note

*   模型在Three.js的scene里是这样组织的: 每个marker是scene的子节点，是一个group对象，可以给这个group添加子节点。当现实世界的marker移动之后，这个marker group的坐标会发生变化，从而子节点也会发生变化。
*   几何光学实验:
    *   平行光源、点光源、凸透镜、凹透镜、凸面镜、凹面镜
    *   光源由两个marker确定方向，可以射出很多光线
*   单缝衍射、双缝干涉实验:
    *   线光源、可调的双缝。不需要接收屏，因为接收屏的位置不影响观察结果，可由双缝位置确定。
    *   只有一个缝的时候，实验变成单缝实验。
    *   需要在接收屏上方增加亮度曲线。
*   优势:
    *   无需专门的实验器材
    *   可以观察到光路
    *   可以自由调整各个器材的光学参数
    *   与现实结合，可体会到对象实际尺度
