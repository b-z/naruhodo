'use strict';

var data = {
	convex_lens: {
		radius: 10,
		r: 1.0,
		d: 0.1,
		n: 1.458,
		height: 1.5
	},
	concave_lens: {
		radius: 10,
		r: 1.0,
		d: 0.02,
		n: 1.458,
		height: 1.5
	},
	spherical_mirror: {
		radius: 4,
		r: 1.0,
		height: 1.5
	},
	mirror: {
		size: 2.0,
		height: 1.5
	},
	light: {
		scale: 0.2,
		height: 1.5,
		number_of_rays: 20,
		use_point_light: false,
		d: 1, // should set from divergence_angle
		offset: 1.25,
		divergence_angle: 15,
		circle_light: true
	},
	base: {
		height: 0.15,
		radius_top: 0.4,
		radius_bottom: 0.5,
	},
	coplanar: true
};
var epsilon = 0.0001;

function initializeScene(s) {
	initializeOptics(s);
}

function initializeOptics(s) {
	// s.fog = new THREE.Fog(0x72645b, 2, 15);
	addPlane(s);
	addLaser(s);
	addElements(s);
}

function addPlane(s) {
	var planeRoot = new THREE.Group();
	planeRoot.name = 'group_plane';

	var ls = createLightSource(data.light);
	planeRoot.add(ls);

	// s.add(new THREE.HemisphereLight(0xffcc88, 0xffffff));
	planeRoot.add(new THREE.HemisphereLight(0x443333, 0x111122));
	// addShadowedLight(planeRoot, -1, 3, 1, 0xffffff, 1);
	addShadowedLight(planeRoot, -4, 6, 2, 0xffffff, 1, 0, 0, -8, true);
	addShadowedLight(planeRoot, 0, 4, -8, 0xffcc88, 0.8, 1, -3, -1, false);
	// addShadowedLight(planeRoot, 3, 10, 5, 0xffffff, 1);
	// addShadowedLight(planeRoot, 3, 8, -4, 0xffcc88, 0.8);


	s.add(planeRoot);
}

function addShadowedLight(root, x, y, z, color, intensity, dx, dy, dz, cast) {
	// var light = new THREE.PointLight(color, intensity, 0, 2);
	// light.position.set(x, y, z);
	// light.castShadow = true;
	// light.shadow.mapSize.width = 1024; // default
	// light.shadow.mapSize.height = 1024; // default
	// light.shadow.camera.near = 0.5; // default
	// light.shadow.camera.far = 10 // default
	// root.add(light);
	//
	// var helper = new THREE.PointLightHelper(light, 0.5);
	// root.add(helper);

	var directionalLight = new THREE.DirectionalLight(color, intensity);
	directionalLight.position.set(x, y, z);
	directionalLight.castShadow = cast;
	var d = 5;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;
	directionalLight.shadow.camera.near = 0.5;
	directionalLight.shadow.camera.far = 300;
	directionalLight.shadow.mapSize.width = 512;
	directionalLight.shadow.mapSize.height = 512;
	var tg = new THREE.Object3D();
	tg.position.set(dx, dy, dz);
	directionalLight.target = tg;
	scene.add(tg);
	scene.add(directionalLight);
}

function addLaser(s) {
	var laserRoot = new THREE.Group();
	laserRoot.name = 'group_laser';
	s.add(laserRoot);
	initializeLaserOffset();
}

function addElements(s) {
	var m2 = s.getObjectByName('group_2');
	var m3 = s.getObjectByName('group_3');
	var m4 = s.getObjectByName('group_4');
	var m5 = s.getObjectByName('group_5');
	var lens1 = new THREE.Group();
	lens1.name = 'convex_lens';
	lens1.add(createConvexLens(data.convex_lens));
	m2.add(createBase(data.base, 5));
	m2.add(lens1);
	var lens2 = new THREE.Group();
	lens2.name = 'concave_lens';
	lens2.add(createConcaveLens(data.concave_lens));
	m3.add(createBase(data.base, 6));
	m3.add(lens2);
	var mirror1 = new THREE.Group();
	mirror1.name = 'spherical_mirror';
	mirror1.add(createSphericalMirror(data.spherical_mirror));
	m4.add(createBase(data.base, 7));
	m4.add(mirror1);
	var mirror2 = new THREE.Group();
	mirror2.name = 'mirror';
	mirror2.add(createMirror(data.mirror));
	m5.add(createBase(data.base, 8));
	m5.add(mirror2);
}

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
	// adjustMarkers(s);
	updateLaser(s);

	// let m_plane1 = s.getObjectByName('group_0');
	// let m_plane2 = s.getObjectByName('group_1');
	// let s_plane = s.getObjectByName('group_plane');
	//
	// var mixed = mixObjectInfo(m_plane1, m_plane2);
	// s_plane.visible = mixed[3];
	// if (mixed[3]) {
	// 	s_plane.position.copy(mixed[0]);
	// 	s_plane.quaternion.copy(mixed[1]);
	// 	s_plane.scale.copy(mixed[2]);
	// }

	// s_light.position.copy(m_light1.position);
	// s_light.rotation.copy(m_light1.rotation);
	// s_light.scale.copy(m_light1.scale);
	// s_light.visible = m_light1.visible;
}

