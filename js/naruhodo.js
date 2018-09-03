'use strict';

function initializeScene(s) {
	initializeOptics(s);
}

function initializeOptics(s) {
	// s.fog = new THREE.Fog(0x72645b, 2, 15);
	addPlane(s);
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
	planeRoot.add(helper);

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

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
	let m_plane1 = s.getObjectByName('group_0');
	let m_plane2 = s.getObjectByName('group_1');
	let s_plane = s.getObjectByName('group_plane');
	/*
	var mixed = mixObjectInfo(m_plane1, m_plane2);
	s_plane.visible = mixed[3];
	if (mixed[3]) {
		s_plane.position.copy(mixed[0]);
		s_plane.rotation.copy(mixed[1]);
		s_plane.scale.copy(mixed[2]);
	}
	*/
	s_plane.position.copy(m_plane1.position);
	s_plane.rotation.copy(m_plane1.rotation);
	s_plane.scale.copy(m_plane1.scale);
	s_plane.visible = m_plane1.visible;
}

function mixObjectInfo(a, b) {
	if (!a.visible && b.visible) return mixObjectInfo(b, a);
	if (!a.visible && !b.visible) return [null, null, null, false];
	var position = a.position.clone();
	var rotation = a.rotation.clone();
	var scale = a.scale.clone();
	if (b.visible) {
		position.add(b.position).multiplyScalar(0.5);
		scale.add(b.scale).multiplyScalar(0.5);
	}
	return [position, rotation, scale, true];
}
