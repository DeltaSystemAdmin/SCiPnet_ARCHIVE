import css from './cmatrix.min.css'
export function cmatrix() {
    if (!$("#cmatrixWindow").length) {
        import('./cmatrix.html').then(html => {
            openWindow("DECRYPTING MATRIX", 800, "center", "center", html.default)
            currentWindow.id = currentWindow.g.id = "cmatrixWindow"
            window.cmatrixWindow = currentWindow
            const canvas = document.getElementById('canv');
            const ctx = canvas.getContext('2d');

            const w = canvas.width = document.body.offsetWidth;
            const h = canvas.height = document.body.offsetHeight;
            const cols = Math.floor(w / 20) + 1;
            const ypos = Array(cols).fill(0);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);

            function matrix () {
              ctx.fillStyle = '#0001';
              ctx.fillRect(0, 0, w, h);

              ctx.fillStyle = '#0f0';
              ctx.font = '15pt monospace';

              ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
              });
            }

            setInterval(matrix, 50);
            adjustChildHeightDy(currentWindow)
        })
    } else {
        cmatrixWindow.focus()
        appendTerminalError("cmatrix module opened already")
    }
}