function initializeLaserOffset() {
	// 初始化laser的offset
	var laser_scale = data.light.scale;
	laser_offset = new THREE.Vector3(0.625, data.light.height, 0);
	laser_offsets = [new THREE.Vector3()];
	for (var i = 0; i < 40; i++) {
		var x = random();
		var y = random();
		var z = random();
		while (x * x + y * y + z * z > 1) {
			x = random();
			y = random();
			z = random();
		}
		var v = new THREE.Vector3(x, y, z);
		if (data.light.circle_light) {
			v.x = 0;
			v.normalize();
		}
		v.multiplyScalar(laser_scale); //.add(laser_offset);
		laser_offsets.push(v);
	}
}

function adjustMarkers(markers, groups) {
	// return;
	var m = [];
	var g = [];
	for (var i = 0; i < markers.length; i++) {
		if (markers[i].visible) {
			m.push(markers[i]);
			g.push(groups[i]);
			groups[i].position.copy(markers[i].position);
			groups[i].quaternion.copy(markers[i].quaternion);
			groups[i].updateMatrixWorld(true);
		}
		groups[i].visible = markers[i].visible;
	}
	// if (markers[0].visible && !markers[1].visible) {
	// 	g.push(g[0]);
	// }
	// if (markers[1].visible && !markers[0].visible) {
	// 	g.push(g[0]);
	// }

	if (!data.coplanar) return;
	// first, rotate to a same rotation
	if (!m.length) return;
	var dir = g.reduce(function(p, obj) {
		var v = new THREE.Vector3(0, 1, 0);
		v.applyMatrix4(obj.matrixWorld).sub(obj.position).normalize().add(p);
		return v;
	}, new THREE.Vector3(0, 0, 0));
	dir.normalize();
	g.forEach(function(obj) {
		var q = new THREE.Quaternion();
		var v = new THREE.Vector3(0, 1, 0);
		v.applyMatrix4(obj.matrixWorld).sub(obj.position).normalize();
		// q.setFromUnitVectors(v, dir).normalize();
		// obj.quaternion.normalize().multiply(q).normalize();

		// obj.quaternion.setFromUnitVectors(v, dir.clone().normalize());
		var axis = new THREE.Vector3();
		axis.crossVectors(v, dir);
		if (axis.length() < epsilon) return;
		axis.normalize();
		var angle = v.angleTo(dir);
		obj.rotateOnWorldAxis(axis, angle);
		// console.log(axis, angle);
		obj.updateMatrixWorld(true);
	});

	// then move to a same level
	var x = new THREE.Vector3(1, 0, 0);
	var y = new THREE.Vector3(0, 1, 0);
	var z = new THREE.Vector3(0, 0, 1);
	x.applyMatrix4(g[0].matrixWorld).sub(g[0].position);
	y.applyMatrix4(g[0].matrixWorld).sub(g[0].position);
	z.applyMatrix4(g[0].matrixWorld).sub(g[0].position);
	var a1 = x.x;
	var a2 = x.y;
	var a3 = x.z;
	var b1 = y.x;
	var b2 = y.y;
	var b3 = y.z;
	var c1 = z.x;
	var c2 = z.y;
	var c3 = z.z;
	var det = a1 * (b2 * c3 - c2 * b3) - a2 * (b1 * c3 - c1 * b3) + a3 * (b1 * c2 - c1 * b2);
	// if (Math.abs(det) < epsilon) return null;
	var px = new THREE.Vector3(b2 * c3 - c2 * b3, c1 * b3 - b1 * c3, b1 * c2 - c1 * b2);
	var py = new THREE.Vector3(c2 * a3 - a2 * c3, a1 * c3 - c1 * a3, c1 * a2 - a1 * c2);
	var pz = new THREE.Vector3(a2 * b3 - b2 * a3, b1 * a3 - a1 * b3, a1 * b2 - b1 * a2);

	var kys = [];
	g.forEach(function(obj) {
		var pos = obj.position;
		var ky = py.dot(pos) / det;
		// kx * x + ky * y + kz * z
		// should average the ky;
		kys.push(ky);
	});
	var avg = 0;
	for (var k of kys) avg += k;
	avg /= m.length;

	for (var i = 0; i < g.length; i++) {
		var obj = g[i];
		var pos = obj.position;
		var kx = px.dot(pos) / det;
		var kz = pz.dot(pos) / det;
		// kx * x + ky * y + avg * z
		var npos = new THREE.Vector3(0, 0, 0);
		npos.add(x.clone().multiplyScalar(kx));
		npos.add(y.clone().multiplyScalar(avg));
		npos.add(z.clone().multiplyScalar(kz));
		g[i].position.copy(npos);
		g[i].updateMatrixWorld(true);
	}

	// for (var i = 0; i <= 4; i++) {
	// 	var m = s.getObjectByName('group_' + i);
	// 	// if (m.visible) console.log(m.rotation);
	// 	// var v = new THREE.Vector3(0, 1, 0);
	// 	// v.applyMatrix4(m.matrixWorld);
	// 	// var u = new THREE.Vector3(0, 0, 0);
	// 	// u.applyMatrix4(m.matrixWorld);
	// 	// v.sub(u);
	// 	var x = Math.min(m.rotation.x, Math.PI - m.rotation.x);
	// 	m.rotation.set(x, m.rotation.y, m.rotation.z, 'XYZ');
	// }
}

