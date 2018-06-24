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
    const questionTime = 6; // # of seconds between questions
    const dialogTime = 4; // # of seconds that will elapse before we close a modal after waiting on you to close it.
    let aTimer; // The global timeout timer for the modal window.
    let numRight;
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function showModal(title, message, delay) {
        [[$('#modalTitle'), title], [$('#modalMsg'), message]].map(e => { $(e[0]).empty().text(e[1]) });
        $('#theModal').modal('show')
        return new Promise((resolve, reject) => {
            $('#modalOk').on('click', () => resolve());
            if (delay) {
                setTimeout(() => {
                    resolve();
                }, dialogTime * 1000)
            }
        })
            .then(() => {
                $('#modalOk').off('click');
                $('#theModal').modal('hide');
            });
    }
    function gameOver() {
        return new Promise(resolve => {
            showModal('Game Over', `${(numRight == questions.length) ? "You Won!" : "You Lost!"}\n${numRight} out of ${questions.length} correct.`, false)
        })
            .then(initGame)
    }

    async function initGame() {
        numRight = 0
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            await new Promise(async (resolve, reject) => {
                $('#question').text(question.question)
                $('#answers').empty();
                question.answers.forEach((answer, i) => {
                    $('#answers').append(
                        $('<tr>')
                            .on('click', function (e) {
                                clearInterval(aTimer); 
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
                    console.log(`INTERVAL ${seconds} ATIMER ${aTimer}`)
                    $('#timeRemaining').empty().append(`Time Remaining: ${seconds--}`)
                    if (seconds < 0) {
                        console.log('CLEAR INTERVAL')
                        $('#timeRemaining').empty()
                        clearInterval(aTimer);
                        return resolve('Times UP!!!!')
                    }
                }, 1000)
            })
                .then(async result => {
                    clearTimeout(aTimer)
                    console.log(`RESULT: ${result}`)
                    await showModal(result, `The answer was\n${question.answers[question.correctAnswer]}`, true)
                })
            clearTimeout(aTimer)
        }
        await gameOver();
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


    initGame();
})