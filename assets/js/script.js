// Canvas setup
const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")
canvas.width = 800
canvas.height = 500
const gameOver = false

let score = 0
let gameFrame = 0

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect()
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click:false
}
canvas.addEventListener("mousedown", function(event){
    mouse.click = true
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    // console.log(mouse.x, mouse.y)
})

window.addEventListener("resize", function(){
    canvasPosition = canvas.getBoundingClientRect()
})

canvas.addEventListener("mousedown", function(){
    mouse.click = false
})

// Player
class Player{
    constructor(){
        this.x = canvas.width
        this.y = canvas.height/2
        this.radius = 50
        this.angle = 0 //face direction
        // this.frameX = 0
        // this.frameY = 0
        // this.frame = 0
        // this.spriteWidth = 498
        // this.spriteheight = 327
    }
    update(){
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        if (mouse.x != this.x){
            this.x -= dx/30
        }
        if (mouse.y != this.y){
            this.y -= dy/30
        }
    }
    
    draw(){
        if (mouse.click) {
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke() // connect those 2 points
        }

        ctx.fillStyle = "green"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill() //draw the circle
        ctx.closePath()
    }
}

const player = new Player()

// Bubbles
const bubblesArray = []
class Bubble {
    constructor(){
        this.x = Math.random() * (canvas.width)
        this.y = canvas.height + 100
        this.radius = 40
        this.speed = Math.random() * 5 + 1
        this.distance
        this.counted = false
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2"    
    }

    update(){
        this.y -= this.speed
        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx*dx + dy*dy)
    }

    draw(){
        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()
    }
}


function handleBubbles(){
    if (gameFrame % 50 == 0){ // % = remainder (zbytek deleni) = every 50th is true
        bubblesArray.push(new Bubble())
        // console.log(bubblesArray.length)
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update()
        bubblesArray[i].draw()
    } // <-- if .splice (remove) method is used here that may all the bubbles blinking when one of them is removed. Need to use it in other "for loop" 
    
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1)
        }
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            if (!bubblesArray[i].counted){
                if(bubblesArray[i].sound === "sound1"){
                    bubblePop1.play()
                }
                else {
                    bubblePop2.play()
                }
                score++
                bubblesArray[i].counted = true
                bubblesArray.splice(i, 1) 
            }
        }
    }   
}
const bubblePop1 = document.createElement("audio")
bubblePop1.src = "./assets/sounds/bubble1.mp3"
const bubblePop2 = document.createElement("audio")
bubblePop2.src = "./assets/sounds/bubble2.mp3"

// Enemies
const enemyArray = []
class Enemy{
    constructor(){
        this.x = canvas.width + 200
        this.y = Math.random() * (canvas.height)
        this.radius = 30
        this.speed = Math.random() * 2 + 2
    }
    draw(){
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
    update(){
        this.x -= this.speed
        if (this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200
            this.y = Math.random() * (canvas.height + 60)
            this.speed = Math.random() * 2 + 2
        }
        //collision with player

        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx*dx + dy*dy)
        if (this.distance < this.radius + player.radius){
            gameOverSound.play()
            backgorundMusic.pause()      
            document.getElementById("newGame").style.display = "block"
            document.getElementById("newGame").addEventListener("click", function reload(){
                location.reload()
            }) 
            handleGameOver()
        }
    }
}
const enemy1 = new Enemy
function handleEnemies(){

    if (gameFrame % 1000 == 0){
        enemyArray.push(new Enemy())
        // console.log("Enemies: " + (enemyArray.length + 1))
    }
    for (let i = 0; i < enemyArray.length; i++){
        enemyArray[i].update()
        enemyArray[i].draw()
    }
        enemy1.update()
        enemy1.draw()   
}

const gameOverSound = document.createElement("audio")
gameOverSound.src = "./assets/sounds/gameOver.wav"

// End game

function handleGameOver(){
    ctx.fillStyle = "Black"
    ctx.font = "80px Arial"
    ctx.fillText("Game over!", 190, 250)
    gameOver = true
    backgorundMusic.pause()
    gameOverSound.play()
}


// Animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    player.draw()
    ctx.font = "50px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Score: " + score, 10, 50)
    ctx.font = "20px Arial"
    ctx.fillText("Enemies: " + (enemyArray.length + 1), 13, 70)

    gameFrame++
    handleBubbles()
    handleEnemies()
    music()
    if(!gameOver){
     requestAnimationFrame(animate)
    }
}
animate() 

// Background music

const backgorundMusic = document.createElement("audio")
backgorundMusic.src = "./assets/sounds/background.mp3"
backgorundMusic.volume = 0.5
backgorundMusic.playbackRate = 0.8
backgorundMusic.loop = true

function music(){
    if (score === 1){
        backgorundMusic.play() 
    }
    if (gameFrame % 1000 === 0){
        backgorundMusic.playbackRate = backgorundMusic.playbackRate + 0.05
        // console.log("music speed: " + backgorundMusic.playbackRate)                   
    } 
}

const mute = document.getElementById("volume")
document.getElementById("volume").addEventListener("click", function(){
    if(mute.src = "./assets/img/mute.png"){
        backgorundMusic.pause()
        mute.src = "./assets/img/unmute.png"
    }
})









