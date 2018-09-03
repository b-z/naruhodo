'use strict';

function saveScreenshot() {
	var w = 1280;
	var h = 960;
	var $canvas = $('#canvas');
	var $video = $('video');
	var type = 'image/png';
	var ctx = $('#screenshot')[0].getContext('2d');
	ctx.drawImage($video[0], 0, 0, w, h);
	ctx.drawImage($canvas[0], 0, 0, w, h);
	var imgsrc = $('#screenshot')[0].toDataURL(type).replace(type, "image/octet-stream");
	var img = new Image();
	img.src = imgsrc;
	window.location.href = imgsrc;
}

window.addEventListener('keydown', function(e) {
	// console.log(e);
	switch (e.code) {
		case 'KeyS':
			saveScreenshot();
			break;
	}
});
