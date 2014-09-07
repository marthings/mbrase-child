jQuery(document).ready(function($) {
	$('.no-touch select').selectize();
	$('.js-sub-nav-toggler').click(function(){
		$('.sub-nav ul').fadeToggle();
	});
});