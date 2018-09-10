'use strict';

function createSphericalMirror(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);
	// var material = new THREE.MeshPhongMaterial({
	// 	color: 0xffff00,
	// 	side: THREE.DoubleSide
	// });
	var mesh = new THREE.Mesh(geometry, refractMaterial3);
	mesh.rotation.z = Math.PI / 2;
	mesh.position.set(Math.sqrt(sqr(object.radius) - sqr(object.r)), object.height, 0);
	mesh.name = 'element_sphe';
	return mesh;
}

function createMirror(object) {
	var geometry = new THREE.PlaneGeometry(object.size, object.size);
	var testTexture = new THREE.Texture(generateTexture());
	testTexture.needsUpdate = true;
	var material =
		new THREE.MeshBasicMaterial({
			map: testTexture,
			side: THREE.DoubleSide,
			// transparent: true
			// color: 0xff0000,
			// blending: THREE.SubtractiveBlending
		});
	// new THREE.MeshPhongMaterial({
	// 	color: 0xffff00,
	// 	side: THREE.DoubleSide
	// });
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = Math.PI / 2;
	mesh.position.set(0, object.height, 0);
	mesh.name = 'element_mirr';
	return mesh;
}



function createConvexLens(object) {
	var theta = Math.asin(object.r / object.radius);
	var geometry = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);
	// var material1 = new THREE.MeshPhongMaterial({
	// 	color: 0xffff00,
	// 	// side: THREE.DoubleSide
	// });
	// var geometry2 = new THREE.SphereGeometry(object.radius, 16, 5, 0, Math.PI * 2, 0, theta);
	// var material2 = new THREE.MeshPhongMaterial({
	// 	color: 0xffff00,
	// 	// side: THREE.DoubleSide
	// });
	var mesh1 = new THREE.Mesh(geometry, refractMaterial1);
	var mesh2 = new THREE.Mesh(geometry, refractMaterial1);
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
	var mesh1 = new THREE.Mesh(geometry, refractMaterial2);
	var mesh2 = new THREE.Mesh(geometry, refractMaterial2);
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
