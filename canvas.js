//
//  Dial Control
//
//  MIT License
//  Copyright © 2017 Mitja Semolic.
//

class Dial {

    constructor({canvas, radius = 100, min = 1, max = 10, step = 1, color = "red"}) {
        this.canvas = document.getElementById(canvas);
        this.radius = radius;
        this.min = min;
        this.max = max;
        this.step = step;
        this.color = color;

        this.value = min;
        this.degrees;
        this.isMoving = false;
        this.dialColor = "silver";
        this.showText = false;
    }

    get value() {
        let value = this.degrees * (this.max - this.min) / 360;
        return Math.round(value * this.step) / this.step;
    }

    set value(value) {
        this.degrees = value * 360 / (this.max - this.min);
    } 

    listenEvents() {
        this.canvas.addEventListener("mousedown", event => { this.handleTapDown(event) }, false);
        this.canvas.addEventListener("mouseup", event => { this.handleTapUp(event) }, false);
        this.canvas.addEventListener("mousemove", event => { this.handlePan(event) }, false);
    }

    handleTapDown(event) {
        let position = this.getPositionFrom(event);
        if (this.hitTestButton(position)) {
            this.isMoving = true;
            this.showText = true;
        }

        if (this.hitTestDial(position)) {
            this.degrees = this.getDegreesFrom(position);
        }
    }

    handleTapUp(event) {
        this.isMoving = false
        this.showText = false;
    }

    handlePan(event) {
        if (this.isMoving) {
            let position = this.getPositionFrom(event);
            this.degrees = this.getDegreesFrom(position);
        }
    }

    getPositionFrom(event) {
        let rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getDegreesFrom(position) {
        let dx = position.x - this.canvas.width/2;
        let dy = position.y - this.canvas.height/2;
        let radians = Math.atan2(dy, dx) + 0.5*Math.PI;
        if (radians < 0) radians += 2*Math.PI;
        let degrees = radians * 180 / Math.PI;
        return degrees;
    }

    hitTestButton(position) {
        let radians = this.degrees * Math.PI / 180;
        let centerX = this.radius * Math.cos(radians - 0.5*Math.PI);
        let centerY = this.radius * Math.sin(radians - 0.5*Math.PI);
        let center = { x: this.canvas.width/2 + centerX, y: this.canvas.height/2 + centerY };
        let dx = center.x - position.x;
        let dy = center.y - position.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        return distance < 25;
    }

    hitTestDial(position) {
        let center = { x: this.canvas.width/2, y: this.canvas.height/2 };
        let dx = center.x - position.x;
        let dy = center.y - position.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        return distance < this.radius + 15 && distance > this.radius - 15;
    }

    draw() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let radians = this.degrees * Math.PI / 180;
        let g = this.canvas.getContext("2d");

        // clear canvas everytime
        //TODO: clear() with clip

        // background circle
        g.beginPath();
        g.strokeStyle = this.dialColor;
        g.lineWidth = 30;
        g.arc(width/2, height/2, this.radius, 0, 2*Math.PI, false);
        g.stroke();

        // gauge will be a simple arc
        g.beginPath();
        g.strokeStyle = this.color;
        g.lineWidth = 30;
        g.arc(width/2, height/2, this.radius, -0.5*Math.PI, radians - 0.5*Math.PI, false);
        g.stroke();

        // text to display value
        if (this.showText) {
            g.fillStyle = this.color;
            g.font = "50px helvetica";
            let text = this.value;
            let textWidth = g.measureText(text).width;
            g.fillText(text, width/2 - textWidth/2, height/2 + 20);
        }

        // draw 50 tick lines
        let ticks = Math.round((this.max - this.min) / this.step) + this.step;
        for(let i = 0; i < ticks; i++) {
            let angle = 2*Math.PI / ticks * i;
            this.drawTick(angle);
        }

        // gauge control button
        let dx = this.radius * Math.cos(radians - 0.5*Math.PI);
        let dy = this.radius * Math.sin(radians - 0.5*Math.PI);
        g.beginPath();
        g.lineWidth = 1;
        g.strokeStyle = "silver";
        g.fillStyle = "ghostwhite";
        g.arc(width/2 + dx, height/2 + dy, 20, 0, 2*Math.PI, false);
        g.fill();
        g.stroke();
    }

    drawTick(angle) {
        let g = this.canvas.getContext("2d");
        let bodyStyle = window.getComputedStyle(document.body, null);
        let lenght = 31;
        let point1X = (this.radius - lenght/2) * Math.cos(angle - 0.5*Math.PI);
        let point1Y = (this.radius - lenght/2) * Math.sin(angle - 0.5*Math.PI);    
        let point2X = (this.radius + lenght/2) * Math.cos(angle - 0.5*Math.PI);
        let point2Y = (this.radius + lenght/2) * Math.sin(angle - 0.5*Math.PI);
        let center = { x: canvas.width/2, y: canvas.height/2}
        let point1 = { x: center.x + point1X, y: center.y + point1Y };
        let point2 = { x: center.y + point2X, y: center.y + point2Y };
        g.beginPath();
        g.strokeStyle = bodyStyle.backgroundColor;
        g.lineWidth = this.max < 100 ? 3 : 1.5;
        g.moveTo(point1.x, point1.y);
        g.lineTo(point2.x, point2.y);
        g.stroke();
    }

    clear() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let g = this.canvas.getContext("2d");
        g.clearRect(0, 0, width, height);
        //TODO: clip
    }
}

var DIALS;

window.onload = function() {

    DIALS = {
        red: new Dial({
            canvas: "canvas",
            radius: 100,
            min: 0, max: 25, step: 1,
            color: "lightgreen" }),

        green: new Dial({
            canvas: "canvas",
            radius: 150,
            min: 0, max: 30, step: 1,
            color: "lightcoral" }),
        
        blue: new Dial({
            canvas: "canvas",
            radius: 200,
            min: 0, max: 60, step: 1,
            color: "deepskyblue"
            })
    }

    DIALS.red.value = 10;
    DIALS.green.value = 20;
    DIALS.blue.value = 30;

    DIALS.red.listenEvents();
    DIALS.green.listenEvents();
    DIALS.blue.listenEvents();
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
    if (DIALS != undefined) {
        DIALS.blue.clear();
        DIALS.red.draw();
        DIALS.green.draw();
        DIALS.blue.draw();
    }

    requestAnimFrame(loopDraw);
})();
