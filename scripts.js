$(document).ready(function(){
	//global variables
	selected = null;
	pause = false;
	lastdown = 0;
	menu = false;
	theme = 'rose';

	//setting theme
	if(localStorage.theme){
		theme = localStorage.theme;
	} else{
		theme = 'cyan';
	}

	$('.addtheme').each(function(){
		$(this).removeClass('addtheme');
		$(this).removeClass('transparent');
		$(this).addClass(theme);
	})

	//setting the sound clips
	startsound = document.createElement('audio');
	startsound.setAttribute('src','start.mp3');

	// Initialize collapse button
	$(".button-collapse").sideNav();
	// Initialize collapsible (uncomment the line below if you use the dropdown variation)
	//$('.collapsible').collapsible();

	//Retrieving saved tasks from localStorage
	var routines;
	if(localStorage.routines){
		routines = JSON.parse(localStorage.routines);
		if(routines.length < 1){
			routines = [{id:Date.now(),name:"New Routine",table:[]}];
		}
	}
	else{
		routines = [{id:Date.now(),name:"New Routine",table:[]}];
	}
	console.log(routines);

	for(l=0; l<routines.length; l++){
		var table = '<div id="' + routines[l].id + '" class="routine"><div class="start"><button class="waves-effect waves-light btn ' + theme + ' startbutton">Start</button></div><div class="pause"><button class="waves-effect waves-light btn ' + theme + ' pausebutton">Pause</button><button class="waves-effect waves-light btn ' + theme + ' stopbutton">Stop</button></div><table class="table draggable"><tr class="head"><th>Task</th><th>Duration</th><th></th></tr></table><button class="waves-effect waves-light btn ' + theme + ' addrowbutton">Add Task</button><br/><button class="waves-effect waves-light btn ' + theme + ' savebutton">Save Routine</button><button class="waves-effect waves-light btn ' + theme + ' renamebutton">Rename Routine</button><button class="waves-effect waves-light btn ' + theme + ' deletebutton">Delete Routine</button></div>';
		$("#tables").append(table);
		for(j=0; j<routines[l].table.length; j++){
			var newrow = "<tr><td>" + routines[l].table[j].task + "</td><td class='time'>" + parseInt(routines[l].table[j].seconds) + "</td><td class='displaytime'>" + formattime(parseInt(routines[l].table[j].seconds)) + "</td><td><a class='waves-effect waves-" + theme + " btn-flat removetaskbutton'>Delete</a></td></tr>";
			$("#" + routines[l].id + " table").append(newrow);
		}
		if(routines[l].table.length < 1){
			$("#" + routines[l].id).find(".addrowbutton").click();
		}
		var title = '<li class="tab pickroutinebutton" id="' + routines[l].id + 'title"><a href="#' + routines[l].id + '">' + routines[l].name + '</a></li>';
		$(title).insertBefore($(".newroutinebutton"));
	}
	$('ul.tabs').tabs();
	$(".routine").hide();
	$(".routine:nth-child(1)").show();
    $('ul.tabs').tabs('select_tab', $(".pickroutinebutton:first-child").attr('id').replace("title",""));

	//formatting the display times
	$("tr").each(function(index){
		$(this).find(".displaytime").text(formattime($(this).find(".time").text()));
	})
})


/*
**event responses
*/
//new routine
$(document).on('click','.newroutinebutton',function(){
	$("#tables").children().hide();
	var id = Date.now()
	var newroutine = '<div id="' + id + '" class="routine"><div class="start"><button class="waves-effect waves-light btn ' + theme + ' startbutton">Start</button></div><div class="pause"><button class="waves-effect waves-light btn ' + theme + ' pausebutton">Pause</button><button class="waves-effect waves-light btn ' + theme + ' stopbutton">Stop</button></div><table class="table draggable"><tr class="head"><th>Task</th><th>Duration</th><th></th></tr></table><button class="waves-effect waves-light btn ' + theme + ' addrowbutton">Add Task</button><br/><button class="waves-effect waves-light btn ' + theme + ' savebutton">Save Routine</button><button class="waves-effect waves-light btn ' + theme + ' renamebutton">Rename Routine</button><button class="waves-effect waves-light btn ' + theme + ' deletebutton">Delete Routine</button></div>';
	$("#tables").append(newroutine)
	var newroutinelink = '<li class="tab pickroutinebutton highlightroutine" id="' + id + 'title"><a href="#' + id + '">New Routine</a></li>'
	$(newroutinelink).insertBefore($(".newroutinebutton"));
	$("#" + id).find('.addrowbutton').click();
    $('ul.tabs').tabs('select_tab', id);
})
//pick routine
$(document).on('click','.pickroutinebutton',function(event){
	$(".stopbutton").click()
	id = $(this).attr("id").replace("title","");
	$(".pickroutinebutton").removeClass("highlightroutine");
	$(this).addClass("highlightroutine");
	$("#tables div").not(".start").not(".pause").hide();
	$("#" + id).show();
}).on('click','.pickroutinebutton input',function(event){
	event.stopPropagation();
})
//rename routine
$(document).on('click','.renamebutton',function(){
	if($("#" + $(this).closest(".routine").attr("id") + "title a").html() == "<input>"){
		$("#" + $(this).closest(".routine").attr("id") + "title a").html($("#" + $(this).closest(".routine").attr("id") + "title input").val())
		//$(event.target).closest("h1").html($(event.target).val())
	} else {
	$("#" + $(this).closest(".routine").attr("id") + "title a").html("<input></input>");
	}
})
$(document).on('keyup.renamebutton',function(event){
	if(event.keyCode == 13){
		$(event.target).closest("li a").html($(event.target).val())
	}
})
//delete routine
$(document).on('click','.deletebutton',function(){
	var id = $(this).closest(".routine").attr("id");
	if(id != $(".pickroutinebutton:first-child").attr("id").replace("title","")){
		var focusid = $("#" + $(this).closest(".routine").attr("id") + "title").prev().attr("id").replace("title","");
	}
	else{
		var focusid = $("#" + $(this).closest(".routine").attr("id") + "title").next().attr("id").replace("title","");
	}
	$(this).closest(".routine").remove();
	$("#" + $(this).closest(".routine").attr("id") + "title").remove();
	$('ul.tabs').tabs('select_tab', focusid);
	$("#" + focusid).show();	
})

