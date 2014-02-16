$(function() {
	addItems(1,10);
});

function addItems(page,size){
	$.get("api/user/list/page?page="+page+"&size="+size, function( data ) {}).done(function(data) {
		var result = "";
		$(data.result).each(function(index, value) {
			var content = '<tr>'+
				/*'<td><img src="'+validateHeadPhoto(value.headPhoto)+'"/></img></td>'+*/
			/*	'<td>'+validate(value.name)+'</td>'+*/
				'<td>'+validate(value.nickname)+'</td>'+
				'<td class="center">'+validate(value.level)+'</td>'+
				'<td class="center">'+validate('<span style="background-color:#E2EFD9; padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">1</span><span style="background-color:rgb(255, 243, 203); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">2</span><span style="background-color:rgb(255, 153, 153); padding-left: 20px; padding-top: 5px; padding-bottom: 15px;">3</span>'/*value.coins*/)+'</td>'+
				'<td class="center">'+validate("1")+'</td>'+
				'<td class="center">'+validate("4/10")+'</td>'+
				'<td class="center">'+validate("23")+'</td>'+
				'<td class="center">'+validate("46:23:12")+'</td>'+
				'<td class="center">'+validate("Music"/*value.group.type*/)+'</td>'+
				'<td class="center">'+validate("UC Berkeley"/*value.group.org*/)+'</td>'+
				'<td class="center">'+validate("Swim Team"/*value.group.nam*/)+'</td>'+
				'<td class="center">'+validate("true"/*value.group.create*/)+'</td>'+
				'<td class="center">'+
					'<a class="btn btn-info" href="image.html?userid='+value.id+'"><i class="icon-picture icon-white"></i>Image</a>&nbsp;'+
				'</td>'+
			'</tr>';
			result = result+content;
		});
		/* <th>Nickname</th>
										<!-- <th>Username</th> -->
										<th>register time</th>
										<th>account</th>
										<th>level</th>
										<th>score</th>
										<th>logins</th>
										<th>total time</th>
										<th>group type</th>
										<th>group org</th>
										<th>gruop name</th>
										<th>Actions</th> */
		$("#user_tbody").html(result);
		pagination(page,size);
	});

}
function validate(value){
	if(value==null||value==undefined){
		return '';
	}else{
		return value;
	}
}
function validateHeadPhoto(value){
	if(value==null||value==undefined){
		return 'comicDir/user_portrait.jpg';
	}else{
		return value;
	}
}
function pagination(page,size){
	if(page==0){
		$(".pagination").html("");
		return;
	}
	$.get("api/user/count", function( data ) {}).done(function(data) {
		var max = parseInt(data/size)+1;
		console.log(data);
		console.log(max);
		var innerHtml_pre;
		if(page>=3){
			innerHtml_pre = '<ul>'+
							'<li><a onclick="addItems(1,'+size+')" href="#" title="1">|<</a></li>'+
							'<li><a onclick="addItems('+(page-2)+','+size+')" href="#">'+(page-2)+'</a></li>'+
							'<li><a onclick="addItems('+(page-1)+','+size+')" href="#">'+(page-1)+'</a></li>';
		}else{
			if(page==1){
				innerHtml_pre = '<ul>';
			}
			if(page==2){
				innerHtml_pre = '<ul>'+
				'<li><a onclick="addItems(1,'+size+')" href="#">1</a></li>';
				
			}
		}
		var innerHtml_active = '<li class="active"><a onclick="addItems('+page+','+size+')" href="#">'+page+'</a></li>';
		
		var innerHtml_suffix ;
		if(max-page>=3){
			innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>'+
								'<li><a onclick="addItems('+(page+2)+','+size+')" href="#">'+(page+2)+'</a></li>'+
								'<li><a title="'+max+'" href="#" onclick="addItems('+max+','+size+')">>|</a></li>'+
						'</ul>';
		}else{
			if(max-page==0){
				innerHtml_suffix = '</ul>';
			}
			if(max-page==1){
				innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>'+
						'</ul>';
			}
			if(max-page==2){
				innerHtml_suffix = 	'<li><a onclick="addItems('+(page+1)+','+size+')" href="#">'+(page+1)+'</a></li>'+
									'<li><a onclick="addItems('+(page+2)+','+size+')" href="#">'+(page+2)+'</a></li>'+
				'</ul>';
			}
		}
		console.log(innerHtml_pre);
		console.log(innerHtml_active);
		console.log(innerHtml_suffix);
		
		$(".pagination").html(innerHtml_pre+innerHtml_active+innerHtml_suffix);
	});
}
function searchUser(){
	var keyWord = $("#userName").val();

	$.get("api/user/search?keyword="+keyWord, function( data ) {}).done(function(data) {
		var result = "";
		$(data.result).each(function(index, value) {
			var statu = "";
			if(value.active==true){
				statu = '<span class="label label-success">Active</span>';
			}else{
				statu = '<span class="label label-important">Inactive</span>';
			}
			var content = '<tr>'+
				'<td><img src="'+validateHeadPhoto(value.headPhoto)+'"/></img></td>'+
				'<td>'+validate(value.name)+'</td>'+
				'<td>'+validate(value.nickname)+'</td>'+
				'<td class="center">'+validate(value.email)+'</td>'+
				'<td class="center">'+validate(value.address)+'</td>'+
				'<td class="center">'+validate(value.cellphone)+'</td>'+
				'<td class="center">'+statu+'</td>'+
				'<td class="center">'+
					'<a class="btn btn-info" href="user_image.html?userid='+value.id+'"><i class="icon-picture icon-white"></i>Image</a>&nbsp;'+
					/*'<a class="btn btn-info" href="_userImage.html?userid='+value.id+'"><i class="icon-picture icon-white"></i>Image_old</a>&nbsp;'+*/
				'</td>'+
			'</tr>';
			result = result+content;
		});
		$("#user_tbody").html(result);
		pagination(0,0);
		$("#close_search").click();
	});
}

