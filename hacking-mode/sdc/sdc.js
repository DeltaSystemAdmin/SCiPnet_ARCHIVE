import css from './sdc.min.css'
export function sdc() {
    if (!$("#sdcWindow").length) {
        import('./sdc.html').then(html => {
          appendTerminal("ACCESS GRANTED BY MAINFRAME")
            openWindow("SDC TERMINAL", 600, "center", "center", html.default)
            currentWindow.id = currentWindow.g.id = "sdcWindow"
            window.sdcWindow = currentWindow
            adjustChildHeightDy(currentWindow)
/*
            window.updateUsrStatus = function() {
                window.userPrompt = `SDC: ~$ `
                $("#shellPrompt").html(userPrompt)
                return;
            }
            // main function
            function sdcFunction() {
                clearInterval(dashLoading)
                $("#contentContain").html(dashHtml)
                updateUsrStatus()
                function initShell() {
                    function accessShell() {
                        appendNormal("CONNECTION ESTABLISHED")
                        appendNormal("ACCESSING TERMINAL...")
                        import('../sdc/shell/shell.js').then(module => {
                            window.shellFunction = module.shell
                            $("#dailyReport mono").append("<br><green>[" + formatTime() + "] SUCCESS</green>")
                            addLog("shell started")
                            setTimeout(function() {
                                $("#windowShellContent div").fadeOut("slow")
                                $("#windowShellContent div").promise().done(function() {
                                    $(this).remove()
                                    $("#windowShellContent").html(`<div id="shellContainer"><div id="shellHistory"></div><div id="shellInputArea"><span id="shellPrompt">${userPrompt}</span> <div id="shellInput" contenteditable="true" spellcheck="false"></div><button id="shellCaret" for="input">&nbsp;</button></div></div><div id="tabContent"></div>`)
                                    shellFunction()
                                    responsiveDesign()
                                });
                            })
                        })
                        accessShell()
                    })
                });
                initShell()
            })
            export function sdcLaunch() {
                import('./sdc.html').then(html => {
                    window.dashHtml = html.default
                    if (html) {
                        sdcFunction()
                    } else {
                        appendTerminalError("SDC init failure")
                    }
                })
            })
            sdcLaunch()*/
        })
    } else {
        sdcWindow.focus()
        sdcWindow.minimize(false)
        appendTerminalError("sdc module opened already")
    }
}
