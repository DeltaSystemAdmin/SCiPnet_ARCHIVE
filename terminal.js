import css from "../terminal/terminal.min.css";
import $ from 'jquery';
import './windows/windows';

export function terminal() {
    // internet connectivity
    var internet = true;
    var internetNotice;
    import('./windows/notice.html').then(html => {
        internetNotice = html.default
    })
    window.addEventListener('offline', function(e) {
        openWindow("notice", 500, "center", "center", internetNotice, true)
        currentWindow.addClass("modal").addClass("no-animation")
        $(currentWindow.g).find(".noticeText").html("SCiPNET requires an internet connection, please check the internet connection and try again.")
        initialWindow(currentWindow)
        moveWindowNoAnim(currentWindow, "center", "center")
        disableClose(currentWindow)
        window.internetWindow = currentWindow
        internet = false
        addLog("connection lost")
        currentWindow.removeClass("no-animation")
    });
    window.addEventListener('online', function(e) {
        if (internet == false) {
            internetWindow.close()
            addLog("connection restored")
        }
    });
    // global variables declare
    window.scroll = function() {
        $('#windowTerminalContent').scrollTop($('#windowTerminalContent')[0].scrollHeight);
    }
    window.halfscroll = function() {
        $('#windowTerminalContent').scrollTop($('#windowTerminalContent').scrollTop() + 75);
    }
    window.isNumber = function(n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }
    window.tabContentStorage = new Object()
    window.tabScrollStorage = new Object()
    window.playAudio = function(path) {
        var audio = new Audio(path);
        audio.play();
    }
    //terminal framework credit: https://stackoverflow.com/a/64217174
    var history = document.getElementById('terminalHistory');
    var input = document.getElementById('terminalInput');
    var cursor = document.getElementById('terminalCaret');

    // function to append content to terminal with blockquote
    window.appendTerminal = function(data, id) {
        function normalAppend() {
            $(history).append(`<commandBlockquote>${data}</commandBlockquote>`)
        }
        if (id) {
            if (id != "noscroll") {
                $(history).append(`<commandBlockquote id="${id}">${data}</commandBlockquote>`)
                scroll()
            } else {
                normalAppend()
                halfscroll()
            }
        } else {
            normalAppend()
            scroll()
        }
    }
    window.appendTerminalError = function(data, example) {
        if (example) {
            $(history).append(`<commandBlockquote>↳scsh: <red>ERROR</red>: ${data}<hr><small class="textGrey">${example}</small></commandBlockquote>`)
        } else {
            $(history).append(`<commandBlockquote>↳scsh: <red>ERROR</red>: ${data}</commandBlockquote>`)
        }
        scroll()
    }
    window.appendTerminalNoAuth = function() {
        appendTerminalError("user not authenticated, please login or register first to access this function.")
    }
    // function to append text for decoding files
    window.appendDecodeText = function(path, fun, width) {
        if ($("#loadingFile").length) {
            clearInterval(updateProgress)
            progressBar.setValue(100)
        }
        var decodeWindowHeight = window.innerHeight - 50
        var decodeWindowWidth = 894
        if (width) {
            decodeWindowWidth = width
        }
        var randomPosition = pickRandom(-20, 20)
        if (decodeWindowWidth > (window.innerWidth - 40)) {
            decodeWindowHeight = window.innerHeight
            decodeWindowWidth = window.innerWidth
            randomPosition = 0
        }
        openWindow("LOADING", decodeWindowWidth, window.innerHeight / 2 - (decodeWindowHeight) / 2 + randomPosition, window.innerWidth / 2 - (decodeWindowWidth) / 2 + randomPosition, `<div style="height: 100%;width: 100%;display:flex" id="loadingFile" class="loadingFile flex-center flex-column"></div>`)
        window.progressBar = new AsciiProgress("loadingFile", {
            "showComment": true,
            "commentLocation": "bottom",
            "startingComment": `DECODING ${path.toUpperCase()}`,
            onComplete: function() {
                if (fun) {
                    fun()
                }
                $("#loadingFile").attr("id", "")
            }
        })

        window.updateProgress = function() {
            progressBar.setValue(progressBar.value += 1.25)
        }
        setInterval(updateProgress, 20)
        initialWindow(currentWindow)
        let initial = setInterval(function() {
            adjustChildHeightDy(currentWindow)
        }, 10);
        setTimeout(function() {
            clearInterval(initial)
        }, 1000);
    }

    function focusAndMoveCursorToTheEnd(e) {
        input.focus();
        var range = document.createRange();
        var selection = window.getSelection();
        var {
            childNodes
        } = input;
        var lastChildNode = childNodes && childNodes.length - 1;

        range.selectNodeContents(lastChildNode === -1 ? input : childNodes[lastChildNode]);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function handleCommand(originalVal) {
        // prevent HTML injection
        function sanitize(string) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
            };
            var reg = /[&<>"']/ig;
            return string.replace(reg, (match) => (map[match]));
        }
        var originalVal = sanitize(originalVal);
        // split the input with whitespaces into an array
        var inputVal = originalVal.toLowerCase().trim().replace(/\s{2,}/g, ' ').replace(/\s/g, ' ').split(' ')
        $(history).append(`<div style="position:relative"><span style="color:var(--textDim);position: absolute;margin-left: -1ch;">[</span>${userPrompt} <span class="historyCommand">${originalVal}</span></div>`)

        // check for keyword
        addLog("running command: " + inputVal[0])
        switch (inputVal[0]) {
            case "":
                // empty for line break
                break;
            case "help":
                appendTerminal('ACCESSING HELP MODULE...')
                import("./command/help/help.js").then(function(module) {
                    window.openHelp = module.openHelp
                    openHelp()
                })
                break;
            case "cmatrix":
                appendTerminal('ACCESSING CMATRIX MODULE...')
                import("./command/hacking-mode/cmatrix/cmatrix.js").then(function(module) {
                    window.cmatrix = module.cmatrix
                    cmatrix()
                })
                break;
            case "sdc":
                window.pageContent = null
                if (inputVal[1]) {
                    appendTerminal('ACCESSING SDC CONSOLE...')
                    if (inputVal[1] == "start") {
                        appendTerminal('ACCESSING SDC KERNEL...')
                        import("../terminal/command/hacking-mode/sdc/sdc.js").then(function(module) {
                            window.sdc = module.sdc
                            sdc()
                        })
                    } else if (inputVal[1] == "install") {
                        appendTerminalError("SDC assets are already installed on the mainframe")
                    } else {
                        appendTerminalError(`invalid argument : ${inputVal[1]}`)
                    }
                } else {
                    appendTerminalError("please enter an argument or a command", "Example: sdc <b>start</b>")
                }
                break;
            case "access":
                window.pageContent = null
                if (inputVal[1]) {
                    appendTerminal('ACCESSING DOCUMENT...')
                    var clearance = 0;
                    if (userState) {
                        clearance = Number(userInfo.clearance)
                    }

                    function isInt(value) {
                        return !isNaN(value) &&
                            parseInt(Number(value)) == value &&
                            !isNaN(parseInt(value, 10));
                    }
                    if (inputVal[2] && isInt(inputVal[2]) && userState && inputVal[2] <= Number(userInfo.clearance)) {
                        clearance = inputVal[2]
                    } else if (inputVal[2] && inputVal[2] != 0) {
                        appendTerminalError('invalid or insufficient security clearance level, attempting to display the Lv. 0 clearance version of the file')
                    }
                    import('../terminal/command/access/access.js').then(module => {
                        window.access = module.access
                        access(inputVal[1], clearance)
                    })
                } else {
                    appendTerminalError("please enter the filename/scp number of the document you wish to access", "Example: ACCESS <u>173</u>")
                }
                break;
            case "auth":
                appendTerminal('ACCESSING AUTHENTICATION MODULE...')
                import('../terminal/command/auth/auth.js').then(module => {
                    window.auth = module.auth
                    auth()
                })
                break;
            case "lockout":
                appendTerminal('ACCESSING LOCKOUT MODULE...')
                import('../terminal/command/lockout/lockout.js').then(module => {
                    window.lockout = module.lockout
                    lockout()
                })
                break;
            case "locate":
                appendTerminal('ACCESSING LOCATION MODULE...')
                import('../terminal/command/locate/locate.js').then(module => {
                    window.locate = module.locate
                    locate()
                })
                break;
            case "clear":
                $("#terminalHistory").text("")
                break;
            case "fullscreen":
                import('../terminal/command/fullscreen/fullscreen.js').then(module => {
                    window.fullscreen = module.fullscreen
                    fullscreen(true)
                })
                break;
            case "fullquit":
                import('../terminal/command/fullscreen/fullscreen.js').then(module => {
                    window.fullscreen = module.fullscreen
                    fullscreen(false)
                })
                break;
            case "whoami":
                appendTerminal('ACCESSING USER PROFILE MODULE...')
                import('../terminal/command/profile/whoami/whoami.js').then(module => {
                    window.whoami = module.whoami
                    whoami()
                })
                break;
            case "bgm":
                appendTerminal('ACCESSING BACKGROUND MUSIC/AUDIO MODULE...')
                import('../terminal/command/bgm/bgm.js').then(module => {
                    window.bgm = module.bgm
                    bgm()
                })
                break;
            default:
                appendTerminalError(`command not found: ${inputVal[0]}`)
                addLog(`command not found: ${inputVal[0]}`)
        }
    }
    document.addEventListener('selectionchange', () => {
        if (document.activeElement.id !== 'terminalInput') return;
        var range = window.getSelection().getRangeAt(0);
        var start = range.startOffset;
        var end = range.endOffset;
        var length = input.textContent.length;

        if (end < length) {
            input.classList.add('noCaret');
            $("#terminalInput").css("caret-color", "var(--text)")
        } else {
            $("#terminalInput").css("caret-color", "")
            input.classList.remove('noCaret');
        }
    });
    document.addEventListener('keydown', (e) => {
        var ctrl = !(e.metaKey && e.keyCode == 67)
        if (String.fromCharCode(e.keyCode).match(/(\w|\s)/g) && ctrl) {
            if (!$("input:not('#terminalInput')").is(":focus")) {
                if (e.target !== input) focusAndMoveCursorToTheEnd();
                scroll()
            }
        }
    });
    $(document).on("click", "#terminalInputArea", function() {
        input.focus();
        scroll();
    })
    $(document).on("click", "#terminalCaret", function() {
        focusAndMoveCursorToTheEnd();
        scroll();
    })
    input.addEventListener('input', () => {
        if (input.childElementCount > 0) {
            var lines = input.innerText.replace(/\n$/, '').split('\n');
            var lastLine = lines[lines.length - 1];

            for (let i = 0; i <= lines.length - 2; ++i) {
                handleCommand(lines[i]);
            }

            input.textContent = lastLine;

            focusAndMoveCursorToTheEnd();
        }
        if (input.innerText.length === 0) {
            $("#terminalInput").css("caret-color", "")
            input.classList.remove('noCaret');
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(input.textContent);
            input.textContent = '';
            focusAndMoveCursorToTheEnd();
            scroll()
        }
    });
    $(document).on("click", ".collapsible-block-link", function() {
        $(this).closest(".collapsible-block-folded, .collapsible-block-unfolded").siblings(".collapsible-block-folded, .collapsible-block-unfolded").toggle()
        $(this).closest(".collapsible-block-folded, .collapsible-block-unfolded").hide()
    });

    // development
    import("./command/help/help.js").then(function(module) {
        window.openHelp = module.openHelp
        openHelp()
        $(`#${currentWindow.id}`).css("animation", "entranceFlash 400ms 497ms linear backwards 1")
    })
    import("./tab.js")
}
