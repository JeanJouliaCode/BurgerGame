function startGame() {
  var burger = new Burger();
  var order = document.getElementById("order");
  order.addEventListener(
    "click",
    burger.prepare(
      ["bredBottom", "ketchup", "cheese", "meat", "egg", "tomato", "bredTop"],
      10
    )
  );
}
