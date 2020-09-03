/* 
Build a turn-based board game in JavaScript

GAME'S RULES:
How to Play-
1. Hulk and Thanos can move upto 3 spaces in both up and down directions.
2. You have to collect different stones for being more powerful and increase your Health.
3. Intially you will have Time Stone which is powerful but have to collect more to be more powerful.
4. Stones have different powers, try to choose the most powerful one.
5. If you feel you're strong enough then, you can find an another player on the game board to start your fight.
6. You can increase you health by going to quiz blocks and answer right to the question.
7. But remember! If your answer will be wrong, you will descrease your health score by -10 and on right answer you will get +20
8. You have 2 possibilites: attack or defend, choose the better strategy.
 */

/*  

             *VARIABLES*

*/

const mapSize = 99;
const obstacles = 20;
let tiles = [];
let possibleMoves = 3;
let playerActive;
let activePlayer = 1;
let currentWeapon = 1;
let turn = 0;
let playerDefend = null;
let player1Active = true;
let player2Active = false;
let move = true;
let attacked = false;
let hover = false;

const attackBtn1 = $('.btn-attack-1');
const attackBtn2 = $('.btn-attack-2');
const defendBtn1 = $('.btn-defend-1');
const defendBtn2 = $('.btn-defend-2');
const startButton = $('#start');
const mapContainer = $('#board-game');
const startContainer = $('#intro');
const gameOverContainer =$('#gameOver');
const playerContainerDiv = $('.player-container');
const powerDiv1 = $('.energy-1');
const powerDiv2 = $('.energy-2');
const body = $('body');
const turnMessage = [
"Let's move, there is your turn! Good Luck!",
"Be careful, don't start your fight if you aren't strong enough!",
"Do you have enough energy?",
"Your enemy is behind your back!",
"Your move! Don't wait to long!",
]
const noTurnMessage = 'Wait for your turn!';
// Extra - quiz 
let scores = 0;
let questionsMark = 5;

/*
        
Code for Creating Game Strategy & Logics

*/

// Functions for constructing map tile board with obstacles on it
const Map = function(mapSize) {
    this.mapSize = mapSize;

    this.create  = function() {
        for (let i = 0; i <= mapSize; i += 1) {
        mapContainer.append('<li class="box" data-index="' + i + '">');
        let numTiles = $('.box').length;
        tiles.push(numTiles);
        }
    }
    this.obstacles = function(itemClass) {
        addComponents(itemClass)
    }
}

// Code for creating map objects in game
let game = new Map(mapSize);


// Functions for constructiong players
const Player = function(name, healthScore, itemClass, player, weapon, power, activePath) {
    this.name = name;
    this.healthScore = healthScore;
    this.itemClass = itemClass;
    this.player = player;
    this.weapon = weapon;
    this.power = power;
    this.activePath = activePath;

    //adding players to the map
    this.add = function () {
        addComponents(this.itemClass, this.player);
    }
    // set information about player on the boards;
    this.setData = function() {
        $('.name-'+this.player).text(this.name);
        $('#health-'+ this.player).text(this.healthScore);
        $('<img src="image/wp-1.png">').appendTo(".stone-" + this.player);
        $('.energy-' + this.player).text(this.power);
    }
    //player attack/fight logics
    this.attack = function(whichPlayer) {
        if(playerDefend == 1) {
            whichPlayer.healthScore -= (this.power/2);
            playerDefend = 0;

            } else {
                whichPlayer.healthScore -= this.power;
            }
                $('#health-' + whichPlayer.player).text(whichPlayer.healthScore);
                if(whichPlayer.healthScore <= 0) {
                    gameOverBoard();
            }
    }
    // Display who is he winner and who lose the game, once the game over
    this.winner = function(whichPlayer) {
        if(whichPlayer.healthScore <= 0) {
            $('#winner').text(this.name);
            $('#looser').text(whichPlayer.name);
        } else if (this.healthScore <= 0) {
            $('#winner').text(whichPlayer.name);
            $('#looser').text(this.name);

        }
    }    
};

