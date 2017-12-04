
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
var degrees = 100;
var text;

// properties
var color = "lightgreen";
var backgroundColor = "#222";

var isDragging

window.onload = function() {
    setupCanvas();
    setupEvents();
}

function setupCanvas() {
    var canvas = document.getElementById("canvas");
    g = canvas.getContext("2d");
}

function setupEvents() {
    var canvas = document.getElementById("canvas");

    canvas.addEventListener("mousedown", function(event) {
        var pos = getMousePosition(canvas, event);
    }, false);
    
    canvas.addEventListener("mouseup", function(event) {

    }, false);
}

function getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
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
    g.arc(width/2, height/2, 100, -0.5*Math.PI, radians -0.5*Math.PI, false);
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
    g.lineWidth = 2;
    g.strokeStyle = "#d3d3d3";
    g.fillStyle = "#fff";
    g.arc(width/2 + dx, height/2 + dy, 20, 0, 2*Math.PI, false);
    g.fill();
    g.stroke();
}

(function drawLoop() {
    if (g != undefined) {
        draw();
    }
    requestAnimFrame(drawLoop);
})();