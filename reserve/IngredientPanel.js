//list containing the reserves
var foodList = [];

//every information about the food
var ingredientChart = {
    bredTop: { unlock: true, nb: 20, nbElement: 2, price: 1, initPrice: 30, initSpeed: 26000 },
    meat: { unlock: true, nb: 20, nbElement: 10, price: 2, initPrice: 40, initSpeed: 22000 },
    cheese: {
        unlock: true,
        nb: 30,
        nbElement: 15,
        price: 3,
        initPrice: 40,
        initSpeed: 26000
    },
    salad: {
        unlock: true,
        nb: 20,
        nbElement: 10,
        price: 1,
        initPrice: 40,
        initSpeed: 25000
    },
    ketchup: {
        unlock: true,
        nb: 20,
        nbElement: 10,
        price: 4,
        initPrice: 40,
        initSpeed: 28000
    },
    tomato: {
        unlock: false,
        nb: 20,
        nbElement: 20,
        price: 5,
        initPrice: 160,
        initSpeed: 6650
    },
    pickle: {
        unlock: false,
        nb: 20,
        nbElement: 20,
        price: 6,
        initPrice: 260,
        initSpeed: 3660
    },
    beacon: {
        unlock: false,
        nb: 20,
        nbElement: 20,
        price: 8,
        initPrice: 300,
        initSpeed: 1960
    },
    egg: {
        unlock: false,
        nb: 20,
        nbElement: 20,
        price: 9,
        initPrice: 400,
        initSpeed: 1120
    },
    bredTopBlack: {
        unlock: false,
        nb: 20,
        nbElement: 20,
        price: 10,
        initPrice: 640,
        initSpeed: 405
    }
};

//ingredient that can be picked at random with out neading to be in a specific position
var regularIngredient = [
    "meat",
    "salad",
    "pickle",
    "tomato",
    "beacon",
    "egg",
    "cheese"
];

