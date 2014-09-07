jQuery(document).ready(function($) {

	$('.quiz-container').addClass('hidden');

	$('#start-quiz').click(function() {
		$('.quiz-container').removeClass('hidden');
		$('.quiz-header').addClass('hidden');
		$('.question-wrapper').addClass('hidden');
		$('#question-number-1').removeClass('hidden');
	});

	$('#quiz-show-result').click(function() {
		$('.quiz-pagination').addClass('hidden');
		$('.quiz-container').removeClass('hidden');
		$('.quiz-result').removeClass('hidden');
		$('.question-wrapper').removeClass('hidden');
		$('.correct-quiz-answer').removeClass('hidden');
		$('input[name=quizRadio]').attr("disabled",true);

		var correct_q = $('.qcr-asw-flag').length;
		var total_q = $('#total-question-number').val();

		var correct_string_result = correct_q + ' av ' + total_q;

		$('#quiz-total-correct-answers').empty().append(correct_string_result);

	});

	
	$('input[name="quizRadio"]:radio' ).change(function() {
		
		var correct_answer = parseInt($(this).val());

		// is correct answer
		if(correct_answer === 1) {
			$(this).closest('.question-wrapper').find('.correct-quiz-answer').empty().append('<div class="alert alert-success qcr-asw-flag">Rätt svar!</div>');
		} else {
			// wrong answer
			var correct_string = $(this).closest('.question-wrapper').find('.correct-answer').val();
			$(this).closest('.question-wrapper').find('.correct-quiz-answer').empty().append('<div class="alert alert-danger">Fel! Rätt svar ska vara: ' + correct_string + '</div>');
		}

	});

	$('#quiz-previous-question').click(function() {

		if($(this).hasClass('disabled')) {
			// Button is disabled
		} else {

			$('#quiz-show-result').addClass('hidden');
			$('#quiz-next-question').removeClass('hidden');

			var current_q = parseInt($('#current-question-id').val());

			$('.question-wrapper').addClass('hidden');

			$('#quiz-next-question').removeClass('disabled');

			current_q--;

			$('#current-question-id').val(current_q);

			if(current_q <= 1) {
				$(this).addClass('disabled');
			}
			else {
				$(this).removeClass('disabled');
			}

			$('#question-number-' + current_q).removeClass('hidden');

		}
		

	});

	$('#quiz-next-question').click(function() {

		if($(this).hasClass('disabled')) {
			// Button is disabled
		} else {

			var current_q = parseInt($('#current-question-id').val());

			$('.question-wrapper').addClass('hidden');

			current_q++;

			$('#current-question-id').val(current_q);

			var total_q = $('#total-question-number').val();

			$('#quiz-previous-question').removeClass('disabled');

			if(current_q >= total_q) {
				//$(this).addClass('disabled');

				$(this).addClass('hidden');
				$('#quiz-show-result').removeClass('hidden');

			} else {
				$(this).removeClass('disabled');
			}

			if(current_q <= 1) {
				$('#quiz-previous-question').addClass('disabled');
			}

			$('#question-number-' + current_q).removeClass('hidden');

		}

	});

});