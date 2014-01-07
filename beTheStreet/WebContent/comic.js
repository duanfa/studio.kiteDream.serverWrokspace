var jsonData ;
$(function() {
	$("#dialog-form").dialog({
		autoOpen : false,
		height : 300,
		width : 350,
		modal : true,
		buttons : {
			"add" : function() {
				$("#dialog-form").dialog("close");
				$("#coreIframe").contents().find("#addComicForm").submit();
			},
		},
		close : function() {
		}
	});
	$("#create-comic").click(function() {
		$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" src="comic_upload.html" frameborder="0"></iframe>');
		$("#dialog-form").dialog("open");
	});
	addItems();
});

function addItems(){
	$.get("api/comic/list/all", function( data ) {}).done(function(data) {
		jsonData = data;
		var result = "";
		$(data).each(function(index, value) {
			var levelhead = '<div class="row-fluid sortable">'+
			'<div class="box span12">'+
				'<div class="box-header well" data-original-title>'+
					'<h2><i class="icon-picture"></i> level '+value[0].level+'</h2>'+
					'<div class="box-icon">'+
						'<a href="#" class="btn btn-setting btn-round"><i class="icon-cog"></i></a>'+
						'<a href="#" class="btn btn-minimize btn-round"><i class="icon-chevron-up"></i></a>'+
						'<a href="#" class="btn btn-close btn-round"><i class="icon-remove"></i></a>'+
					'</div>'+
				'</div>'+
				'<div class="box-content">'+
					'<br/>'+
					'<ul class="thumbnails gallery">';
			result = result+levelhead;
			$(value).each(function(i, v) {
				 
				var comic = '<li id="image-1" class="thumbnail">'+
									'<a style="background:url('+v.path+')" title="'+v.name+'" href="'+v.path+'"><img class="grayscale" src="'+v.path+'" alt="'+v.info+'"></a>'+
								'</li>';
				result = result+comic;				
			});
			var leveltail = '</ul>'+
			'</div>'+
		'</div>'+
	'</div>';
			result = result+leveltail;	
		});
		$("#level-comic-content").html(result);
	});

}
function deleteMsg(msgId){
	$.get("api/helloMessage/del/"+msgId, function( data ) {}).done(function(data) {
		addItems();
	});
}