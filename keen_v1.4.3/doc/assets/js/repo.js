$(document).ready(function() {
	var repo = {
		formRegister: null,
		init: function() {
			repo.formInit();
		},
		formInit: function() {
			repo.formRegister = $('#repo-register-form');

			$(repo.formRegister).find('#submit').click(function(e) {
				e.preventDefault();

				var errorMsg = {
					'username': 'Github username is required',
					'email': 'Email is required',
					'order_id': 'Order ID is required',
					'g-recaptcha-response': 'reCaptcha is required',
				};

				var errors = [];
				$(repo.formRegister).find(':input').each(function(i, input) {
					if ($(input).val() === '') {
						errors.push(errorMsg[$(input).attr('name')]);
					}
				});
				if (errors.length > 0) {
					alert(errors.join('\n'));
					return;
				}

				repo.submitRegister();
			});
		},
		submitRegister: function() {
			var data = repo.objectifyForm($(repo.formRegister).serializeArray());
			$(repo.formRegister).find(':input').prop('disabled', true).addClass('disabled');

			return $.ajax({
				url: 'tools/preview/docs/repo-keen.php',
				method: 'POST',
				headers: ['Content-Type', 'application/json'],
				data: data,
			}).done(function(result) {
				if (result) {
					if ($.isEmptyObject(result.errors)) {
						repo.showAlert('Your request has been succesfully received. Please wait for the invitation email within a few hours.', 'alert-success');
					} else {
						repo.showAlert(result.errors.join('\n'), 'alert-danger');
					}
				}
			}).always(function() {
				$(repo.formRegister).find(':input').prop('disabled', false).removeClass('disabled');
				$(repo.formRegister).find(':input').each(function () {
					$(this).val('');
				});
				grecaptcha.reset();
			});
		},
		objectifyForm: function(serialized) {
			var obj = {};
			for (var i = 0; i < serialized.length; i++) {
				obj[serialized[i]['name']] = serialized[i]['value'];
			}
			return obj;
		},
		showAlert: function(message, alert, element) {
			if (typeof element === 'undefined') element = '#alert-message';
			$(element).show().
				removeAttr('class').
				addClass('alert ' + alert).
				html(message);
		},
	};

	repo.init();

});