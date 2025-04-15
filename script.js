const clicker = document.getElementById("clicker");
const candle = document.querySelector(".g-candle");
const scary1 = document.getElementById("scary1");
const clickCounter = document.getElementById("click-counter");
let clicks = 0;
let flag = true;
let chestTimeout; // Timeout for despawning the chest
let chestRespawnTimeout; // Timeout for respawning the chest
let ball; // Reference to the ball element
let ballSpeed = 2; // Initial speed of the ball
let ballInterval; // Interval for ball movement
let isBallFaster = false; // Flag to track if the ball is moving faster
let waterLevel = 0; // Tracks the current water level (percentage)
let waterInterval; // Interval for water rising
let glassTimeout; // Timeout for despawning the glass
let planeInterval, bombInterval;
let tankPosition = window.innerWidth / 2; // Initial tank position
const tankSpeed = 20; // Speed of tank movement
const projectileSpeed = 10; // Speed of projectile movement
const triggeredEvents = new Set(); // Track triggered events
let ballSpawned = false; // Flag to track if the ball has already been spawned

window.onload = () => {
  init();
};
function init() {
  // Call the function to start listening for the sequence
  listenForKeys();
  clicker.addEventListener("click", handleClick);
}

function handleClick(event) {
  clicks++;

  if (clickCounter) {
    clickCounter.textContent = `Clicks: ${clicks}`;
  }

  if (event) {
    createRipple(event);
  }

  // Recheck all conditions whenever clicks are updated
  checkEvents();
}

function checkEvents() {
  // Check all conditions independently and ensure each event is triggered only once
  if (clicks >= 50 && !triggeredEvents.has(50)) {
    triggeredEvents.add(50);
    dvd();
  }
  if (clicks >= 75 && !triggeredEvents.has(75)) {
    triggeredEvents.add(75);
    scary1.play();
  }
  if (clicks >= 100 && !triggeredEvents.has(100)) {
    triggeredEvents.add(100);
    candle.classList.remove("hide");
  }
  if (clicks >= 150 && !triggeredEvents.has(150)) {
    triggeredEvents.add(150);
    rain();
  }
  if (clicks >= 250 && !triggeredEvents.has(250)) {
    triggeredEvents.add(250);
    createSnake();
  }
  if (clicks >= 400 && !triggeredEvents.has(400)) {
    triggeredEvents.add(400);
    showMoon();
  }
  if (clicks >= 500 && !triggeredEvents.has(500)) {
    triggeredEvents.add(500);
    stars();
  }
  if (clicks >= 666 && !triggeredEvents.has(666)) {
    triggeredEvents.add(666);
    const wisper = document.getElementById("wisper");
    wisper.play();
  }
  if (clicks >= 700 && !triggeredEvents.has(700)) {
    triggeredEvents.add(700);
    showYT();
  }
  if (clicks >= 800 && !triggeredEvents.has(800)) {
    triggeredEvents.add(800);
    spawnChest();
  }
  if (clicks >= 1000 && !triggeredEvents.has(1000)) {
    triggeredEvents.add(1000);
    spawnBouncyBall();
  }
  if (clicks >= 1200 && !triggeredEvents.has(1200)) {
    triggeredEvents.add(1200);
    startDinosaurGame();
  }
  if (clicks >= 1500 && !triggeredEvents.has(1500)) {
    triggeredEvents.add(1500);
    spawnGhosts();
  }
  if (clicks >= 2000 && !triggeredEvents.has(2000)) {
    triggeredEvents.add(2000);
    startWaterEffect();
  }
  if (clicks >= 2500 && !triggeredEvents.has(2500)) {
    triggeredEvents.add(2500);
    spawnClouds();
  }
  if (clicks >= 3000 && !triggeredEvents.has(3000)) {
    triggeredEvents.add(3000);
    showGta();
  }
  if (clicks >= 3400 && !triggeredEvents.has(3400)) {
    triggeredEvents.add(3400);
    showDeathMessage();
  }
  if (clicks >= 3500 && !triggeredEvents.has(3500)) {
    triggeredEvents.add(3500);
    showVideoButtons();
  }
  if (clicks >= 4500 && !triggeredEvents.has(4500)) {
    triggeredEvents.add(4500);
    createTank();
    startPlaneFeature();
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
    showGta();
    spawnBouncyBall();
    spawnClouds();
    startWaterEffect();
    showYT();
    spawnGhosts();
    spawnChest();
    stars();
    showVideoButtons();
    startDinosaurGame();
    createTank();
    startPlaneFeature();
  }
}

