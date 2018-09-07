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
	mesh.name = 'element';
	return mesh;
}
