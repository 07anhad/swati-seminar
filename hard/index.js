"use strict";

// Function to generate a random math question
function generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const num2 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const operator = '*'; // Multiplication operator
    const correctAnswer = num1 * num2; // Calculate the correct answer
    const question = `What is ${num1} ${operator} ${num2}?`; // Generate the question string
    return { question, correctAnswer };
}

// Function to prompt the user with a math question
let promptCount = 0; // Track the number of prompts
function promptMathQuestion(rectangle, name) {
    if (promptCount >= 2) return false; // If already prompted twice, return false
    const { question, correctAnswer } = generateMathQuestion(); // Generate the math question
    const userAnswer = prompt(`${name}'s health is low! Please answer this math question to restore health:\n${question}`);
    if (userAnswer === null || userAnswer === '') {
        alert('You did not answer the question. Health not restored.');
        return false;
    }
    const parsedAnswer = parseInt(userAnswer); // Parse the user's answer to an integer
    if (!isNaN(parsedAnswer) && parsedAnswer === correctAnswer) {
        rectangle.health = 100; // Restore health to full
        gsap.to(`#${name.toLowerCase()}Health`, { width: '100%' }); // Dynamically restore health bar to full
        // alert(`Correct! ${name}'s health has been restored to full.`);
        promptCount++; // Increment prompt count
        return true;
    } else {
        alert('Incorrect answer. Health not restored.');
        return false;
    }
}

// Function to start the timer countdown
function startTimer() {
    let time = 30; // Timer starts from 30 seconds
    const timerId = setInterval(() => {
        time--; // Decrement time
        console.log(`Time left: ${time} seconds`);
        if (time === 0) {
            clearInterval(timerId); // Stop the timer when time runs out
            console.log("Time's up!");
        }
    }, 1000); // Update timer every second
}

//Select canvas & type & size
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
document.body.style.backgroundColor = "black";
canvas.width = 1280;
canvas.height = 720;

// Background fill
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1.5;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/Sicarius.png",
});

//Initialize player
const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/Sprites/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 105,
        y: 65,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Sprites/IdleS.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "./img/Sprites/RunS.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Sprites/JumpS.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Sprites/FallS.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Sprites/Attack1S.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "./img/Sprites/Take Hit - S.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "./img/Sprites/DeathS.png",
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 120,
            y: 150,
        },
        width: 140,
        height: 50,
    },
});

//Initialize enemy
const enemy = new Fighter({
    position: {
        x: 1000,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: "./img/SpritesV2/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 115,
        y: 80,
    },
    sprites: {
        idle: {
            imageSrc: "./img/SpritesV2/IdleS.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "./img/SpritesV2/RunS.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/SpritesV2/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/SpritesV2/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/SpritesV2/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./img/SpritesV2/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/SpritesV2/Death.png",
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -175,
            y: 150,
        },
        width: 140,
        height: 50,
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

//Animation loop
const animate = (e) => {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -3;
        player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 3;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    //Jumping
    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -3;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.switchSprite("run");
        enemy.velocity.x = 3;
    } else {
        enemy.switchSprite("idle");
    }

    //Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    //Detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to("#enemyHealth", {
            width: enemy.health + "%",
        });
    }

    //If player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    //Detect for collision & player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
            width: player.health + "%"
        })
    }

    // If Enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }

    // Check if player's health is low and prompt math question
    if (player.health <= 20) {
        const promptResult = promptMathQuestion(player, 'Player');
        if (promptResult) {
            promptCount++;
        }
    }

    // Check if enemy's health is low and prompt math question
    if (enemy.health <= 20) {
        const promptResult = promptMathQuestion(enemy, 'Enemy');
        if (promptResult) {
            promptCount++;
        }
    }
};
animate();

window.addEventListener("keydown", (e) => {
    if (!player.dead) {
        if (keys.a.pressed && keys.ArrowRight.pressed) {
            if (player.position.x < -80 && enemy.position.x > 1075) {
                keys.a.pressed = false;
                player.velocity.x = 100;
                keys.ArrowRight.pressed = false;
                enemy.velocity.x = -100;
            }
            return;
        }
        switch (e.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "D":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                if (player.position.x < -80) {
                    keys.a.pressed = false;
                    player.velocity.x = 3;
                    return;
                }
                break;
            case "A":
                keys.a.pressed = true;
                player.lastKey = "a";
                if (player.position.x < -80) {
                    keys.a.pressed = false;
                    player.velocity.x = 3;
                    return;
                }
                break;
            case "w":
                player.velocity.y = -20;
                break;
            case "W":
                player.velocity.y = -20;
                break;
            case " ":
                player.attack();
                break;
        }
    }
    if (!enemy.dead) {
        switch (e.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                if (enemy.position.x > 1075) {
                    keys.ArrowRight.pressed = false;
                    enemy.velocity.x = -3;
                    return;
                }
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y = -20;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            if (player.position.x < -80) {
                keys.a.pressed = false;
                player.velocity.x = 3;
                return;
            }
            break;
    }

    //Enemy keys

    switch (e.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            if (enemy.position.x > 1075) {
                keys.ArrowRight.pressed = false;
                enemy.velocity.x = -3;
                return;
            }
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
});

// Start the timer countdown
startTimer();
