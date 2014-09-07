jQuery(document).ready(function($) {

	$('#stores-show-list').click(function() {
		
		$('.filter-result').show();
		$(this).addClass('selected');
		$('#stores-show-map').removeClass('selected');

		google.maps.event.trigger(map, 'resize');

	});

	$('#stores-show-map').click(function() {
		$('.filter-result').hide();
		$(this).addClass('selected');
		$('#stores-show-list').removeClass('selected');
	});


	$select_county = $('#select-county').selectize();

	var scounty = $select_county[0].selectize;

	$select_city = $('#select-city').selectize();

	var scity = $select_city[0].selectize;

	$select_store = $('#select-store').selectize();

	var sstore = $select_store[0].selectize;

	var countyhandler = function() { 

		// get picked county
		var county = scounty.getValue();

		// change map center and zoom with geocoder
		codeAddress(county, 8);

		// clear city and store selects
		scity.clearOptions();
		sstore.clearOptions();

		// Get all cities by county
		$.post(
			mbAjax.ajaxurl,
			{
				action : 'ajax_get_all_cities_by_county',
				county: county
			},
			function( response ) {

				$.each( response, function( key, value ) {
					scity.addOption({value:value,text:value }); 
					scity.addItem(value);
				});

				scity.refreshItems();
				scity.clear();
			}

		);

		$("#map-filter-result").empty();

		// Get all stores by county to populate list
		$.post(
			mbAjax.ajaxurl,
			{
				action : 'ajax_get_all_stores_by_county',
				county: county
			},
			function( response ) {

				for (p in response) {

					var store_id = response[p].store_id;
					var store_title = response[p].post_title;
					var link = response[p].permalink;
					var city = response[p].city;

					$("#map-filter-result").append('<li><div class="result-title"><a href="' + link + '">' + store_title +'</a></div><span class="badge">' + city + '</span></li>');
				}

				google.maps.event.trigger(map, 'resize');
			}

		);
	};

	scounty.on('dropdown_close', countyhandler);

	var cityhandler = function() { 

		// get picked city
		var _city = scity.getValue();

		// change map center and zoom with geocoder
		codeAddress(_city, 12);

		// clear previously picked stores from list
		sstore.clearOptions();

		$("#map-filter-result").empty();

		// Get all stores by city
		$.post(
			mbAjax.ajaxurl,
			{
				action : 'ajax_get_all_stores_by_city',
				city: _city
			},
			function( response ) {

				for (p in response) {

					var latitude = response[p].lat;
					var longitude = response[p].long;
					var store_id = response[p].store_id;
					var store_title = response[p].post_title;
					var city = response[p].city;
					var link = response[p].permalink;

					if (latitude === undefined || latitude === null || longitude  === undefined || longitude === null) {
						
					} else {
						tmpLatLng = new google.maps.LatLng( latitude, longitude);
						sstore.addOption({value:store_id,text:store_title }); 
						sstore.addItem(store_id);
					}

					$("#map-filter-result").append('<li><div class="result-title"><a href="' + link +'">' + store_title +'</a></div><span class="badge">' + city + '</span></li>');
				}
				sstore.refreshItems();
				sstore.clear();

				google.maps.event.trigger(map, 'resize');
			}
		);
	};

	scity.on('dropdown_close', cityhandler);

	var storehandler = function() { 

		// get picked store
		var _store = sstore.getValue();
		
		// Get all stores by city
		$.post(
			mbAjax.ajaxurl,
			{
				action : 'ajax_get_store_by_id',
				id: _store
			},
			function( response ) {

				for (p in response) {

					var latitude = response[p].lat;
					var longitude = response[p].long;
					var store_id = response[p].store_id;
					var store_title = response[p].post_title;

					if (latitude === undefined || latitude === null || longitude  === undefined || longitude === null) {
						
					} else {
						tmpLatLng = new google.maps.LatLng( latitude, longitude);
						map.setCenter(tmpLatLng);
						map.setZoom(16);
					}
				}
			}
		);
	};

	sstore.on('dropdown_close', storehandler);

	// Get all countys
	$.post(
		mbAjax.ajaxurl,
		{
			action : 'ajax_get_all_countys',
		},
		function( response ) {
			
			$.each( response, function( key, value ) {

				scounty.addOption({value:value,text:value }); 
				scounty.addItem(value);

			});

			scounty.refreshItems();
			scounty.clear();
		}

	);

	// Get all cities
jQuery.post(
	mbAjax.ajaxurl,
	{
		action : 'ajax_get_map_markers',
	},
	function( response ) {

		initialize();

		for (p in response) {

			var latitude = response[p].lat;
			var longitude = response[p].long;
			var store_title = response[p].post_title;
			var store_content = response[p].post_content;
			var phonenumber = response[p].phonenumber;

			var streetname = response[p].streetname;
			var zipcode = response[p].zipcode;
			var city = response[p].city;

			var link = response[p].permalink;

			if (latitude === undefined || latitude === null || longitude  === undefined || longitude === null) {
				
			} else {

				tmpLatLng = new google.maps.LatLng( latitude, longitude);

				// make and place map maker.
				var marker = new google.maps.Marker({
					map: map,
					position: tmpLatLng,
					title : store_title
				});

				var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h2>' + store_title +'</h2>'+
					'<div id="bodyContent">'+
					'<p><b>Telefonnummer: </b>' + phonenumber + '</p>' +
					'<p><a href="' + link +'"> Visa butikssida </a></p>' +
					'</div>'+
					'</div>';

				bindInfoWindow(marker, map, infowindow, contentString);

				markers.push(marker);

			}

		}
		
	}

);

	// Get all cities
	/*
	$.post(
		mbAjax.ajaxurl,
		{
			action : 'ajax_get_all_cities',
		},
		function( response ) {

			console.log(response);
			
			$.each( response, function( key, value ) {

				scity.addOption({value:value,text:value }); 
				scity.addItem(value);

			});

			scity.refreshItems();
			scity.clear();
		}

	);
	*/
	

});

// Google maps

var geocoder;
var map;
var places;
var markers = [];
var geocoder;

function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(60.586967,15.637665),
		zoom: 4,
		scrollwheel: false,
		noClear: false,
	};
	var myLatLng = new google.maps.LatLng(60.586967,15.637665);

	geocoder = new google.maps.Geocoder();

	map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
	
}


var markersarray;

var infowindow =  new google.maps.InfoWindow({
		content: ''
});



// binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
	});
} 

function codeAddress(address, zoom) {
	var _address = address;
	var _zoom = zoom;

	geocoder.geocode( { 'address': _address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setZoom(_zoom);
		} 
	});
}

//google.maps.event.addDomListener(window, 'load', initialize);
