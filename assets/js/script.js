jQuery(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}
	
	
	// The URL of your web server (the port is set in app.js)
	//var url = 'http://localhost:3000';
    var url = window.location.hostname;
	var positionx ='20';
	var positiony='0';



	var doc = jQuery(document),
		canvas = jQuery('#paper'),
		canvas1 = jQuery('#paper1'),
	instructions = jQuery('#instructions');
  var color = '#ff0000';
	// A flag for drawing activity
	var drawing = false;
	var clients = {};
	var cursors = {};
	
	//  funzione richiesta di nick name   
	
	var username = 'Guest';

if(!username)
{
	username = '';
} 


username = username.substr(0,20);	
var nameChanged;

$("#username").on('change',function(){
					var newName = $("#username").val();
					username = newName;
					nameChanged = true;
				});

var socket = io.connect(url); 
	
var ctx = canvas[0].getContext('2d');	
var ctx1 = canvas1[0].getContext('2d');	
var width = jQuery('#width').value;
var colorem;
    // Force canvas to dynamically change its size to the same width/height
    // as the browser window.
    canvas[0].width = document.body.clientWidth;
    canvas[0].height = document.body.clientHeight;

    // ctx setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth =  20;
 ctx.font = "20px Arial";

  
	// Generate an unique ID
	var id = Math.round(jQuery.now()*Math.random());
if (username =='')  {username = id }
jQuery('#write').keypress(function(e){
var code = e.keyCode;
if (code == '13') {
  if (document.getElementById('write').value.length > 0 ) {	
 var message = jQuery('#write').val();
	socket.emit('sendchat', message);
 /*socket.emit('chat',{
				'testochat': document.getElementById('write').value,				
				'id': id,
				'username' : username
			});*/
 //jQuery('<div class="memsg">me: <span style="color:#ffffff;">' + document.getElementById('write').value +'</span></div>').appendTo('#testichat');
  //document.getElementById('write').value ='';

var objDiv = document.getElementById("testichat");
objDiv.scrollTop = objDiv.scrollHeight;

}}
});

    var r = Math.floor(Math.random() * 255) + 70;
    var g = Math.floor(Math.random() * 255) + 70;
    var b = Math.floor(Math.random() * 255) + 70;
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
  
$('.file_button_container').change(function(e) {
        var file = e.target.files[0],
            imageType = /image.*/;
    if (!file.type.match(imageType))
            return;

        var reader = new FileReader();
        reader.onload = fileOnload;
    reader.readAsDataURL(file);  
		     
    });	

jQuery('#vedomonitor').click(function (){
if(document.getElementById('monitorcam').style.display == 'none')   { 
document.getElementById("monitorcam").style.display = 'block';
document.getElementById('vedomonitor').innerHTML = ' Hide webcam monitor ';
} else  {
document.getElementById('monitorcam').style.display = 'none';	
document.getElementById('vedomonitor').innerHTML = ' Show webcam monitor ';
}										  
});

jQuery('#paper').dblclick(function (e){
positionx = e.pageX;
positiony= e.pageY;
if (document.getElementById('write').value.length > 1 ) {
ctx.fillStyle = $('#minicolore').minicolors('rgbaString');
ctx.font =  document.getElementById('fontsize').value +"px Arial";
ctx.fillText(document.getElementById('write').value, e.pageX, e.pageY); 

socket.emit('doppioclick',{
				'x': e.pageX,
				'y': e.pageY,
				'write': document.getElementById('write').value,				
				'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'spessremo' : document.getElementById('width').value,
				'fontsizerem': document.getElementById('fontsize').value
			});

document.getElementById('write').value ='';
}	
									
});	
jQuery('#salvafoto').click(function (){
var dataURL = canvas[0].toDataURL();
document.getElementById("canvasimg").src = dataURL;  
window.open(document.getElementById("canvasimg").src, "toDataURL() image", "width=800, height=800");									
										  
});

 jQuery('#cancellalavagna').click(function (){
ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);													  
});
 
  socket.on('camperaltriser', function (data) {
var camdaclient = new Image();
camdaclient.src = data.camperaltridati;
camdaclient.onload = function() {
//	imgdaclient.src = data.fileperaltri;
ctx.drawImage(camdaclient,data.positionx,data.positiony,320,240);
}
});	
 
 
 socket.on('fileperaltriser', function (data) {
 
var imgdaclient = new Image();
imgdaclient.src = data.fileperaltri;
imgdaclient.onload = function() {
//	imgdaclient.src = data.fileperaltri;
ctx.drawImage(imgdaclient, data.positionx, data.positiony);
}
});	
	
 socket.on('doppioclickser', function (data) {
 ctx.fillStyle = data.color;
 ctx.font = data.fontsizerem + "px Tahoma";
	ctx.fillText(data.write, data.x, data.y); 
          
	});	
 
  socket.on('chatser', function (data) {
 
	//alert (data.testochat);
    jQuery('<div class="testochat">' + data.username +': ' + '<span style="color:#eae1ff;">'+ data.testochat +'</span></div>').appendTo('#testichat');         
document.getElementById('frecce').style.backgroundColor ='#ffff00';
var objDiv1 = document.getElementById("testichat");
objDiv1.scrollTop = objDiv1.scrollHeight;
	});	
 	
	socket.on('moving', function (data) {
		
		if(! (data.id in clients)){
			//data.username = $("#username").val();
			// a new user has come online. create a cursor for them
			cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.username +'</div>').appendTo('#cursors');
		}
		else{
			
				myCursor = cursors[data.id];
				if(myCursor.username != data.username){
					myCursor.remove();
					cursors[data.id] = jQuery('<div class="cursor"><div class="identif">'+ data.username +'</div>').appendTo('#cursors');
				}
			
			
		}
	// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
			
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer

            ctx.strokeStyle = data.color;
			drawLinerem(clients[data.id].x, clients[data.id].y, data.x, data.y,data.spessremo,data.color);
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = jQuery.now();
	});

  
 
	var prev = {};

    // To manage touch events
    // http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/

  //  document.addEventListener("touchstart", touchHandler, true);
  
