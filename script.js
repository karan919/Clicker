window.onload = function () {
  const clicker = document.getElementById("clicker");
  const candle = document.querySelector(".g-candle");
  const scary1 = document.getElementById("scary1"); 
  let clicks = 0;

  clicker.addEventListener("click", function (event) {
    clicks++;
    document.title = `Clicks: ${clicks}`;
    createRipple(event);

    if (clicks === 100) {
      dvd();
    }else if(clicks === 2){
      candle.classList.remove("hide");
    }else if(clicks % 75 === 0){
      scary1.play();
    }else if(clicks === 10){
      rain();
    }
    createSnake();
  });
};

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
    if (newHead.x === parseInt(food.style.left) && newHead.y === parseInt(food.style.top)) {
      // Add a new segment to the snake
      const newSegment = document.createElement("div");
      newSegment.className = "snake-segment";
      snakeContainer.appendChild(newSegment);
      snakeSegments.push(newSegment);
      positions.push({}); // Add a placeholder for the new segment
      placeFoodRandomly(food); // Place the food in a new random position
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
    const randomX = Math.floor(Math.random() * (maxX / segmentSize)) * segmentSize;
    const randomY = Math.floor(Math.random() * (maxY / segmentSize)) * segmentSize;
    food.style.left = `${randomX}px`;
    food.style.top = `${randomY}px`;
  }

  // Add event listener for arrow key controls
  document.addEventListener("keydown", changeDirection);

  // Start the snake movement
  moveSnake();
}

function rain() {
  const clicker = document.getElementById("clicker");
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