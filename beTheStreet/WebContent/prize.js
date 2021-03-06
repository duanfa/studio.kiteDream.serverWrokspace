$(function() {
	addItems(1,30);
});

$("#dialog-form").dialog({
	autoOpen : false,
	height : 600,
	width : 330,
	modal : true,
	buttons : {
		"submit" : function() {
			$("#dialog-form").dialog("close");
			$("#coreIframe").contents().find("#addComicForm").submit();
			$('#coreIframe').load(function(){  
						addItems(pageNo,pageSize);
			  });
		},
	},
	close : function() {
	}
});
$("#create-level").click(function() {
	$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" scrolling="no" src="prize_upload.html" frameborder="0" style="height: 480px;"></iframe>');
	$("#dialog-form").dialog("open");
});

var pageNo,pageSize;
var baselevelData;
function addItems(page,size){
	pageNo = page;
	pageSize = size;
	var url = "api/prize/listPage?page="+page+"&size="+size;
	$.get(url, function( data ) {}).done(function(data) {
		var result = "";
		baselevelData = data.result;
		$(data.result).each(function(index, value) {
			var statu = "";
			if(value.sellState==1){
				statu = '<span id="statu'+value.id+'"><span class="label label-success">ON SALE</span><span>';
			}else{
				statu = '<span id="statu'+value.id+'"><span class="label label-important">SOLD OUT</span><span>';
			}
			var content = '<tr>'+
				'<td class="center"><span class="thumbnail" style="width: 100px;margin-bottom:0px !important"><a class="cboxElement" title="'+value.desc+'" href="'+value.headPhoto+'"><img src="'+value.thumbnail_path+'"/></a><span></td>'+
				'<td class="center">'+validate(value.title)+'</td>'+
				'<td class="center">'+validate(value.description)+'</td>'+
				'<td class="center">'+validate(value.num)+'</td>'+
				'<td class="center">'+validatecoins(value.coins)+'</td>'+
				'<td class="center">'+statu+'</td>'+
				'<td class="center">'+
				'<a class="btn btn-info" onclick="update('+index+')" href="#"><i class="icon icon-black icon-edit"></i>Edit</a>&nbsp;'+
				'<a class="btn btn-danger" onclick="deletePrize('+value.id+')" href="#"><i class="icon icon-black icon-trash"></i>Delete</a>'+
			'</td>'+
			'</tr>';
			result = result+content;
		});
		$("#user_tbody").html(result);
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
		
		var innerHtml_suffix = '';
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
function validatecoins(coins){
	var greenNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	var yellowNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	var redNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	if(coins==null||coins==undefined){
		 greenNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
		 yellowNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
		 redNum='&nbsp;&nbsp;&nbsp;&nbsp;0';
	}else{
		if((coins.greenNum!=null)&&(coins.greenNum!=undefined)){
			greenNum=coins.greenNum;
			if(greenNum>10&&greenNum<100){
				greenNum = "&nbsp;&nbsp;"+greenNum;
			}else if(greenNum<10){
				greenNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+greenNum;
			}
		}
		if((coins.yellowNum!=null)&&(coins.yellowNum!=undefined)){
			yellowNum=coins.yellowNum;
			if(yellowNum>10&&yellowNum<100){
				yellowNum = "&nbsp;&nbsp;"+yellowNum;
			}else if(yellowNum<10){
				yellowNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+yellowNum;
			}
		}
		 if((coins.redNum!=null)&&(coins.redNum!=undefined)){
			 redNum=coins.redNum;
			 if(redNum>10&&redNum<100){
				 redNum = "&nbsp;&nbsp;"+redNum;
				}else if(redNum<10){
					redNum = "&nbsp;&nbsp;&nbsp;&nbsp;"+redNum;
				}
		 }
	}
	var spans = '<span style="background-color:#E2EFD9; padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	greenNum+'</span><span style="background-color:rgb(255, 243, 203); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	yellowNum+'</span><span style="background-color:rgb(255, 153, 153); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">'+
	redNum+'</span>';/*value.coins*/
	return spans;
}
function deletePrize(id){
	$.get("api/prize/delete/" + id, function(data) {
	}).done(function(data) {
		addItems(pageNo,pageSize);
	});
}
function update(value){
	//'<a class="btn btn-info" onclick="update(\''+value.id+'\',\''+value.title+'\',\''+value.description+'\',\''+value.num+'\',\''+value.coins.greenNum+'\',\''+value.coins.yellowNum+'\',\''+value.coins.redNum+'\',\''+value.sellState+'\')" href="#"><i class="icon icon-black icon-edit"></i>Edit</a>&nbsp;'+
	$("#dialog-form").html('<iframe id="coreIframe" name="coreIframe" scrolling="no" src="prize_upload.html?id='+baselevelData[value].id+'&title='+baselevelData[value].title+'&description='+baselevelData[value].description+'&num='+baselevelData[value].num+'&greenNum='+baselevelData[value].coins.greenNum+'&yellowNum='+baselevelData[value].coins.yellowNum+'&redNum='+baselevelData[value].coins.redNum+'&sellState='+baselevelData[value].sellState+'" frameborder="0" style="height: 480px;"></iframe>');
	$("#dialog-form").dialog("open");
}