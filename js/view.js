'use strict';

function saveScreenshot() {
	var w = 640;
	var h = 480;
	var $canvas = $('#canvas');
	var $video = $('video');
	var type = 'image/png';
	var ctx = $('#screenshot')[0].getContext('2d');
	ctx.drawImage($video[0], 0, 0, w, h);
	ctx.drawImage($canvas[0], 0, 0, w, h);
	var imgsrc = $('#screenshot')[0].toDataURL(type).replace(type, "image/octet-stream");
	var img = new Image();
	img.src = imgsrc;
	window.open(imgsrc);
}

window.addEventListener('keydown', function(e) {
	// console.log(e);
	switch (e.code) {
		case 'KeyS':
			saveScreenshot();
			break;
	}
});

function onResize() {
	// arToolkitSource.onResize(); // will change the size in <video>'s style

	var vw = $('video')[0].videoWidth;
	var vh = $('video')[0].videoHeight;

	var w = $('video').width();
	var h = w / vw * vh;
	$('#canvas').height(h);
	$('#canvas').width(h / 3 * 4);
	$('#canvas').css('left', (w - h / 3 * 4) / 2 + 'px');
	$('video').height(h);
	$('#app-container').height(h);

	// arToolkitSource.copySizeTo(renderer.domElement); // copy the style from <video> to <canvas>
	// if (arToolkitContext.arController !== null) {
	// 	arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
	// }
}

// handle resize event
window.addEventListener('resize', function() {
	onResize();
});
