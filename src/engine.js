const WIDTH  = 1024
const HEIGHT = 576

const canvas = document.querySelector ('canvas')
const ctx    = canvas.getContext ('2d')

canvas.width  = WIDTH
canvas.height = HEIGHT

ctx.imageSmoothingEnabled = false

class Obj {
    constructor ({pos, width, height, color, imgSrc = null, attrib}) {
        this.pos    = pos
        this.width  = width
        this.height = height
        this.color  = color
        this.attrib = attrib
        this.vel = {
            x : 0,
            y : 0
        }

        if (imgSrc != null) {
            this.image = new Image ()
            this.image.src = imgSrc
        }
    }

    draw () {
        if (this.image) {
            ctx.drawImage (
                this.image,
                this.pos.x,
                this.pos.y,
                this.width,
                this.height
            )
            return
        }

        ctx.save ()
        ctx.fillStyle = this.color
        ctx.fillRect (
            this.pos.x,
            this.pos.y,
            this.width,
            this.height
        )
        ctx.restore ()
    }

    move () {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
    }

    update () {
        this.move ()
        this.draw ()
    }
}

class Player extends Obj {
    constructor ({width, height, color, imgSrc = null, attrib, shotMax = 5}) {
        let pos = {
            x : WIDTH/2 - width/2,
            y : HEIGHT - height * 1.5
        }
        super ({pos, width, height, color, imgSrc, attrib})
        this.shotList = []
        this.shotMax  = shotMax
        this.attrib = {
            atk : 1,
            def : 0,
            life: 10
        }
        this.box = {
            pos : {
                x : this.pos.x + (this.width/2 - this.width/4),
                y : this.pos.y + (this.height/2 - this.height/4),
            },
            width : this.width/2,
            height: this.height/2
        }
    }

    shoot () {
        if (this.shotList.length < this.shotMax) {
            this.shotList.push (
                new Shot ({
                    shooter : this,
                    width   : 8,
                    height  : 8,
                    color   : '#ff0'
                })
            )
        }
    }

    // draw () {
    //     super.draw ()
    //     ctx.save ()
    //     ctx.fillStyle = '#ff0'
    //     ctx.fillRect (
    //         this.box.pos.x,
    //         this.box.pos.y,
    //         this.box.width,
    //         this.box.height
    //     )
    //     ctx.restore ()
    // }

    move () {
        super.move ()
        this.box.pos.x += this.vel.x
        this.box.pos.y += this.vel.y
    }

    update () {
        this.move ()

        if (this.pos.x <= 0) this.pos.x = 0
        if (this.pos.x >= WIDTH - this.width) this.pos.x = WIDTH - this.width
        if (this.pos.y <= 0) this.pos.y = 0
        if (this.pos.y >= HEIGHT - this.height) this.pos.y = HEIGHT - this.height

        if (this.box.pos.x <= (this.width/2 - this.width/4)) this.box.pos.x = (this.width/2 - this.width/4)
        if (this.box.pos.y <= (this.height/2 - this.height/4)) this.box.pos.y = (this.height/2 - this.height/4)
        if (this.box.pos.x >= WIDTH - (this.box.width + (this.width/2 - this.width/4))) this.box.pos.x = WIDTH - (this.box.width + (this.width/2 - this.width/4))
        if (this.box.pos.y >= HEIGHT - (this.box.height + (this.height/2 - this.height/4))) this.box.pos.y = HEIGHT - (this.box.height + (this.height/2 - this.height/4))

        this.draw ()
        this.shotList.forEach (shot => {
            shot.update ()
        })
    }
}

class Enemy extends Obj {
    constructor ({width, height, color, imgSrc = null, attrib, shotMax = 3}) {
        let pos = {
            x : Math.random () * (WIDTH - width),
            y : 0 - height
        }
        super ({pos, width, height, color, imgSrc, attrib})
        this.shotList = []
        this.shotMax  = shotMax
        this.vel.y = 3
        this.attrib = {
            atk : 1,
            def : 0,
            life: 1
        }
        this.box = {
            pos   : this.pos,
            width : this.width,
            height: this.height
        }
    }

