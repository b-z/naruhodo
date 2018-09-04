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
	laserRoot.add(generateLaser());
	s.add(laserRoot);
}

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
	var m1 = s.getObjectByName('group_0');
	var m2 = s.getObjectByName('group_1');
	let s_laser = s.getObjectByName('group_laser');

	if (m1.visible && m2.visible) {
		s_laser.children[0].position.copy(m1.position).lerp(m2.position, 0.5);

		var sub = m1.position.clone().sub(m2.position);
		var len = sub.length();
		s_laser.children[0].scale.set(1, 1, len);
		sub.normalize();
		var axis = new THREE.Vector3(0, 0, 1);
		s_laser.children[0].quaternion.setFromUnitVectors(axis, sub);
	}

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
	var outer_geometry = new THREE.BoxGeometry(0.2, 0.2, 3);
	var outer_mesh = new THREE.Mesh(outer_geometry, outer);
	// outer_mesh.rotation.y = Math.PI / 2;
	var inner_geometry = new THREE.BoxGeometry(0.07, 0.07, 3);
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
