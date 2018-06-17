$(document).ready(function () {
    function getTimeLeft(timeout) {
        return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
    }

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    function ask(idx) {
        $('#question').text(questions[idx].question)
        $('#answers').empty();
        questions[idx].answers.forEach(answer => {
            $('#answers').append(
                $('<li>').append(
                    $('<h5>').addClass("answer").text(answer)
                )
            )
        });
        return questions[idx]
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
            correctAnswer: "The Andy Griffith Show"
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
            correctAnswer: "Jeffrey Tambor"
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
            correctAnswer: "Hip-Hop"
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
            correctAnswer: "Screen Actors Guild Awards"
        },
    ]);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constants
    let questionTime = 10; // # of seconds between questions
    let dialogTime = 4; // # of seconds that will elapse before we close a modal on you.

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    $('#timesUpModal').modal('hide')

    function askQuestionByIndex(idx) {
        return new Promise((resolve, reject) => {
            $('#answers').on('click', '.answer', function (event) {
                $('#answers').off();
                console.log($(this).text());
                console.log(question.correctAnswer)
                if ($(this).text() == question.correctAnswer) {
                    return resolve($(this).text())
                } else {
                    return resolve(false)
                }
            })
            let question = ask(idx);

            // time remaining counter
            let seconds = questionTime;
            let aTimer = setInterval(function () {
                $('#timeRemaining').empty();
                $('#timeRemaining').append(`Time Remaining: ${seconds}`);
                --seconds;
                if (seconds < 0) {
                    clearTimeout(aTimer)
                    setTimeout(function () {
                        $('#timesUpModal').modal('hide')
                        return resolve(false)
                    }, dialogTime * 1000);
                }
            }, 1000)
            
        })
    }
    async function playTheGame(qIdx) {
        askQuestionByIndex(qIdx)
        .then((result) => {

            if (result == question.correctAnswer) {
                $('#correctAnswerModal').modal('show')
            } else {
                $('#correctAnswer').after(question.correctAnswer)
                $('#timesUpModal').modal('show')
            }




            if (--qIdx >= 0) {
                    playTheGame(qIdx)
                }
            })
    }



    playTheGame(questions.length-1)
})