// Call checkEvents whenever clicks are updated in other parts of the code
function updateClicks(amount) {
  clicks += amount;
  if (clickCounter) {
    clickCounter.textContent = `Clicks: ${clicks}`;
  }
  checkEvents(); // Recheck all conditions
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

    // Use a more robust collision detection
    if (
      Math.abs(newHead.x - foodX) < segmentSize &&
      Math.abs(newHead.y - foodY) < segmentSize
    ) {
      // Add a new segment to the snake
      const newSegment = document.createElement("div");
      newSegment.className = "snake-segment";
      snakeContainer.appendChild(newSegment);
      snakeSegments.push(newSegment);
      updateClicks(25); // Add 25 clicks for eating food

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
    death: playDeathVideo, // Play the full-screen video when "death" is typed
    karan: showImage, // Show the image when "karan" is typed
    play: playBGM, // Play all sounds when "play" is typed
    infinite: setDeathClicks, // Set click count to 9999998 when "infinite" is typed
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
  clicks = 9999998; // Set the click count to 9999998
  checkEvents(); // Recheck all conditions
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

function stars() {
  const starContainer = document.createElement("stars");
  starContainer.classList.remove("hide"); // Show the stars
  // Select star-divs
  const STARS = document.querySelectorAll(".star");
  // Set counter
  let i = 0;
  // Select every star and reposition it by coincidence
  STARS.forEach(function () {
    // defining x coordinate
    let x = Math.floor(Math.random() * 100 + 1);
    // defining y coordinate
    let y = Math.floor(Math.random() * 90 + 1);
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
  function blink() {
    // Setup of a random selektor
    let startID = Math.floor(Math.random() * 100 + 1);
    // Selekting random star
    let selection = document.querySelector("#star-" + startID);
    // Adding blink-classs to selektion
    selection.classList.add("blink");
    setTimeout(function () {
      // Removing Blink-class after timeout
      selection.classList.remove("blink");
    }, intervalTimer / 2);
  }

  // Let the magic beginn
  setInterval(blink, intervalTimer / 160);
}

function spawnChest() {
  // Check if the chest already exists
  let chest = document.querySelector(".chest");
  if (!chest) {
    chest = document.createElement("div");
    chest.className = "chest";
    chest.innerHTML = '<img src="./images/chest.png" alt="Chest" />';
    document.body.appendChild(chest);
  }

  // Randomly position the chest
  const chestSize = 50; // Adjust chest size if needed
  const maxX = window.innerWidth - chestSize;
  const maxY = window.innerHeight - chestSize;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  chest.style.position = "absolute";
  chest.style.left = `${randomX}px`;
  chest.style.top = `${randomY}px`;
  chest.style.width = `${chestSize}px`;
  chest.style.height = `${chestSize}px`;
  chest.style.cursor = "pointer";
  chest.style.zIndex = "1000";
  chest.style.display = "block";

  // Add click event to the chest
  chest.onclick = () => {
    updateClicks(100); // Add 100 clicks
    chest.style.display = "none"; // Hide the chest
    clearTimeout(chestTimeout); // Clear the despawn timeout
    respawnChest(); // Schedule the next chest spawn
  };

  // Despawn the chest after 2 seconds if not clicked
  chestTimeout = setTimeout(() => {
    chest.style.display = "none"; // Hide the chest
    respawnChest(); // Schedule the next chest spawn
  }, 2000);
}

function respawnChest() {
  // Respawn the chest after 3 minutes (180,000 milliseconds)
  chestRespawnTimeout = setTimeout(() => {
    spawnChest();
  }, 180000);
}

function spawnBouncyBall() {
  if (ballSpawned) return; // Prevent duplicate calls
  ballSpawned = true;

  // Check if the ball already exists
  if (!ball) {
    ball = document.createElement("div");
    ball.className = "bouncy-ball";
    document.body.appendChild(ball);
  }

  // Randomly position the ball
  const ballSize = 50; // Size of the ball
  const maxX = window.innerWidth - ballSize;
  const maxY = window.innerHeight - ballSize;
  let ballX = Math.floor(Math.random() * maxX);
  let ballY = Math.floor(Math.random() * maxY);
  let dirX = 1; // Horizontal direction (1 = right, -1 = left)
  let dirY = 1; // Vertical direction (1 = down, -1 = up)

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  ball.style.width = `${ballSize}px`;
  ball.style.height = `${ballSize}px`;

  // Function to move the ball
  function moveBall() {
    ballX += dirX * ballSpeed;
    ballY += dirY * ballSpeed;

    // Bounce off the walls
    if (ballX <= 0 || ballX >= maxX) dirX *= -1;
    if (ballY <= 0 || ballY >= maxY) dirY *= -1;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
  }

  // Start moving the ball
  ballInterval = setInterval(moveBall, 16); // ~60 FPS

  // Add click event to the ball
  ball.onclick = () => {
    ballSpeed += 2; // Increase the speed
    dirX = Math.random() > 0.5 ? 1 : -1; // Randomize horizontal direction
    dirY = Math.random() > 0.5 ? 1 : -1; // Randomize vertical direction
  };
}

function spawnGhosts() {
  const ghostContainer = document.createElement("div");
  ghostContainer.id = "ghost-container";
  document.body.appendChild(ghostContainer);

  let ghostSpawnInterval;
  let ghostDespawnTimeout;

  // Function to spawn a single ghost
  function spawnGhost() {
    const ghost = document.createElement("img");
    ghost.src = `./images/ghost${Math.floor(Math.random() * 3) + 1}.png`; // Random ghost image
    ghost.className = "ghost";

    const ghostSize = 50; // Size of the ghost
    const maxX = window.innerWidth - ghostSize;
    const maxY = window.innerHeight - ghostSize;

    // Randomly position the ghost
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    ghost.style.position = "absolute";
    ghost.style.left = `${randomX}px`;
    ghost.style.top = `${randomY}px`;
    ghost.style.width = `${ghostSize}px`;
    ghost.style.height = `${ghostSize}px`;
    ghost.style.cursor = "pointer";
    ghost.style.zIndex = "1000";

    ghostContainer.appendChild(ghost);

    // Add click event to the ghost
    ghost.onclick = () => {
      updateClicks(20); // Add 20 clicks
      ghost.remove(); // Remove the ghost
    };

    // Despawn the ghost after 10 seconds if not clicked
    ghostDespawnTimeout = setTimeout(() => {
      ghost.remove();
    }, 10000);
  }

  // Start spawning ghosts every 5 seconds
  ghostSpawnInterval = setInterval(spawnGhost, 5000);

  // Stop spawning ghosts after 2 minutes
  setTimeout(() => {
    clearInterval(ghostSpawnInterval);
    console.log("Ghost spawning stopped after 2 minutes.");
  }, 120000); // 2 minutes in milliseconds
}

// Start the water effect and spawn buckets
function startWaterEffect() {
  let water = document.querySelector(".water");
  if (!water) {
    water = document.createElement("div");
    water.className = "water";
    document.body.appendChild(water);
  }

  waterInterval = setInterval(() => {
    waterLevel += 1; // Increase water level by 1%
    water.style.height = `${waterLevel}%`;

    if (waterLevel >= 100) {
      clearInterval(waterInterval);
      clicks = 0; // Reset clicks
      clickCounter.textContent = `Clicks: ${clicks}`;
      alert("The water has filled the screen! Clicks have been reset.");
      waterLevel = 0;
      water.style.height = "0%";
    }
  }, 2000);

  // Start spawning buckets
  setTimeout(spawnBucket, 5000); // Spawn the first bucket after 20 seconds
}

function spawnBucket() {
  // Create the bucket element if it doesn't exist
  let bucket = document.querySelector(".bucket");

  // Randomly position the bucket
  const bucketSize = 40; // Size of the bucket
  const maxX = window.innerWidth - bucketSize;
  const maxY = window.innerHeight - bucketSize;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  bucket.style.left = `${randomX}px`;
  bucket.style.top = `${randomY}px`;
  bucket.style.width = `${bucketSize}px`;
  bucket.style.height = `${bucketSize}px`;
  bucket.style.display = "block";

  // Add click event to the bucket
  bucket.onclick = () => {
    waterLevel = Math.max(0, waterLevel - 10); // Lower water level by 10%
    document.querySelector(".water").style.height = `${waterLevel}%`;
    bucket.style.display = "none"; // Hide the bucket
    clearTimeout(bucketTimeout); // Clear the despawn timeout
  };

  // Despawn the bucket after 1.5 seconds if not clicked
  bucketTimeout = setTimeout(() => {
    bucket.style.display = "none"; // Hide the bucket
  }, 1500);

  // Schedule the next bucket spawn after 20 seconds
  setTimeout(spawnBucket, 5000);
}

function spawnClouds() {
  const cloudContainer = document.querySelector(".cloud-container") || document.createElement("div");
  if (!cloudContainer.classList.contains("cloud-container")) {
    cloudContainer.className = "cloud-container";
    document.body.appendChild(cloudContainer);
  }

  function createCloud() {
    const cloud = document.createElement("img");
    const randomCloudNumber = Math.floor(Math.random() * 5) + 1; // Randomly select cloud1 to cloud5
    cloud.src = `./images/cloud${randomCloudNumber}.png`;
    cloud.className = "cloud";

    // Randomize initial position and z-index
    const startX = Math.random() > 0.5 ? -150 : window.innerWidth + 150; // Start offscreen (left or right)
    const randomY = Math.floor(Math.random() * (window.innerHeight * 0.8)); // Random vertical position (top 80% of the screen)
    const randomZIndex = Math.floor(Math.random() * 11) + 10; // Z-index between 10 and 20

    cloud.style.left = `${startX}px`;
    cloud.style.top = `${randomY}px`;
    cloud.style.zIndex = randomZIndex;

    cloudContainer.appendChild(cloud);

    // Animate the cloud along the X-axis
    const endX = startX < 0 ? window.innerWidth + 150 : -150; // Move to the opposite side
    const duration = Math.random() * 5000 + 5000; // Random duration between 5s and 10s

    cloud.style.transition = `left ${duration}ms linear`;
    setTimeout(() => {
      cloud.style.left = `${endX}px`;
    }, 100); // Delay to ensure the transition applies

    // Remove the cloud after it moves offscreen
    setTimeout(() => {
      cloud.remove();
    }, duration + 100);

    // Spawn the next cloud after a random delay
    setTimeout(createCloud, Math.random() * 2000 + 1000); // Delay between 1s and 3s
  }

  // Start spawning clouds
  createCloud();
}

function showGta() {
  const gta = document.querySelector(".gta");
  gta.classList.remove("hide");
}

function showYT() {
  const yt = document.querySelector(".yt-video");
  yt.classList.remove("hide");
}

function showVideoButtons() {
  const videoChoice = document.querySelector(".video-choice");
  videoChoice.style.display = "flex"; // Show the buttons

  // Add event listeners to the buttons
  document.getElementById("video1").onclick = () => playVideo(0); // Play "rolled" video
  document.getElementById("video2").onclick = () => playVideo(1); // Play "scare" video
}

function playVideo(videoIndex) {
  const videoBox = document.querySelector(".video-box");
  const videos = videoBox.querySelectorAll("video");

  // Hide the buttons
  const videoChoice = document.querySelector(".video-choice");
  videoChoice.style.display = "none";

  // Show the selected video
  const selectedVideo = videos[videoIndex];
  selectedVideo.style.display = "block"; // Ensure the video is visible
  selectedVideo.style.position = "fixed";
  selectedVideo.style.top = "0";
  selectedVideo.style.left = "0";
  selectedVideo.style.width = "100vw";
  selectedVideo.style.height = "100vh";
  selectedVideo.style.zIndex = "1000";
  selectedVideo.play();

  // Hide the video after it ends
  selectedVideo.onended = () => {
    selectedVideo.style.display = "none"; // Hide the video
    selectedVideo.pause();
    selectedVideo.currentTime = 0; // Reset the video
  };
}

function startPlaneFeature() {
  const plane = document.createElement("img");
  plane.src = "images/plane.png"; // Replace with the path to your plane image
  plane.className = "plane";
  document.body.appendChild(plane);

  let planeDirection = 1; // 1 for right, -1 for left
  let planePosition = 0;

  // Move the plane
  planeInterval = setInterval(() => {
    planePosition += 5 * planeDirection;
    if (planePosition > window.innerWidth - 100 || planePosition < 0) {
      planeDirection *= -1; // Reverse direction
    }
    plane.style.left = `${planePosition}px`;
  }, 50);

  bombInterval = setInterval(() => {
    dropBomb(planePosition);
  }, 8000);
}

function dropBomb(x) {
  const bomb = document.createElement("img");
  bomb.src = "images/bomb.png"; // Replace with the path to your bomb image
  bomb.className = "bomb";
  bomb.style.left = `${x}px`;
  bomb.style.top = "30px"; // Initial position
  document.body.appendChild(bomb);

  const bombFallInterval = setInterval(() => {
    const bombTop = parseInt(bomb.style.top || "30px");
    if (bombTop >= window.innerHeight - 50) {
      clearInterval(bombFallInterval);
      bomb.remove();

      // Decrease clicks by 5 if the bomb touches the bottom
      updateClicks(-5); // Ensure clicks don't go below 0
    } else {
      bomb.style.top = `${bombTop + 5}px`;
    }
  }, 50);

  // Attach the interval ID to the bomb element for later clearing
  bomb.dataset.fallInterval = bombFallInterval;
}

function createTank() {
  const tank = document.createElement("img");
  tank.src = "images/tank.png"; // Replace with the path to your tank image
  tank.id = "tank";
  tank.style.left = `${tankPosition}px`;
  document.body.appendChild(tank);

  document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") {
      tankPosition = Math.max(0, tankPosition - tankSpeed);
    } else if (event.key === "d" || event.key === "D") {
      tankPosition = Math.min(window.innerWidth - 50, tankPosition + tankSpeed);
    } else if (event.key === "w" || event.key === "W") {
      shootProjectile();
    }
    tank.style.left = `${tankPosition}px`;
  });
}

function shootProjectile() {
  const projectile = document.createElement("img");
  projectile.src = "images/rocket.png"; // Replace with the path to your rocket image
  projectile.className = "projectile";
  projectile.style.left = `${tankPosition + 20}px`;
  projectile.style.top = `${window.innerHeight - 50}px`; // Initial position
  document.body.appendChild(projectile);

  const projectileInterval = setInterval(() => {
    const projectileTop = parseInt(projectile.style.top || `${window.innerHeight - 50}px`);
    if (projectileTop <= 0) {
      clearInterval(projectileInterval);
      projectile.remove();
    } else {
      projectile.style.top = `${projectileTop - projectileSpeed}px`;

      // Check for collision with bombs
      const bombs = document.querySelectorAll(".bomb");
      bombs.forEach((bomb) => {
        const bombRect = bomb.getBoundingClientRect();
        const projectileRect = projectile.getBoundingClientRect();
        if (
          projectileRect.left < bombRect.right &&
          projectileRect.right > bombRect.left &&
          projectileRect.top < bombRect.bottom &&
          projectileRect.bottom > bombRect.top
        ) {
          // Remove the bomb and clear its fall interval
          const bombFallInterval = bomb.dataset.fallInterval;
          if (bombFallInterval) {
            clearInterval(bombFallInterval);
          }
          bomb.remove();

          // Remove the projectile
          projectile.remove();
          clearInterval(projectileInterval);

          // Increase clicks by 5 if the rocket hits a bomb
          updateClicks(5);
        }
      });
    }
  }, 30);
}

function startDinosaurGame() {
  // Create game container
  const gameContainer = document.createElement("div");
  gameContainer.id = "dino-game";
  document.body.appendChild(gameContainer);

  // Create bicycle
  const bicycle = document.createElement("img");
  bicycle.src = "images/bicycle.png"; // Replace with the path to your bicycle image
  bicycle.id = "bicycle";
  gameContainer.appendChild(bicycle);

  let isJumping = false;

  // Handle jump
  document.addEventListener("keydown", (event) => {
    if (event.key === " " && !isJumping) {
      isJumping = true;
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
          clearInterval(jumpInterval);
          const fallInterval = setInterval(() => {
            if (jumpHeight <= 0) {
              clearInterval(fallInterval);
              isJumping = false;
            }
            jumpHeight -= 5;
            bicycle.style.bottom = `${jumpHeight}px`;
          }, 20);
        }
        jumpHeight += 5;
        bicycle.style.bottom = `${jumpHeight}px`;
      }, 20);
    }
  });

  // Function to spawn stones
  function spawnStone() {
    const stone = document.createElement("img");
    stone.src = "images/stone.png"; // Replace with the path to your stone image
    stone.className = "stone";
    stone.style.left = "100%";
    stone.style.bottom = "0"; // Ensure the stone starts at the bottom
    gameContainer.appendChild(stone);

    let hasCollided = false; // Track if the stone has collided with the bicycle

    const stoneInterval = setInterval(() => {
      const stoneLeft = parseInt(window.getComputedStyle(stone).left);
      const bicycleBottom = parseInt(window.getComputedStyle(bicycle).bottom);
      const stoneLeftAfterMove = parseInt(window.getComputedStyle(stone).left);

      // Check for collision
      if (
        stoneLeftAfterMove > 50 && // Adjusted collision range
        stoneLeftAfterMove < 100 &&
        bicycleBottom < 50 // Ensure collision only happens when the bicycle is not jumping
      ) {
        hasCollided = true; // Mark as collided
        updateClicks(-50); // Decrease clicks by 50
        stone.remove(); // Remove the stone
        clearInterval(stoneInterval); // Stop the stone's movement
      }

      // If the stone reaches the left edge and no collision occurred
      if (stoneLeft <= 0 && !hasCollided) {
        updateClicks(50); // Add 50 clicks for successfully avoiding the stone
        stone.remove(); // Remove the stone
        clearInterval(stoneInterval); // Stop the stone's movement
      } else {
        stone.style.left = `${stoneLeft - 10}px`; // Move the stone left
      }
    }, 50);

    // Spawn the next stone after a random interval (5 to 15 seconds)
    setTimeout(spawnStone, Math.random() * 10000 + 5000);
  }

  // Start spawning stones
  spawnStone();
}