// document.addEventListener("blur", cambiacolore(), true);
		  
   document.addEventListener("change", cambiaspessore, true);
  function cambiaspessore () {
	   ctx.lineWidth = document.getElementById('width').value;	   
}  
      
	canvas.on('mousedown', function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('mouseup mouseleave', function(){
		username = $("#username").val();
		drawing = false;
	});

	var lastEmit = jQuery.now();

	doc.on('mousemove', function(e){
								 
		if(jQuery.now() - lastEmit > 30){
//	document.getElementById('risultato').innerHTML = $('#minicolore').minicolors('rgbaString');
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
                'color': $('#minicolore').minicolors('rgbaString'),
				'id': id,
				'username' : document.getElementById('username').value,
				'spessremo' : document.getElementById('width').value,
				'nameChanged' : nameChanged,
			});
			nameChanged = false;
			lastEmit = jQuery.now();
		}
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){

       //     ctx.strokeStyle = document.getElementById('minicolore').value;
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});
	
	// Remove inactive clients after 10 seconds of inactivity
    setInterval(function(){
        var totalOnline = 0;
        for(var ident in clients){
            if(jQuery.now() - clients[ident].updated > 20000){

                // Last update was more than 10 seconds ago.
                // This user has probably closed the page

                cursors[ident].remove();
                delete clients[ident];
                delete cursors[ident];
            }
            else {
        }}
        jQuery('#onlineCounter').html('<i class="icon-eye-open"></i> '+totalOnline);
    },20000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.strokeStyle = $('#minicolore').minicolors('rgbaString');
		ctx.lineWidth = document.getElementById('width').value;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
	
	function drawLinerem(fromx, fromy, tox, toy,width,colorem){
		ctx.strokeStyle = colorem;
       ctx.lineWidth = width;	
        ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}

function fileOnload(e) {
        var img = $('<img>', { src: e.target.result });
		// alert(img.src.value);
   //     var canvas1 = $('#paper')[0];
   //     var context1 = canvas1.getContext('2d');
        img.load(function() {
            ctx.drawImage(this,300,10,600,400);
			socket.emit('fileperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'fileperaltri':  this.src
				});	
        });
    }
	
(function() {

  var streaming = false,
      video        = document.getElementById('video'),
  	paper1  = document.getElementById('paper1'),
      startbutton  = document.getElementById('catturacam'),
      width = 320,
      height = 240;

  navigator.getMedia = ( navigator.getUserMedia || 
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    { 
      video: true, 
      audio: false 
    },
    function(stream) {
      if (navigator.mozGetUserMedia) { 
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', 320);
      video.setAttribute('height', 240);
 //     canvas.setAttribute('width', width);
   //   canvas.setAttribute('height', height);
      streaming = true;
    }
	 video.setAttribute('width', 320);
      video.setAttribute('height', 240);
  }, false);

  function takepicture(e) {
 ctx.drawImage(video, positionx, positiony,320,240);
ctx1.drawImage(video,0,0,320,240);
var datacam = paper1.toDataURL('image/png');
// paper1 e ctx1 servono per prelevare solo i dati della webcam e inviarli al server per gli altri	
socket.emit('camperaltri',{
				'id': id,
				'positionx': positionx,
				'positiony': positiony,
				'camperaltridati':  datacam
				});			 
  }

  startbutton.addEventListener('click', function(ev){
												
      takepicture();
    ev.preventDefault();
  }, false);

})();




});

	