function updatePlane(m0, m1, plane, ls) {
	// 根据m1, m2两个marker设置plane的位置
	ls.visible = true;
	if (m0.visible && m1.visible) {
		var p = new THREE.Vector3(-data.light.offset, 0, 0);
		p.applyMatrix4(m1.matrixWorld);
		plane.position.copy(m0.position).lerp(p, 0.5);
		plane.quaternion.copy(m0.quaternion).slerp(m1.quaternion, 0.5);
	} else if (m0.visible) {
		copyPosition(plane, m0);
	} else if (m1.visible) {
		copyPosition(plane, m1);
		var p = new THREE.Vector3(-data.light.offset, 0, 0);
		p.applyMatrix4(m1.matrixWorld);
		plane.position.copy(p);
	} else {
		ls.visible = false;
	}
}

function copyPosition(a, b) {
	a.position.copy(b.position);
	a.quaternion.copy(b.quaternion);
}

var laser_idx;
var laser_offset;
var laser_offsets;

function updateLaser(s) {
	// 更新所有的laser
	var m0 = s.getObjectByName('marker_0');
	var m1 = s.getObjectByName('marker_1');
	var m2 = s.getObjectByName('marker_2');
	var m3 = s.getObjectByName('marker_3');
	var m4 = s.getObjectByName('marker_4');
	var m5 = s.getObjectByName('marker_5');
	var g0 = s.getObjectByName('group_0');
	var g1 = s.getObjectByName('group_1');
	var g2 = s.getObjectByName('group_2');
	var g3 = s.getObjectByName('group_3');
	var g4 = s.getObjectByName('group_4');
	var g5 = s.getObjectByName('group_5');
	var plane = s.getObjectByName('group_plane');
	var ls = s.getObjectByName('light_source');
	adjustMarkers([m0, m1, m2, m3, m4, m5], [g0, g1, g2, g3, g4, g5]);
	updatePlane(g0, g1, plane, ls);
	var convex_lens = g2.getObjectByName('convex_lens');
	var concave_lens = g3.getObjectByName('concave_lens');
	var spherical_mirror = g4.getObjectByName('spherical_mirror');
	var mirror = g5.getObjectByName('mirror');
	var elements = {
		convex_lens: convex_lens,
		concave_lens: concave_lens,
		spherical_mirror: spherical_mirror,
		mirror: mirror
	};

	var s_laser = s.getObjectByName('group_laser');
	for (var c of s_laser.children) {
		c.visible = false;
	}
	laser_idx = 0;
	if (g0.visible || g1.visible) {
		for (var l = 0; l < Math.min(data.light.number_of_rays, laser_offsets.length); l++) {
			var p1 = laser_offset.clone();
			var p2 = laser_offset.clone().add(new THREE.Vector3(data.light.d, 0, 0));
			if (data.light.circle_light) {
				if (!data.light.use_point_light) p1.add(laser_offsets[l]);
				p1.applyMatrix4(plane.matrixWorld);
				p2.add(laser_offsets[l]).applyMatrix4(plane.matrixWorld);
			} else {
				p1.applyMatrix4(plane.matrixWorld);
				if (!data.light.use_point_light) p1.add(laser_offsets[l]);
				p2.applyMatrix4(plane.matrixWorld).add(laser_offsets[l]);
			}
			var dir = p2.clone().sub(p1).normalize();
			castLaser(s_laser, elements, p1, dir, false, 'white');
		}
	}
}

