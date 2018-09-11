'use strict';

var scene, camera, renderer, clock, deltaTime, totalTime, winResize;

var arToolkitSource, arToolkitContext;


function initialize() {
	scene = new THREE.Scene();

	// let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
	// scene.add(ambientLight);

	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		preserveDrawingBuffer: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.renderReverseSided = false;
	renderer.setSize(640, 480);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	renderer.domElement.id = 'canvas';
	// winResize = new THREEx.WindowResize(renderer, camera);
	$('#app-container').append(renderer.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType: 'webcam',
		sourceWidth: 640,
		sourceHeight: 480,
		displayWidth: 640,
		displayHeight: 480,
	});

	arToolkitSource.init(function onReady() {
		onResize();
		setTimeout(hideMask, 100);
	});

	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para-iPhone.dat',
		detectionMode: 'color_and_matrix',
		matrixCodeType: '3x3',
		maxDetectionRate: 30,
		canvasWidth: 640,
		canvasHeight: 480,
		imageSmoothingEnabled: true
	});

	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// let loader = new THREE.TextureLoader();
	// let texture = loader.load( 'images/border.png' );

	// let patternArray = ["letterA", "letterB", "letterC", "letterD", "letterF", "kanji", "hiro"];
	let colorArray = [0xff0000, 0xff8800, 0xffff00, 0x00cc00, 0x0000ff, 0xcc00ff, 0xcccccc];
	for (let i = 0; i <= 5; i++) {
		let markerRoot = new THREE.Group();
		let group = new THREE.Group();
		markerRoot.name = 'marker_' + i;
		group.name = 'group_' + i;
		scene.add(markerRoot);
		scene.add(group);
		let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			size: 1,
			type: 'barcode',
			barcodeValue: i,
			minConfidence: 0.1
		});

		let mesh = new THREE.Mesh(
			new THREE.CubeGeometry(0.1, 0.1, 0.1),
			// new THREE.MeshBasicMaterial({color:colorArray[i], map:texture, transparent:true, opacity:0.5})
			new THREE.MeshPhongMaterial({
				color: colorArray[i],
				// transparent: true,
				// opacity: 0.5,
			})
		);
		// mesh.castShadow = true;
		// mesh.receiveShadow = true;
		mesh.position.y = 1; // 1 / 2;
		// markerRoot.add(mesh);

		var helper = new THREE.GridHelper(1.25, 16);
		// helper.position.y = -0.5999;
		helper.position.y = 0;
		// helper.material.opacity = 0.9;
		// helper.material.transparent = true;
		group.add(helper);

		var axis = new THREE.AxesHelper();
		axis.scale.set(1, 1, 1);
		// axis.position.set(0, 0.5, 0);
		group.add(axis);
		group.matrixAutoUpdate = true;
	}
	initializeScene(scene);
}


function update() {
	// update artoolkit on every frame
	if (arToolkitSource.ready !== false) {
		arToolkitContext.update(arToolkitSource.domElement);
		updateScene(scene);
	}
}


function render() {
	renderer.render(scene, camera);
}


function animate() {
	setTimeout(function() {
		requestAnimationFrame(animate);
	}, 100);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
