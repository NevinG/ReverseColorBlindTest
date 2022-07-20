const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let circleBackgroundColor = 'white';
let backgroundColor = 'white    ';

function windowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();
};
  
window.addEventListener('resize', windowResize);
draw();

//start making an ishaara circle
function draw() {
    const colorPalletes = [
         {
             insideColors: ['rgb(220,0,0)', 'rgb(240,0,0)', 'rgb(260,0,0)'],
             outsideColors: ['rgb(110,75,0)', 'rgb(130,75,0)', 'rgb(150,75,0)'],
         },
        //  {
        //     insideColors: ['rgb(188,140,15)', 'rgb(113,158,28)', 'rgb(192,146,30)'],
        //     outsideColors: ['rgb(135,112,37)', 'rgb(237,99,17)', 'rgb(75,126,41)'],
        // }
    ];

    const plateColors = colorPalletes[Math.floor(Math.random() * colorPalletes.length)];
    const insideColors = plateColors.insideColors;
    const outsideColors = plateColors.outsideColors;

    //draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = circleBackgroundColor;
    ctx.beginPath();
    const minDimension = Math.min(width, height);
    const plateRadius = minDimension / 4;
    

    //get text in ImageData so we can use for later to see if shape overlaps the text
    //calibrate right font size
    const numberToAppearInCircle = Math.floor(Math.random() * 90 + 10).toString();

    let fontSize = 0;
    let textWidth = 0;
    while(textWidth / (plateRadius * 2) < .8){
        fontSize++;

        ctx.font = 'bold ' + fontSize + 'px Arial';
        textWidth = ctx.measureText(numberToAppearInCircle).width;
    }

    ctx.fillStyle = 'rgb(10,10,10)';
    ctx.strokeStyle = 'rgb(10,10,10)';
    ctx.fillText(numberToAppearInCircle, width / 2 - textWidth / 2, height / 2 + fontSize / 3.5);
    const myImageData = ctx.getImageData(0,0,width, height);

    ctx.fillStyle = circleBackgroundColor;
    ctx.strokeStyle = circleBackgroundColor;
    ctx.arc(width / 2, height / 2, plateRadius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();


    const plateArea = Math.PI * Math.pow(plateRadius, 2);
    let currentPlateCoverage = 0;

    //pick random spot in circle and then draw a circle there
    
    //pick random spot in a square around the circle
    const listOfCircles = [];
    
    let radiusOfCircle;
    while(currentPlateCoverage / plateArea < .65){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.beginPath();    
        const x = Math.floor((Math.random() * minDimension) + (width / 2 - (plateRadius)));
        const y = Math.floor((Math.random() * minDimension) + (height / 2 - (plateRadius)));

        //get the radius of the circle
        if(currentPlateCoverage / plateArea < .25) {
            radiusOfCircle = plateRadius / 20;
        }
        else if(currentPlateCoverage / plateArea < .40){
            radiusOfCircle = plateRadius / 25;
        }
        else if(currentPlateCoverage / plateArea < .50){
            radiusOfCircle = plateRadius / 40;
        }
        else if(currentPlateCoverage / plateArea < .58){
            radiusOfCircle = plateRadius / 50;
        }
        else if(currentPlateCoverage / plateArea < .64){
            radiusOfCircle = plateRadius / 80;
        }
        else if(currentPlateCoverage / plateArea < .65){
            radiusOfCircle = plateRadius / 150;
        }

        //then check if that spot is in the circle
        //check in polar if r is less than the radius of the background circle
        const r = Math.sqrt(Math.pow((x - width / 2), 2) + Math.pow((y - height / 2), 2));
        if(r + radiusOfCircle > plateRadius){
            continue;
        }

        //check if it intersects with any other circle
        //if the distance between the circles is less than the sum of their radius
        let brokeOut = false;
        for (const circle of listOfCircles){
            if(Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)) < radiusOfCircle + circle.r){
                brokeOut = true;
                break;
            }
        }
        if(brokeOut){
            continue;
        }

        //then draw the circle

        //get color for the circle
        //check if circle is on the number


        if(myImageData.data[(y * width + x) * 4] == 10){
            const color = insideColors[Math.floor((Math.random() * insideColors.length))];
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
        }
        else {
            const color = outsideColors[Math.floor((Math.random() * outsideColors.length))];
            ctx.fillStyle = color;
            ctx.strokeStyle = color
            
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
        }
        
        currentPlateCoverage += Math.PI * Math.pow(radiusOfCircle, 2);

        listOfCircles.push({
            x: x,
            y: y,
            r: radiusOfCircle
        })
        ctx.arc(x, y, radiusOfCircle, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    }
    //ctx.putImageData(myImageData,0,0);
}





