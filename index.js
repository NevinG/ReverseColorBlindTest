const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dropdown = document.getElementById('testTypeDropdown');

let width = window.innerWidth;
let height = window.innerHeight;
let testType = 'reverse';

canvas.width = width;
canvas.height = height;

let circleBackgroundColor = 'white';
let backgroundColor = 'white';

function windowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();
};
  
window.addEventListener('resize', windowResize);
document.addEventListener('keydown', logKey);
draw();

function changedDropdown() {
    testType = dropdown.value;
}

//start making an ishaara circle
function draw() {
    const normalPalletes = [
         {
             insideColors: ['rgb(220,20,0)', 'rgb(240,20,0)', 'rgb(260,20,0)'],
             outsideColors: ['rgb(110,65,0)', 'rgb(130,65,0)', 'rgb(150,65,0)'],
         },
         {
            insideColors: ['rgb(238,140,108)', 'rgb(217,88,72)'],
            outsideColors: ['rgb(93,85,56)', 'rgb(166,147,110)'],
        }
    ];

    const reversePalletes = [
        {
           insideColors: ['rgb(178,130,5)', 'rgb(103,148,18)', 'rgb(182,136,20)'],
           outsideColors: ['rgb(135,112,37)', 'rgb(237,99,17)', 'rgb(75,126,41)'],
       }
   ];

    let colorPalletes;
    switch(testType){
        case 'normal':
            colorPalletes = normalPalletes;
            break;
        case 'reverse':
            colorPalletes = reversePalletes;
            break;
        default:
            colorPalletes = reversePalletes;
            break;
    }

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
    if(testType == 'test'){
        testImage();
    }
    
    //ctx.putImageData(myImageData,0,0);
}

function logKey(keyEvent){
    if(keyEvent.key == "Enter" || keyEvent.key =="Shift" || keyEvent.key == " "){
        draw();
    }
}

function testImage(){
    const myImageData = ctx.createImageData(width, height);
    const minDimension = Math.min(width, height);
    const plateRadius = minDimension / 4;
    //get text in ImageData so we can use for later to see if shape overlaps the text
    //calibrate right font size
    const numberToAppearInCircle = Math.floor(Math.random() * 90 + 10).toString();

    let fontSize = 0;
    let textWidth = 0;
    while(textWidth / (plateRadius * 2) < .8){
        fontSize++;

        ctx.font = fontSize + 'px Arial';
        textWidth = ctx.measureText(numberToAppearInCircle).width;
    }

    ctx.fillStyle = 'rgb(10,10,10)';
    ctx.strokeStyle = 'rgb(10,10,10)';
    ctx.fillText(numberToAppearInCircle, width / 2 - textWidth / 2, height / 2 + fontSize / 3.5);
    const myImageData2 = ctx.getImageData(0,0,width, height);

    ctx.fillStyle = circleBackgroundColor;
    ctx.strokeStyle = circleBackgroundColor;
    ctx.arc(width / 2, height / 2, plateRadius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();


    const setColor = (x, y, r, g, b) => {
        const i = y * (width * 4) + x * 4;
        myImageData.data[i] = r;
        myImageData.data[i + 1] = g;
        myImageData.data[i + 2] = b;
        myImageData.data[i + 3] = 255;
      };
    
    for(let i =0; i < width; i++){
        for (let j = 0; j < height; j++){
            if(myImageData2.data[(j * width + i) * 4] == 10){
                if(Math.floor(Math.random() * 2) == 0){
                    setColor(i,j,204,130,85);
                } else {
                    setColor(i,j,153,120,89);
                }
            }
            else {
                if(Math.floor(Math.random() * 2) == 0){
                    setColor(i,j,209,135,90);
                } else {
                    setColor(i,j,158,125,94);
                }
            }
        }
    }

    ctx.putImageData(myImageData,0,0);
    
}





