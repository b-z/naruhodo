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
	if ($('video')[0] !== undefined) {
		var vw = $('video')[0].videoWidth;
		var vh = $('video')[0].videoHeight;
		var w = $('video').width();
		var h = w / vw * vh;
		$('#canvas').height(h);
		$('#canvas').width(h / 3 * 4);
		$('#canvas').css('left', (w - h / 3 * 4) / 2 + 'px');
		$('video').height(h);
		$('#app-container').height(h);
	}
	// arToolkitSource.copySizeTo(renderer.domElement); // copy the style from <video> to <canvas>
	// if (arToolkitContext.arController !== null) {
	// 	arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
	// }
}

// handle resize event
window.addEventListener('resize', function() {
	onResize();
});

$(document).ready(function() {
	initSettings();
	// loadApplication();
});

function loadApplication() {
	initialize();
	animate();
}

function hideMask() {
	$('#logo-mask').fadeOut(250);
}

function initSettings() {
	onChangeNumberOfRays();
	onChangeConvexLensRadius();
	onChangeConcaveLensRadius();
	onChangeSphericalMirrorRadius();
	onChangeDivergenceAngle();
	onChangeUsePointLight();
	$('#number_of_rays').on('input change', onChangeNumberOfRays);
	$('#convex_lens_radius').on('input change', onChangeConvexLensRadius);
	$('#concave_lens_radius').on('input change', onChangeConcaveLensRadius);
	$('#spherical_mirror_radius').on('input change', onChangeSphericalMirrorRadius);
	$('#divergence_angle').on('input change', onChangeDivergenceAngle);
	$('#use_point_light').change(onChangeUsePointLight);
}

function onChangeNumberOfRays() {
	data.light.number_of_rays = parseInt($('#number_of_rays').val());
	$('#number_of_rays_label').text($('#number_of_rays').val());
}

function onChangeConvexLensRadius() {
	data.convex_lens.radius = parseFloat($('#convex_lens_radius').val());
	$('#convex_lens_radius_label').text($('#convex_lens_radius').val());
}

function onChangeConcaveLensRadius() {
	data.concave_lens.radius = parseFloat($('#concave_lens_radius').val());
	$('#concave_lens_radius_label').text($('#concave_lens_radius').val());
}

function onChangeSphericalMirrorRadius() {
	data.spherical_mirror.radius = parseFloat($('#spherical_mirror_radius').val());
	$('#spherical_mirror_radius_label').text($('#spherical_mirror_radius').val());
}

function onChangeDivergenceAngle() {
	data.light.divergence_angle = parseFloat($('#divergence_angle').val());
	$('#divergence_angle_label').text($('#divergence_angle').val());
	data.light.d = 0.5 / Math.sin(data.light.divergence_angle / 180 * Math.PI / 2);
}

function onChangeUsePointLight() {
	data.light.use_point_light = $('#use_point_light')[0].checked;
	if (data.light.use_point_light) {
		$('#divergence_angle_container').show();
	} else {
		$('#divergence_angle_container').hide();
	}
}
