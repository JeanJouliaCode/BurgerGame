var burger;

function startGame() {
  burger = new Burger();
  burger.init();
}

function generateCommand() {
  console.log("click");
  burger.prepare(
    [
      "plate",
      "bredBottom",
      "ketchup",
      "cheese",
      "meat",
      "pickle",
      "tomato",
      "bredTop"
    ],
    50
  );
}