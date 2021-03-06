$(function() {
	addItems(1,30);
});

$("#dialog-form").dialog({
	autoOpen : false,
	height : 900,
	width : 360,
	modal : true,
	buttons : {
		"submit" : function() {
			$("#dialog-form").dialog("close");
			$("#coreIframe").contents().find("#addComicForm").submit();
			$('#coreIframe').load(function(){  
				try{
						addItems(pageNo,pageSize);
				}catch(e){
					console.log(e);
				}
			   });
		},
	},
	close : function() {
	}
});
$("#create-level").click(function() {
	$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" scrolling="no" src="level_challenge_upload.html" frameborder="0" style="height: 530px; width: 330px;"></iframe>');
	$("#dialog-form").dialog("open");
});

var pageNo,pageSize;
var baselevelData;
var challengelevelData;
function addItems(page,size){
	pageNo = page;
	pageSize = size;
	var url = "api/level/listRegularPage?page="+page+"&size="+size;
	$.get(url, function( data ) {}).done(function(data) {
		var result = "";
		baselevelData = data.result;
		$(data.result).each(function(index, value) {
			var content = '<tr>'+
				/*'<td class="center"><span class="thumbnail" style="width: 100px;margin-bottom:0px !important"><a title="'+baselevelData[value].desc+'" href="'+value.path+'"><img src="'+value.thumbnail_path+'"/></a><span></td>'+*/
				'<td class="center">'+validate(value.level)+'</td>'+
				'<td class="center">'+validate(value.title)+'</td>'+
				'<td class="center">'+validate(value.shortdesc)+'</td>'+
				'<td class="center">'+validate(value.desc)+'</td>'+
				'<td class="center">'+validate(value.regular_stage)+'</td>'+
				'<td class="center">'+validate(value.completeNum)+'</td>'+
				'<td class="center">'+validate(value.title2)+'</td>'+
				'<td class="center">'+validate(value.shortdesc2)+'</td>'+
				'<td class="center">'+validate(value.desc2)+'</td>'+
				'<td class="center">'+validate(value.sumcoins)+'</td>'+
				'<td class="center">'+validatecoins(value)+'</td>'+
				'<td class="center">'+
				'<a class="btn btn-info" onclick="update_regular('+index+')" href="#"><i class="icon icon-black icon-edit"></i>Edit</a>&nbsp;'+
			'</td>'+
			'</tr>';
			result = result+content;
		});
		$("#regular_level_tbody").html(result);
	});
	var url = "api/level/listChallengePage?page="+page+"&size="+size;
	$.get(url, function( data ) {}).done(function(data) {
		var result = "";
		challengelevelData = data.result;
		$(data.result).each(function(index, value) {
			var content = '<tr>'+
			/*'<td class="center"><span class="thumbnail" style="width: 100px;margin-bottom:0px !important"><a title="'+value.desc+'" href="'+value.path+'"><img src="'+value.thumbnail_path+'"/></a><span></td>'+*/
			'<td class="center">'+validate(value.level)+'</td>'+
			'<td class="center">'+validate(value.title)+'</td>'+
			'<td class="center">'+validate(value.shortdesc)+'</td>'+
			'<td class="center">'+validate(value.desc)+'</td>'+
			'<td class="center">'+validate(value.completeNum)+'</td>'+
			'<td class="center">'+validate(value.sumcoins)+'</td>'+
			'<td class="center">'+validatecoins(value)+'</td>'+
			'<td class="center">'+
			'<a class="btn btn-info" onclick="update_challenge('+index+')" href="#"><i class="icon icon-black icon-edit"></i>Edit</a>&nbsp;'+
			'<a class="btn btn-danger" onclick="deleteLevel('+value.id+')" href="#"><i class="icon icon-black icon-trash"></i>Delete</a>'+
			'</td>'+
			'</tr>';
			result = result+content;
		});
		$("#challenge_level_tbody").html(result);
		pagination(page,size,data.count);
	});

}
function validate(value){
	if(value==null||value==undefined){
		return '';
	}else{
		return value;
	}
}
function pagination(page,size,count){
	if(page==0){
		$(".pagination_ul").html("");
		return;
	}
	var max ;
	if(count%size==0){
		max= parseInt(count/size);
	}else{
		max= parseInt(count/size)+1;
	}
		var innerHtml_pre;
		if(page>=3){
			innerHtml_pre = '<li><a onclick="addItems(1,'+size+')" href="#" title="1">|<</a></li>'+
							'<li><a onclick="addItems('+(page-2)+','+size+')" href="#">'+(page-2)+'</a></li>'+
							'<li><a onclick="addItems('+(page-1)+','+size+')" href="#">'+(page-1)+'</a></li>';
		}else{
			if(page==1){
				innerHtml_pre = '';
			}
			if(page==2){
				innerHtml_pre = '<li><a onclick="addItems(1,'+size+')" href="#">1</a></li>';
				
			}
		}
		var innerHtml_active = '<li class="active"><a onclick="addItems('+page+','+size+')" href="#">'+page+'</a></li>';
		
		var innerHtml_suffix ='';
		if(max-page>=3){
			innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>'+
								'<li><a onclick="addItems('+(page+2)+','+size+')" href="#">'+(page+2)+'</a></li>'+
								'<li><a title="'+max+'" href="#" onclick="addItems('+max+','+size+')">>|</a></li>';
		}else{
			if(max-page==0){
				innerHtml_suffix = '';
			}
			if(max-page==1){
				innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>';
			}
			if(max-page==2){
				innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>'+
									'<li><a onclick="addItems('+(page+2)+','+size+')" href="#">'+(page+2)+'</a></li>';
			}
		}
		$(".pagination_ul").html(innerHtml_pre+innerHtml_active+innerHtml_suffix);
}
function validatecoins(level){
	var greenNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	var yellowNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	var redNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
			greenNum=level.greenRatio;
			if(greenNum>10&&greenNum<100){
				greenNum = "&nbsp;&nbsp;"+greenNum;
			}else if(greenNum<10){
				greenNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+greenNum;
			}
			yellowNum=level.yellowRatio;
			if(yellowNum>10&&yellowNum<100){
				yellowNum = "&nbsp;&nbsp;"+yellowNum;
			}else if(yellowNum<10){
				yellowNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+yellowNum;
			}
			redNum=level.redRatio;
			if(redNum>10&&redNum<100){
				redNum = "&nbsp;&nbsp;"+redNum;
			}else if(redNum<10){
				redNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+redNum;
			}
	var spans = '<span style="background-color:#E2EFD9; padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	greenNum+'%</span><span style="background-color:rgb(255, 243, 203); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	yellowNum+'%</span><span style="background-color:rgb(255, 153, 153); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	redNum+'%</span>';/*value.coins*/
	return spans;
}

