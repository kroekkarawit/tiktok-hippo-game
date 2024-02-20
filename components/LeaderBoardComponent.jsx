import React, { useEffect, useRef } from "react";

function LeaderBoardComponent() {
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
      blueHippoEatSpeed: 15,
      redHippoEatSpeed: 25,
      ballSpeed: 10,
      ballSize: 80,
    };
    var myGamePieces = [];
    var leader1st;
    var leader2nd;
    var leader3rd;
    var leaderUserName = [
        {username:"" ,score: 0},{username:"" ,score: 0},{username:"" ,score: 0},
    ];
    var myBackground;

    var lastDataFetchTime = 0;

    var imageUrls = [];
    imagesRef.current.wallpaper.src = "leaderBoard.png";

    function startGame() {
      myBackground = new component(1236, 190, "leaderBoard.png", 0, 0, "image");
      leader1st = new component(83, 83, "blueHippo.png", 617, 100, "ball");
      leader2nd = new component(65, 65, "blueHippo.png", 277, 90, "ball");
      leader3rd = new component(65, 65, "blueHippo.png", 958, 97, "ball");
      requestAnimationFrame(updateGameArea);
    }

    var myGameArea = {
      canvas: canvas,
      start: function () {
        this.canvas.width = 1236;
        this.canvas.height = 190;
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

    function component(width, height, color, x, y, type) {
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

      this.update = function () {
        if (type === "image") {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (type === "ball") {
          ctx.save();
          ctx.beginPath();
          const borderThickness = 10; // Adjust this value for the desired border thickness
          ctx.lineWidth = borderThickness;
          ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2, false);
          ctx.strokeStyle = "#ec6b5e";
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

      leader1st.newPos();
      leader1st.update();
      leader2nd.newPos();
      leader2nd.update();
      leader3rd.newPos();
      leader3rd.update();

      ctx.fillStyle = "white";
      ctx.font = "bolder 20px Arial";
      let textWidth = ctx.measureText(leaderUserName[0].username).width;
      let centerX = (canvas.width - textWidth) / 2;
      ctx.fillText(`@${leaderUserName[0].username}`, centerX, 165);

      ctx.fillStyle = "#57bfed";
      ctx.font = "17px Arial";
      textWidth = ctx.measureText(leaderUserName[0].score).width;
      centerX = (canvas.width - textWidth) / 2;
      ctx.fillText(leaderUserName[0].score, centerX, 185);

      ctx.fillStyle = "#ececec";
      ctx.font = "bolder 18px Arial";
      textWidth = ctx.measureText(leaderUserName[1].username).width;
      centerX = (canvas.width / 2 - textWidth) / 2;
      ctx.fillText(`@${leaderUserName[1].username}`, centerX - 30, 160);

      ctx.fillStyle = "#57bfed";
      ctx.font = "17px Arial";
      textWidth = ctx.measureText(leaderUserName[1].score).width;
      centerX = (canvas.width / 2 - textWidth) / 2;
      ctx.fillText(leaderUserName[1].score, centerX - 30 , 180);


      ctx.fillStyle = "#ececec";
      ctx.font = "bolder 18px Arial";
      textWidth = ctx.measureText(leaderUserName[2]).width;
      centerX = (canvas.width / 2 - textWidth) / 2;
      ctx.fillText(`@${leaderUserName[2].username}`, centerX + 660, 160);

      ctx.fillStyle = "#57bfed";
      ctx.font = "17px Arial";
      textWidth = ctx.measureText(leaderUserName[2].score).width;
      centerX = (canvas.width / 2 - textWidth) / 2;
      ctx.fillText(leaderUserName[2].score, centerX + 660 , 180);

      frameCountRef.current += 1;

      /*
      // Display the frame count on the canvas
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Frame Count: ${frameCountRef.current}`, 10, 30);
        */
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3000/api/game-leader`);
        if (res.ok) {
          const data = await res.json();
          const gameLeaders = data.getSumScore;
          leader1st = new component(
            83,
            83,
            gameLeaders[0].profilePictureUrl,
            617,
            100,
            "ball"
          );
          leader2nd = new component(
            65,
            65,
            gameLeaders[1].profilePictureUrl,
            277,
            90,
            "ball"
          );
          leader3rd = new component(
            65,
            65,
            gameLeaders[2].profilePictureUrl,
            958,
            97,
            "ball"
          );
          leaderUserName[0] = {
            username: gameLeaders[0].uniqueId,
            score: gameLeaders[0].totalScore,
          };
          leaderUserName[1] = {
            username: gameLeaders[1].uniqueId,
            score: gameLeaders[1].totalScore,
          };
          leaderUserName[2] = {
            username: gameLeaders[2].uniqueId,
            score: gameLeaders[2].totalScore,
          };
        }
      };
      const currentTime = performance.now();

      if (currentTime - lastDataFetchTime >= 2000) {
        fetchData();
        lastDataFetchTime = currentTime; // Update the last fetch time
      }

      if (currentTime - lastDataFetchTime >= 180000) {
        myGameArea.clear();
        myGamePieces = [];
        imageUrls = [];
        startGame();
      }

      requestAnimationFrame(updateGameArea); // Continue the animation loop
    }

    function showScoreText(color, text, x, y) {
      ctx.fillStyle = color;
      ctx.font = "bolder 50px Arial";
      ctx.fillText(text, x, y);
    }

    myGameArea.start();
    startGame();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1236}
      height={190}
      style={{ position: "absolute", top: 90, left: 0 }}
    ></canvas>
  );
}

export default LeaderBoardComponent;
