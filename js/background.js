$(function() {
  var animation_speed = 1200;
  
  var foreground = $('#foreground');
  var midground = $('#midground');
  var background = $('#background');
  
  var wSpace = ($(window).width() - background.width()) / 2;
  var hSpace = ($(window).height() - background.height()) / 2;
  
  foreground.css('margin-bottom', 0);
  midground.css('margin-bottom', 0);
  background.css('margin-bottom', -background.height() / 4);
  
  $(window).click(function (){
    if(foreground.css('margin-bottom') == "0px"){
		$('#title').animate({'margin-top': $(window).height() * 1.25}, animation_speed);
		
		foreground.delay(100).animate({'margin-bottom': -foreground.height()}, animation_speed);
		midground.delay(300).animate({'margin-bottom': -midground.height()}, animation_speed);
		$('#body').css('background', '#D75C6A');
    }
  });
});