//on start
$(document).on('click','.startbutton',function(){
	var id = $(this).closest(".routine").attr("id");
	start(2, id);
	$(".start").hide();
	$(".pause").show();
})
//when you click on a table row
$(document).on('mousedown','tr',function(event){
	lastdown = Date.now()
	row = $(this)
	islong = setTimeout(function(){
		if(!row.hasClass("head")){
			$(".stopbutton").click();
			select(row)
		}
	}, 500);
}).on('mousedown','tr a',function(event){
	event.stopPropagation();
}).on('mousedown','tr button',function(event){
	event.stopPropagation();
})
$(document).on('mouseup','tr',function(event){
	clearTimeout(islong)
	//if short click:
	if(Date.now() - lastdown < 500){
		var id = $(this).closest(".routine").attr("id");
		if(!$(this).hasClass("new") && !$(this).hasClass("head")){
			clearInterval(timer)
			start($("#" + id + " tr").index($(this)) + 1,id);
			pause = false;
			$(".pausebutton").html('Pause');
		}
	}
	//if long click:
	else{
		unselect($(this));
	}
}).on('mouseup','tr a',function(event){
	event.stopPropagation();
}).on('mouseup','tr button',function(event){
	event.stopPropagation();
})

$(document).on('mouseup',function(event){
	unselect($(this));
})
//on pause
$(document).on('click','.pausebutton',function(){
	if(pause == true){
		pause = false;
		$(".pausebutton").html('Pause');
	}
	else{
		pause = true;
		$(".pausebutton").html('Resume');
	}
})
//on stop
$(document).on('click','.stopbutton',function(){
	var id = $(this).closest(".routine").attr("id");
	clearInterval(timer)
	$("#timer").html(formattime(0));
	pause = false;
	$("#" + id + " tr").removeClass("highlight");
	$("#" + id + " tr").removeClass(theme);
	$("#" + id + " tr").removeClass("lighten-4");

	$(".start").show();
	$(".pause").hide();
})
//on new row
$(document).on('click','.addrowbutton',function(){
	var id = $(this).closest(".routine").attr("id");
	newrow = "<tr class='new'><td><input name='task'></td><td><input name='duration'></td><td><button class='waves-effect waves-" + theme + " btn-flat addtaskbutton'>Add</button></td></tr>";
	$("#" + id + " table").append(newrow);
})
//on add task
$(document).on('click','.addtaskbutton',function(){
	if(!isNaN(parseInt($(this).closest("tr").find("input[name=duration]").val()))){
		$(this).closest("tr").removeClass('new');
		var place = $("tr").index($(this).closest("tr")) + 1;
		var newrow = "<td>" + $(this).closest("tr").find("input[name=task]").val() + "</td><td class='time'>" + parseInt($(this).closest("tr").find("input[name=duration]").val()) + "</td><td class='displaytime'>" + formattime(parseInt($(this).closest("tr").find("input[name=duration]").val())) + "</td><td><button class='waves-effect waves-" + theme + " btn-flat removetaskbutton'>Delete</button></td>";
		$(this).closest("tr").html(newrow);
	}
	else{
		alert("Sorry! The time you have chosen is invalid.");
	}
})
//on remove task
$(document).on('click','.removetaskbutton',function(){
	var id = $(this).closest(".routine").attr("id");
	var place = $("#" + id + " tr").index($(this).closest("tr")) + 1;
	if($("#" + id + " tr").index($(".highlight")) == $("#" + id + " tr").index($(this).closest("tr"))){
		start(place+1,id);
	}
	$("#" + id + " table tr:nth-child(" + place + ")").remove();
})
//on reorder
$(document).on('mouseover','.draggable tr',function(){
	if(!$(this).hasClass("head")){
		switchitems($(this));
	}
})
//on save
$(document).on('click','.savebutton',function(){
	var routines = [];
	$("#titles li").each(function(){
		if($(this).attr("id")){
			var id = $(this).attr("id").replace("title","");
			var name = $(this).first().html();
			name = name.replace(/<[^>]+>/g,"")
			var tasks = [];
			console.log($("#" + id + " table tr").length)
			for(j=1;j<= $("#" + id + " table tr").length; j++){
				if(!isNaN($("#" + id + " table tr:nth-child(" + j + ") td:nth-child(2)").html())){
					console.log($("#" + id + " table tr:nth-child(" + j + ") td:nth-child(1)").html() + " " + $("#" + id + " table tr:nth-child(" + j + ") td:nth-child(2)").html())
					tasks.push({id:j,task:$("#" + id + " table tr:nth-child(" + j + ") td:nth-child(1)").html(),seconds:$("#" + id + " table tr:nth-child(" + j + ") td:nth-child(2)").html()})
				}
				console.log(tasks)
			}
			routines.push({id:id,name:name,table:tasks});
		}
	})
	console.log(JSON.stringify(routines))
	localStorage.setItem("routines", JSON.stringify(routines))
	console.log(localStorage.routines)
	alert('saved!')
})

