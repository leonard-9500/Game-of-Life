/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 11.08.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

ctx.save();

let radians = Math.PI / 180;

/* Audio Object Definitions */
let audioButtonPressed = new Audio("audio/audioButtonPressed.mp3");
let audioButtonPressedIsReady = false;
audioButtonPressed.addEventListener("canplaythrough", function () { audioButtonPressedIsReady = true; });

/* Mouse Input */
let mouseX;
let mouseY;
let mouseLeftPressed = false,
    mouseRightPressed = false;

let mouseLeftPressedBefore = false,
    mouseRightPressedBefore = false;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function mouseMoveHandler(e)
{
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function mouseDownHandler(e)
{
    //console.log("Mouse pressed.\n");
    if (e.button == 0) { mouseLeftPressed = true; };
    if (e.button == 2) { mouseRightPressed = true; };
}

function mouseUpHandler(e)
{
    //console.log("Mouse released.\n");
    if (e.button == 0) { mouseLeftPressed = false; };
    if (e.button == 2) { mouseRightPressed = false; };
}

/* Key Presses */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let wPressed = false,
    aPressed = false,
    sPressed = false,
    dPressed = false,
    jPressed = false,
    kPressed = false,
    lPressed = false,
	enterPressed = false;

let wPressedBefore = false,
    aPressedBefore = false,
    sPressedBefore = false,
    dPressedBefore = false,
    jPressedBefore = false,
    kPressedBefore = false,
    lPressedBefore = false,
	enterPressedBefore = false;

function keyDownHandler(e)
{
    if (e.code == "KeyW") { wPressed = true; }
    if (e.code == "KeyA") { aPressed = true; }
    if (e.code == "KeyS") { sPressed = true; }
    if (e.code == "KeyD") { dPressed = true; }

    if (e.code == "KeyJ") { jPressed = true; }
    if (e.code == "KeyK") { kPressed = true; }
    if (e.code == "KeyL") { lPressed = true; }

	if (e.code == "Enter") { enterPressed = true; }
}

function keyUpHandler(e)
{
    if (e.code == "KeyW") { wPressed = false; }
    if (e.code == "KeyA") { aPressed = false; }
    if (e.code == "KeyS") { sPressed = false; }
    if (e.code == "KeyD") { dPressed = false; }

    if (e.code == "KeyJ") { jPressed = false; }
    if (e.code == "KeyK") { kPressed = false; }
    if (e.code == "KeyL") { lPressed = false; }

	if (e.code == "Enter") { enterPressed = false; }
}

/* Class Definitions */
class LifeScreen
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		this.width = 40;
		this.height = 40;
		this.cellScale = 16;
		this.cell = [(this.width/4) * (this.height/4)];
		this.cell.fill(0);
		this.cellPrev = [(this.width/4) * (this.height/4)];
		this.cellPrev.fill(0);
		this.advanceInterval = 500;
		this.advanceTick = Date.now();
		this.allowInput = true;
		this.simIsRunning = false;
		this.button = [];
	}

	update()
	{
		this.handleInput();
		this.advanceState();
		this.draw();
	}

	addButton(text, x, y)
	{
	}

	handleInput()
	{
		if (mouseLeftPressed)
		{
			let localMouseX = (mouseX-this.x) / this.cellScale;
			let localMouseY = (mouseY-this.y) / this.cellScale;
			this.cell[localMouseX + localMouseY * this.width] = 1;
			//this.cell[mouseX + mouseY * this.width] = 1;
		}
	}

	advanceState()
	{
		if (tp1 - this.advanceTick >= this.advanceInterval)
		{
			this.cellPrev = this.cell;

			for (let y = 0; y < this.height; y++)
			{
				for (let x = 0; x < this.width; x++)
				{
					// Calculate number of neighbors
					let n = 0;
					for (let cY = 0; cY < 3; cY++)
					{
						for (let cX = 0; cX < 3; cX++)
						{
							if (this.cell[(x+cX-1) + ((y+cY-1)*this.width)] == 1)
							{
								n += 1;
							}
						}
					}

					// If cell is active.
					if (this.cellPrev[x + y * this.width] == 1)
					{
						// Cell deactivates
						if (n < 2) {this.cell[x + y * this.width] = 0;};
						// Cell stays active
						//if (n == 2 || n == 3) {this.cellPrev[x + y * this.width] = 0;};
						// Cell deactivates
						if (n > 3) {this.cell[x + y * this.width] = 0;};
					}
					// If cell is inactive.
					if (this.cellPrev[x + y * this.width] == 0)
					{
						// Cell activates
						if (n == 3) {this.cell[x + y * this.width] = 0;};
					}
				}
			}

			this.advanceTick = Date.now();
		}
	}

	draw()
	{
		for (let y = 0; y < this.height; y++)
		{
			for (let x = 0; x < this.width; x++)
			{
				if (this.cell[x + y * this.width] == 1)
				{
					ctx.fillRect(x*this.cellScale, y*this.cellScale, this.cellScale, this.cellScale);
				}
			}
		}
	}
}