// create Players
let player1 = new Player('Hulk', 100, 'player1', 1, 'wp-1', 10, 'image/path-1.png');
let player2 = new Player('Thanos', 100, 'player2', 2, 'wp-1', 10, 'image/path-2.png');

// initialize the movment of the players:
// players can move up to the 3 tiles by mouse clicks in up-down and left-right directions , avoiding tiles with obstacles
// and the tiles with another player
function movePlayer() {
    let gameBox = $('.box');
    // mouseover method shows the possible move of the player
    gameBox.hover( function () {
            hover = true;
            let sqHovered = $(this).data('index');
            posNew = getCoordinates(sqHovered);
            //check the posible move horizontally
            for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
                let num = getTileIndex(i, posOld.y);
                let tile = $('.box[data-index="' + num + '"]');
                if (tile.hasClass('obstacle')) {
                    return;
                }
                if (player1Active) {
                    if (tile.hasClass('player2')) {
                        return;
                    }
                } else {
                    if (tile.hasClass('player1')) {
                        return;
                    }
                }
            }
            //check the posible move vertically 
            for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
                let num = getTileIndex(posOld.x, i);
                let tile = $('.box[data-index="' + num + '"]');
                if (tile.hasClass('obstacle')) {
                    return;
                }
                if (player1Active) {
                    if (tile.hasClass('player2')) {
                        return;
                    }
                } else {
                    if (tile.hasClass('player1')) {
                        return;
                    }
                }
            }
            if (!attacked) {
                // if players don't cross adjacent tile, their path for possible movement will be shown
                if (posNew.y === posOld.y && posNew.x <= posOld.x + possibleMoves && posNew.x >= posOld.x - possibleMoves
                    || posNew.x === posOld.x && posNew.y <= posOld.y + possibleMoves && posNew.y >= posOld.y - possibleMoves) {

                    if (player1Active) {
                        $(this).css('backgroundImage', 'url(' + player1.activePath + ')');

                    } else {
                        $(this).css('backgroundImage', 'url(' + player2.activePath + ')');
                    }
                }

            }
            // if the movement isn't possible hover is false and the posible movment won't be shown
        }, 
        function () {
            hover = false;
            $(this).css('backgroundImage', '');
        }
    );
    // by the click method choose the next position of the player 
    gameBox.on('click', function () {
        hover = false;
        let sqClicked = $(this).data('index');
        posNew = getCoordinates(sqClicked);
        //new position of the player choosen by mouse click vertically - coordinate X
        for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
            let num = getTileIndex(i, posOld.y);
            let tile = $('.box[data-index="' + num + '"]');
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
            }
        }
        //check possible new position of the player choosen by mouse click vertically
        for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
            let num = getTileIndex(posOld.x, i);
            let tile = $('.box[data-index="' + num + '"]');
            // if new tile includes obstacle - don't move
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            // if new tile includes players - don't move
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
            }
        }
        if (player1Active) {
            if ($(this).hasClass('player1')){
                return;
            }
        }else{
            if ($(this).hasClass('player2')){
                return;
            }
        }

        if (move) {
            // check when the player can move maximum 3 tiles (possibleMoves) in up-down and left-right directions

            if (posNew.y === posOld.y && posNew.x <= posOld.x + possibleMoves && posNew.x >= posOld.x - possibleMoves
                || posNew.x === posOld.x && posNew.y <= posOld.y + possibleMoves && posNew.y >= posOld.y - possibleMoves) {
                // check the position X
                for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
                    let num = getTileIndex(i, posOld.y);
                    checkWeapon(num);
                }
                // check the position Y
                for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
                    let num = getTileIndex(posOld.x, i);
                    checkWeapon(num);
                }
                whoIsActive();
                // if the player moved, his tile lose a class 'active', which is set to opposite player
                if (player1Active) {
                    playerPosition = boxPosition('.player2');
                    posOld = getCoordinates(playerPosition);
                    $('.player1').removeClass('player1').removeClass('active');
                    $(this).addClass('player1');
                    $('.player2').addClass('active');
                    fight(posNew, posOld);
                    player1Active = false;

                
                } else {
                    playerPosition = boxPosition('.player1');
                    posOld = getCoordinates(playerPosition);
                    $('.player2').removeClass('player2').removeClass('active');
                    $(this).addClass('player2');
                    $('.player1').addClass('active');
                    fight(posNew, posOld);
                    player1Active = true;
                }
            }
        }
    });
}