//on mobile long tap
$(document).on("longtap",".draggable tr",function(e){
	e.preventDefault();
	if ("vibrate" in navigator) {
		navigator.vibrate(500);
	}
	select($(this));
})
//on mobile touch end
$(document).on("touchend",function(){
	unselect($(this));
})
//on mobile touch move
$(document).on("touchmove",function(e){
	if(selected){
  	e.preventDefault();
  	shouldswitch(e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY,$(this));
  }
})


/*
**functions
*/

//start timer for a particular task
function start(i, id) {
	$(".start").hide();
	$(".pause").show();
	clearInterval(timer);
	ilimit = $("#" + id + " table tr").length;
	if(i <= ilimit){
		if($("#" + id + " tr:nth-child(" + i + ")").hasClass("new")){
			start(i+1, id)
		}
		else{
			if ("vibrate" in navigator) {
				// vibration API supported
				// vibrate for one second
				navigator.vibrate([1000,500,1000]);
			}
			startsound.play();
			$("#" + id + " tr").removeClass("highlight");
			$("#" + id + " tr").removeClass(theme);
			$("#" + id + " tr").removeClass("lighten-4");
			$("#" + id + " tr:nth-child(" + i + ")").addClass("highlight");
			$("#" + id + " tr:nth-child(" + i + ")").addClass(theme);
			$("#" + id + " tr:nth-child(" + i + ")").addClass("lighten-4");
			time = $("#" + id + " table tr:nth-child(" + i + ")").find(".time").html();
			$("#timer").html(formattime(time));
			timer = setInterval('countdown(' + i + ',' + id + ')', 1000);
		}
	}
	else{
		clearInterval(timer)
		$("#" + id + " tr").removeClass("highlight");
		$("#" + id + " tr").removeClass(theme);
		$("#" + id + " tr").removeClass("lighten-4");
		$(".start").show();
		$(".pause").hide();
		alert("congratulations on completing your morning routine!")
	}
}
//decrements time by one
function countdown(i, id){
	if(pause == true){
		console.log('paused');
	}
	else if(time<=0){
		$("#timer").html(formattime(0));
		clearInterval(timer);
		console.log(i+1 + " " + id)
		start(i+1, id)

	}
	else{
		time --;
		$("#timer").html(formattime(time));
	}
	return 0;
}
//from seconds to h:mm:ss
function formattime(s){
	var h = Math.floor(s/3600);
	s -= h*3600;
	var m = Math.floor(s/60);
	s -= m*60;
	return h+":"+(m <10 ? '0'+m : m)+":"+(s<10 ? '0'+s : s);
}

//select for reordering
function select(el){
	console.log(el)
	el.addClass("selected");
	selected = el;
}
//drop for ordering
function unselect(el){
	if(selected){
    selected.removeClass("selected");
    selected = false;
  }
}
//switch orders
function switchitems(el){
	var id = el.closest(".routine").attr("id");
	if(selected){
		console.log(id)
  	if($("#" + id + " tr").index(el) == $("#" + id + " tr").index(selected)){
    	console.log("same")
    }
    else if($("#" + id + " tr").index(el) > $("#" + id + " tr").index(selected)){
  		selected.insertAfter(el);
    }
    else{
      selected.insertBefore(el);
    }
  }
}
//detect if you should switch (mobile)
function shouldswitch(x,y,el){
	var id = selected.closest(".routine").attr("id");
	$("#" + id + " tr").each(function(){
  	if(!(x <= $(this).offset().left || x >= $(this).offset().right + $(this).outerWidth() || y <= $(this).offset().top || y >= $(this).offset().top + $(this).outerHeight())){
    	switchitems($(this));
    }
    else{
    }
  })
}