function castLaser(s_laser, elements, src, dir, in_glass, color) {
	// 发射射线，遇到光学器件会做相应处理
	if (s_laser.children.length <= laser_idx) {
		s_laser.add(generateLaser());
	}
	var intersections = [];
	for (var i in elements) {
		var p = testIntersection(src, dir, elements[i], in_glass);
		if (p !== null) intersections.push(p);
	}
	intersections.sort(function(a, b) {
		return src.distanceTo(a.pos) - src.distanceTo(b.pos);
	});
	if (intersections.length && intersections[0] !== null) {
		var p = intersections[0];
		// if (!in_glass) setLaser(s_laser.children[laser_idx], src, p.pos);
		setLaser(s_laser.children[laser_idx], src, p.pos, color);
		laser_idx++;
		castLaser(s_laser, elements, p.pos, p.dir, p.in_glass, p.color);
	} else {
		setLaser(s_laser.children[laser_idx], src, src.clone().add(dir.clone().multiplyScalar(1000)), color);
		laser_idx++;
	}
}

function testIntersection(src, dir, element, in_glass) {
	// 射线到光学器件求交，返回第一个合法交点
	var q = null;
	if (!element.parent.visible) return q;
	switch (element.name) {
		case 'convex_lens':
			var c = new THREE.Vector3(0, data.convex_lens.height, 0);
			var m = new THREE.Vector3(1, 0, 0);
			var R = data.convex_lens.radius;
			var r = data.convex_lens.r;
			var d = Math.sqrt(sqr(R) - sqr(r));
			var center1 = c.clone().add(m.clone().multiplyScalar(d));
			var e_center1 = c.clone().add(m.clone().multiplyScalar(d - R));
			var center2 = c.clone().add(m.clone().multiplyScalar(-d));
			var e_center2 = c.clone().add(m.clone().multiplyScalar(-d + R));
			[center1, e_center1, center2, e_center2].forEach(function(e) {
				e.applyMatrix4(element.matrixWorld);
			});
			var q1 = testIntersectionToSpherePart(src, dir, center1, R, r, e_center1);
			var q2 = testIntersectionToSpherePart(src, dir, center2, R, r, e_center2);
			if (q1 !== null) q = q1;
			if (q === null || (q2 !== null && src.distanceTo(q2.pos) < src.distanceTo(q.pos))) q = q2;
			if (q !== null) {
				var angle_i = dir.angleTo(q.norm);
				if (angle_i < epsilon || Math.PI - angle_i < epsilon) {
					q.dir = dir;
				} else {
					var n = dir.clone().sub(q.norm.clone().multiplyScalar(dir.length() * Math.cos(angle_i))).normalize();
					if (in_glass) n.multiplyScalar(-1);
					var sin_r = Math.sin(angle_i) / (in_glass ? (1 / data.convex_lens.n) : data.convex_lens.n);
					if (sin_r > 1) {
						q = null;
						break;
					}
					var angle_r = Math.asin(sin_r);
					q.dir = n.multiplyScalar(Math.tan(angle_r)).add(q.norm);
					if (in_glass) q.dir.multiplyScalar(-1);
				}
				q.in_glass = !in_glass;
				q.color = 'blue';
			}
			break;
		case 'concave_lens':
			var c = new THREE.Vector3(0, data.concave_lens.height, 0);
			var m = new THREE.Vector3(1, 0, 0);
			var R = data.concave_lens.radius;
			var r = data.concave_lens.r;
			// var d = Math.sqrt(sqr(R) - sqr(r));
			var center1 = c.clone().add(m.clone().multiplyScalar(R + data.concave_lens.d / 2));
			var e_center1 = c.clone().add(m.clone().multiplyScalar(data.concave_lens.d / 2));
			var center2 = c.clone().add(m.clone().multiplyScalar(-R - data.concave_lens.d / 2));
			var e_center2 = c.clone().add(m.clone().multiplyScalar(-data.concave_lens.d / 2));
			[center1, e_center1, center2, e_center2].forEach(function(e) {
				e.applyMatrix4(element.matrixWorld);
			});
			var q1 = testIntersectionToSpherePart(src, dir, center1, R, r, e_center1);
			var q2 = testIntersectionToSpherePart(src, dir, center2, R, r, e_center2);
			if (q1 !== null) q = q1;
			if (q === null || (q2 !== null && src.distanceTo(q2.pos) < src.distanceTo(q.pos))) q = q2;
			if (q !== null) {
				var angle_i = dir.angleTo(q.norm);
				if (angle_i < epsilon || Math.PI - angle_i < epsilon) {
					q.dir = dir;
				} else {
					var n = dir.clone().sub(q.norm.clone().multiplyScalar(dir.length() * Math.cos(angle_i))).normalize();
					if (in_glass) n.multiplyScalar(-1);
					var sin_r = Math.sin(angle_i) / (in_glass ? (1 / data.concave_lens.n) : data.concave_lens.n);
					if (sin_r > 1) {
						q = null;
						break;
					}
					var angle_r = Math.asin(sin_r);
					q.dir = n.multiplyScalar(Math.tan(angle_r)).sub(q.norm);
					if (in_glass) q.dir.multiplyScalar(-1);
				}
				q.in_glass = !in_glass;
				q.color = 'red';
			}
			break;
		case 'spherical_mirror':
			var c = new THREE.Vector3(0, data.spherical_mirror.height, 0);
			var m = new THREE.Vector3(1, 0, 0);
			var R = data.spherical_mirror.radius;
			var r = data.spherical_mirror.r;
			var d = Math.sqrt(sqr(R) - sqr(r));
			var center = c.clone().add(m.clone().multiplyScalar(d));
			var e_center = c.clone().add(m.clone().multiplyScalar(d - R));
			center.applyMatrix4(element.matrixWorld);
			e_center.applyMatrix4(element.matrixWorld);
			q = testIntersectionToSpherePart(src, dir, center, R, r, e_center);
			if (q !== null) {
				q.dir = dir.clone().reflect(q.norm);
				q.in_glass = in_glass;
				q.color = 'green';
			}
			break;
		case 'mirror':
			var c = new THREE.Vector3(0, data.mirror.height, 0);
			var norm = c.clone().add(new THREE.Vector3(1, 0, 0));
			var size = data.mirror.size;
			var x = c.clone().add(new THREE.Vector3(0, size / 2, 0));
			var y = c.clone().add(new THREE.Vector3(0, 0, size / 2));
			[c, norm, x, y].forEach(function(e) {
				e.applyMatrix4(element.matrixWorld);
			});
			norm.sub(c);
			x.sub(c);
			y.sub(c);
			q = testIntersectionToPlanePart(src, dir, c, x, y, norm);
			if (q !== null) {
				q.dir = dir.clone().reflect(q.norm);
				q.in_glass = in_glass;
				q.color = 'green';
			}
			break;
	}
	return q;
}