// weapon function constructor:
function Weapon(type, value, itemClass) {
    this.type = type;
    this.value = value;
    this.itemClass = itemClass;

    // add weapons to the map
    this.add = function () {
    addComponents(this.itemClass);
    }
    //add quiz mark to the map
    this.addExtras = function(){
        for(var i = 1; i<=questionsMark; i++){
            addComponents(this.itemClass);
        }
    }
};

// create weapons with their attributes:
let defaultWeapon = new Weapon('DefaultWeapon', 10, 'wp-1 weapon');
let spacestone = new Weapon('spacestone', 30, 'wp-2 weapon');
let powerstone = new Weapon('powerstone', 40, 'wp-3 weapon');
let mindstone = new Weapon('mindstone', 50, 'wp-4 weapon');
let gauntlet = new Weapon('gauntlet', 60, 'wp-5 weapon');
let extra = new Weapon ('Extra1', 20, 'quiz-1');

// replace the weapon on the map:
function replaceWeaponOnMap(value, weapon, num) {
    let tile = $('.box[data-index="' + num + '"]');
    whoIsActive();
    tile.removeClass(weapon).addClass(playerActive.weapon);
    playerActive.weapon = weapon;    
    playerNotActive.power = value;        
}

// check weapon on the tile and call replace functions (for the player's boards and for the map):
function checkWeapon(num) {
    let tile = $('.box[data-index="' + num + '"]');
    if (tile.hasClass('weapon')) {
        if (tile.hasClass('wp-1')) {
            currentWeapon = 1;
            replaceWeaponOnMap(defaultWeapon.value, 'wp-1', num);
            replaceWeaponOnBoard(defaultWeapon.value);
            return;
        }
        if (tile.hasClass('wp-2')) {
            currentWeapon = 2;
            replaceWeaponOnMap(spacestone.value, 'wp-2', num);
            replaceWeaponOnBoard(spacestone.value);
            return;
        }
        if (tile.hasClass('wp-3')) {
            currentWeapon = 3;
            replaceWeaponOnMap(powerstone.value,'wp-3',num);
            replaceWeaponOnBoard(powerstone.value); 
            return;
        }
        if (tile.hasClass('wp-4')) {
            currentWeapon = 4;
            replaceWeaponOnMap(mindstone.value, 'wp-4', num);
            replaceWeaponOnBoard(mindstone.value);
            return;
        }
            if (tile.hasClass('wp-5')) {
            currentWeapon = 5;
            replaceWeaponOnMap(gauntlet.value,'wp-5', num);
            replaceWeaponOnBoard(gauntlet.value);
            return;
            }
        
        }
        if (tile.hasClass('quiz-1')) {
            tile.removeClass('quiz-1');
            initQuiz();
            return;
        }

}

// If players cross over adjacent squares (horizontally or vertically), a battle begins
function fight(posNew, posOld) {

    if (posNew.x === posOld.x 
        && posNew.y <= posOld.y + 1 && posNew.y >= posOld.y - 1 ||posNew.y === posOld.y 
        && posNew.x <= posOld.x + 1 && posNew.x >= posOld.x - 1) {
        move = false;
        hover = false;
        fightingArea();
        scores = 0;
        fightPlayerOne();
        fightPlayerTwo();
    }
}

//initialize the Game
function initGame() {
    game.create();
    for (let i = 0; i < obstacles; i += 1) {
        game.obstacles('obstacle');
    }
    spacestone.add();
    powerstone.add();
    mindstone.add();
    gauntlet.add();
    player1.add();
    player2.add();
    player1.setData();
    player2.setData();
    $('.player1').addClass('active');
    extra.addExtras();

}

initGame();
movePlayer();

