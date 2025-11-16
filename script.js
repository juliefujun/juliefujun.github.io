let margin = 80; 
let data;
let xScale, yScale;
let plantImages = []; 
let hoveredColor = null;
let hoveredPlant = null;

async function setup() {
  createCanvas (600, 600);
  background(255);
  // load data from csv
  data = await d3.csv("plantData.csv", d3.autoType)
  for (let plant of data) {
    plantImages[plant.name] = await loadImage("images/"+plant.image);
  }

  data = d3.sort(data, (a, b) => d3.ascending(a.place, b.place))
  console.log(data);

  xScale = d3.scaleBand(d3.map(data, (d) => d.name), [margin, width - margin]).padding(0.1);
  yScale = d3.scaleBand(d3.range(10, 0, -1).map(i => "color" + i), [margin, height - margin * 1.75]).padding(0.1);
  
  }
  
  function draw() {
    background(255);
    
    // creates Y axis label
    noStroke();
    push();
    translate(margin - 40, height / 2);
    rotate(-PI / 2);
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(14);
    text("Distinguishing colors", 0, 0);
    pop();

    // creates vertical line
    stroke(0);
    strokeWeight(2);     
    line(margin - 8, margin + 12, margin - 8, height - margin - 58);

    // creates arrowhead
    noStroke();
    fill(0);
    let arrowSize = 10;
    triangle(margin - 8, margin + 12 - arrowSize, margin - 8 - arrowSize / 2, margin + 12, margin - 8 + arrowSize / 2, margin + 12);
    
    
    hoveredColor = null;
    data.forEach((plant) => {
    let colors = d3.range(1, 11).map(i => plant["color" + i]);
    // loops over all the colors and draws a rectangle
    colors.forEach((c, i) => {
      fill(c);
      rect(xScale(plant.name), yScale("color" + (i + 1)), xScale.bandwidth(), yScale.bandwidth(), 8);

      // finds the place of the rectangle on my canvas
      let x = xScale(plant.name);
      let y = yScale("color" + (i + 1));
      let w = xScale.bandwidth();
      let h = yScale.bandwidth();
       // checks if my mouse is inside the canvas and if it is, it returns the color of the rectangle
      if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
        hoveredColor = c;
      }
    });
  });
  
    hoveredPlant = null;
    // creates plant name display from my csv
      data.forEach((plant) => {
      push();
      let x = xScale(plant.name) + xScale.bandwidth() / 2 + 5;
      let y = height - margin / 2 * 2.95;
      let angle = -PI / 3.5;
      translate(x, y);
      rotate(angle);

      textAlign(RIGHT);
      textSize(12);
      fill(0);
      text(plant.name, 0, 0);

      // checks to how far the mouse is from the text anchor point
      let dx = mouseX - x;
      let dy = mouseY - y;
      // it undoes the slant (-PI/3.5) so that the mouseX and mouseY see the text at horizontal
      let mx = dx * cos(-angle) - dy * sin(-angle); 
      let my = dx * sin(-angle) + dy * cos(-angle);
       // checks if my mouse is inside the text
      if (mx >= -textWidth(plant.name) && mx <= 0 && my >= -14 / 2 && my <= 14 / 2) {
        hoveredPlant = plant.name;
      }
      pop();
    });
    
    // creates hover function to display the hex codes from my rectangles
    if (hoveredColor) {
      // draws the small white box - tooltip
      fill(255);
      noStroke();
      rect(mouseX + 5, mouseY - 30, 70, 20, 5);
      
      // draws the text inside the tooltip
      fill(0);
      textSize(12);
      textAlign(LEFT);
      text(hoveredColor, mouseX + 15, mouseY - 15);
      }
    // creates hover function to display my images from the csv
    if (hoveredPlant) {
      let img = plantImages[hoveredPlant];
        if (img) {
          image(img, mouseX, mouseY - 100, height / 8, width / 6);
        }
     }

    }
