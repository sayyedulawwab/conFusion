$(document).ready(function () {
	$('#mycarousel').carousel({
		interval: 2000,
	});
	$('#carouselButton').click(function () {
		if ($('#carouselButton span').hasClass('fa-pause')) {
			$('#mycarousel').carousel('pause');
			$('#carouselButton span').removeClass('fa-pause');
			$('#carouselButton span').addClass('fa-play');
		} else if ($('#carouselButton span').hasClass('fa-play')) {
			$('#mycarousel').carousel('cycle');
			$('#carouselButton span').removeClass('fa-play');
			$('#carouselButton span').addClass('fa-pause');
		}
	});
	$('#loginBtn').click(function () {
		$('#loginModal').modal('show');
	});
	$('#loginModalClose, #loginModalCancel').click(function () {
		$('#loginModal').modal('hide');
	});

	$('#reserveBtn').click(function () {
		$('#reserveModal').modal('show');
	});
	$('#reserveModalClose, #reserveModalCancel').click(function () {
		$('#reserveModal').modal('hide');
	});
});
