import React, { useEffect, useRef } from "react";

function GameComponent() {
  const canvasRef = useRef(null);
  const frameCountRef = useRef(0);

  const imagesRef = useRef({
    blueHippo: new Image(),
    blueHippoEat: new Image(),
    redHippo: new Image(),
    redHippoEat: new Image(),
    wallpaper: new Image(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    var gameConfig = {
      users: {
        blue: [],
        red: [],
      },
      blueHippoEatSpeed: 25,
      redHippoEatSpeed: 25,
      ballSpeed: 10,
      ballSize: 80,
    };
    var myGamePieces = [];
    var myBackground;
    var myScoreSound;
    var myBlueHippo;
    var myRedHippo;
    var isHippoEating = {
      blue: false,
      red: false,
    };
    var lastDataFetchTime = 0;

    var imageUrls = [];
    imagesRef.current.blueHippo.src = "blueHippo.png";
    imagesRef.current.blueHippoEat.src = "blueHippoEat.png";
    imagesRef.current.redHippo.src = "redHippo.png";
    imagesRef.current.redHippoEat.src = "redHippoEat.png";
    imagesRef.current.wallpaper.src = "wallpaper.jpg";

    function startGame() {
      // Create game pieces from the list of image URLs
      for (let i = 0; i < imageUrls.length; i++) {
        const x = getRandomPosition(0, canvas.width - 90); // Adjust the width of the game piece
        const y = getRandomPosition(0, canvas.height - 90); // Adjust the height of the game piece

        const gamePiece = new component(
          gameConfig.ballSize, // Adjust the width of the game piece
          gameConfig.ballSize, // Adjust the height of the game piece
          imageUrls[i],
          x,
          y,
          "image"
        );

        gamePiece.speedX = getRandomSpeed(1, gameConfig.ballSpeed);
        gamePiece.speedY = getRandomSpeed(1, gameConfig.ballSpeed);

        myGamePieces.push(gamePiece);
      }
      myBlueHippo = new component(330, 660, "blueHippo.png", 453, 0, "image");
      myRedHippo = new component(330, 660, "redHippo.png", 453, 1196, "image");
      myBackground = new component(1236, 1856, "wallpaper.jpg", 0, 0, "image");
      myScoreSound = new sound("pop.mp3");
      myScoreSound.play();

      requestAnimationFrame(updateGameArea);
    }

    var myGameArea = {
      canvas: canvas,
      start: function () {
        this.canvas.width = 1236;
        this.canvas.height = 1856;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
      },
      clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      stop: function () {
        // Not needed with requestAnimationFrame
      },
    };

    function component(width, height, color, x, y, type, team = null) {
      this.type = type;
      if (type === "image" || type === "ball") {
        this.image = new Image();
        this.image.src = color;
      }
      this.width = width;
      this.height = height;
      this.speedX = 0;
      this.speedY = 0;
      this.x = x;
      this.y = y;
      this.team = team;
      this.profilePictureUrl = color;

      this.update = function () {
        if (type === "image") {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (type === "ball") {
          ctx.save();
          ctx.beginPath();
          const borderThickness = 10; // Adjust this value for the desired border thickness
          ctx.lineWidth = borderThickness;
          ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2, false);
          ctx.strokeStyle = team === "red" ? "#ff6058" : "#57bfed";
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(
            this.image,
            this.x - this.width / 2,
            this.y - this.width / 2,
            this.width,
            this.height
          );
          ctx.restore();

          //this.image.src = color;
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      };

      this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        // Check for collisions with the canvas walls
        if (this.x < 0 || this.x + this.width > myGameArea.canvas.width) {
          this.speedX = -this.speedX; // Reverse horizontal speed
        }
        if (this.y < 0 || this.y + this.height > myGameArea.canvas.height) {
          this.speedY = -this.speedY; // Reverse vertical speed
        }
      };
    }

    function updateGameArea() {
      myGameArea.clear();
      myBackground.newPos();
      myBackground.update();

      // Use swept AABB collision detection
      for (let i = myGamePieces.length - 1; i >= 0; i--) {
        const gamePiece = myGamePieces[i];

        if (isCollision(gamePiece, myRedHippo)) {
          if (gamePiece.team === "red" && isHippoEating.red) {
            imageUrls.splice(i, 1);
            myGamePieces.splice(i, 1);
            addNewScore(1, gamePiece.profilePictureUrl);
            showScoreText("white", "+ 1", gamePiece.x, gamePiece.y);
            myScoreSound.play();
          } else if (gamePiece.team === "blue" && isHippoEating.red) {
            imageUrls.splice(i, 1);
            myGamePieces.splice(i, 1);
            addNewScore(-1, gamePiece.profilePictureUrl);
            showScoreText("#ff4646", "- 1", gamePiece.x, gamePiece.y);
            myScoreSound.play();
          } else {
            gamePiece.speedX = -gamePiece.speedX;
            gamePiece.speedY = -gamePiece.speedY;

            gamePiece.x += gamePiece.speedX;
            gamePiece.y += gamePiece.speedY;
          }
        } else if (isCollision(gamePiece, myBlueHippo)) {
          if (gamePiece.team === "blue" && isHippoEating.blue) {
            imageUrls.splice(i, 1);
            myGamePieces.splice(i, 1);
            addNewScore(1, gamePiece.profilePictureUrl);
            showScoreText("white", "+ 1", gamePiece.x, gamePiece.y);
            myScoreSound.play();
          } else if (gamePiece.team === "red" && isHippoEating.blue) {
            imageUrls.splice(i, 1);
            myGamePieces.splice(i, 1);
            addNewScore(-1, gamePiece.profilePictureUrl);
            showScoreText("#ff4646", "- 1", gamePiece.x, gamePiece.y);
            myScoreSound.play();
          } else {
            gamePiece.speedX = -gamePiece.speedX;
            gamePiece.speedY = -gamePiece.speedY;

            gamePiece.x += gamePiece.speedX;
            gamePiece.y += gamePiece.speedY;
          }
        } else {
          for (let j = 0; j < myGamePieces.length; j++) {
            if (
              i !== j &&
              areSweptAABBsIntersecting(myGamePieces[i], myGamePieces[j])
            ) {
              // Handle the collision between two game pieces
              handleCollision(myGamePieces[i], myGamePieces[j]);
            }
          }
          if (gamePiece.width !== gameConfig.ballSize) {
            gamePiece.width = gameConfig.ballSize;
            gamePiece.height = gameConfig.ballSize;
          }

          gamePiece.newPos();
          gamePiece.update();
        }
      }

      myBlueHippo.newPos();
      myBlueHippo.update();
      myRedHippo.newPos();
      myRedHippo.update();
      frameCountRef.current += 1;

      // Display the frame count on the canvas
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Frame Count: ${frameCountRef.current}`, 10, 30);
      const fetchData = async () => {
        const maxAttempts = 100; // Maximum attempts to find a suitable position
        const res = await fetch(`http://localhost:3000/api/game-state`);
        if (res.ok) {
          const data = await res.json();

          gameConfig = data.gameConfig;

          imageUrls = [...imageUrls, ...data.users.blue];

          // Create new game pieces for the fetched images and add them to myGamePieces
          for (let i = 0; i < imageUrls.length; i++) {
            let x, y;
            let isOverlapping;
            let attempts = 0; // Track the number of attempts

            do {
              // Generate random x and y positions
              x = getRandomPosition(0, canvas.width - 90);
              y = getRandomPosition(0, canvas.height - 90);

              // Check for overlapping with existing game pieces
              isOverlapping = myGamePieces.some((piece) => {
                return (
                  x < piece.x + gameConfig.ballSize &&
                  x + gameConfig.ballSize > piece.x &&
                  y < piece.y + gameConfig.ballSize &&
                  y + gameConfig.ballSize > piece.y
                );
              });

              attempts++; // Increment the attempt counter

              // If maximum attempts are reached, break out of the loop
              if (attempts >= maxAttempts) {
                console.log(
                  `Maximum attempts reached for image ${i}. Skipping.`
                );
                break;
              }
            } while (isOverlapping);

            // If a suitable position is found, add the game piece
            if (!isOverlapping) {
              const gamePiece = new component(
                gameConfig.ballSize,
                gameConfig.ballSize,
                imageUrls[i],
                x,
                y,
                "ball",
                Math.random() < 0.5 ? "red" : "blue"
              );

              gamePiece.speedX = getRandomSpeed(1, gameConfig.ballSpeed);
              gamePiece.speedY = getRandomSpeed(1, gameConfig.ballSpeed);

              myGamePieces.push(gamePiece);
            }
          }
        }
      };
      const currentTime = performance.now();

      if (currentTime - lastDataFetchTime >= 10000) {
        fetchData();
        lastDataFetchTime = currentTime; // Update the last fetch time
      }

      if (currentTime - lastDataFetchTime >= 180000) {
        myGameArea.clear();
        myGamePieces = [];
        imageUrls = [];
        startGame();
      }

      if (frameCountRef.current % gameConfig.blueHippoEatSpeed === 0) {
        isHippoEating = {
          blue: !isHippoEating.blue,
          red: isHippoEating.red,
        };
        myBlueHippo.image = isHippoEating.blue
          ? imagesRef.current.blueHippoEat
          : imagesRef.current.blueHippo;
      }

      if (frameCountRef.current % gameConfig.redHippoEatSpeed === 0) {
        isHippoEating = {
          blue: isHippoEating.blue,
          red: !isHippoEating.red,
        };
        myRedHippo.image = isHippoEating.red
          ? imagesRef.current.redHippoEat
          : imagesRef.current.redHippo;
      }

      requestAnimationFrame(updateGameArea); // Continue the animation loop
    }

    function showScoreText(color, text, x, y) {
      ctx.fillStyle = color;
      ctx.font = "bolder 50px Arial";
      ctx.fillText(text, x, y);
    }

    function addNewScore(score, profilePictureUrl) {
      const fetchData = async () => {
        try {
          const url = "http://localhost:3000/api/game-leader/new";
          const data = {
            score: score,
            profilePictureUrl: profilePictureUrl,
          };
    
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify(data), // Convert data to JSON format
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const responseData = await response.json();
          // Handle the response data if needed
    
          // You can also return the response data or perform other actions here
          return responseData;
        } catch (error) {
          // Handle any errors that occurred during the fetch
          console.error("Error:", error);
        }
      };
    
      fetchData();
    }
    
    function sound(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      this.play = function(){
          this.sound.play();
      }
      this.stop = function(){
          this.sound.pause();
      }    
  }
  

    function getRandomSpeed(minSpeed, maxSpeed) {
      // Generate a random speed between minSpeed and maxSpeed
      return Math.random() * (maxSpeed - minSpeed) + minSpeed;
    }

    function getRandomPosition(min, max) {
      // Generate a random position between min and max
      return Math.random() * (max - min) + min;
    }

    // Function to check if two game pieces are colliding
    function isCollision(obj1, obj2) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    }

    function handleCollision(obj1, obj2) {
      // Reverse the speeds of the objects
      const tempSpeedX = obj1.speedX;
      const tempSpeedY = obj1.speedY;
      obj1.speedX = obj2.speedX;
      obj1.speedY = obj2.speedY;
      obj2.speedX = tempSpeedX;
      obj2.speedY = tempSpeedY;
    }

    function getSweptAABB(obj) {
      // Calculate swept AABB for a moving object
      const x = obj.x + obj.speedX;
      const y = obj.y + obj.speedY;
      const width = obj.width;
      const height = obj.height;
      const minX = obj.speedX > 0 ? x : obj.x;
      const minY = obj.speedY > 0 ? y : obj.y;
      const maxX = obj.speedX > 0 ? obj.x + width : x + width;
      const maxY = obj.speedY > 0 ? obj.y + height : y + height;

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    function areSweptAABBsIntersecting(obj1, obj2) {
      // Check if two swept AABBs are intersecting
      const sweptAABB1 = getSweptAABB(obj1);
      const sweptAABB2 = getSweptAABB(obj2);

      return (
        sweptAABB1.x < sweptAABB2.x + sweptAABB2.width &&
        sweptAABB1.x + sweptAABB1.width > sweptAABB2.x &&
        sweptAABB1.y < sweptAABB2.y + sweptAABB2.height &&
        sweptAABB1.y + sweptAABB1.height > sweptAABB2.y
      );
    }

    myGameArea.start();
    startGame(); // Start the game when the component mounts
  }, []); // Empty dependency array to run this effect once

  return (
    <>
      <canvas
        ref={canvasRef}
        width={1236}
        height={1856}
        style={{ position: "absolute", top: 190, left: 0 }}
      ></canvas>
    </>
  );
}

export default GameComponent;
