
//  print a red square on the canvas
ctx.beginPath();
ctx.rect(20, 40, 50, 50); // 20px from left, 40px from top , 50px width and 50px height
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

// print out a green circle
ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false); // x and y cordinates of the circle from center, arc radius, start and end angle in radians, clockwise=true: anticlockwise: false
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

// print blue-stroked empty rectangle
ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();
