'use strict';

var data = {
	convex_lens: {
		radius: 5,
		r: 1,
		d: 0.2,
		n: 1.458,
		height: 2
	},
	concave_lens: {
		radius: 5,
		r: 1,
		d: 0.2,
		n: 1.458,
		height: 2
	},
	spherical_mirror: {
		radius: 5,
		r: 1,
		height: 2
	}
};

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
	m2.add(lens1);
	var lens2 = new THREE.Group();
	lens2.name = 'concave_lens';
	m3.add(lens2);
	var mirror1 = new THREE.Group();
	mirror1.name = 'spherical_mirror';
	m4.add(mirror1);
}

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
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
	var laser_scale = 0.5;
	laser_offset = new THREE.Vector3(0, 0.5, 0);
	laser_offsets = [];
	for (var i = 0; i < 15; i++) {
		var x = random();
		var y = random();
		var z = random();

		while (x * x + y * y + z * z > 1) {
			x = random();
			y = random();
			z = random();
		}
		var v = new THREE.Vector3(x, y, z);
		v.multiplyScalar(laser_scale); //.add(laser_offset);
		laser_offsets.push(v);
	}
}

var laser_idx;
var laser_offset;
var laser_offsets;

function updateLaser(s) {
	var m0 = s.getObjectByName('group_0');
	var m1 = s.getObjectByName('group_1');
	var convex_lens = s.getObjectByName('group_2').getObjectByName('convex_lens');
	var concave_lens = s.getObjectByName('group_3').getObjectByName('concave_lens');
	var spherical_mirror = s.getObjectByName('group_4').getObjectByName('spherical_mirror');
	var elements = {
		convex_lens: convex_lens,
		concave_lens: concave_lens,
		spherical_mirror: spherical_mirror
	};

	var s_laser = s.getObjectByName('group_laser');
	laser_idx = 0;
	if (m0.visible && m1.visible) {
		for (var l of laser_offsets) {
			var p1 = laser_offset.clone();
			var p2 = laser_offset.clone();
			p1.applyMatrix4(m0.matrixWorld); //.add(l);
			p2.applyMatrix4(m1.matrixWorld).add(l);
			castLaser(s_laser, elements, p1, p2);
		}
	}
}

function castLaser(s_laser, elements, src, dst) {
	if (s_laser.children.length <= laser_idx) {
		s_laser.add(generateLaser());
	}
	var intersections = [];
	var dir = dst.clone().sub(src);
	for (var i in elements) {
		var p = testIntersection(src, dir, elements[i]);
	}
	setLaser(s_laser.children[laser_idx], src, dst);
	laser_idx++;
}

function testIntersection(src, dir, element) {
	switch (element.name) {
		case 'convex_lens':

			break;
		case 'concave_lens':

			break;
		case 'spherical_mirror':
			
			break;
	}
}

function testIntersectionToSpherePart(src, dir, center, R, r, e_center) {
	// R: sphere
	// r: element
	// center: the center of the sphere
	// e_center: the center of the sphere part
	var p = testIntersectionToSphere(src, dir, center, R);
	for (var q of p) {
		var d = q.distanceTo(e_center);
		var t = Math.sqrt(sqr(r) + sqr(R - Math.sqrt(sqr(R) - sqr(r))));
		if (d <= t) return q;
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
		if (t1 > 0) result.push(src.clone().add(dir.clone().multiplyScalar(t1)));
		if (t2 > 0) result.push(src.clone().add(dir.clone().multiplyScalar(t2)));
	}
	return result;
}

function setLaser(laser, p1, p2) {
	laser.position.copy(p1).lerp(p2, 0.5);
	var sub = p1.clone().sub(p2);
	var len = sub.length();
	laser.scale.set(0.3, 0.3, len);
	sub.normalize();
	var axis = new THREE.Vector3(0, 0, 1);
	laser.quaternion.setFromUnitVectors(axis, sub);
}

function generateLaser() {
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
