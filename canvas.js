

var CANVAS;
var G;
var DIAL;

window.onload = function() {
    //TODO: container
    CANVAS = document.getElementById("canvas");
    G = canvas.getContext("2d");

    DIAL = new Dial({
        radius: 100,
		min: 0, max: 10, step: 1,
		color: "lightgreen"
    })
    
    DIAL.value = 5;
    DIAL.listenEvents();
}

class Dial {

    constructor({radius = 100, min = 1, max = 10, step = 1, color = "red"}) {
        this.radius = radius;
        this.min = min;
        this.max = max;
        this.step = step;
        this.color = color;

        this.value = min;
        this.degrees;
        this.isMoving = false;
        this.dialColor = "silver";
    }

    get value() {
        let value = this.degrees * (this.max - this.min) / 360;
        return Math.round(value * this.step) / this.step;
    }

    set value(value) {
        this.degrees = value * 360 / (this.max - this.min);
    } 

    listenEvents() {
        CANVAS.addEventListener("mousedown", event => { DIAL.handleTapDown(event) }, false);
        CANVAS.addEventListener("mouseup", event => { DIAL.handleTapUp(event) }, false);
        CANVAS.addEventListener("mousemove", event => { DIAL.handlePan(event) }, false);
    }

    handleTapDown(event) {
        let position = this.getPositionFrom(event);
        if (this.hitTestButton(position)) {
            this.isMoving = true;
        }
    }

    handleTapUp(event) {
        this.isMoving = false
    }

    handlePan(event) {
        if (this.isMoving) {
            let position = this.getPositionFrom(event);
            this.degrees = this.getDegreesFrom(position);
        }
    }

    getPositionFrom(event) {
        let rect = CANVAS.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getDegreesFrom(position) {
        let dx = position.x - CANVAS.width/2;
        let dy = position.y - CANVAS.height/2;
        let radians = Math.atan2(dy, dx) + 0.5*Math.PI;
        if (radians < 0) radians += 2*Math.PI;
        let degrees = radians * 180 / Math.PI;
        return degrees;
    }

    hitTestButton(position) {
        let radians = this.degrees * Math.PI / 180;
        let centerX = this.radius * Math.cos(radians - 0.5*Math.PI);
        let centerY = this.radius * Math.sin(radians - 0.5*Math.PI);
        let center = { x: canvas.width/2 + centerX, y: canvas.height/2 + centerY };
        let dx = center.x - position.x;
        let dy = center.y - position.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        return distance < 25;
    }

    draw() {
        let width = CANVAS.width
        let height = CANVAS.height
        let radians = this.degrees * Math.PI / 180;

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
        let text = this.value;
        let textWidth = G.measureText(text).width;
        G.fillText(text, width/2 - textWidth/2, height/2 + 20);

        // draw 50 tick lines
        for(let i = 0; i < 50; i++) {
            let angle = 2*Math.PI / 50 * i;
            this.drawTick(angle);
        }

        // gauge control button
        let dx = this.radius * Math.cos(radians - 0.5*Math.PI);
        let dy = this.radius * Math.sin(radians - 0.5*Math.PI);
        G.beginPath();
        G.lineWidth = 1;
        G.strokeStyle = "silver";
        G.fillStyle = "ghostwhite";
        G.arc(width/2 + dx, height/2 + dy, 20, 0, 2*Math.PI, false);
        G.fill();
        G.stroke();
    }

    drawTick(angle) {
        let bodyStyle = window.getComputedStyle(document.body, null);
        let lenght = 31;
        let point1X = (this.radius - lenght/2) * Math.cos(angle - 0.5*Math.PI);
        let point1Y = (this.radius - lenght/2) * Math.sin(angle - 0.5*Math.PI);    
        let point2X = (this.radius + lenght/2) * Math.cos(angle - 0.5*Math.PI);
        let point2Y = (this.radius + lenght/2) * Math.sin(angle - 0.5*Math.PI);
        let center = { x: canvas.width/2, y: canvas.height/2}
        let point1 = { x: center.x + point1X, y: center.y + point1Y };
        let point2 = { x: center.y + point2X, y: center.y + point2Y };
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
