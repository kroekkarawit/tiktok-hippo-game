import React, { useEffect, useRef } from "react";

function GiftComponent() {
  const canvasRef = useRef(null);

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
    var myGifts = [];

    var imageUrls = [
      "gift1.png",
      "gift2.png",
      "gift3.png",
      "gift4.png",
      "gift5.png",
      "gift6.png",
    ];

    function startGame() {
      for (let i = 0; i < imageUrls.length; i++) {
        const x = i * 130;
        const y = 0;

        const gamePiece = new component(
          69,
          90,
          imageUrls[i],
          x,
          y,
          "image"
        );

        gamePiece.speedX = -1; // Set a constant negative speed for leftward movement
        gamePiece.speedY = 0;

        myGifts.push(gamePiece);
      }

      requestAnimationFrame(updateGameArea);
    }

    var myGameArea = {
      canvas: canvas,
      start: function () {
        this.canvas.width = 1236;
        this.canvas.height = 90;
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
        }
      };

      this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        // Check if the gift is off-screen, and if so, reset its position
        if (this.x + this.width < 0) {
          this.x = canvas.width;
        }
      };
    }

    function updateGameArea() {
      myGameArea.clear();

      for (let i = 0; i < myGifts.length; i++) {
        const gamePiece = myGifts[i];
        gamePiece.newPos();
        gamePiece.update();
      }

      requestAnimationFrame(updateGameArea); // Continue the animation loop
    }

    myGameArea.start();
    startGame();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1236}
      height={60}
      style={{ position: "absolute", top: 0, left: 0 }}
    ></canvas>
  );
}

export default GiftComponent;
