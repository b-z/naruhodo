'use strict';

var videoTexture,
	refractMaterial1, // convex
	refractMaterial2, // concave
	refractMaterial3; // mirror

function createGlassTexture() {
	videoTexture = new THREE.VideoTexture(arToolkitSource.domElement);
	videoTexture.minFilter = THREE.LinearFilter;

	refractMaterial1 = new THREE.ShaderMaterial({
		uniforms: {
			texture: {
				value: videoTexture
			},
			refractionRatio: {
				value: 0.75
			},
			distance: {
				value: 1.0
			},
			opacity: {
				value: 0.8
			},
			tint: {
				value: new THREE.Vector3(1.0, 0.8, 0.8)
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		transparent: true,
		// side: THREE.DoubleSide
	});

	refractMaterial2 = new THREE.ShaderMaterial({
		uniforms: {
			texture: {
				value: videoTexture
			},
			refractionRatio: {
				value: 0.75
			},
			distance: {
				value: 1.0
			},
			opacity: {
				value: 0.8
			},
			tint: {
				value: new THREE.Vector3(0.8, 0.8, 1.0)
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		transparent: true,
		side: THREE.DoubleSide
	});

	refractMaterial3 = new THREE.ShaderMaterial({
		uniforms: {
			texture: {
				value: videoTexture
			},
			refractionRatio: {
				value: 0.75
			},
			distance: {
				value: 1.0
			},
			opacity: {
				value: 0.8
			},
			tint: {
				value: new THREE.Vector3(0.8, 1.0, 0.8)
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		transparent: true,
		side: THREE.DoubleSide
	});
}
