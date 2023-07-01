const ball = document.querySelector(".ball");
popmotion.animate({
  from: "0px",
  to: "500px",
  repeat: Infinity,
  repeatType: "mirror",
  type: "spring",
  onUpdate(update) {
    console.log("update>>>>>>", update);
    ball.style.left = update;
  },
});
