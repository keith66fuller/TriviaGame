$(document).ready(function () {
    function shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    const questions = shuffle([
        {
            question: "What TV show featured the A.D narrator as a breakout child star?",
            answers: [
                "Car 54 Where Are You?",
                "Bewitched",
                "The Andy Griffith Show",
                "Petticoat Junction"
            ],
            correctAnswer: 2
        },
        {
            question: "What A.D. actor got caught up in #MeToo?",
            answers: [
                "Will Arnett",
                "Portia DeRossi",
                "Jason Bateman",
                "Jeffrey Tambor",
                "David Cross",
                "Michael Cera",
                "Tony Hale"
            ],
            correctAnswer: 3
        },
        {
            question: "The show was sued by the ____ group Arrested Development over the use of its name",
            answers: [
                "Alternative Rock",
                "Hip-Hop",
                "R&B",
                "Bluegrass",
                "Jazz",
                "Classic Rock"
            ],
            correctAnswer: 1
        },
        {
            question: "A.D. never won any ____.",
            answers: [
                "Primetime Emmy Awards",
                "Primetime Creative Arts Emmy Awards",
                "Golden Globe Awards",
                "Satellite Awards",
                "Screen Actors Guild Awards",
                "Television Critics Association Awards",
                "Writers Guild of America Awards"
            ],
            correctAnswer: 4
        }
    ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constants
    const questionTime = 4; // # of seconds between questions
    const dialogTime = 10; // # of seconds that will elapse before we close a modal after waiting on you to close it.
    let aTimer; // The global timeout timer for the modal window.
    let sTimer;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function askQuestionByIndex(idx) {
        return new Promise(async (resolve, reject) => {
            const question = questions[idx]
            $('#question').text(question.question)
            $('#answers').empty();
            question.answers.forEach((answer, i) => {
                $('#answers').append(
                    $('<tr>')
                        .on('click', function (e) {
                            while (aTimer--) {
                                console.log(`ATIMER ${aTimer}`)
                                window.clearTimeout(aTimer); // will do nothing if no timeout with id is present
                            }
                            $('#answers').off();
                            if ($(this).data("number") == question.correctAnswer) {
                                numRight++;
                                return resolve('Correct!')
                            } else {
                                return resolve('Sorry, wrong answer ...')
                            }
                        })
                        .attr("data-number", i).append(
                            $('<td>').addClass("answer").text(answer)
                        )
                )
            });





            // time remaining counter
            let seconds = questionTime
            aTimer = setInterval(function () {
                console.log(`INTERVAL ${seconds}`)
                seconds--;
                $('#timeRemaining').empty().append(`Time Remaining: ${seconds}`)
                if (seconds < 0) {
                    console.log('CLEAR INTERVAL')
                    clearInterval(aTimer);
                    return resolve('Times UP!!!!')
                }
            }, 1000)

        })
    }

    function showModal(title, message) {
        console.log('SHOW MODAL')
        return new Promise(async (resolve, reject) => {
            [[$('#modalTitle'), title], [$('#modalMsg'), message]].map(e => { $(e[0]).empty().text(e[1]) });
            $('#theModal').modal('show').on('click', resolve())
        })
    }
    
    
    function showModalThenHide(title, message) {
        console.log('SHOW MODAL')
        return new Promise(async (resolve, reject) => {
            [[$('#modalTitle'), title], [$('#modalMsg'), message]].map(e => { $(e[0]).empty().text(e[1]) });
            $('#theModal').modal('show').on('click', resolve())


            let seconds = dialogTime
            sTimer = setInterval(function () {
                console.log(`S-INTERVAL ${sTimer} ${seconds}`)
                seconds--
                if (seconds < 0) {
                    console.log("HIDE MODAL")
                    clearInterval(sTimer)
                    $('#theModal').modal('hide');
                    return resolve('DONE')
                }
            }, 1000)





        })
    }
    async function playTheGame(qIdx) {
        console.log('PLAY GAME')
        let question = questions[qIdx];
        var x = await askQuestionByIndex(qIdx)
        console.log('QUESTION ASKED')
        
        var y = await showModal('foobar', `The answer was\n${question.answers[question.correctAnswer]}`)
        var z = await waitResolve(dialogTime)
        $('#theModal').modal('hide');
        console.log("CLEAR TIMEOUT")
        clearTimeout(aTimer)
        if (--qIdx >= 0) {
            playTheGame(qIdx)
        } else {
            $('#modalMsg').empty().text(`${(numRight == questions.length) ? "You Won!" : "You Lost!"}\n${numRight} out of ${questions.length}`)
            $('#theModal').modal('show').on('click', () => { initGame() });
        }
    }

    function waitResolve(t) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, t * 1000);
        });
    }

    /*ooo        ooooo            .o.            ooooo      ooooo      ooo 
    `88.       .888'           .888.           `888'      `888b.     `8' 
     888b     d'888           .8"888.           888        8 `88b.    8  
     8 Y88. .P  888          .8' `888.          888        8   `88b.  8  
     8  `888'   888         .88ooo8888.         888        8     `88b.8  
     8    Y     888        .8'     `888.        888        8       `888  
    o8o        o888o      o88o     o8888o      o888o      o8o        `8  
                                                                         
                                                                         
                                                                         */

    $('#theModal').modal('hide')

    let numRight = 0
    function initGame() {
        numRight = 0
        playTheGame(questions.length - 1)
    }

    initGame();
})