function testIntersectionToPlanePart(src, dir, c, x, y, norm) {
	var a1 = x.x;
	var a2 = x.y;
	var a3 = x.z;
	var b1 = y.x;
	var b2 = y.y;
	var b3 = y.z;
	var c1 = -dir.x;
	var c2 = -dir.y;
	var c3 = -dir.z;
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
	// console.log(t);
	var pos = c.clone().add(x.clone().multiplyScalar(a)).add(y.clone().multiplyScalar(b));
	return {
		pos: pos, //src.clone().add(dir.clone().multiplyScalar(t)),
		norm: norm
	}
}

function testIntersectionToSpherePart(src, dir, center, R, r, e_center) {
	// 射线射到曲面镜
	// 求交点、法线方向，返回的是第一个合法的交点
	// R: sphere
	// r: element
	// center: the center of the sphere
	// e_center: the center of the sphere part
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
	// 射线到球求交点
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


function mixObjectInfo(a, b) {
	// 弃用
	if (!a.visible && b.visible) return mixObjectInfo(b, a);
	if (!a.visible && !b.visible) return [null, null, null, false];
	var position = a.position.clone();
	var quaternion = a.quaternion.clone();
	var scale = a.scale.clone();
	if (b.visible) {
		position.lerp(b.position, 0.5);
		quaternion.slerp(b.quaternion, 0.5);
		scale.lerp(b.scale, 0.5);
	}
	return [position, quaternion, scale, true];
}
