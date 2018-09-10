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

function generateTexture() {
	var canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	var context = canvas.getContext('2d');
	var image = context.getImageData(0, 0, 256, 256);
	var x = 0,
		y = 0;
	for (var i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
		x = j % 256;
		y = x == 0 ? y + 1 : y;
		image.data[i] = 128;
		image.data[i + 1] = 128;
		image.data[i + 2] = 128 + Math.floor(x ^ y) / 2;//255;
		image.data[i + 3] = Math.floor(x ^ y);
	}
	context.putImageData(image, 0, 0);
	// document.body.appendChild(canvas);
	return canvas;
}
