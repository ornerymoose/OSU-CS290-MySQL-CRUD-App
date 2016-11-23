$(document).ready(function(){
	$('#myModal').modal({
        keyboard: true,
        backdrop: "static",
        show:false,
    //http://stackoverflow.com/questions/34288662/bootstrap-how-to-show-data-from-row-in-modal-window
    }).on('show.bs.modal', function(e){
		var id = $(e.relatedTarget).data('id');
		var name = $(e.relatedTarget).data('name');
		var reps = $(e.relatedTarget).data('reps');
		var weight = $(e.relatedTarget).data('weight');
		var date = $(e.relatedTarget).data('date');
		$("#workout-title").html(name);
		$("#workout-name-edit").val(name);
		$("#workout-reps-edit").val(reps);
		$("#workout-weight-edit").val(weight);
		$("#workout-date-edit").val(date);
    });
	$(document).on('click','.insert-data',function() {
		var data = $("form").serializeArray();
		$.ajax({
			data: data,
			type: "post",
			url: "/insert",
			success: function(data){
				var editAndDeleteButtons = '<button type="button" class="btn btn-default edit-row" id="' + data.id + '" data-toggle="modal" data-date="' + data.date + '" data-weight="' + data.weight + '" data-reps="' + data.reps + '" data-id="' + data.id + '" data-name="' + data.name + '" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp;<button type="button" class="btn btn-default delete-row"  id="'+data.id+'"><span class="glyphicon glyphicon-trash"></span></button>';
				//need to add in logic if there is currently no rows, it wouldnt be append itd be create
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

	//http://stackoverflow.com/questions/680241/resetting-a-multi-stage-form-with-jquery
	function resetForm($form) {
		$form.find('input:text, input[type=number], input[type=date]').val('');
		$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	}
});
