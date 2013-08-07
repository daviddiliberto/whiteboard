	var socket;
		$(document).ready(function(){
      socket = io.connect('http://bored.io');

			// on connection to server, ask for user's name with an anonymous callback
			socket.on('connect', function(){
				uname = "Guest";
				socket.emit('adduser', uname);
				document.getElementById('username').value = uname;
			});

			// listener, whenever the server emits 'updatechat', this updates the chat body
			socket.on('updatechat', function (username, data) {
				/*if(username != "SERVER")
					username = document.getElementById('username').value; */
				jQuery('<div class="memsg"><b>'+ username +': </b><span style="color:#000000;">' + data +'</span></div>').appendTo('#testichat');
				document.getElementById('write').value ='';
				//$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
			});

			// listener, whenever the server emits 'updaterooms', this updates the room the client is in
			socket.on('updaterooms', function(rooms, current_room) {
				$('#rooms').empty();
				$.each(rooms, function(key, value) {
					if(value == current_room){
						$('#rooms').append('<div>' + value + '</div>');
					}
					else {
						$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
					}
				});
			});

			

			// on load of page
			/*$(function(){
				// when the client clicks SEND
				$('#datasend').click( function() {
					var message = $('#data').val();
					$('#data').val('');
					// tell server to execute 'sendchat' and send along one parameter
					socket.emit('sendchat', message);
				});

				// when the client hits ENTER on their keyboard
				$('#data').keypress(function(e) {
					if(e.which == 13) {
						$(this).blur();
						$('#datasend').focus().click();
					}
				});
			});	*/
			
			
				var canvas = document.getElementById("paper"),
				context = canvas.getContext("2d"),
				img = document.createElement("img"),
				mouseDown = false,
				brushColor = "rgb(0, 0, 0)",
				hasText = true,
				clearCanvas = function () {
					if (hasText) {
						context.clearRect(0, 0, canvas.width, canvas.height);
						hasText = false;
					}
				};
				// Image for loading	
				img.addEventListener("load", function () {
					clearCanvas();
					context.drawImage(img, 0, 0);
				}, false);
				
				// To enable drag and drop
				canvas.addEventListener("dragover", function (evt) {
					evt.preventDefault();
				}, false);

				// Handle dropped image file - only Firefox and Google Chrome
				canvas.addEventListener("drop", function (evt) {
					var files = evt.dataTransfer.files;
					if (files.length > 0) {
						var file = files[0];
						if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
							var reader = new FileReader();
							// Note: addEventListener doesn't work in Google Chrome for this event
							reader.onload = function (evt) {
								img.src = evt.target.result;
								socket.emit('dropImage',evt.target.result);
							};
							reader.readAsDataURL(file);
						}
					}
					evt.preventDefault();
				}, false); 

				$("#showContacts").click(function(){
					//console.log(socket.id);
					//var clients = io.sockets.clients(socket.id);
					socket.emit('askForClients');
					//alert(clients);
				
				});
				
				socket.on("addImage",function(data){
					img.src = data;
				});
				
				$("#username").change(function(){
					var newName = $("#username").val();
					socket.emit("changeUserName",newName);
				});
				
				/*$.fn.switchRoom = function() {
				  alert('hello world');
			   }; */
		
		});
		
		
		function switchRoom(room){
				socket.emit('switchRoom', room);
			}
		$(document).ready(function() {
	$("#monitorcam").draggable({ cursor: "move" });			
	document.getElementById('monitorcam').style.display ='none';	
	$('#minicolore').minicolors(
	{
	opacity:true
	}
	);	
	});	