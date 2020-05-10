//create the display for the burger
var burger;

var tamponTmp = 0;

var date0;

//chef List
var chefList = [];

var isGameGoing = true;

function startGame() {
  //currentChef = 0;
  getItemLocalStorage();
  //initialise the burger
  burger = new Burger();

  document.getElementById('meat').addEventListener('click', () => {
    localStorage.setItem('saveObject', null);
    console.warn('reset')
  })

  //fill up the food reserve
  initFoodReserve();

  initChef();

  //get div order to maker burger when clicked for test purpose
  makeBurger();
}

window.onblur = function() {
  console.log('unFocused')
  date0 = new Date();
};

window.onfocus = function() {
  console.log('focused')
  tamponTmp = new Date() - date0;
};

async function makeBurger() {
  console.log('pending',pending)
  if (!pending) {
    burger.prepare(generateCommand());
  }
  updateScore();
}

function initFoodReserve() {
  //get the foodContainer div and initialize them
  var foodDiv = document.getElementsByClassName("ingredientPile");
  for (var food of foodDiv) {
    var ingredientPanel = new IngredientPanel(
      food.id, // ingredient name
      ingredientChart[food.id].unlock, // is it locked
      ingredientChart[food.id].initSpeed, // speed of delivery
      food, // HTML Document
      ingredientChart[food.id].nb, // maximum number of food in reserve
      ingredientChart[food.id].initPrice,
      ingredientChart[food.id].nbElement
    );

    //add element to the list
    foodList.push(ingredientPanel);
  }
}

function initChef() {
  for (chef of document.getElementsByClassName("locked")) {
    var newChef = new Chef(
      chef,
      chefs[chef.id].upgrade1locked,
      chefs[chef.id].upgrade2locked,
      "./ressources/chefs/" + chef.id + ".png",
      chefs[chef.id].price,
      chefs[chef.id].speed,
      chefs[chef.id].unlocked,
      chef.id
    );
    chefList.push(newChef);
  }
}
