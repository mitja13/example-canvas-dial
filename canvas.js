

var CANVAS;
var G;
var DIAL;

window.onload = function() {
    CANVAS = document.getElementById("canvas");
    G = canvas.getContext("2d");

    DIAL = new Dial(100, "lightgreen");
    DIAL.listenEvents();
}

class Dial {
    constructor(radius, color) {
        this.radius = radius;
        this.color = color;
        this.dialColor = "silver";
        this.text = "";
        this.degrees = 200;
        this.isMoving = false;
    }

    listenEvents() {
        CANVAS.addEventListener("mousedown", event => { DIAL.handleTapDown(event) }, false);
        CANVAS.addEventListener("mouseup", event => { DIAL.handleTapUp(event) }, false);
        CANVAS.addEventListener("mousemove", event => { DIAL.handlePan(event) }, false);
    }

    handleTapDown(event) {
        var position = this.getPositionFrom(event);
        if (this.hitTestButton(position)) {
            this.isMoving = true;
        }
    }

    handleTapUp(event) {
        this.isMoving = false
    }

    handlePan(event) {
        if (this.isMoving) {
            var position = this.getPositionFrom(event);
            this.degrees = this.getDegreesFrom(position);
        }
    }

    getPositionFrom(event) {
        var rect = CANVAS.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getDegreesFrom(position) {
        var dx = position.x - CANVAS.width/2;
        var dy = position.y - CANVAS.height/2;
        var radians = Math.atan2(dy, dx) + 0.5*Math.PI;
        if (radians < 0) radians += 2*Math.PI;
        var degrees = radians * 180 / Math.PI;
        return degrees;
    }

    hitTestButton(position) {
        var radians = this.degrees * Math.PI / 180;
        var centerX = this.radius * Math.cos(radians - 0.5*Math.PI);
        var centerY = this.radius * Math.sin(radians - 0.5*Math.PI);
        var center = { x: canvas.width/2 + centerX, y: canvas.height/2 + centerY };
        var dx = center.x - position.x;
        var dy = center.y - position.y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        return distance < 25;
    }

    draw() {
        var width = CANVAS.width
        var height = CANVAS.height
        var radians = this.degrees * Math.PI / 180;

        // clear canvas everytime
        G.clearRect(0, 0, width, height);

        // background circle
        G.beginPath();
        G.strokeStyle = this.dialColor;
        G.lineWidth = 30;
        G.arc(width/2, height/2, this.radius, 0, 2*Math.PI, false);
        G.stroke();

        // gauge will be a simple arc
        G.beginPath();
        G.strokeStyle = this.color;
        G.lineWidth = 30;
        G.arc(width/2, height/2, this.radius, -0.5*Math.PI, radians - 0.5*Math.PI, false);
        G.stroke();

        // text to display value
        G.fillStyle = this.color;
        G.font = "50px helvetica";
        this.text = Math.floor(this.degrees/360*100) + '%';
        var textWidth = G.measureText(this.text).width;
        G.fillText(this.text, width/2 - textWidth/2, height/2 + 20);

        // draw 50 tick lines
        for(var i = 0; i < 50; i++) {
            var angle = 2*Math.PI / 50 * i;
            this.drawTick(angle);
        }

        // gauge control button
        var dx = this.radius * Math.cos(radians - 0.5*Math.PI);
        var dy = this.radius * Math.sin(radians - 0.5*Math.PI);
        G.beginPath();
        G.lineWidth = 1;
        G.strokeStyle = "silver";
        G.fillStyle = "ghostwhite";
        G.arc(width/2 + dx, height/2 + dy, 20, 0, 2*Math.PI, false);
        G.fill();
        G.stroke();
    }

    drawTick(angle) {
        var bodyStyle = window.getComputedStyle(document.body, null);
        var lenght = 31;
        var point1X = (this.radius - lenght/2) * Math.cos(angle - 0.5*Math.PI);
        var point1Y = (this.radius - lenght/2) * Math.sin(angle - 0.5*Math.PI);    
        var point2X = (this.radius + lenght/2) * Math.cos(angle - 0.5*Math.PI);
        var point2Y = (this.radius + lenght/2) * Math.sin(angle - 0.5*Math.PI);
        var center = { x: canvas.width/2, y: canvas.height/2}
        var point1 = { x: center.x + point1X, y: center.y + point1Y };
        var point2 = { x: center.y + point2X, y: center.y + point2Y };
        G.beginPath();
        G.strokeStyle = bodyStyle.backgroundColor;
        G.lineWidth = 3;
        G.moveTo(point1.x, point1.y);
        G.lineTo(point2.x, point2.y);
        G.stroke();
    }
}

// get interval to draw on screen
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     ||  
        function(callback) { window.setTimeout(callback, 1000 / 60) };
})();


(function loopDraw() {
    if (G != undefined) {
        DIAL.draw();
    }
    requestAnimFrame(loopDraw);
})();