    shoot () {
        if (this.shotList.length < this.shotMax) {
            this.shotList.push (
                new Shot ({
                    shooter : this,
                    width   : 8,
                    height  : 8,
                    color   : '#0ff'
                })
            )
        }
    }

    update () {
        this.move ()
        this.draw ()
        this.shotList.forEach (shot => {
            shot.update ()
        })

        if (this.pos.y >= HEIGHT + this.height) {
            this.delete ()
        }

        if (Math.floor (Math.random () * 150) == 3 && this.shotList.length < this.shotMax) {
            this.shoot ()
        }

        if (this.attrib.life <= 0) {
            this.delete ()
        }
    }

    delete () {
        enemyList.splice (enemyList.indexOf (this), 1)
    }
}

class Shot extends Obj {
    constructor ({shooter, width, height, color, imgSrc = null, attrib}) {
        let pos, vel;
        if (shooter instanceof Player) {
            pos = {
                x : shooter.pos.x + (shooter.width/2) - width/2,
                y : shooter.pos.y
            }
            vel = -5
        }

        if (shooter instanceof Enemy) {
            pos = {
                x : shooter.pos.x + (shooter.width/2) - width/2,
                y : shooter.pos.y + shooter.height
            }
            vel = 5
        }
        super ({pos, width, height, color, imgSrc, attrib})
        this.shooter = shooter;
        this.vel.y = vel
    }

    update () {
        this.move ()
        this.draw ()

        if (this.shooter instanceof Player) {
            enemyList.forEach (enemy => {
                this.hit (enemy)
            })

            if (this.pos.y <= -this.height) {
                this.delete ()
            }
        }

        if (this.shooter instanceof Enemy) {
            if (this.pos.y >= HEIGHT + this.height) {
                this.delete ()
            }

            this.hit (player)
        }
    }


    collision (obj) {
        if (this.shooter instanceof Player) {
            if (
                this.pos.x + this.width >= obj.box.pos.x &&
                this.pos.x <= obj.box.pos.x + obj.box.width &&
                this.pos.y <= obj.box.pos.y + obj.box.height
            ) return true
        }

        if (this.shooter instanceof Enemy) {
            if (
                this.pos.x + this.width >= obj.box.pos.x &&
                this.pos.x <= obj.box.pos.x + obj.box.width &&
                this.pos.y + this.height >= obj.box.pos.y
            ) return true
        }

        return false
    }

    hit (obj) {
        if (this.collision (obj)) {
            obj.attrib.life += (obj.attrib.def - this.shooter.attrib.atk) < 0 ? (obj.attrib.def - this.shooter.attrib.atk) : 0
            this.delete ()
        }
    }

    delete () {
        this.shooter.shotList.splice (this.shooter.shotList.indexOf (this), 1)
    }
}
const enemyList = []
const enemyMax  = 5

const player = new Player ({
    width : 48,
    height: 48,
    imgSrc : 'res/green.png'
})

const bg0a = new Obj ({
    pos : {
        x : 0,
        y : 0,
    },
    width : WIDTH,
    height: HEIGHT,
    imgSrc : 'res/bg0a.png'
})
const bg0b = new Obj ({
    pos : {
        x : 0,
        y : -HEIGHT,
    },
    width : WIDTH,
    height: HEIGHT,
    imgSrc : 'res/bg0b.png'
})
const bg1a = new Obj ({
    pos : {
        x : 0,
        y : 0,
    },
    width : WIDTH,
    height: HEIGHT,
    imgSrc : 'res/bg1a.png'
})
const bg1b = new Obj ({
    pos : {
        x : 0,
        y : -HEIGHT,
    },
    width : WIDTH,
    height: HEIGHT,
    imgSrc : 'res/bg1b.png'
})

function bgScroll (bgA, bgB, vel) {

    bgA.vel.y = bgB.vel.y = vel

    bgA.update ()
    bgB.update ()

    if (bgA.pos.y >= HEIGHT) bgA.pos.y = -HEIGHT
    if (bgB.pos.y >= HEIGHT) bgB.pos.y = -HEIGHT
}

