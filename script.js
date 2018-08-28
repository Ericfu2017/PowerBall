
$(document).ready(function(){

    const auSystem = {     // Australlian Powerball System
        firstBarrel: 35,
        secondBarrel: 20,
        numbers: 7
    }

    const usSystem = {     // USA Powerball System
        firstBarrel: 69,
        secondBarrel: 26,
        numbers: 5
    }

    const winningNumber = {
        mainNumbers: [],
        powerBall: [],
    } 

    const nextDrawing = {
        
    }


    const powerBallInfoData = fetch('https://games.api.lottery.com/api/v2.0/results?game=59bc2b6031947b9daf338d32');  // fetch the winning PowerBall Number :-)
    //console.log(powerBallInfoData);
    powerBallInfoData
        .then(data => data.json())
        .then(data => {
            let j = 1;
            data[j].results ? j = 1 : j =2;
            const winningTicketNumber = data[j].results.values.map(item => item.value);
            winningTicketNumber.splice(6, 1);
            for (let i = 0; i < 5; i++) {
                winningNumber.mainNumbers[i] = parseInt(winningTicketNumber[i]);
            }
            winningNumber.powerBall[0] = parseInt(winningTicketNumber[5])
            winningNumber.drawDate =  data[j].results.asOfDate.slice(0, 10);
            winningNumber.jackPot = parseInt(data[j].prizes.values[0].value)
            nextDrawing.drawDate = data[0].resultsAnnouncedAt.slice(0, 10);
            nextDrawing.jackPot = parseInt(data[0].prizes.values[0].value);
            printResultInfo();  // got to fetch the info first otherwise display info will be undefined T_T
        })
        .catch(err => console.log(err));
    
    
   
    
    let ticketDataBase = [];
    let localTicketDataBase = [];
    let ticketId = 1;  // inistialize tiketId counting system :-)

    localTicketDataBase = JSON.parse(localStorage.getItem('ticketDataBase')); // extract ticketDataBase from localStorage :-)

    if (localTicketDataBase) {  // if ticketDataBase has already existed in the localStorage, the varaible ticketDataBase point to it :-)
       let arrLength = localTicketDataBase.length;
        ticketDataBase = localTicketDataBase;
        ticketId = ticketDataBase[arrLength-1].ticketId; // track ticketId
    }

function returnPrizeMoney(sum) {

    return Math.abs(Number(sum)) >= 1.0e+9 
    ? Math.abs(Number(sum)) / 1.0e+9 + ' Billion'
    : Math.abs(Number(sum)) >= 1.0e+6
    ? Math.abs(Number(sum)) / 1.0e+6 + ' Million'
    : Math.abs(Number(sum)) >= 1.0e+3
    ? Math.abs(Number(sum)) / 1.0e+3 + 'Thousands'
    : Math.abs(Number(sum));
}


function drawOneGame(system) { // draw one powerball game :-) ^_^
    
    const lottoMachine = [];
    const powerBallMachine = [];
    let maxNumber = system.firstBarrel;
    const maxPowerNumber = system.secondBarrel;
    const mainNumbers = [];
    const powerBall = [];

    for (let i = 1; i <= maxNumber; i++) {   // initialize lottoMachine :-)
        lottoMachine.push(i);
    }
   // console.log(lottoMachine);

    for (let i = 1; i <= maxPowerNumber; i++) {  // initialize powerBallMachine :-)
        powerBallMachine.push(i);
    }
   //console.log(powerBallMachine);

    function drawMainNumbers() {  // draw the main numbers :-)

        let randomPosition;
        let i = system.numbers;

        while (i > 0) {
            randomPosition = Math.floor(Math.random() * maxNumber);
            mainNumbers.push(lottoMachine.splice(randomPosition, 1)[0]);
            i --; 
            maxNumber--;
        }

        return mainNumbers.sort(function(a, b)  {return a-b});

    }
   // console.log(drawMainNumbers());

    function drawPowerBall() {  // draw the powerball :-) Yea!!! ^_^
        
        let randomPosition = Math.floor(Math.random() * maxPowerNumber);
        powerBall.push(powerBallMachine.splice(randomPosition, 1)[0]);

        return powerBall;
    }
  //  console.log(drawPowerBall());

    return {
        mainNumbers: drawMainNumbers(),
        powerBall: drawPowerBall()
    }
}

function drawOnePowerHit(system) {    // draw one PowerHit game (actually 20 games) in case I want to adds more games or more functions :-)

    let onePowerBallHit = [];
    let x = drawOneGame(system);
    let mainNumbers = x.mainNumbers;
    
    function returnOneGame (mainNumbers, x) {  // create one powerHit game, Array of 20 ticket objects
        return {
            mainNumbers: mainNumbers,
            powerBall: [x]
        }
    }

    for (let i = 1; i <= 20; i++) {
        onePowerBallHit.push(returnOneGame(mainNumbers, i));
    }

    return onePowerBallHit;  // Array of 20 ticket objects 
} 

//console.log(drawOnePowerHit(auSystem));

function produceTicket(system, howManyGames, playMethod) { // add playMethod parameter just in case if i want to adds more way of play, say system 10 ~ system 20 .....
    let i = howManyGames;
    const lottoTicket = [];

    if (playMethod === 'standard') {
        while (i > 0) {
            lottoTicket.push(drawOneGame(system));
            i --;
        }
    }  
    
    if (playMethod === 'powerhit') {
        while (i > 0) {
            lottoTicket.push(...drawOnePowerHit(system)); // spread the Array of 20 ticket objects to be 20 indivisual tickets... :-)
            i--;
        }
    }
  //  console.log(lottoTicket);
    return {
        ticketId: ticketId++,
        games: lottoTicket,
        timestamp: new Date()
    }

}

//ticketDataBase.push(produceTicket(usSystem, 20000, 'standard'));
//localStorage.setItem('ticketDataBase', JSON.stringify(ticketDataBase)); //keep the ticketDataBase in localStorage...
//localStorage.removeItem('ticketDataBase');
console.log(ticketDataBase);

function auRanking (mainNumber, powerBall) {   // return the result of one  ticket checking....
    if (mainNumber === 7 && powerBall === true) {
        return 'Jack Pot'
    } else if (mainNumber === 7 && powerBall === false) {
        return 'Division 2'
    } else if (mainNumber === 6 && powerBall === true) {
        return 'Division 3'
    } else if (mainNumber === 6 && powerBall === false) {
        return 'Division 4'
    } else if (mainNumber === 5 && powerBall === true) {
        return 'Division 5'
    } else if (mainNumber === 4 && powerBall === true) {
        return 'Division 6'
    } else if (mainNumber === 5 && powerBall === false) {
        return 'Division 7'
    } else if (mainNumber === 3 && powerBall === true) {
        return 'Division 8'
    } else if (mainNumber === 2 && powerBall === true) {
        return 'Division 9'
    } else  {
        return  null;
    }
  }

function usRanking (mainNumber, powerBall) {   // return the result of one  ticket checking....
    if (mainNumber === 5 && powerBall === true) {
        return 'Jack Pot'
    } else if (mainNumber === 5 && powerBall === false) {
        return 'Division 2'
    } else if (mainNumber === 4 && powerBall === true) {
        return 'Division 3'
    } else if (mainNumber === 4 && powerBall === false) {
        return 'Division 4'
    } else if (mainNumber === 3 && powerBall === true) {
        return 'Division 5'
    } else if (mainNumber === 3 && powerBall === false) {
        return 'Division 6'
    } else if (mainNumber === 2 && powerBall === true) {
        return 'Division 7'
    } else if (mainNumber === 1 && powerBall === true) {
        return 'Division 8'
    } else if (mainNumber === 0 && powerBall === true) {
        return 'Division 9'
    } else  {
        return  null;
    }
  }


function checkOneGame(system, oneGame, winningNumber) { // return winning division or null
 
    let ckeckPowerBall = (oneGame.powerBall[0] === winningNumber.powerBall[0]);
    let checkMainNumbers = 0; // initialize checkMainNumbers to see how many numbers in first Barrel are matching with the winning number :-)
    let x = oneGame.mainNumbers;
    let y = winningNumber.mainNumbers;
    let powerBallSystem = system.numbers;  // 7 for Australia and 5 for the USA :-)

    for (let i = 0; i < powerBallSystem; i ++) {
        if(x.find(ballNumber => ballNumber === y[i])) {
            checkMainNumbers ++;
        }
    }
    //console.log(checkMainNumbers);
    if (system === auSystem) {  // Australia and the USA have different PowerBall Ranking system :-)
        return auRanking(checkMainNumbers, ckeckPowerBall);
    }

    if (system === usSystem) {
        return usRanking(checkMainNumbers, ckeckPowerBall);
    } 
    
}


function checkResult(system, ticketId, winningNumber) {

    let jackPot = 0, div2 = 0, div3 = 0, div4 = 0, div5 = 0, div6 =0 , div7 = 0, div8 = 0, div9 =0;
    let index = ticketDataBase.findIndex(x => x.ticketId === ticketId);  // locate the position of the ticket in the ticketDataBase :-)
    let buyerGames = ticketDataBase[index].games; // poit to the games Array (includes all the games in one ticket) :-)
    let result;
    let totalPrizeMoney = 0;
    let jackPotId;

    const div2Id = [];
    const div3Id = [];

  
   
    for (let i = 0; i <buyerGames.length; i++) {
         result = checkOneGame(system, buyerGames[i], winningNumber);
          if (result === 'Jack Pot') {
            jackPot ++;
            jackPotId = i;
            console.log('Jack Pot Ticket: ', i);
          } else if (result === 'Division 2') {
            div2 ++;
            console.log('Division 2 ticket:', i);
          } else if (result === 'Division 3') {
            div3 ++;
          } else if (result === 'Division 4') {
            div4 ++;
          } else if (result === 'Division 5') {
            div5 ++;
          } else if (result === 'Division 6') {
            div6 ++;
          } else if (result === 'Division 7') {
            div7 ++;
          } else if (result === 'Division 8') {
            div8 ++;
          } else if (result === 'Division 9') {
            div9 ++;
          } 
    }
    totalPrizeMoney = div2 * 1000000 + div3 * 50000 + div4 * 100 + div5 * 100 + div6 * 7 + div7 * 7 + div8 * 4 + div9 * 4;

    return `The Result is :<br><br>
                            JackPot = ${jackPot}<br>
                            Division 2 = ${div2}<br>
                            Division 3 = ${div3}<br>
                            Division 4 = ${div4}<br>
                            Division 5 = ${div5}<br>
                            Division 6 = ${div6}<br>
                            Division 7 = ${div7}<br>
                            Division 8 = ${div8}<br>
                            Division 9 = ${div9}<br><br>

                            ${jackPot ? `Oh My God, You Won the Jack Pot! <span class="prizeMoney">${returnPrizeMoney(nextDrawing.jackPot)}</span> The Jack Pot ticket ID is: ${jackPotId + 1}<br>plus $${totalPrizeMoney.toLocaleString('en')} <br>Holy Moly ^_^ ^_^ ^_^`
                            : `You bought ${buyerGames.length} games, worth $${(buyerGames.length * 2).toLocaleString()}<br>
                            ${totalPrizeMoney // won any money ^_^
                            ? `Congradulations!!! ^_^ You won totally $${totalPrizeMoney.toLocaleString('en')}` 
                            : `Sorry, You won nothing. Better Luck Next Time :-)` } `} 
                            
                            `

}  

 function prize(system, division) { // figure out prize money :-) 
    
    const prizeSwitch = (division) => ({
        "Jack Pot": "Jack Pot",
        "Division 2": "$1,000,000",
        "Division 3": "$50,000",
        "Division 4": "$100",
        "Division 5": "$100",
        "Division 6": "$7",
        "Division 7": "$7",
        "Division 8": "$4",
        "Division 9": "$4"
    })[division];

    if (system === usSystem) {
        return prizeSwitch(division);
    }
    
}

//console.log(prize(usSystem, 'Division 5'));

function displayTicket(ticket) {
    
    let numberOfTicktes = ticket.games.length;
    let oneGamePrice = 2;
    let total = (numberOfTicktes * oneGamePrice).toLocaleString();
    let games = ticket.games;

    
    const displayTicket = `

        <div class="row" id="ticketInfo">
            <div class="col-lg-6">
                <p class="displayTicket">Ticket ID: ${ticket.ticketId}</p>
                <p class="displayTicket" id="purchaseDate">Purchase Date: ${ticket.timestamp}</p>
                <p class="displayTicket" id="ticketDtail">Ticket Details: ${numberOfTicktes} x $${oneGamePrice}</p>
                <p class="displayTicket" id="total">Total: $${total}</p>
                <p class="displayTicket">Ticket Numbers:</p>
            </div>
        </div>
        <div class="displayBoughtTicket" id="display">
            ${renderTicketHtml()}
        </div>
    
    `;

    function renderTicketHtml() {

        let number = 1;
        return `
            ${games.map(item => `
                <div class="row ticket">
                    <span>${number++}) </span>
                    <ul class="mainNumbers" id="mainNumbers">
                        ${item.mainNumbers.map(num =>`
                            <li>${num}</li>
                        `
                        ).join('')}
                    </ul> 
                    <ul class="powerBall" id="powerBall">
                        <li>${item.powerBall[0]}</li>
                    </ul>
                </div>
            `
            ).join('')}
        `
    }
    
    $('#displayTicket').html(displayTicket);

}

function displayTicketResult(system, ticketId, winningNumber) {

    let index = ticketDataBase.findIndex(x => x.ticketId === ticketId); // find the ticket games in the ticketDataBase :-)
    let games = ticketDataBase[index].games;
    let purchaseDate = ticketDataBase[index].timestamp;
    let firstBarrel = winningNumber.mainNumbers;
    let secondBarrel = winningNumber.powerBall; 
    

    const displayTicketResult = `

        <div class="row" id="result">
            <div class="col-lg-6">
                <p class="result">Tickit ID: ${ticketId} </p>
                <p class="result">Purchased Date: ${purchaseDate} </p>
                <p class="result">Ticket Numbers</p>
            </div>
            <div class="col-lg-6" style="text-align: left">
                <p class="result">Prize Won</p>
            </div>
        </div>

        <div class="displayTicketResult" id="displayTicketResult">
            ${renderResultHtml()}
        </div>

    `;



    function renderResultHtml() {

        let number = 1;

        return `
            ${games.map(item => `
                <div class="row" id="ticketRow">
            
                    <div class="col-lg-6">
                        <div class="row ticket">
                            <span>${number++}) </span>
                            <ul class="mainNumbers" id="mainNumbers">
                                ${item.mainNumbers.map(num=>`
                                    ${firstBarrel.includes(num) ? `<li class="matchingNumber">${num}</li>` : `<li>${num}</li>`}
                                `).join('')}
                            </ul>
                            <ul class="powerBall" id="powerBall">
                            ${secondBarrel.includes(item.powerBall[0]) ? `<li class="matchingNumber">${item.powerBall[0]}</li>` : `<li>${item.powerBall[0]}</li>`}
                            </ul>
                        </div> 
                    </div>

                    <div class="col-lg-6">
                        <div class="row">
                            <p id="description">${checkOneGame(system, item, winningNumber) ? `1 × ${checkOneGame(system, item, winningNumber)}` : ''} </p>
                            <p id="price">${checkOneGame(system, item, winningNumber) ? prize(system, checkOneGame(system, item, winningNumber)) : ''}</p>     
                        </div>
                    </div>

                </div> 
            `).join('')}
        `;
    }

    $('#displayResultInfo').html(displayTicketResult);
    $('#summary').html(checkResult(system, ticketId, winningNumber));

}
//console.log(checkResult(usSystem, 28, winningNumber));
//displayTicketResult(usSystem, 84, winningNumber);


