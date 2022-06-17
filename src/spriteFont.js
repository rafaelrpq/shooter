const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;+-=[]/\\|<>"
const spriteFont = new Image ()
spriteFont.src = 'res/spriteFont[white].png'

function printText (txt, x, y, fontSize, color = null) {
    txt = txt.toString ()
    for (i in txt) {
        for (c in chars) {
            if (chars[c] === txt[i]) {
                let l  = Math.floor  (c / 10)
                c  = (c % 10)


                ctx.drawImage (
                    spriteFont,
                    c * 8,
                    l * 8,
                    8,
                    8,
                    x + (i * fontSize),
                    y,
                    fontSize,
                    fontSize
                )
                break
            }
        }
    }

    if (color != null) {
        ctx.save ()
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = color;
        ctx.fillRect (x, y, txt.length * fontSize, fontSize);
        ctx.globalCompositeOperation = "source-over";
        ctx.restore ()
    }
}

const Color = {
    BLACK : 0,
    WHITE : 1,
    RED   : 2,
    GREEN : 3,
    BLUE  : 4,
    YELLOW: 5,
    ORANGE: 6,
    PURPLE: 7
}

class SpriteFont {
    constructor (color = Color.BLACK) {
        let src;
        this.chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;+-=[]/\\|<>"
        this.image = new Image()
        switch (color) {
            case Color.BLACK :
                src = 'res/spriteFont.png'
                break;
            case Color.WHITE :
                src = 'res/spriteFont[white].png'
                break;
            case Color.RED :
                src = 'res/spriteFont.png'
                break;
            case Color.GREEN :
                src = 'res/spriteFont.png'
                break;
            case Color.BLUE :
                src = 'res/spriteFont.png'
                break;
            case Color.YELLOW :
                src = 'res/spriteFont.png'
                break;
            case Color.ORANGE :
                src = 'res/spriteFont.png'
                break;
            case Color.PURPLE :
                src = 'res/spriteFont.png'
                break;
        }
        this.image.src = src
    }

    printText (txt, x, y, fontSize) {
        txt = txt.toString ()
        for (let i in txt) {
            for (let c in this.chars) {
                if (this.chars[c] === txt[i]) {
                    let l  = Math.floor  (c / 10)
                    c  = (c % 10)
                    ctx.drawImage (
                        this.image,
                        c * 8,
                        l * 8,
                        8,
                        8,
                        x + (i * fontSize),
                        y,
                        fontSize,
                        fontSize
                    )
                    break
                }
            }
        }
    }
}
