$(document).on('click','.savebutton',function(){
	var oldtheme = theme;
	theme = $('input[name=theme]:checked').attr('id');
	//console.log(oldtheme);
	$('.' + oldtheme).each(function(){
		if(!$(this).hasClass('theme')){
			$(this).removeClass(oldtheme);
			$(this).addClass(theme);
		}
		$('#content h1').css('color',$('.' + theme).css('background-color'));
		$('#content h2').css('color',$('.' + theme).css('background-color'));
	})
    localStorage.setItem("theme", theme)
    
    isTimer = $('input[name=timer]').prop('checked');
    localStorage.setItem("isTimer",isTimer)
})