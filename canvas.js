
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
var degrees = 230;
var text;

// properties
var color = "lightgreen";
var backgroundColor = "#222";

window.onload = function() {
    setupCanvas();
    //draw();
}

function setupCanvas() {
    var canvas = document.getElementById("canvas");
    g = canvas.getContext("2d");
}

function draw() {
    var width = canvas.width
    var height = canvas.height

    // clear canvas everytime
    g.clearRect(0, 0, width, height);

    // background circle
    g.beginPath();
    g.strokeStyle = backgroundColor;
    g.lineWidth = 30;
    g.arc(width/2, height/2, 100, 0, 2*Math.PI, false);
    g.stroke();

    // gauge will be a simple arc
    var radians = degrees * Math.PI / 180;
    g.beginPath();
    g.strokeStyle = color;
    g.lineWidth = 30;
    g.arc(width/2, height/2, 100, -0.5*Math.PI, radians -0.5*Math.PI, false);
    g.stroke();

    // text to display value
    g.fillStyle = color;
    g.font = "50px helvetica";
    text = Math.floor(degrees/360*100) + '%';
    textWidth = g.measureText(text).width;
    g.fillText(text, width/2 - textWidth/2, height/2 + 20);
    
}

(function drawLoop() {
    if (g != undefined) {
        draw();
    }
    requestAnimFrame(drawLoop);
})();