//class to manage food reserve
var IngredientPanel = class IngredientPanel {
    constructor(ingredient, unlock, speed, document, nbmax, initPrice, numberElement) {
        this.speedOfDelivery = speed;
        this.unlock = unlock;
        this.ingredient = ingredient;
        this.document = document;
        this.listElement = [];
        this.nbElement = 0;
        this.initNumberElement = numberElement;
        this.nbMax = nbmax;
        this.priceUpgrade = initPrice;
        this.isReserveFilling = true;
        this.speedDocument = null;
        this.button = null;
        this.ketchupDiv = null;
        this.toolTip = null;
        this.initValues = true;

        this.init();
    }

    //upgrade the speed of delivery
    upgrade() {
        if (money >= this.priceUpgrade && this.unlock) {
            this.lightYellow();

            money -= this.priceUpgrade;
            this.speedOfDelivery = this.getNewSPeed(this.speedOfDelivery);
            this.worker.postMessage(this.speedOfDelivery)
            ingredientChart[this.ingredient].initSpeed = this.speedOfDelivery;
            this.priceUpgrade = this.getNewPrice(this.priceUpgrade)
            ingredientChart[this.ingredient].initPrice = this.priceUpgrade;
            this.speedDocument.textContent =
                "every " + this.roundValue(this.speedOfDelivery / 1000, 2).toString(10) + "s";
            this.button.textContent = this.priceUpgrade.toString(10) + "$";

            for (var i = 0; i < 2; i++) {
                this.add();
            }

            updateScore();
            this.updateTootTip();
        }

    }

    async lightYellow() {
        this.reservePanel.style.backgroundColor = "#FF961B";
        this.reservePanel.style.transform = "scale(1.01)";
        await burger.sleep(100);
        if (this.ingredient == "pickle") {

            this.reservePanel.style.backgroundColor = "rgb(154, 212, 157)";
            return;
        } else {
            this.reservePanel.style.backgroundColor = "#FFFFFF";
        }
        this.reservePanel.style.transform = "scale(1)";
    }

    //getPrice
    getNewPrice(oldPrice) {
        switch (currentChef) {
            case 0:
                oldPrice += 7.5;
                break;
            case 1:
                oldPrice += 10;
                break;
            case 2:
                oldPrice += 22;
                break;
            case 3:
                oldPrice += 40;
                break;
            case 4:
                oldPrice += 80;
                break;
            case 5:
                oldPrice += 120;
                break;
        }
        return this.roundValue(oldPrice);
    }

    getNewSPeed(oldSpeed) {
        // switch (currentChef) {
        //     case 0:
        //         oldSpeed -= 1090;
        //         break;
        //     case 1:
        //         oldSpeed -= 480;
        //         break;
        //     case 2:
        //         oldSpeed -= 280;
        //         break;
        //     case 3:
        //         oldSpeed -= 175;
        //         break;
        //     case 4:
        //         oldSpeed -= 117;
        //         break;
        //     case 5:
        //         oldSpeed -= 80;
        //         break;
        // }
        if (currentChef > 4) {
            return this.roundValue(oldSpeed * 0.91);
        }
        if (currentChef == 3) {
            return this.roundValue(oldSpeed * 0.90);
        }
        if (currentChef == 2) {
            return this.roundValue(oldSpeed * 0.88);
        }
        if (currentChef == 1) {
            return this.roundValue(oldSpeed * 0.85);
        }
        return this.roundValue(oldSpeed * 0.80);
    }

    //average speed of all unlocked reserve
    averageSpeed() {
        var speedAverage = 0;
        var nbUnlockedReserve = 0;
        for (var reserve of foodList) {
            if (reserve.unlock) {
                nbUnlockedReserve++;
                speedAverage += reserve.speedOfDelivery;
            }
        }
        return this.roundValue(speedAverage / nbUnlockedReserve);
    }

    //average price of all unlocked reserve
    averagePrice() {
        var priceAverage = 0;
        var nbUnlockedReserve = 0;
        for (var reserve of foodList) {
            if (reserve.unlock) {
                nbUnlockedReserve++;
                priceAverage += reserve.priceUpgrade;
            }
        }
        return this.roundValue(priceAverage / nbUnlockedReserve);
    }

    //unlocked the reserve
    unlockReserve() {
        this.speedOfDelivery = this.averageSpeed();
        ingredientChart[this.ingredient].initSpeed = this.speedOfDelivery;
        this.priceUpgrade = this.averagePrice();
        ingredientChart[this.ingredient].initPrice = this.priceUpgrade;

        this.document.style.backgroundColor = "rgb(238, 237, 237)";
        if (this.ingredient == "pickle") {
            this.document.style.backgroundColor = 'rgb(154, 212, 157)';
        }

        //display the speed of delivery
        this.speedDocument.textContent =
            "every " + this.roundValue(this.speedOfDelivery / 1000, 2).toString(10) + "s";
        //display the price of the upgrade
        this.button.textContent = this.priceUpgrade.toString(10) + "$";

        this.checkMoneyButton();

        //fill the associated reserve
        for (var i = 0; i < this.nbMax; i++) {
            this.add();
        }
        //start the regular delivery
        this.initLoop(this.speedOfDelivery);

        this.unlock = true;

        ingredientChart[this.ingredient].unlock = true;

        this.initValues = false;
    }

    //color of button with out enough gold to buy
    checkMoneyButton() {
        if (this.unlock) {
            if (money < this.priceUpgrade) {
                this.button.style.backgroundColor = "#10222C";
                //this.button.style.pointerEvents = "none";
                this.button.style.boxShadow = 'none';
            } else {
                this.button.style.backgroundColor = "#007d96";
                //this.button.style.pointerEvents = "auto";
                this.button.style.boxShadow = '6px 6px 0px 1px #142d3a';
            }
        }
    }

    updateTootTip() {
        this.toolTip.childNodes[3].textContent = '1 every ' + this.roundValue(this.speedOfDelivery / 1000, 2) + " secondes";
        this.toolTip.childNodes[7].textContent = '1 every ' + this.roundValue(this.getNewSPeed(this.speedOfDelivery) / 1000, 2) + " secondes";
    }

    //initialize the reserve
    init() {
        this.speedDocument = document.getElementById(this.ingredient + "Speed");
        this.button = document.getElementById(this.ingredient + "Button");
        this.toolTip = document.getElementById(this.ingredient + "ToolTip");
        this.reservePanel = document.getElementById(this.ingredient);
        this.loading = document.getElementById(this.ingredient + "Load");

        //listen for click on the upgrade button
        this.button.addEventListener("click", () => {
            this.upgrade();
        });

        var hoverBool = false;

        this.button.addEventListener('mouseover', () => {
            hoverBool = true;
            if (this.unlock) {
                setTimeout(() => {
                    if (hoverBool) {
                        this.toolTip.style.visibility = 'visible';
                    }
                }, 500)
            }
        })

        this.button.addEventListener('mouseleave', () => {
            hoverBool = false;
            if (this.unlock) {
                this.toolTip.style.visibility = 'hidden';
            }
        })

        this.updateTootTip();

        //if the reserve start unlocked
        if (this.unlock) {
            if (this.ingredient == "ketchup") {
                this.ketchupDiv = document.createElement("div");
                this.document.appendChild(this.ketchupDiv);
                this.ketchupDiv.style.width = "100%";
                this.ketchupDiv.style.backgroundColor = "rgb(255, 76, 9)";
                this.ketchupDiv.style.borderRadius = "5px";
            }
            //display the speed of delivery
            this.speedDocument.textContent =
                "every " + this.roundValue(this.speedOfDelivery / 1000, 2).toString(10) + "s";
            //display the price of the upgrade
            this.button.textContent = this.priceUpgrade.toString(10) + "$";

            this.checkMoneyButton();

            //fill the associated reserve
            for (var i = 0; i < this.initNumberElement; i++) {
                this.add();
            }

            this.initLoop(this.speedOfDelivery);

            this.initValues = false;
        } else {
            //grey everything out
            this.document.style.backgroundColor = "#10222C";
            //this.button.style.pointerEvents = "none";
            this.button.style.backgroundColor = "#10222C";
            this.button.style.boxShadow = 'none';
        }

    }

    initLoop(valueSpeed) {
        //start the regular delivery
        this.worker = new Worker(URL.createObjectURL(new Blob(["(" + startLoop.toString() + ")()"], { type: 'text/javascript' })));

        this.worker.onmessage = (e) => {
            switch (e.data) {
                case 'add':
                    this.add();
                    break;
                default:
                    if (this.nbMax <= this.nbElement) {
                        this.loading.style.height = "0%";
                        break;
                    }
                    this.loading.style.height = this.roundValue(e.data * 100).toString() + "%";
            }
        }

        this.worker.postMessage(valueSpeed)
    }

    //remove an ingredient
    remove() {
        if (this.listElement.length > 0 || this.ingredient == "ketchup") {
            if (this.ingredient == "ketchup") {
                this.ketchupDiv.style.height =
                    (100 / this.nbMax) * (this.nbElement - 1).toString(10) + "%";
                this.ketchupDiv.style.borderRadius = "0px";
                this.ketchupDiv.style.borderBottomLeftRadius = "3px";
                this.ketchupDiv.style.borderBottomRightRadius = "3px";
            } else {
                var ingredient = this.listElement.pop();
                ingredient.parentNode.removeChild(ingredient);
            }
            this.nbElement--;
            if (!this.initValues) {
                ingredientChart[this.ingredient].nbElement -= 1;
            }
        }
    }

    //add an ingredient
    add() {
        if (this.nbElement < this.nbMax) {
            if (this.ingredient == "ketchup") {
                if (this.nbElement == this.nbMax - 1) {
                    this.ketchupDiv.style.borderRadius = "3px";
                } else {
                    this.ketchupDiv.style.borderRadius = "0px";
                    this.ketchupDiv.style.borderBottomLeftRadius = "3px";
                    this.ketchupDiv.style.borderBottomRightRadius = "3px";
                }
                this.ketchupDiv.style.height =
                    Math.round((100 / this.nbMax) * (this.nbElement + 1)).toString(10) +
                    "%";
            } else {
                var divImageIngredient = document.createElement("div");
                var imageIngredient = document.createElement("img");
                divImageIngredient.style.height = (100 / this.nbMax).toString(10) + "%";
                var Terminaison = (Math.random() > 0.6) ? "Dif" : "";
                imageIngredient.src =
                    "ressources/pileElement/" + this.ingredient + Terminaison + ".png";
                imageIngredient.style.height = "120%";
                if (this.ingredient === "cheese") {
                    imageIngredient.style.height = "190%";
                }
                imageIngredient.classList.add("foodElement");
                divImageIngredient.appendChild(imageIngredient);
                this.document.appendChild(divImageIngredient);
                this.listElement.push(divImageIngredient);
            }
            this.nbElement++;
            if (!this.initValues) {
                ingredientChart[this.ingredient].nbElement += 1;
            }
        }
        if (pending) {
            burger.prepare(command);
        }
    }

    //round
    roundValue(value, nb = 0) {
        return Math.round(value * Math.pow(10, nb)) / Math.pow(10, nb);
    }

};

function startLoop() {
    var speedOfDelivery = 1000000;

    var init = true;

    var isReserveFilling = true;

    //sleep method even if it's bad
    async function sleepM() {
        for (var i = 0; i < speedOfDelivery; i += 10) {
            await sleep(10);
            if (i % 50 == 0) {
                postMessage(i / speedOfDelivery);
            }
        }
        return;
    }

    //sleep fonction
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function loop() {
        while (isReserveFilling) {
            await sleepM();
            postMessage(1)
            postMessage('add');
        }
    }

    onmessage = function(e) {
        speedOfDelivery = e.data;

        if (init) {
            init = false;
            loop();
        }
    }
}