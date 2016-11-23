$(document).ready(function(){
	$(document).on('click','.insert-data',function() {
		var data = $("form").serializeArray();
		$.ajax({
			data: data,
			type: "post",
			url: "/insert",
			success: function(data){
				var editAndDeleteButtons = '<button type="button" class="btn btn-default edit-row" id="' + data.id + '"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp;<button type="button" class="btn btn-default delete-row"  id="'+data.id+'"><span class="glyphicon glyphicon-trash"></span></button>';
				$('.table tbody').append("<tr id='workout-"+data.id+"'><td>" + data.name + "</td><td>" + data.reps + "</td><td>" + data.weight + "</td><td>" + data.date + "</td><td>testLbs" + "</td><td>" + editAndDeleteButtons + "</td></tr>");
				resetForm($('form'));
			},
			error: function(response) {
          		console.log("Error...");
          		console.log(response);
      		}
		});
		
		return false;
	});

	$('.table').on('click','.delete-row',function(){
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

	function resetForm($form) {
    	$form.find('input:text, input[type=number], input[type=date]').val('');
    	$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	}
});
