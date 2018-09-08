'use strict';

var data = {
	convex_lens: {
		radius: 10,
		r: 1.5,
		d: 0.1,
		n: 1.458,
		height: 1.5
	},
	concave_lens: {
		radius: 10,
		r: 1.5,
		d: 0.1,
		n: 1.458,
		height: 1.5
	},
	spherical_mirror: {
		radius: 4,
		r: 1.5,
		height: 1.5
	},
	light: {
		scale: 0.5,
		height: 1.5,
		number_of_rays: 20,
		use_point_light: false,
		d: 1, // should set from divergence_angle
		offset: 1.25,
		divergence_angle: 15,
		circle_light: true
	}
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
	/*
	var planeGeometry = new THREE.PlaneBufferGeometry(5, 5);
	var planeMaterial = new THREE.MeshPhongMaterial({
		color: 0xbbbbbb,
		specular: 0x101010,
		transparent: true,
		opacity: 0.15
	});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -0.005;
	// plane.receiveShadow = true;
	// planeRoot.add(plane);

	var helper = new THREE.GridHelper(5, 20);
	// helper.position.y = -0.5999;
	helper.position.y = 0;
	helper.material.opacity = 0.9;
	helper.material.transparent = true;
	// planeRoot.add(helper);
	*/
	// s.add(new THREE.HemisphereLight(0xffcc88, 0xffffff));
	planeRoot.add(new THREE.HemisphereLight(0x443333, 0x111122));
	addShadowedLight(planeRoot, 3, 10, 5, 0xffffff, 1);
	addShadowedLight(planeRoot, 3, 8, -4, 0xffcc88, 0.8);
	s.add(planeRoot);
}

function addShadowedLight(root, x, y, z, color, intensity) {
	var light = new THREE.PointLight(color, intensity, 100);
	light.position.set(x, y, z);
	// light.castShadow = true;
	root.add(light);
	// var helper = new THREE.PointLightHelper(light, 0.5);
	// root.add(helper);
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
	var lens1 = new THREE.Group();
	lens1.name = 'convex_lens';
	lens1.add(createConvexLens(data.convex_lens));
	m2.add(lens1);
	var lens2 = new THREE.Group();
	lens2.name = 'concave_lens';
	lens2.add(createConcaveLens(data.concave_lens));
	m3.add(lens2);
	var mirror1 = new THREE.Group();
	mirror1.name = 'spherical_mirror';
	mirror1.add(createSphericalMirror(data.spherical_mirror));
	m4.add(mirror1);
}

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
	adjustMarkers(s);
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
	laser_offset = new THREE.Vector3(0, data.light.height, 0);
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

function adjustMarkers(s) {
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

function updatePlane(m0, m1, plane) {
	// 根据m1, m2两个marker设置plane的位置
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
	var m0 = s.getObjectByName('group_0');
	var m1 = s.getObjectByName('group_1');
	var plane = s.getObjectByName('group_plane');
	updatePlane(m0, m1, plane);
	var convex_lens = s.getObjectByName('group_2').getObjectByName('convex_lens');
	var concave_lens = s.getObjectByName('group_3').getObjectByName('concave_lens');
	var spherical_mirror = s.getObjectByName('group_4').getObjectByName('spherical_mirror');
	var elements = {
		convex_lens: convex_lens,
		concave_lens: concave_lens,
		spherical_mirror: spherical_mirror
	};

	var s_laser = s.getObjectByName('group_laser');
	for (var c of s_laser.children) {
		c.visible = false;
	}
	laser_idx = 0;
	if (m0.visible || m1.visible) {
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
			castLaser(s_laser, elements, p1, dir, false);
		}
	}
}

function castLaser(s_laser, elements, src, dir, in_glass) {
	// 发射射线，遇到光学器件会做相应处理
	if (s_laser.children.length <= laser_idx) {
		s_laser.add(generateLaser());
	}
	var intersections = [];
	for (var i in elements) {
		var p = testIntersection(src, dir, elements[i], in_glass);
		if (p !== null) intersections.push(p);
	}
	// TODO: sort the intersections by distance
	if (intersections.length && intersections[0] !== null) {
		var p = intersections[0];
		if (!in_glass) setLaser(s_laser.children[laser_idx], src, p.pos);
		laser_idx++;
		castLaser(s_laser, elements, p.pos, p.dir, p.in_glass);
	} else {
		setLaser(s_laser.children[laser_idx], src, src.clone().add(dir.clone().multiplyScalar(1000)));
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
			}
			break;
		case 'concave_lens':

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
			}
			break;
	}
	return q;
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

function setLaser(laser, p1, p2) {
	// 将laser对象绘制在p1到p2两点之间
	laser.visible = true;
	laser.position.copy(p1).lerp(p2, 0.5);
	var sub = p1.clone().sub(p2);
	var len = sub.length();
	laser.scale.set(0.3, 0.3, len);
	sub.normalize();
	var axis = new THREE.Vector3(0, 0, 1);
	laser.quaternion.setFromUnitVectors(axis, sub);
}

function generateLaser() {
	// 生成一个laser的mesh
	var mesh = new THREE.Object3D();
	var outer = new THREE.MeshPhongMaterial({
		color: 0x0,
		emissive: 0xff5555
	});
	outer.blending = THREE.AdditiveBlending;
	outer.transparent = true;
	outer.opacity = 0.7;
	var inner = new THREE.MeshPhongMaterial({
		color: 0x0,
		emissive: 0xffffff
	});
	var outer_geometry = new THREE.BoxGeometry(0.1, 0.1, 1);
	var outer_mesh = new THREE.Mesh(outer_geometry, outer);
	// outer_mesh.rotation.y = Math.PI / 2;
	var inner_geometry = new THREE.BoxGeometry(0.035, 0.035, 1);
	var inner_mesh = new THREE.Mesh(inner_geometry, inner);
	// inner_mesh.rotation.y = Math.PI / 2;
	mesh.add(outer_mesh);
	mesh.add(inner_mesh);
	return mesh;
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
