var navMain = document.querySelector(".main-nav");
var navButton = document.querySelectorAll(".main-nav__button");

navMain.classList.remove("main-nav--nojs");

for (var i = 0; i < navButton.length; i++) {
  navButton[i].addEventListener("click", function(evt) {
  evt.preventDefault();
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
  }
  });
};

if (document.querySelector(".slider")) {
  var slider = document.querySelector(".slider");
  var slideBefore = document.querySelector(".slider__item--before");
  var slideAfter = document.querySelector(".slider__item--after");
  var condBefore = document.querySelector(".slider__condition--before");
  var condAfter = document.querySelector(".slider__condition--after");
  var toggle = document.querySelector(".slider__toggle");

  condBefore.addEventListener("click", function(evt) {
    if (slideBefore.classList.contains("slider__item--hidden")) {
      evt.preventDefault();
      slideBefore.classList.remove("slider__item--hidden");
      slideAfter.classList.add("slider__item--hidden");
      toggle.style.left = "10%";
      toggle.style.right = "auto";
    }
  });

  condAfter.addEventListener("click", function(evt) {
    if (slideAfter.classList.contains("slider__item--hidden")) {
      evt.preventDefault();
      slideAfter.classList.remove("slider__item--hidden");
      slideBefore.classList.add("slider__item--hidden");
      toggle.style.right = "10%";
      toggle.style.left = "auto";
    }
  });
};

if (document.querySelector(".form-page")) {
  var form = document.querySelector("form");
  var catName = document.querySelector("[name=cat-name]");
  var catWeight = document.querySelector("[name=cat-weight]");
  var email = document.querySelector("[name=email]");
  var telephone = document.querySelector("[name=telephone]");

  form.addEventListener("submit", function(evt) {
    if (!catName.value || !catWeight.value || !email.value || !telephone.value) {
      evt.preventDefault();
      console.log("Заполните все необходимые поля");
    }
  });
};
