// const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;+-=[]/\\|<>"
// const spriteFont = new Image ()
// spriteFont.src = 'res/spriteFont[white].png'

// function printText (txt, x, y, fontSize, color = null) {
//     txt = txt.toString ()
//     for (i in txt) {
//         for (c in chars) {
//             if (chars[c] === txt[i]) {
//                 let l  = Math.floor  (c / 10)
//                 c  = (c % 10)


//                 ctx.drawImage (
//                     spriteFont,
//                     c * 8,
//                     l * 8,
//                     8,
//                     8,
//                     x + (i * fontSize),
//                     y,
//                     fontSize,
//                     fontSize
//                 )
//                 break
//             }
//         }
//     }

//     if (color != null) {
//         ctx.save ()
//         ctx.globalCompositeOperation = "source-in";
//         ctx.fillStyle = color;
//         ctx.fillRect (x, y, txt.length * fontSize, fontSize);
//         ctx.globalCompositeOperation = "source-over";
//         ctx.restore ()
//     }
// }

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

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?:;+-=[]/\\|<>"
const src = {
    0 : "res/spriteFont.png",
    1 : "res/spriteFont[white].png",
    2 : "res/spriteFont[red].png",
    3 : "res/spriteFont[green].png",
    4 : "res/spriteFont[blue].png",
    5 : "res/spriteFont[yellow].png",
    6 : "res/spriteFont[orange].png",
    7 : "res/spriteFont[purple].png",
}
function printText (txt, x, y, fontSize, color = Color.BLACK) {
    txt = txt.toString ()
    const image = new Image()
    image.src = src[color]
    for (let i in txt) {
        for (let c in chars) {
            if (chars[c] === txt[i]) {
                let l  = Math.floor  (c / 10)
                c  = (c % 10)
                ctx.drawImage (
                    image,
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

