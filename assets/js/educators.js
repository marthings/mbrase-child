jQuery(document).ready(function($) {

	$select_county = $('#select-county-edu').selectize();

	var scounty = $select_county[0].selectize;

	var countyhandler = function() { 

		// get picked county
		var county = scounty.getValue();

		//$(".filter-result").empty();

		$('.filter-result').show();

		// Get all stores by county to populate list
		$.post(
			mbAjax.ajaxurl,
			{
				action : 'ajax_get_all_educators_by_county',
				county: county
			},
			function( response ) {

				for (p in response) {

					var source = $("#educator-results").html();
					var template = Handlebars.compile(source);
					var arr = { post : response };
					$('.filter-result').empty();
					$('.filter-result').prepend(template(arr));

				}
			}

		);
	};

	scounty.on('dropdown_close', countyhandler);

	// Get all countys
	$.post(
		mbAjax.ajaxurl,
		{
			action : 'ajax_get_all_countys_edu',
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


});

