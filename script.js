let clicks = 0;
let flag = true;
const clicker = document.getElementById("clicker");
const candle = document.querySelector(".g-candle");
const scary1 = document.getElementById("scary1");
window.onload = init;

function init() {
  // Call the function to start listening for the sequence
  listenForKeys();
  clicker.addEventListener("click", handleClick);
}

function handleClick(event) {
  clicks++;
  document.title = `Clicks: ${clicks}`;
  if(event){
    createRipple(event);
  }

  // Check all conditions independently
  if (clicks === 1) {
    dvd();
  }
  if (clicks === 2) {
    candle.classList.remove("hide");
  }
  if (clicks % 75 === 0) {
    scary1.play();
  }
  if (clicks === 3) {
    rain();
  }
  if (clicks === 4) {
    createSnake();
  }
  if (clicks === 5) {
    const wisper = document.getElementById("wisper");
    wisper.play();
  }
  if (clicks === 6) {
    showMoon();
  }
  if (clicks === 7) {
    stars();
  }
  if (clicks >= 9999998 && flag) {
    flag = false; // Prevent multiple executions
    rain();
    setTimeout(() => {

      dvd();
    }, 1000); // Delay for 1 second
    candle.classList.remove("hide");
    scary1.play();
    createSnake();
    playBGM();
    showMoon();
  }
}
function createRipple(event) {
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);

  const size = 20; // Size of the ripple
  const x = event.pageX - size / 2;
  const y = event.pageY - size / 2;

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Remove the ripple after the animation ends
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

function createSnake() {
  const clicker = document.getElementById("clicker");
  const snakeContainer = document.createElement("div");
  snakeContainer.id = "snake-container";
  clicker.appendChild(snakeContainer);

  const snakeSegments = [];
  const segmentSize = 20; // Size of each snake segment
  const initialLength = 5; // Initial number of segments
  let direction = { x: 1, y: 0 }; // Initial movement direction (right)
  let positions = []; // Tracks the positions of the snake segments

  const clickerWidth = clicker.offsetWidth;
  const clickerHeight = clicker.offsetHeight;

  // Create initial snake segments
  for (let i = 0; i < initialLength; i++) {
    const segment = document.createElement("div");
    segment.className = "snake-segment";
    segment.style.left = `${i * segmentSize}px`;
    segment.style.top = `0px`;
    snakeContainer.appendChild(segment);
    snakeSegments.push(segment);
    positions.push({ x: i * segmentSize, y: 0 });
  }

  // Create the food item
  const food = document.createElement("div");
  food.className = "food";
  placeFoodRandomly(food);
  snakeContainer.appendChild(food);

  // Function to move the snake
  function moveSnake() {
    // Calculate new head position
    const head = positions[0];
    let newHead = {
      x: head.x + direction.x * segmentSize,
      y: head.y + direction.y * segmentSize,
    };

    // Wrap the snake around if it goes out of bounds
    if (newHead.x < 0) newHead.x = clickerWidth - segmentSize;
    if (newHead.x >= clickerWidth) newHead.x = 0;
    if (newHead.y < 0) newHead.y = clickerHeight - segmentSize;
    if (newHead.y >= clickerHeight) newHead.y = 0;

    // Check if the snake eats the food
    const foodX = parseInt(food.style.left);
    const foodY = parseInt(food.style.top);
    if (newHead.x === foodX && newHead.y === foodY) {
      // Add a new segment to the snake
      const newSegment = document.createElement("div");
      newSegment.className = "snake-segment";
      snakeContainer.appendChild(newSegment);
      snakeSegments.push(newSegment);

      // Add the correct position for the new segment
      const lastSegment = positions[positions.length - 1];
      positions.push({ x: lastSegment.x, y: lastSegment.y });

      // Place the food in a new random position
      placeFoodRandomly(food);
    } else {
      // Remove the last position to maintain the snake's length
      positions.pop();
    }

    // Add new head position to the front of the positions array
    positions.unshift(newHead);

    // Update the position of each segment
    snakeSegments.forEach((segment, index) => {
      segment.style.left = `${positions[index].x}px`;
      segment.style.top = `${positions[index].y}px`;
    });

    // Keep the snake moving
    setTimeout(moveSnake, 100); // Adjust speed by changing the timeout value
  }

  // Function to change the snake's direction
  function changeDirection(event) {
    // Prevent default behavior (e.g., scrolling)
    event.preventDefault();

    switch (event.key) {
      case "ArrowUp":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
    }
  }

  // Function to place the food in a random position
  function placeFoodRandomly(food) {
    const maxX = Math.floor(clickerWidth / segmentSize) * segmentSize;
    const maxY = Math.floor(clickerHeight / segmentSize) * segmentSize;
    const randomX =
      Math.floor(Math.random() * (maxX / segmentSize)) * segmentSize;
    const randomY =
      Math.floor(Math.random() * (maxY / segmentSize)) * segmentSize;
    food.style.left = `${randomX}px`;
    food.style.top = `${randomY}px`;
  }

  // Add event listener for arrow key controls
  document.addEventListener("keydown", changeDirection);

  // Start the snake movement
  moveSnake();
}