function showDeathMessage() {
  const message = document.createElement("div");
  message.id = "death-message";
  message.textContent = "Type: death";
  message.style.position = "fixed";
  message.style.top = "50%";
  message.style.left = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.fontSize = "3rem";
  message.style.color = "red";
  message.style.zIndex = "1000";
  message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  message.style.padding = "20px";
  message.style.borderRadius = "10px";
  message.style.textAlign = "center";
  document.body.appendChild(message);

  // Remove the message after 3 seconds
  setTimeout(() => {
    message.remove();
  }, 3000);
}

function playDeathVideo() {
  const video = document.createElement("video");
  video.src = "./videos/Malenia.mp4"; // Path to the video file
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.zIndex = "1000";
  video.autoplay = true;
  video.controls = false;
  video.loop = false;
  document.body.appendChild(video);
  clicker.style.pointerEvents = "none";

  // Disable clicks and actions after the video ends
  video.onended = () => {
    video.remove();
    endGame();
  };
}

function endGame() {
  const centerText = document.querySelector(".centerText");
  centerText.textContent = "Game Over";

  // Set clicks to 0 and prevent further clicks
  clicks = -9999999; // Set to a negative value to indicate game over
  clickCounter.textContent = `Clicks: ${clicks}`;
  // Disable click events
  clicker.style.pointerEvents = "none";
}