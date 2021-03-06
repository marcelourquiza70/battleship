var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,
    
    generateShipLocations: function() {
        var locations;
        for ( var i = 0; i < this.numShips; i++) {
            do {
                locations = model.generateShip();//recebe um array de generateShips
                //locations = ["00", "11", "22"]; harcode uma locations para testar collision
            } while (this.collision(locations));//passa um array locations para collision
            this.ships[i].locations = locations;//passa o array locations, validado, para o array
            //locations dentro do objeto ships[i]
        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row;
        var column;
        var shipLocation = [];
                    
        if (direction === 0) { //horizontal
            row = Math.floor(Math.random() * model.boardSize);
            column = Math.floor(Math.random() * (model.boardSize -2));
            shipLocation.push(row.toString() + column);
            shipLocation.push(row.toString() + (column + 1));
            shipLocation.push(row.toString() + (column + 2));
            return shipLocation;
            

        } else { //vertical
            row = Math.floor(Math.random() * (model.boardSize - 2));
            column = Math.floor(Math.random() * model.boardSize);
            shipLocation.push(row + column.toString());
            shipLocation.push((row + 1) + column.toString());
            shipLocation.push((row + 2) + column.toString());
            return shipLocation;
            
        }
    },

    collision: function(locations){
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0) {
                    console.log("collision" + locations[j]);
                    return true;
                }
            }
        }
        console.log("no collision");
        return false;
    },

    ships: [{locations: ["", "", ""], hits: ["", "", ""]},
            {locations: ["", "", ""], hits: ["", "", ""]},
            {locations: ["", "", ""], hits: ["", "", ""]}],

    fire: function(guess){
            for( var i = 0 ; i < this.numShips ; i++ ) {//this pois a var numShips est?? dentro
                //do mesmo objeto model em que estamos definindo a fun????o/propriedade fire
                var ship = this.ships[i]; //ships[i] ?? o objeto i dentro da property ships.
                //estamos passando para a var ship, um array com a location e hits do 
                //objeto ships[i]
                //observe que a vari??vel ?? local. h?? outra, local tbm, na fun????o/propriedade collision
                var index = ship.locations.indexOf(guess); //compara o string guess com o array 
                //locations da var ship e retorna o ??ndice onde foi encontrado um array igual
                //se n??o encontra igual, retorna -1
                if (index >= 0){//se index ?? maior que zero, guess ?? igual a uma location, ou seja
                    //um navio foi acertado
                    ship.hits[index] = "hit";//coloca o string "hit" no ??ndice [index] do
                    //array hits da var ship, que contem o array ships[i]
                    view.displayHit(guess);
                    view.displayMessage("HIT!!!");
                    if(this.isSunk(ship)){//retorna true(navio abatido) ou false da 
                        //fun????o isSunk
                        view.displayMessage("You sank my battleship!!!");
                        this.shipsSunk++;
                    }
                    return true;
                }
            }
            view.displayMiss(guess);
            view.displayMessage("You missed!!!");
            return false;
        },

    isSunk: function(ship){//a fun????o recebe o array dentro da var ship
        for ( var i = 0 ; i < this.shipLenght ; i++ ){
            if(ship.hits[i] !== "hit"){//se uma posi????o [i] no array hits da var ship
                //?? diferente de hit, ou seja, ainda h?? posi????o do navio a ser acertada
                //a fun????o retorna false para quem a chamou, no caso a fun????o fire
                return false;
            }
        }
        return true;
    }
};

var controller = {
    guesses: 0,
    shoots: [],
    processGuess: function(guess){
        var location = parseGuess(guess);//recebe a posi????o (00, 01, 02,...10,11, etc)
        //validada de parseguess. aqui, a var location recebe apenas um string
        if (location) {//se location n??o for null, ou seja, se retornar um valor, o if ??
            //executado
            this.guesses++;
            console.log(controller.guesses); 
            var hit = model.fire(location);//passa o string location para a fun????o fire
            //e aloca o retorno de fire (true ou false) na var hit
            //a var hit n??o serve pra nada, s?? pra chamar a fun????o fire;
            //model.fire(location); poderia ter sido usado ao inv??s da var hit[]
            if(model.shipsSunk >= model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses!");
                setTimeout(jogarNovamente, 3000);
            }
        }
    }
};

console.log(model.ships);

function jogarNovamente(){
 alert("O jogo acabou. Clique Ok para jogar novamente!");
 window.location.reload();
};

function parseGuess(guess) {
    var alphabet = ["A","B","C","D","E","F","G"];
        
    if (guess === null || guess.length !== 2) {
        alert("Oops! Please enter a letter and a number on the board!");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar.toUpperCase());//transforma a letra entrada pelo usu??rio
        //para mai??scula, de maneira a n??o dar erro se o usu??rio digitar uma min??scula,
        //e compara com o array alphabet, retornando o ??nidice da letra encontrada
        //transformando uma entrada em letra em um n??mero - A est?? no ??ndice 0, B no ??ndice 1, etc
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)){//|| signifca or. se isNan for true, ou seja, row or column
            //n??o forem number, executa o alert
            alert("Ops! That isn't on the board!");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize ) {
            //se isNan for number, executa o else if, testando se row e column est??o entre 0 e 6
            alert("Ops! That's off the board!");
        } else if (controller.shoots.indexOf(row + column) >= 0) {
            alert("That shot has already been taken! Shoot again!");
            return null;
        }
        controller.shoots.push(row + column);
        console.log(controller.shoots);
        return row + column;//retorna o string row + column, ou seja, a posi????o
            //entrada pelo usu??rio, para o chamador de parseGuess, a var location de
            //processGuess 
        }    
    return null;
};

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    document.getElementById("guessInput").focus();
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress (e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
    
window.onload = init;
model.generateShipLocations();