const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

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
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    const minDimenstion = Math.min(width, height);
    ctx.arc(width / 2, height / 2, minDimenstion / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();

    //pick random spot in circle and then draw a circle there
    
    //pick random spot in a square around the circle
    const listOfCircles = [];
    
    let radiusOfCircle;
    while(listOfCircles.length < 600){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.beginPath();    
        const x = (Math.random() * minDimenstion) + (width / 2 - (minDimenstion / 2));
        const y = (Math.random() * minDimenstion) + (height / 2 - (minDimenstion / 2));

        //get the radius of the circle
        if(listOfCircles.length < 100) {
            radiusOfCircle = minDimenstion / 2 / 19;
        }
        else if( listOfCircles.length < 250){
            radiusOfCircle = minDimenstion / 2 / 27;
        }
        else if( listOfCircles.length < 350){
            radiusOfCircle = minDimenstion / 2 / 35;
        }
        else if( listOfCircles.length < 500){
            radiusOfCircle = minDimenstion / 2 / 41;
        }
        else if( listOfCircles.length < 600){
            radiusOfCircle = minDimenstion / 2 / 80;
        }

        //then check if that spot is in the circle
        //check in polar if r is less than the radius of the background circle
        const r = Math.sqrt(Math.pow((x - width / 2), 2) + Math.pow((y - height / 2), 2));
        if(r + radiusOfCircle > minDimenstion / 2){
            continue;
        }

        //check if it intersects with any other circle
        //if the distance between the circles is less than the sum of their radius
        let brokeOut = false;
        for (const circle of listOfCircles){
            if(Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)) < radiusOfCircle + circle.r){
                ctx.fillStyle = 'blue';
                brokeOut = true;
                break;
            }
        }
        if(brokeOut){
            continue;
        }

        //then draw the circle
        listOfCircles.push({
            x: x,
            y: y,
            r: radiusOfCircle
        })
        ctx.arc(x, y, radiusOfCircle, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    }
    console.log((minDimenstion / 2));
    
}




