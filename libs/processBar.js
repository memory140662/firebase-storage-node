const readline = require('readline');

const processBar = () => {
    const stream = process.stdout;
    const loading = ['\\', '|', '/', '-'];
    let time = 0;
    show('Uploading... ' + loading[time++ % loading.length]);
    let timer;

    function show (content) {
        readline.cursorTo(stream, 0);
        stream.write(content);
        readline.clearLine(stream, 1);
    }
    return {
        finish: () => {
            show('---------------------------RESULT------------------------------\n');
            if (timer) {
                clearInterval(timer);
            }
        },
        start: () => {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(() => {
                show('Uploading... ' + loading[time++ % loading.length]);
            }, 500);
        }
    };
}

module.exports = processBar;