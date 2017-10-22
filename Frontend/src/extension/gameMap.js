var game = {
    "clickbait": {
        wall: "Достали тролли в комментах?",
        text: [],
        actions: [{
                text: "Ага!",
                goto: "got_u"
            },
            {
                text: "Нет, я их игнорирую",
                goto: "ugood"
        }]
    },
    "ugood": {
        text: ["Молодец! Так держать!"],
        actions: []
    },
    "got_u": {
        text: ["Это ужасно!",
            "Мне кажется, тебе стоит пройти наш мини-курс",
            "Он займёт всего несколько минут и поможет тебе научиться владеть собой",
            "Прежде всего: как ты думаешь, запугивание - это насилие?"],
        actions: [{
                text: "Да, конечно!",
                goto: "yes_ofc"
            },
            {
                text: "Нет, с чего бы?",
                goto: "dthso"
        }]
    },
    "yes_ofc": {
        text: ["Правильно!",
            "Как и отбирание денег и вещей, пинки и толчки,",
            "как и предвзятое отношение на основе национальности или пола"],
        actions: [{
            text: "Это, должно быть, ужасно неприятно",
            goto: "violence",
        }]
    },
    "dthso": {
        text: ["С того, что человек испытывает страх или чувствует унижение, столкнувшись с этим."],
        actions: [{
            text: "Понял",
            goto: "violence",
        }]
    },
    "violence": {
        text: ["Вообще насилием можно считать любое умышленное действие, которое может нанести физическую или психологическую травму, покалечить, убить",
            "Как ты думаешь, может ли применить насилие к тебе физически более слабый человек?"],
        actions: [{
                text: "Да, конечно",
                goto: "cyber_1"
            },
            {
                text: "Разумеется, нет. Как он это сделает?",
                goto: "cyber_2"
        }]
    },
    "cyber_1": {
        text: ["Правильно. К сожалению, столкнуться с насилием можно и в интернете",
            "Для психологического насилия в сети есть слов \"кибербуллинг\""],
        actions: [{
            text: "Даже слово неприятное!",
            goto: "stat"
        }]
    },
    "cyber_2": {
        text: ["В Интернете!",
            "Психологическое насилие в сети было ещё до её массового распространения",
            "А теперь интернет есть у всех!",
            "Сетевая травля стала настолько распространённой, что для неё придумали слово: \"кибербуллинг\""],
        actions: [{
            text: "Я и не думал о таком...",
            goto: "stat"
        }]
    },
    "stat": {
        text: ["По исследованием интернет-травле подвергается каждый четвёртый подросток.",
            "Что самое страшное: многие из них, столкнувшись с травлей, чаще думали о самоубийстве"],
        actions: [{
            text: "Но как это касается меня?",
            goto: "me"
        }, {
            text: "Что мне делать, чтобы противостоять насилию?",
            goto: "watdo"
        }]
    },
    "watdo": {
        text: ["Если тебе кажется, что ты подвергся травле, сделай следующее:",
            "1) Набери воздуха в грудь и сосчитай до 10. Это поможет тебе успокоиться.",
            "2) Поговори об этом с близким тебе человеком.",
            "3) Не надо мстить, ругаться и волноваться. Хулиган по ту сторону экрана дожидается именно такой реакции от тебя."],
        actions: [{
            text: "Звучит разумно",
            goto: "blame"
        }]
    },
    "me": {
        text: ["Даже если с тобой такого не случается, никто из твоих друзей от этого не застрахован",
            "Прежде всего - не смейся над ними, когда они обратятся к тебе с подобной проблемой",
            "Дай ему знать, что он не одинок, что у него есть верный друг, который готов ему помочь"],
        actions: [{
                text: "А если это всё-таки коснётся меня?",
                goto: "watdo"
            },
            {
                text: "А что делать, если меня обвинят в кибербуллинге?",
                goto: "blame"
        }]
    },
    "blame": {
        text: ["Если тебя обвиняют в том, что ты \"троллишь\", прежде всего попытайся разобраться",
            "Постарайся понять, не задел ли ты чьи-нибудь чувства. Не стесняйся просить прощения за нанесённую обиду - это улучшит отношения между тобой и собеседником",
            "Если ты не можешь разобраться, в чём дело - попроси собеседника объяснить, что не так",
            "Главное - помни, не говори ничего оскорбительного и не воспринимай пустые угрозы всерьёз."],
        actions: []
    }
};

export default game