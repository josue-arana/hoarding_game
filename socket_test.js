var socket = io.connect(":30000?sketch=-1");

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
	
	// tell socket to draw when "IamDrawing" message is received
  socket.on('iamdrawing', drawCircle);
	
  background(255);
}

function draw() {
	noStroke();
  fill(0, 0, 255, 90);
	// speed of mouse = size of radius
  var radius = Math.abs(mouseX - pmouseX)+Math.abs(mouseY - pmouseY);
  ellipse(mouseX, mouseY, radius, radius);
	// tell socket to send a message every time we draw an circle
  // with the coordinates of our mouse
  socket.emit('iamdrawing',mouseX,mouseY,radius);
}

// this function will be run every time a message is received
function drawCircle(x,y,r){
  noStroke();
  fill(255, 0, 0, 90);
  ellipse(x, y, r, r);
}
