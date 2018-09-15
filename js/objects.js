'use strict';

function createSphericalMirror(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);

	var mesh = new THREE.Mesh(geometry, waterMaterial2);
	mesh.rotation.z = Math.PI / 2;
	mesh.position.set(Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	mesh.name = 'element_sphe';
	mesh.castShadow = true;
	return mesh;
}

function createMirror(object) {
	var geometry = new THREE.PlaneGeometry(object.size, object.size);
	var mesh = new THREE.Mesh(geometry, waterMaterial2);
	mesh.rotation.y = Math.PI / 2;
	mesh.position.set(0, object.height, 0);
	mesh.name = 'element_mirr';
	mesh.castShadow = true;
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
	mesh1.castShadow = true;
	mesh2.castShadow = true;
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
	mesh1.castShadow = true;
	mesh2.castShadow = true;
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
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position.y = object.height / 2;
	return mesh;
}

function createLightSource(object) {
	var group = new THREE.Group();

	// base
	var length = 2.25,
		width = 1;

	var shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	var extrudeSettings = {
		steps: 2,
		depth: 0.1,
		bevelEnabled: true,
		bevelThickness: 0.025,
		bevelSize: 0.025,
		bevelSegments: 1
	};
	var base_geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
	var base_material = new THREE.MeshPhongMaterial({
		color: 0x666666,
		emissive: 0x072534,
		flatShading: true
	});
	var base_mesh = new THREE.Mesh(base_geometry, base_material);
	base_mesh.rotation.x = Math.PI / 2;
	base_mesh.position.x = -0.5;
	base_mesh.position.y = 0.2;
	base_mesh.position.z = -0.5;
	base_mesh.castShadow = true;
	base_mesh.receiveShadow = true;
	group.add(base_mesh);

	// light source
	var cone_geometry = new THREE.ConeGeometry(0.25, 0.8, 7);
	var cone = new THREE.Mesh(cone_geometry, waterMaterial0);
	cone.position.y = object.height;
	cone.rotation.z = -Math.PI / 2;
	cone.position.x = 0.625 - 0.25;
	cone.castShadow = true;
	group.add(cone);

	var cylinder_geometry = new THREE.CylinderGeometry(object.scale * 1.5, object.scale * 1.5, 0.2, 7);
	var cylinder = new THREE.Mesh(cylinder_geometry, waterMaterial0);
	cylinder.position.y = object.height;
	cylinder.rotation.z = -Math.PI / 2;
	cylinder.position.x = 0.625;
	cylinder.castShadow = true;
	group.add(cylinder);

	// shadow receiver
	var planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
	var planeMaterial = new THREE.ShadowMaterial({
		opacity: 0.2
	});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -0.05;
	plane.receiveShadow = true;
	group.add(plane);

	// var helper = new THREE.GridHelper(5, 20);
	// // helper.position.y = -0.5999;
	// helper.position.y = 0;
	// helper.material.opacity = 0.9;
	// helper.material.transparent = true;
	// group.add(helper);

	group.name = 'light_source';
	return group;
}