function deleteLevel(id){
	$.get("api/level/delete/" + id, function(data) {
	}).done(function(data) {
		addItems(pageNo,pageSize);
	});
}
//function update_regular(id,level,title,shortdesc,desc,title2,shortdesc2,desc2,completeNum,sumcoins,greenRatio,yellowRatio,redRatio,regular_stage){
function update_regular(value){
	$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" scrolling="no" src="level_regular_upload.html?id='+baselevelData[value].id+'&level='+baselevelData[value].level+'&title='+baselevelData[value].title+'&shortdesc='+baselevelData[value].shortdesc+'&desc='+baselevelData[value].desc+'&title2='+baselevelData[value].title2+'&desc2='+baselevelData[value].desc2+'&shortdesc2='+baselevelData[value].shortdesc2+'&completeNum='+baselevelData[value].completeNum+'&sumcoins='+baselevelData[value].sumcoins+'&greenRatio='+baselevelData[value].greenRatio+'&yellowRatio='+baselevelData[value].yellowRatio+'&redRatio='+baselevelData[value].redRatio+'&regular_stage='+baselevelData[value].regular_stage+'" frameborder="0" style="height: 760px; width: 330px;"></iframe>');
	$("#dialog-form").dialog("open");
}
//function update_challenge(id,level,title,shortdesc,desc,completeNum,sumcoins,greenRatio,yellowRatio,redRatio,regular_stage){
function update_challenge(value){
	$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" scrolling="no" src="level_challenge_upload.html?id='+challengelevelData[value].id+'&level='+challengelevelData[value].level+'&title='+challengelevelData[value].title+'&shortdesc='+challengelevelData[value].shortdesc+'&desc='+challengelevelData[value].desc+'&completeNum='+challengelevelData[value].completeNum+'&sumcoins='+challengelevelData[value].sumcoins+'&greenRatio='+challengelevelData[value].greenRatio+'&yellowRatio='+challengelevelData[value].yellowRatio+'&redRatio='+challengelevelData[value].redRatio+'&regular_stage='+challengelevelData[value].regular_stage+'" frameborder="0" style="height: 530px; width: 330px;"></iframe>');
	$("#dialog-form").dialog("open");
}