$('#confirm').click(function(){  // buy ticket

    let dataBaseLength = ticketDataBase.length;  // keep track of the length of te ticketDataBase within 10 for the sake of the Brower Memory :-)
    let numberOfGames = $('#buyTicket #numberOfTickets').val();
    let ticketObj = produceTicket(usSystem, numberOfGames, 'standard');

    $('#displayResultInfo').html('');
    $('#summary').html('');

    displayTicket(ticketObj);
    if (dataBaseLength > 9) {
        ticketDataBase.splice(0, 1);
    }
    ticketDataBase.push(ticketObj);
    console.log(ticketDataBase);
    localStorage.setItem('ticketDataBase', JSON.stringify(ticketDataBase)); //keep the ticketDataBase in localStorage...
})

$('#check').click(function(){

    let id = $('#checkTicket #ckeckTicketId').val();
    console.log(ticketDataBase.findIndex(ticket => ticket.ticketId === parseInt(id)));
   if(ticketDataBase.findIndex(ticket => ticket.ticketId === parseInt(id)) === -1) {
       window.alert("The Ticket ID does not exist in the DataBase try again please!")
   } else {
        $('#displayTicket').html(''); //clear the buy ticket display previously :-)
        displayTicketResult(usSystem, parseInt(id), winningNumber);
   }

})


console.log(winningNumber);
function printResultInfo() {

    const lotteryInfo = `
        Next Drawing : ${nextDrawing.drawDate}
       <p> Estimated Jackpot: <span class="prizeMoney">${returnPrizeMoney(nextDrawing.jackPot)}</span></p>
    `;

        const lottoResult = `
        
        <div class="row displayResult">
            <span class="spacer">Winning Number:  ${winningNumber.drawDate}</span>
            <ul class="mainNumbers" id="mainNumbers">
            
                ${winningNumber.mainNumbers.map(num =>`
                    <li>${num}</li>
                `
                ).join('')}
            </ul> 
            <ul class="powerBall" id="powerBall">
                <li>${winningNumber.powerBall[0]}</li>
            </ul>
    
        </div>
    `; 

    $('#nextDrawing').html(lotteryInfo);
    $('#winningGame').html(lottoResult);
}
     

$('#print').click(function(){
    window.print();
})


})





