function fundo () {
    // ctx.save ()
    // ctx.fillStyle = '#103'
    // ctx.fillRect (0, 0, WIDTH, HEIGHT)
    // ctx.restore ()
    bgScroll (bg1a, bg1b, .10)
    bgScroll (bg0a, bg0b, .30)
}

function isGameOver () {
    if (player.attrib.life <= 0) {
        let str =  '-=[ GAME OVER ]=-'
        printText (str, (WIDTH/2 - (str.length/2) * 32) + 1, (HEIGHT / 2 - 32) + 1, 32, Color.WHITE)
        printText (str, WIDTH/2 - (str.length/2) * 32, HEIGHT / 2 - 32, 32, Color.RED)
        setTimeout (() => { cancelAnimationFrame (currentScene) }, 1)
    }
}

function spawnEnemy () {
    let rand = Math.floor (Math.random () * 6)
    let src;
    switch (rand) {
        case 0 :
            src = 'res/blue.png'
            break
        case 1 :
            src = 'res/darkgrey.png'
            break
        case 2 :
            src = 'res/metalic.png'
            break
        case 3 :
            src = 'res/orange.png'
            break
        case 4 :
            src = 'res/purple.png'
            break
        case 5 :
            src = 'res/red.png'
            break
    }

    if (Math.floor (Math.random () * 127) == 3 && enemyList.length < enemyMax) {
        enemyList.push (
            new Enemy ({
                width : 48,
                height: 48,
                imgSrc : src
            })
        )
    }
}

const input = {
    UP    : false,
    DOWN  : false,
    LEFT  : false,
    RIGHT : false,
}


addEventListener ('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp' :
            input.UP = true
            break;

        case 'ArrowDown' :
            input.DOWN = true
            break;

        case 'ArrowLeft' :
            input.LEFT = true
            break;

        case 'ArrowRight' :
            input.RIGHT = true
            break;
    }

    if (e.keyCode === 88) {
        player.shoot ()
    }
})

addEventListener ('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp' :
            input.UP = false
            break;

        case 'ArrowDown' :
            input.DOWN = false
            break;

        case 'ArrowLeft' :
            input.LEFT = false
            break;

        case 'ArrowRight' :
            input.RIGHT = false
            break;
    }
})

const vel = 3

function inputHandler () {
    if (input.UP) {
        player.vel.y = -vel
    } else if (input.DOWN) {
        player.vel.y = vel
    } else {
        player.vel.y = 0
    }

    if (input.LEFT) {
        player.vel.x = -vel
    } else if (input.RIGHT) {
        player.vel.x = vel
    } else {
        player.vel.x = 0
    }
}


function lifeMeter () {
    let color = 'rgba(255,'+28 * player.attrib.life +', 0, 0.7)'
    let x = 8
    let y = 32
    let w = 176
    let h = 16
    printText ('- ENERGIA -', 8, 8, 16, Color.WHITE)

    ctx.fillStyle = color;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect (x,y, w, h)
    ctx.fillRect(x+2,y+2,((w-4)/10) * player.attrib.life, h-4)
}

var currentScene = null
var msg = 'Em desenvolvimento'
function main () {
    for (color in Color) printText ('',-8,-8,8, Color[color])
    ctx.clearRect (0,0, WIDTH, HEIGHT)
    fundo ()
    inputHandler ()
    spawnEnemy ()
    player.update ()

    // printText (`player life  => ${player.attrib.life}`, 16, 16, 16)
    // printText (`player shots => ${player.shotList.length}/${player.shotMax}`, 16, 32, 16)
    // printText (`enemies   => ${enemyList.length}/${enemyMax}`, 750, 16, 16)

    enemyList.forEach (enemy => {
        enemy.update ()
        let i = enemyList.indexOf (enemy)
        // printText (`[${i}] shots => ${enemy.shotList.length}/${enemy.shotMax} | life => ${enemy.attrib.life}`, 558, 16 + (i+1) * 16, 16)
    })

    lifeMeter ()
    currentScene = requestAnimationFrame (main);

    printText (msg, (WIDTH/2) - (msg.length/2) * 8, HEIGHT - 8, 8, Color.YELLOW)
    isGameOver ()
}

main ()

