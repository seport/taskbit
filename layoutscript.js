$(document).ready(function(){
	if(localStorage.theme){
		theme = localStorage.theme;
	} else{
		theme = 'cyan';
	}

	//setting theme
	$('.addtheme').each(function(){
		$(this).removeClass('addtheme');
		$(this).removeClass('transparent')
		$(this).addClass(theme);
	})

	$('#content h1').css('color',$('.' + theme).css('background-color'));
	$('#content h2').css('color',$('.' + theme).css('background-color'));

	// Initialize collapse button
	$(".button-collapse").sideNav();
	// Initialize collapsible (uncomment the line below if you use the dropdown variation)
	//$('.collapsible').collapsible();

	//////FOR SETTINGS////////
	//checking the current theme
	$('input[name=theme][id=' + theme + ']').prop('checked',true);
})