function dvd() {
  let x = 0,
    y = 0,
    dirX = 1,
    dirY = 1;
  const speed = 2;
  const pallete = ["#ff8800", "#e124ff", "#6a19ff", "#ff2188"];
  let dvd = document.getElementById("dvd");
  dvd.style.backgroundColor = pallete[0];
  let prevColorChoiceIndex = 0;
  const dvdWidth = dvd.clientWidth;
  const dvdHeight = dvd.clientHeight;

  function getNewRandomColor() {
    const currentPallete = [...pallete];
    currentPallete.splice(prevColorChoiceIndex, 1);
    const colorChoiceIndex = Math.floor(Math.random() * currentPallete.length);
    prevColorChoiceIndex =
      colorChoiceIndex < prevColorChoiceIndex
        ? colorChoiceIndex
        : colorChoiceIndex + 1;
    const colorChoice = currentPallete[colorChoiceIndex];
    return colorChoice;
  }
  function animate() {
    const screenHeight = document.body.clientHeight;
    const screenWidth = document.body.clientWidth;

    if (y + dvdHeight >= screenHeight || y < 0) {
      dirY *= -1;
      dvd.style.backgroundColor = getNewRandomColor();
    }
    if (x + dvdWidth >= screenWidth || x < 0) {
      dirX *= -1;

      dvd.style.backgroundColor = getNewRandomColor();
    }
    x += dirX * speed;
    y += dirY * speed;
    dvd.style.left = x + "px";
    dvd.style.top = y + "px";
    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
}

function rain() {
  const rainContainer = document.createElement("div");
  rainContainer.className = "rain";
  clicker.appendChild(rainContainer);

  const nbDrop = 200; // Number of drops to create

  // Function to generate a random number within a range
  function randRange(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }

  // Function to generate a single drop with a random delay
  function createDropWithDelay() {
    const clickerWidth = clicker.offsetWidth;
    const clickerHeight = clicker.offsetHeight;

    const dropLeft = randRange(0, clickerWidth); // Random horizontal position
    const dropTop = randRange(-clickerHeight, 0); // Random vertical position (above the container)

    const drop = document.createElement("div");
    drop.className = "drop";
    drop.style.left = `${dropLeft}px`;
    drop.style.top = `${dropTop}px`;

    rainContainer.appendChild(drop);

    // Remove the drop after it finishes falling and create a new one
    drop.addEventListener("animationend", () => {
      drop.remove();
      setTimeout(createDropWithDelay, randRange(500, 2000)); // Create a new drop after a random delay
    });
  }

  // Function to generate all drops with random delays
  function createRain() {
    for (let i = 1; i <= nbDrop; i++) {
      setTimeout(createDropWithDelay, randRange(0, 2000)); // Stagger the creation of drops
    }
  }

  // Make it rain
  createRain();
}

function listenForKeys() {
  const commands = {
    karan: showImage, // Show the image when "karan" is typed
    play: playBGM, // Play all sounds when "play" is typed
    death: setDeathClicks, // Set click count to 9999999 when "death" is typed
    invert: invertClicker, // Invert the clicker when "invert" is typed
    color1: () => changeClickerColor("#333333"),
    color2: () => changeClickerColor("#999999"),
    color3: () => changeClickerColor("#eeeedd"),
    color4: () => changeClickerColor("#555555"),
    color5: () => changeClickerColor("#443355"),
    blur: applyBlurEffect, // Apply blur effect to the clicker
    grayscale: applyGrayscaleEffect, // Apply grayscale effect to the clicker
  };

  let inputBuffer = ""; // Buffer to store user input

  document.addEventListener("keydown", (event) => {
    inputBuffer += event.key.toLowerCase(); // Append the pressed key to the buffer

    // Keep the buffer length equal to the longest command
    const maxCommandLength = Math.max(
      ...Object.keys(commands).map((cmd) => cmd.length)
    );
    if (inputBuffer.length > maxCommandLength) {
      inputBuffer = inputBuffer.slice(1);
    }

    // Check if the buffer matches any command
    for (const command in commands) {
      if (inputBuffer.endsWith(command)) {
        commands[command](); // Execute the corresponding function
        inputBuffer = ""; // Clear the buffer after executing the command
        break;
      }
    }
  });
}

function showImage() {
  const img = document.querySelector(".developer-box");
  img.classList.remove("hide"); // Show the image
  setTimeout(() => {
    img.classList.add("hide");
  }, 3000);
}

function playBGM() {
  const sound = document.querySelector("#bgm");
  sound.play();
}

function setDeathClicks() {
  clicks = 9999998; // Set the click count to 9999999
  handleClick(); // Recheck all conditions
}

function invertClicker() {
  const clicker = document.getElementById("clicker");
  if (clicker.style.filter === "invert(1)") {
    clicker.style.filter = "none"; // Remove the invert effect
  } else {
    clicker.style.filter = "invert(1)"; // Apply the invert effect
  }
}

function applyGrayscaleEffect() {
  if (clicker.style.filter === "grayscale(1)") {
    clicker.style.filter = "none"; // Remove the grayscale effect
  } else {
    clicker.style.filter = "grayscale(1)"; // Apply the grayscale effect
  }
}

function applyBlurEffect() {
  const clicker = document.getElementById("clicker");
  if (clicker.style.filter === "blur(5px)") {
    clicker.style.filter = "none"; // Remove the blur effect
    console.log("Blur effect removed from clicker");
  } else {
    clicker.style.filter = "blur(5px)"; // Apply the blur effect
  }
}

function changeClickerColor(color) {
  const clicker = document.getElementById("clicker");
  clicker.style.backgroundColor = color; // Change the background color
}


function showMoon() {
  const moon = document.querySelector(".moon");
  moon.classList.remove("hide"); // Show the moon
}


function stars(){
  // Author: Ali Soueidan
// Author URI: https//: www.alisoueidan.com

//////
// Positioning stars

// Select star-divs
const STARS = document.querySelectorAll(".star");
// Set counter  
  let i = 0;
// Select every star and reposition it by coincidence
  STARS.forEach( function() {
    // defining x coordinate
      let x = Math.floor((Math.random() * 100) + 1);
    // defining y coordinate
      let y = Math.floor((Math.random() * 90) + 1);
    // Setting star position x & Y
      STARS[i].style.left = x + "%";
      STARS[i].style.top = y + "%";
    // Counting up the counter
      ++i;
  });


//////
// lets do some bling bling (super easy, super simple)

// Setup interval timing
  let intervalTimer = 1000;
// setting upfunction for blinking stars
  function blink(){
    // Setup of a random selektor
      let startID = Math.floor((Math.random() * 100) + 1);
    // Selekting random star
      let selection = document.querySelector("#star-"+ startID);
    // Adding blink-classs to selektion
      selection.classList.add("blink");
    setTimeout(function(){ 
      // Removing Blink-class after timeout
        selection.classList.remove("blink");
    }, intervalTimer/2);
  };

// Let the magic beginn
  setInterval( blink, intervalTimer/160 );

}
