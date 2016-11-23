$(document).ready(function(){
	$(document).on('click','.delete-row',function(){
		var id = $(this).attr('id');
		var payload = {id: id};
		$.ajax({
			url: '/delete',
			type: 'post',
			data: payload,
			success: function(response) {
          		$('.table tr#workout-'+response.id).remove();
      		},
      		error: function(response) {
          		console.log("Error...");
          		console.log(response);
      		}
		});	
	});
});
