
// get interval to draw on screen
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     ||  
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// variables
var g;
var canvas;
var degrees = 200;
var text;

// properties
var color = "lightgreen";
var backgroundColor = "#222";

var isMoving = false;

window.onload = function() {
    setupCanvas();
    setupEvents();
}

function setupCanvas() {
    canvas = document.getElementById("canvas");
    g = canvas.getContext("2d");
}

function setupEvents() {

    canvas.addEventListener("mousedown", function(event) {
        console.log("mousedown");
        isMoving = true;
    }, false);
    
    canvas.addEventListener("mouseup", function(event) {
        console.log("mouseup");
        isMoving = false;
    }, false);

	canvas.addEventListener("mousemove", function (event) {
        if (isMoving) {
            var position = getPositionFrom(event);
            degrees = getDegreesFrom(position);
        }
	}, false);
}

function getPositionFrom(event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function getDegreesFrom(position) {
    var dx = position.x - canvas.width/2;
    var dy = position.y - canvas.height/2;
    var radians = Math.atan2(dy, dx) + 0.5*Math.PI;
    var degrees = radians * 180 / Math.PI;
    return degrees;
}

function hitTest(position) {

}

function draw() {
    var width = canvas.width
    var height = canvas.height
    var radians = degrees * Math.PI / 180;

    // clear canvas everytime
    g.clearRect(0, 0, width, height);

    // background circle
    g.beginPath();
    g.strokeStyle = backgroundColor;
    g.lineWidth = 30;
    g.arc(width/2, height/2, 100, 0, 2*Math.PI, false);
    g.stroke();

    // gauge will be a simple arc
    g.beginPath();
    g.strokeStyle = color;
    g.lineWidth = 30;
    g.arc(width/2, height/2, 100, -0.5*Math.PI, radians - 0.5*Math.PI, false);
    g.stroke();

    // text to display value
    g.fillStyle = color;
    g.font = "50px helvetica";
    text = Math.floor(degrees/360*100) + '%';
    textWidth = g.measureText(text).width;
    g.fillText(text, width/2 - textWidth/2, height/2 + 20);

    // gauge control button
    var dx = 100 * Math.cos(radians - 0.5*Math.PI);
    var dy = 100 * Math.sin(radians - 0.5*Math.PI);
    g.beginPath();
    g.lineWidth = 1;
    g.strokeStyle = "silver";
    g.fillStyle = "ghostwhite";
    g.arc(width/2 + dx, height/2 + dy, 20, 0, 2*Math.PI, false);
    g.fill();
    g.stroke();

    //TODO: draw 50 tick lines
}

(function drawLoop() {
    if (g != undefined) {
        draw();
    }
    requestAnimFrame(drawLoop);
})();