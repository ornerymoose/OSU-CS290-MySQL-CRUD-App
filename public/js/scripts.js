$(document).ready(function(){
	editTableData();
	$('.insert-data').prop('disabled', true);
	$('#workout-name').keyup(function() {
		if ($(this).val().length <= 3) {
			$('.insert-data').prop('disabled', true);
        } else {
        	$('.insert-data').prop('disabled', false);
        }
    });
	$(document).on('click', '.insert-data', function() {
		console.log("inside insert-data click event");
		var data = $("#insert-form").serializeArray();
		$.ajax({
			data: data,
			type: "post",
			url: "/insert",
			success: function(data){
				console.log("data.lbs: " + data.lbs);
				if (data.lbs == 1){
					data.lbs = "Lbs"
				} else {
					data.lbs = "Kgs";
				}
				var editAndDeleteButtons = '<button type="button" class="btn btn-default edit-row" id="' + data.id + '" data-toggle="modal" data-date="' + data.date + '" data-weight="' + data.weight + '" data-reps="' + data.reps + '" data-id="' + data.id + '" data-name="' + data.name + '" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp;<button type="button" class="btn btn-default delete-row"  id="'+data.id+'"><span class="glyphicon glyphicon-trash"></span></button>';
				console.log("data.name: " + data.name);
				//need to add in logic if there is currently no rows, it wouldnt be append itd be create
				$('.table tbody').append("<tr id='workout-"+data.id+"'><td>" + data.name + "</td><td>" + data.reps + "</td><td>" + data.weight + "</td><td>" + data.date + "</td><td>" + data.lbs + "</td><td>" + editAndDeleteButtons + "</td></tr>");
				resetForm($('form'));
				$('.insert-data').prop('disabled', true);
				editTableData();
			},
			error: function(response) {
          		console.log("Error...");
          		console.log(response);
      		}
		});
		return false;
	});

	$(document).on('click','.update-submit',function() {
		var id = $(this).attr('id');
    	$(".modal").modal('hide');
    	var name = $("#workout-name-edit").val();
    	var weight = $("#workout-weight-edit").val();
    	var date = $("#workout-date-edit").val();
    	var reps = $("#workout-reps-edit").val();
    	var lbs = $("#workout-lbs-edit").val();
    	console.log("lbs value: " + lbs);
    	var measurementFlag;
    	if (lbs == 1){
    		measurementFlag = "Kgs";
    	} else if (lbs == 0) {
    		measurementFlag = "Lbs";
    	}
    	//console.log("#workout-reps-edit: " + lbs);
    	var payload = {id: id, name: name, reps: reps, weight: weight, date: date, lbs: measurementFlag};
		$.ajax({
			data: payload,
			type: "get",
			url: "/update",
			success: function(data){
				console.log(JSON.parse(JSON.stringify(data)));;
				var editAndDeleteButtons = '<button type="button" class="btn btn-default edit-row" id="' + payload.id + '" data-toggle="modal" data-date="' + payload.date + '" data-weight="' + payload.weight + '" data-reps="' + payload.reps + '" data-id="' + payload.id + '" data-name="' + payload.name + '" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp;<button type="button" class="btn btn-default delete-row"  id="'+payload.id+'"><span class="glyphicon glyphicon-trash"></span></button>';
				//need to add in logic if there is currently no rows, it wouldnt be append itd be create
				$("#workout-"+payload.id).replaceWith("<tr id='workout-"+payload.id+"'><td>" + payload.name + "</td><td>" + payload.reps + "</td><td>" + payload.weight + "</td><td>" + payload.date + "</td><td>" + payload.lbs + "</td><td>" + editAndDeleteButtons + "</td></tr>");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
          		console.log("Error...");
          		console.log("XMLHttpRequest: " + XMLHttpRequest);
          		console.log("textStatus: " + textStatus);
          		console.log("errorThrown: " + errorThrown)
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

function editTableData(){
	$('.table').on('click','.edit-row',function(){
		console.log("edit-row button was clicked...");
		var measurement = $(this).parent().parent().find('td:eq(4)').text();
		$('#myModal').modal({
    		keyboard: true,
    		backdrop: "static",
    		show:false,
			//http://stackoverflow.com/questions/34288662/bootstrap-how-to-show-data-from-row-in-modal-window
    	}).on('show.bs.modal', function(e){
			var id = $(e.relatedTarget).data('id');
			$(".update-submit").attr('id', id);
			var name = $(e.relatedTarget).attr('data-name');
			var reps = $(e.relatedTarget).data('reps');
			var weight = $(e.relatedTarget).data('weight');
			var date = $(e.relatedTarget).data('date');
			$("#workout-title").html(name);
			$("#workout-name-edit").val(name);
			$("#workout-reps-edit").val(reps);
			$("#workout-weight-edit").val(weight);
			$("#workout-date-edit").val(date);
			if (measurement == "Lbs"){
				$("#workout-lbs-edit").prop('checked', true);	
				$("#workout-lbs-edit").val(1);
			} else {
				$("#workout-lbs-edit").prop('checked', false);
				$("#workout-lbs-edit").val(0);
			}
	    });
	});
}
