'use strict';

function initializeScene(s) {
	initializeOptics(s);
}

function initializeOptics(s) {
	// s.fog = new THREE.Fog(0x72645b, 2, 15);
	addPlane(s);
	addLaser(s);
}

function addPlane(s) {
	var planeRoot = new THREE.Group();
	planeRoot.name = 'group_plane';
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
	// for (var i = 0; i < 15 * 5; i++) {
	// 	laserRoot.add(generateLaser());
	// }
	s.add(laserRoot);

	initializeLaserOffset();
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

	// var laser_offset = [
	// 	new THREE.Vector3(-1 * laser_scale, -3 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(1 * laser_scale, -3 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(-3 * laser_scale, -1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(-1 * laser_scale, -1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(1 * laser_scale, -1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(3 * laser_scale, -1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(-3 * laser_scale, 1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(-1 * laser_scale, 1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(1 * laser_scale, 1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(3 * laser_scale, 1 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(-1 * laser_scale, 3 * laser_scale + object_height, 0),
	// 	new THREE.Vector3(1 * laser_scale, 3 * laser_scale + object_height, 0),
	// ];
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
	var m1 = s.getObjectByName('group_0');
	var m2 = s.getObjectByName('group_1');
	let s_laser = s.getObjectByName('group_laser');
	laser_idx = 0;
	if (m1.visible && m2.visible) {
		for (var l of laser_offsets) {
			var p1 = laser_offset.clone();
			var p2 = laser_offset.clone();
			p1.applyMatrix4(m1.matrixWorld)//.add(l);
			p2.applyMatrix4(m2.matrixWorld).add(l);
			castLaser(s_laser, p1, p2);
		}
	}
}

function castLaser(s_laser, src, dst) {
	if (s_laser.children.length <= laser_idx) {
		s_laser.add(generateLaser());
	}
	setLaser(s_laser.children[laser_idx], src, dst);
	laser_idx++;
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
