let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let cellsize = 50;
let height = 600;
let width = 1000;
let snakecells = [[0, 0]];
let direction = 'right';
let gameover = false;
let foodcell = generatefood();
let score = 0;

// Add gradient colors for snake
const snakeGradient = {
    head: ['#4CAF50', '#2E7D32'],
    body: ['#81C784', '#43A047']
};

// Add particle effects for food
let particles = [];

let intervalid = setInterval(function() {
    update();
    draw();
}, 200);

document.addEventListener('keydown', function(event) {
    if (event.key == 'ArrowDown' && direction != 'up') {
        direction = 'down';
    }
    else if (event.key == 'ArrowUp' && direction != 'down') {
        direction = 'up';
    }
    else if (event.key == 'ArrowLeft' && direction != 'right') {
        direction = 'left';
    }
    else if (event.key == 'ArrowRight' && direction != 'left') {
        direction = 'right';
    }
});

function drawRoundedRect(x, y, width, height, radius, color, isGradient = false) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (isGradient) {
        let gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, color[0]);
        gradient.addColorStop(1, color[1]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = color;
    }
    
    ctx.fill();
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawFood(x, y) {
    // Draw main food circle
    ctx.beginPath();
    ctx.arc(x + cellsize/2, y + cellsize/2, cellsize/2 - 5, 0, Math.PI * 2);
    let gradient = ctx.createRadialGradient(
        x + cellsize/2, y + cellsize/2, 5,
        x + cellsize/2, y + cellsize/2, cellsize/2 - 5
    );
    gradient.addColorStop(0, '#FF5252');
    gradient.addColorStop(1, '#D32F2F');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#B71C1C';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add shine effect
    ctx.beginPath();
    ctx.arc(x + cellsize/3, y + cellsize/3, cellsize/6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
}

function draw() {
    if (gameover) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#FF5252";
        ctx.font = 'bold 50px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("GAME OVER!", width/2, height/2 - 25);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '30px monospace';
        ctx.fillText(`Final Score: ${score}`, width/2, height/2 + 25);
        
        clearInterval(intervalid);
        return;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw snake
    snakecells.forEach((cell, index) => {
        let colors = index === snakecells.length - 1 ? snakeGradient.head : snakeGradient.body;
        drawRoundedRect(cell[0], cell[1], cellsize - 2, cellsize - 2, 10, colors, true);
    });

    // Draw food
    drawFood(foodcell[0], foodcell[1]);

    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Rest of the functions remain the same
function update() {
    let headx = snakecells[snakecells.length-1][0];
    let heady = snakecells[snakecells.length-1][1];

    let newHeadx = headx;
    let newHeady = heady;
    if(direction == 'down') {
        newHeady = heady + cellsize;
        if(newHeady == height || check(newHeadx, newHeady)) {
            gameover = true;
        }
    }
    else if(direction == 'up') {
        newHeady = heady - cellsize;
        if(newHeady < 0 || check(newHeadx, newHeady)) {
            gameover = true;
        }
    }
    else if(direction == 'left') {
        newHeadx = headx - cellsize;
        if(newHeadx < 0 || check(newHeadx, newHeady)) {
            gameover = true;
        }
    }
    else {
        newHeadx = headx + cellsize;
        if(newHeadx == width || check(newHeadx, newHeady)) {
            gameover = true;
        }
    }

    snakecells.push([newHeadx, newHeady]);
    if(newHeadx == foodcell[0] && newHeady == foodcell[1]) {
        foodcell = generatefood();
        score += 1;
    }
    else {
        snakecells.shift();
    }
}

function generatefood() {
    return [
        Math.round((Math.random() * (width-cellsize)) / cellsize) * cellsize,
        Math.round((Math.random() * (height-cellsize)) / cellsize) * cellsize
    ];
}

function check(newHeadx, newHeady) {
    for(let cell of snakecells) {
        if(newHeadx == cell[0] && newHeady == cell[1]) {
            return true;
        }
    }
    return false;
}