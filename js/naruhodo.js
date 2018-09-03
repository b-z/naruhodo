'use strict';

function initializeScene(s) {
	initializeOptics(s);
}

function initializeOptics(s) {
	s.fog = new THREE.Fog(0x72645b, 2, 15);
	addTable(s);
}

function addTable(s) {
    var planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xbbbbbb,
        specular: 0x101010
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
	plane.name = 'table';
    // s.add(plane);
    plane.receiveShadow = true;
}

function updateScene(s) {
	updateOpticsScene(s);
}

function updateOpticsScene(s) {
	let m_plane1 = s.getObjectByName('group_0');
	let m_plane2 = s.getObjectByName('group_1');
	let s_table = s.getObjectByName('table');
}