// check which player is active:
function whoIsActive() {
    if (player1Active) {
        activePlayer = 2;
        notActivePlayer = 1;
        setActivePlayer(player2, player1, powerDiv2);
        setActiveBoard(notActivePlayer, activePlayer);
        displayMessageOnBoard(activePlayer);  
    } else {
        activePlayer = 1; 
        notActivePlayer = 2;
        setActivePlayer(player1, player2, powerDiv1);
        setActiveBoard(notActivePlayer, activePlayer,);
        displayMessageOnBoard(activePlayer);
    }

}

// to find position x and y on the map 
function getCoordinates(tile) {
    return {
        x: (tile) % 10
        ,
        y: Math.floor((tile) / 10)
    }
}
// to find the position of the box with player class
const boxPosition = (itemClass) => {
    return $(itemClass).data('index');
};
let playerPosition = boxPosition('.player1');
// old position is the position of not active player in the moment
let posOld = getCoordinates(playerPosition);

// index of the tile on the map (from 1 to 100);
function getTileIndex(x, y) {
    return y * 10 + x;
}
/* add components to the map function like obstacles, weapon, players, which is used by 'add' function by their function constructor */
function addComponents(itemClass, player) {
    let restOfTiles = tiles;
    let boxes = $('.box');
    let empty = true;
    while (empty) {
        let item = random(mapSize);
        if (player === 1) {
            positionRules = (item % 10 === 0);
        } else if (player === 2) {
            positionRules = (item % 10 === 9);
        } else {
            positionRules = (item % 10 !== 0 && item % 10 !== 9);
        }
        if (positionRules && restOfTiles.includes(item)) {
            boxes.eq(item).addClass(itemClass);
            let index = restOfTiles.indexOf(item);
            restOfTiles.splice(index, 1);
            empty = false;
        }
    }
}
// randomize the boxes on the map to randomize position of game's components
function random(num) {
    return Math.floor(Math.random() * num);
}
/*

                                     ----INFORMATION ON THE PLAYER BOARDS----

*/

//set attributes to the acctive player to use them by replacing weapon
function setActivePlayer(Active, notActive, activePowerDiv) {
    playerActive = Active;
    playerNotActive = notActive; 
    activePlayerPowerDiv = activePowerDiv;      
}
// add a class for a board of the active player to display current information about game flow
function setActiveBoard(notActivePlayer, activePlayer) {
    $('#player-' + notActivePlayer).removeClass('active-board');
    $('#player-' + activePlayer).addClass('active-board');
}
// display random message on active player's board
function displayMessageOnBoard(activePlayer) {  
    let text = turnMessage[Math.floor(Math.random()*turnMessage.length)];
    $('.turn-' + activePlayer).text(text);
    $('.turn-' + notActivePlayer).text(noTurnMessage);
}
// replace the information on the player's board:
function replaceWeaponOnBoard(power){
    whoIsActive();
    $('.stone-' + notActivePlayer).empty();
    $('<img src="image/wp-' + currentWeapon +'.png">').appendTo(".stone-" + notActivePlayer);
    $(".energy-" + notActivePlayer).text(power);
}
// Extra points for the players if they cross through 'quiz' square.
function addExtraPoints(){
    whoIsActive();
    playerActive.healthScore += scores; 
    $('#health-'+ playerActive.player).text(playerActive.healthScore);
}
// show and hide buttons during the fight
function combat() {
    if(turn == 0) {
        attackBtn1.hide();
        defendBtn1.hide();
        attackBtn2.hide();
        defendBtn2.hide();
    }else if(turn == 1) {
        attackBtn2.hide();
        defendBtn2.hide();
        attackBtn1.show();
        defendBtn1.show();
    } else if (turn == 2) {
        attackBtn1.hide();
        defendBtn1.hide();
        attackBtn2.show();
        defendBtn2.show();       
    }
}
// when the players fight, the board game is hidden
function fightingArea() {
    mapContainer.hide();
    $('#player-1').css('margin-left', '300px');
    $('#player-2').css('margin-right', '300px');
    $(body).css({
        'backgroundImage' : 'url("image/background.jpg")',
        'backgroundSize'  : 'no-repeat'
    })
    $('div.turn-1').empty();
    $('div.turn-2').empty();
    $('#player-' + activePlayer).removeClass('active-board');
    attackBtn1.show();
    defendBtn1.show();

}
// display Game Over board at the end, when battle is finished
function gameOverBoard() {
    $('.player-container').hide();
    $('header').hide();
    gameOverContainer.show();
    player1.winner(player2);
}
/*

                                    ----BUTTONS FUNCTIONALITY----

    */
