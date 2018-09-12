'use strict';

function createSphericalMirror(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);

	var mesh = new THREE.Mesh(geometry, waterMaterial2);
	mesh.rotation.z = Math.PI / 2;
	mesh.position.set(Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	mesh.name = 'element_sphe';
	return mesh;
}

function createMirror(object) {
	var geometry = new THREE.PlaneGeometry(object.size, object.size);
	var mesh = new THREE.Mesh(geometry, waterMaterial2);
	mesh.rotation.y = Math.PI / 2;
	mesh.position.set(0, object.height, 0);
	mesh.name = 'element_mirr';
	return mesh;
}

function createConvexLens(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 32, 5, 0, Math.PI * 2, 0, theta);

	var mesh1 = new THREE.Mesh(geometry, waterMaterial3);
	var mesh2 = new THREE.Mesh(geometry, waterMaterial3);

	mesh1.rotation.z = Math.PI / 2;
	mesh2.rotation.z = -Math.PI / 2;
	mesh1.position.set(Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	mesh2.position.set(-Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	var group = new THREE.Group();
	group.name = 'element_conv';
	group.add(mesh1);
	group.add(mesh2);
	return group;
}

function createConcaveLens(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);
	var mesh1 = new THREE.Mesh(geometry, waterMaterial1);
	var mesh2 = new THREE.Mesh(geometry, waterMaterial1);
	mesh1.rotation.z = Math.PI / 2;
	mesh2.rotation.z = -Math.PI / 2;
	mesh1.position.set(object.radius + object.d / 2, object.height, 0);
	mesh2.position.set(-object.d / 2 - object.radius, object.height, 0);
	var group = new THREE.Group();
	group.name = 'element_conv';
	group.add(mesh1);
	group.add(mesh2);
	return group;
}

function createBase(object, n) {
	var geometry = new THREE.CylinderGeometry(object.radius_top, object.radius_bottom, object.height, n);
	var material = new THREE.MeshPhongMaterial({
		color: 0x666666,
		emissive: 0x072534,
		flatShading: true
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = object.height / 2;
	return mesh;
}
