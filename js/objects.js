'use strict';

function createSphericalMirror(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 17, 4, 0, Math.PI * 2, 0, theta);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffff00,
		side: THREE.DoubleSide
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.z = Math.PI / 2;
	mesh.position.set(Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	mesh.name = 'element_sphe';
	return mesh;
}

function createConvexLens(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry1 = new THREE.SphereGeometry(object.radius, 17, 4, 0, Math.PI * 2, 0, theta);
	var material1 = new THREE.MeshPhongMaterial({
		color: 0xffff00,
		side: THREE.DoubleSide
	});
	var geometry2 = new THREE.SphereGeometry(object.radius, 17, 4, 0, Math.PI * 2, 0, theta);
	var material2 = new THREE.MeshPhongMaterial({
		color: 0xffff00,
		side: THREE.DoubleSide
	});
	var mesh1 = new THREE.Mesh(geometry1, material1);
	var mesh2 = new THREE.Mesh(geometry2, material2);
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