function startGame(){
    playerContainerDiv.show();
    mapContainer.show();
    startContainer.hide();
    attackBtn1.hide();
    attackBtn2.hide(); 
    defendBtn1.hide();
    defendBtn2.hide();
    $('#player-1').addClass('active-board');
 };

// attack and defend buttons connected with attack function mentioned in player function constructor
function fightPlayerOne(){
    attackBtn1.click(function() {
        player1.attack(player2);
        pleyerDefend = 0;
        turn = 2;
        activePlayer = 2;
        combat();
    });
    defendBtn1.click(function(){
        playerDefend = 1;
        turn = 2;
        activePlayer = 2;
        combat();
        
    })
}
function fightPlayerTwo() {
        attackBtn2.click(function() {
        player2.attack(player1);
        pleyerDefend = 0;
        turn = 1;
        activePlayer = 1;
        combat();
    });
    defendBtn2.click(function(){       
        turn = 1;
        playerDefend = 1;
        activePlayer = 1;
        combat();
        
    })
}
/*

                                            ---- QUIZ----

*/

var Question = function (question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;

    this.displayQuestion = function() {
        $('.question').text(this.question);

        for (var i = 0; i < this.answers.length; i++) {
           $('form').append('<input type="radio" id="answer" name="ans" value="' + i + '">' + this.answers[i]+'<br>');
        }
    }

    this.checkAnswer = function(n) {
        $('input[type="radio"]').change(function(){
        let checked = $(this).is(':checked');
        if(checked) {
            let thisChecked = $(this).val();
            let playerChoice = parseInt(thisChecked);
                if (playerChoice == questions[n].correct) {
                    $('.result').text('Right answer Congrats!!, you earn 20 points!');
                    scores += extra.value;
                    $('form').empty();
                    $('.question').empty();

                } else {
                    $('.result').text('Ohh Hoo!! Wrong answer, You loose 10 points!');
                    scores -= 10;
                    $('form').empty();
                    $('.question').empty();

                }
            }   
        }); 
    }
}

// Quiz Questions and correct answers stored

    var q1 = new Question('What is the name of Thor’s hammer?',
                          ['Mjolnir', 'Balder', 'Aesir'],
                          0);
    var q2 = new Question("What is Peter Quill’s alter ego?",
                          ['Star Dude', 'Star Lord', 'Star God'],
                          1);
    var q3 = new Question("Who is Thor’s father?",
                          ['Loki', 'Odin', 'Yondu'],
                          1);
    var q4 = new Question('What tape does Peter Quill listen to on his Walkman?',
                          ['Awesome Mix Vol. 1', 'Great Tunes Vol. 1', 'Awesome Songs Vol. 1'],
                          0);
    var q5 = new Question("Who died in Avengers: Age of Ultron?",
                          ['Quicksilver', 'Vision', 'Scarlet Witch'],
                          0);
    var q6 = new Question('Which planet are Thor and the Hulk on in Thor: Ragnarok?',
                          ['Sakaar', 'Wakanda', 'Asgard'],
                          0);
    var q7 = new Question('Who has a cameo in every MCU movie??',
                          ['Stan Lee', 'Russo Brothers', 'Jack Kirby'],
                          0);

    var questions = [q1, q2, q3, q4, q5, q6, q7];


function initQuiz(){
    scores = 0;
    $('.container-quiz').show();
    var n = random(questions.length);
    questions[n].displayQuestion();
    questions[n].checkAnswer(n);
} 
function closeQuiz(){
    addExtraPoints();
    $('.container-quiz').hide();
    $('form').empty();
    $('.result').empty();
}