class Button
{
	constructor()
	{
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        // Colors
        this.colEdgeNeutral = "#888888";
        this.colFaceNeutral = "#00000044";
        this.colEdgeHover = "#bbbbbb";
        this.colFaceHover = "#00000088";
        this.colEdgePressed = "#ffffff";
        this.colFacePressed = "#000000bb";
        this.colTextFill = "#000000";
        this.colTextShadow = "#ffffff";
        // Color assignment
        this.edgeColor = this.colEdgeNeutral;
        this.faceColor = this.colFaceNeutral;

        this.text = "Button";
        this.isPressed = false;
        this.isVisible = true;
		this.playSound = true;
        // How often can the user click the button.
        this.clickSpeed = 50;
        this.clickTick = Date.now();
	}

    update()
    {
        this.collisionDetection();
		this.draw();
		this.playAudio();
    }

    collisionDetection()
    {
        // Only let the user click the button if the wait time has been passed
        if (tp1 - this.clickTick >= this.clickSpeed)
        {
            // If mouse is within button bounds.
            if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height)
            {
                // If mouse clicked on button
                if (mouseLeftPressed)
                {
                    if (mouseLeftPressedBefore == false)
                    {
                        this.edgeColor = this.colEdgePressed;
                        this.faceColor = this.colFacePressed;

                        this.isPressed = true;
                        mouseLeftPressedBefore = true;
                    }
                }
                // If mouse is hovering on button
                if (!mouseLeftPressed)
                {
                    this.edgeColor = this.colEdgeHover;
                    this.faceColor = this.colFaceHover;

                    this.isPressed = false;
                    mouseLeftPressedBefore = false;
                }
            }
            // If mouse is out of button bounds.
            else
            {
                this.edgeColor = this.colEdgeNeutral;
                this.faceColor = this.colFaceNeutral;

                this.isPressed = false;
            }

            this.clickTick = Date.now();
        }
    }

    draw()
    {
		if (this.isVisible)
		{
			// Draw fill
			ctx.fillStyle = this.faceColor;
			ctx.fillRect(this.x, this.y, this.width, this.height);

			// Draw border
			ctx.strokeStyle = this.edgeColor;
			ctx.strokeRect(this.x, this.y, this.width, this.height);

			// Draw text
			let textPosX = this.x + (this.width / 2),
				textPosY = this.y + (this.height / 1.5),
				textSize = this.height/1.5;

			ctx.textAlign = "center";
			ctx.font = this.height / 2 + "px sans-serif";

			// Text shadow
			ctx.fillStyle = this.colTextShadow;
			ctx.fillText(this.text, textPosX + textSize/128, textPosY + textSize/128);

			// Actual text
			ctx.fillStyle = this.colTextFill;
			ctx.fillText(this.text, textPosX, textPosY);
		}

    }

	playAudio()
	{
		if (this.playSound)
		{
			if (this.isPressed)
			{
				if (audioButtonPressedIsReady) { audioButtonPressed.play(); };
			}
		}
	}
}
/* Function definitions */
function getRandomIntInclusive(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum and minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}


let lifeScreen = new LifeScreen;
for (let y = 0; y < lifeScreen.height; y++)
{
	for (let x = 0; x < lifeScreen.width; x++)
	{
		lifeScreen.cell[x + y * lifeScreen.width] = getRandomIntInclusive(0, 1);
	}
}

// Time variables
let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// The game loop
window.main = function ()
{
    window.requestAnimationFrame(main);
    // Get elapsed time for last tick.
    tp2 = Date.now();
    elapsedTime = tp2 - tp1;
    //console.log("elapsedTime:" + elapsedTime + "\n");
    tp1 = tp2;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	lifeScreen.update();
	button.update();
}

// Start the game loop
main();