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
	// loadApplication();
});

function loadApplication() {
    createWaterTexture();
	initialize();
    // createGlassTexture();
	initSettings();
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
	onChangeCoplanar();
	$('#number_of_rays').on('input change', onChangeNumberOfRays);
	$('#convex_lens_f').on('input change', onChangeConvexLensRadius);
	$('#concave_lens_f').on('input change', onChangeConcaveLensRadius);
	$('#spherical_mirror_f').on('input change', onChangeSphericalMirrorRadius);
	$('#divergence_angle').on('input change', onChangeDivergenceAngle);
	$('#use_point_light').change(onChangeUsePointLight);
	$('#coplanar').change(onChangeCoplanar);
}

function onChangeCoplanar() {
	data.coplanar = !$('#coplanar')[0].checked;
}

function onChangeNumberOfRays() {
	data.light.number_of_rays = parseInt($('#number_of_rays').val());
	$('#number_of_rays_label').text($('#number_of_rays').val());
}

function onChangeConvexLensRadius() {
	var f = parseFloat($('#convex_lens_f').val()) / 4;
	var radius = 2 / (1 / f / (data.convex_lens.n - 1));
	data.convex_lens.radius = radius;
	data.convex_lens.radius = Math.max(data.convex_lens.radius, data.convex_lens.r);
	$('#convex_lens_f_label').text($('#convex_lens_f').val());
	$('#convex_lens_radius_label').text(Math.round(radius * 4 * 100) / 100);
	if (scene) {
		var group = scene.getObjectByName('convex_lens');
		if (group) {
			var old = group.getObjectByName('element_conv');
			for (var c of old.children) {
				c.geometry.dispose();
				c.material.dispose();
			}
			group.remove(old);
			var mesh = createConvexLens(data.convex_lens);
			group.add(mesh);
		}
	}
}

function onChangeConcaveLensRadius() {
	var f = parseFloat($('#concave_lens_f').val()) / 4;
	var radius = 2 / (1 / f / (data.concave_lens.n - 1));
	data.concave_lens.radius = radius;
	data.concave_lens.radius = Math.max(data.concave_lens.radius, data.concave_lens.r);
	$('#concave_lens_f_label').text($('#concave_lens_f').val());
	$('#concave_lens_radius_label').text(Math.round(radius * 4 * 100) / 100);
	if (scene) {
		var group = scene.getObjectByName('concave_lens');
		if (group) {
			var old = group.getObjectByName('element_conv');
			for (var c of old.children) {
				c.geometry.dispose();
				c.material.dispose();
			}
			group.remove(old);
			var mesh = createConcaveLens(data.concave_lens);
			group.add(mesh);
		}
	}
}

function onChangeSphericalMirrorRadius() {
	var f = parseFloat($('#spherical_mirror_f').val()) / 4;
	var radius = f * 2;
	data.spherical_mirror.radius = radius;
	data.spherical_mirror.radius = Math.max(data.spherical_mirror.radius, data.spherical_mirror.r);
	$('#spherical_mirror_f_label').text($('#spherical_mirror_f').val());
	$('#spherical_mirror_radius_label').text(Math.round(radius * 4 * 100) / 100);
	if (scene) {
		var group = scene.getObjectByName('spherical_mirror');
		if (group) {
			var old = group.getObjectByName('element_sphe');
			old.geometry.dispose();
			old.material.dispose();
			group.remove(old);
			var mesh = createSphericalMirror(data.spherical_mirror);
			group.add(mesh);
		}
	}

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
