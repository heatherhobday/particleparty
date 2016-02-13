$(function() {
	var animation_speed = 1000;
	var maxParticles = 1000;
	var animSpeed = 5000;
	var velConstant = 16;
	var bool=1;
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var timeoutHandle;
	var controllerUsed = true;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Container for all the particles, fields, and emitters and player input
	var particles = []
	var emitters = []
	var rightHand = new PlayerHand(0, 0);
	var lastEmitter = 0;
	
	//Radial point
	var colors = ['#162955', '#4F628E', '#7887AB', '#887CAF', '#226666', '#B45A81']
	var radial = $("#background");
	var xCoord = '1px';
	var yCoord = '0px';
	radial.css('margin-left', 0);
	var temp = true;
	
	// Creates some emitters at the top
	for(m = 0; m < 10; m++){
		emitters.push(new Emitter($(window).width() / 10 * (m + 0.5), (m * -50), 0, 0, 0, 0));
	}
	
	// Initialize the starting animations
	addNewParticles(1);

	// Starts the loop sequence
	loop();
	
	// Enables the background animation
	$(window).click(function (){
		if($('#foreground').css('margin-bottom') == "0px"){
			xCoord = '0px';
			$('#body').css('transition', 'background 13s');
			$('#body').css('background', colors[0]);
			timeoutHandle = setTimeout(changeColor, '14000');
		}
	});
	
	// Changes the color of the background
	function changeColor() {
		var color = colors[Math.floor(Math.random() * colors.length)];
		
		while(color == $("#body").css("background")){
			color = colors[Math.floor(Math.random() * colors.length)];
		}
		
		$('#body').css('background', color);
		timeoutHandle = setTimeout(changeColor, '14000');
	}
	
	// Checker that it is constantly run to test if the coords need to be updated
	function checkCoords() {
		if($('#foreground').css('margin-bottom') == $('#foreground').height()){
			if(radial.css('margin-left') - xCoord <= '2px' || radial.css('margin-left') - xCoord >= '-2px'){
				radial.css('margin-left', xCoord);
			}
			
			if(radial.css('margin-left') == xCoord){
				xCoord = Math.round($(window).width() * -0.25 + $(window).width() / 2 * Math.random()) + 'px';
				yCoord = Math.round($(window).height() * -0.25 + $(window).height() / 2 * Math.random()) + 'px';
				animGradient();
			}
		}
	}
	
	// Animates the gradient ball
	function animGradient() {
		radial.animate({'margin-bottom': yCoord}, {duration: animSpeed});
		radial.animate({'margin-left': xCoord}, {duration: animSpeed, queue: false});
	}
	
	// The loop of the canvas which keeps it updating and animating
	function loop(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		update();
		draw();
		queue();
	}

	// Keeps the loop cycle going
	function queue(){
		window.requestAnimationFrame(loop);
	}

	// Updates the player if no leap motion is connected
	$(document).mousemove(function(e){
		if(!controllerUsed){
			rightHand.vel.x = e.pageX - rightHand.pos.x;
			rightHand.vel.y = e.pageY - rightHand.pos.y;
			rightHand.pos.x = e.pageX;
			rightHand.pos.y = e.pageY; 
		}
	}); 

	// Update variables in a single loop instance
	function update(){
		controllerUsed = false;
		var d = new Date();
		var ext = "am";
		var zero = "";
		var day;
		if(d.getHours() >= 12){ ext = "pm"; }
		if(d.getMinutes() < 10){ zero = "0"; }
		
		// Sets the alphabetic day of the week
		switch(d.getDate()){
			case 0:
				day = "Sunday";
				break;
				
			case 0:
				day = "Monday";
				break;
				
			case 0:
				day = "Tuesday";
				break;
				
			case 0:
				day = "Wednesday";
				break;
				
			case 0:
				day = "Thursday";
				break;
				
			case 0:
				day = "Friday";
				break;
				
			default:
				day = "Saturday"
				break;
		}
		
		$('#time').html(day + " " + d.getDate() + ", " + d.getUTCFullYear() + "</br>" + d.getHours() % 12 + ":" + zero + d.getMinutes() + ext);
		checkCoords();
		
		// Move the particles
		for(i = 0; i < particles.length; i++){
			var particle = particles[i];
			move(particle);
		}
		
		// Spawn particles if needed
		for(n = 0; n < emitters.length; n++){
			if(particles.length < maxParticles && lastEmitter == n){
				lastEmitter++;
				if(lastEmitter == 10){ lastEmitter = 0;}
				
				emitParticle(emitters[n]);
			}
		}
		
		rightHand.vel.x = 0;
		rightHand.vel.y = 0;
	}

	// Draws entities to the canvas screen
	function draw(){
		// Set the color of our particles
		ctx.fillStyle = 'rgba(217,255,220, 0.6)';
		ctx.strokeStyle = 'rgba(217,255,220, 0.7)';

		// Draw a square at each particle
		for (var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			ctx.fillRect(particle.pos.x-particle.size/2, particle.pos.y-particle.size/2, particle.size, particle.size);
		}
		
		// Draw a circle for the player
		ctx.beginPath();
		ctx.fill();
		ctx.arc(rightHand.pos.x, rightHand.pos.y, rightHand.size, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.stroke();
	}

	// On the window click it speeds up the particles after the animation is completed
	$('#timeArea').on("click", function (){
		if($('#foreground').css('margin-bottom') >= -$('#foreground').height() + "px"){
			xCoord = '0px';
			yCoord = '0px';
			$('#body').css('transition', 'background 1.2s');
			$('#body').css('background', '#D75C6A');
			window.clearTimeout(timeoutHandle);
			
			$('#foreground').delay(100).animate({'margin-bottom': 0}, animation_speed);
			$('#midground').delay(300).animate({'margin-bottom': 0}, animation_speed);
			$('#title').animate({'margin-top': "1.5em"}, animation_speed);
			$('#title').html("Still Snowing");
		} 
    });

	// Basic Vector Object with values x, y
	function Vector(x, y) {
		this.x = x;
		this.y = y;
	}
		// Adds the velocity from one vector to another vector, used in collision
		function addVector(baseVect, addVect) {
			baseVect.x += addVect.x;
			baseVect.y += addVect.y;
		}

	// Basic Particle Object with radius and vector variables
	function Particle(x, y, vx, vy){
		this.pos = new Vector(x, y);
		this.vel = new Vector(vx, vy);
		this.size = 2 + 4 * Math.random();
	}

		// Moves the particle based on velocity
		function move(p) {
			if($('#forground').css("margin-bottom") == 0){
				p.vel.x /= velConstant;
				p.vel.y /= velConstant;
			}

			addVector(p.pos, p.vel);
			
			if($('#forground').css("margin-bottom") == 0){
				p.vel.x *= velConstant;
				p.vel.y *= velConstant;
			}
			
			// Does some quick hit detection, if true then perform vector addition
			if(rightHand.vel.x != 0 && rightHand.vel.y != 0 && circleHitDetection(rightHand.pos, p.pos, rightHand.size + 2, p.size)){
				p.vel.x = 0 + rightHand.vel.x;
				p.vel.y = 0 + rightHand.vel.y; 
			}
			
			
			// The velocity is too high and must get shrinked
			if(p.vel.x * p.vel.x + p.vel.y * p.vel.y > 10){
				p.vel.x /= 1.05;
				p.vel.y /= 1.05;
			}

			// Bounces the particle back into the canvas
			if(p.pos.x - p.size< 0 || p.pos.x + p.size> $(window).width()){
				addVector(p.vel, new Vector(p.vel.x * -2, 0));
			} else if(p.pos.y + p.size> $(window).height()){
				// remove the particle
				p.pos = particles[particles.length - 1].pos;
				p.vel = particles[particles.length - 1].vel;
				particles.pop();
			}
		}
	
	// An Emitter object which acts itself as a particle but also contains a spread to emit particles
	function Emitter(x, y, vx, vy){
		this.itself = new Particle(x, y, vx, vy);
		this.spread = 3 * Math.PI / 2;
		this.drawColor = '#555';
	}

		// Emits a particle with a randomized velocity and angle
		function emitParticle(emtr) {
			var particle = createRandomParticle();
			particle.pos = new Vector(emtr.itself.pos.x, emtr.itself.pos.y);
			var rand = Math.random();
			
			if(particle.vel.y <= 0){
				particle.vel.y *= -1;
			}
			if(rand <= 0.5){
				particle.vel.x *= -1;
			} 
			
			particles.push(particle);
		} 

		// Function for adding new particles to the screen
		function addNewParticles(amount) {
			// Create particles from anywhere
			for(i = 0; i < amount; i++){
				if(particles.length < maxParticles){
					particles.push(createRandomParticle());
				} else {
					i = amount;
				}
			}
		}

		// Creates a random particle on the screen
		function createRandomParticle() {
			var multx=1;
			var multy=1
			if(Math.random()<0.5) multx=-1;
			if(Math.random()<0.5) multy=-1;
			var x = $(window).width() * Math.random();
			var y = $(window).width() * Math.random();

			var vx = 1 + Math.random();
			var vy = 1 + Math.random();
			
			return (new Particle(x, y, vx, vy, 0, 0));

			var vx = baseVelocity + Math.random();
			var vy = baseVelocity + Math.random();

			return (new Particle(x, y, multx*vx, multy*vy, 0, 0));

		}

	// Player's hand used to interact with particles
	function PlayerHand (x, y) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(0, 0);
		this.size = 25;
	}

	// Determines if two circles collide or not
	function circleHitDetection(p1, p2, radiusOne, radiusTwo){
		return ((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) 
			<= (radiusOne + radiusTwo) * (radiusOne + radiusTwo));
	}

	
	function centre(x, y, radius){
		return Vector(x + radius/2, y + radius/2);
	}

	// Loops the leap motion device
	Leap.loop(function(frame) {
	frame.hands.forEach(function(hand, index){
			controllerUsed = true;
			var cursorSize= 10+10*hand.grabStrength.toPrecision(2);
            var handR= {
			  x: canvas.width*0.5 + hand.palmPosition[0]*canvas.width/400,
       			  y: canvas.height*1.25 - hand.palmPosition[1]*canvas.height/300
			};
			
			rightHand.pos.x = handR.x;
			rightHand.pos.y = handR.y;
			console.log(handR.x + " " + handR.y);
		});
	});
	
	Leap.loopController.setBackground(true);
});

