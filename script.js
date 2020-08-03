
function changeImage() {
  var transition = document.getElementById("transition");
  // document.getElementById("transition").style.transition = "all 2s";
  transition.src = (transition.src == "https://tse1.mm.bing.net/th?id=OIP.zIxBq-ME4fezAyO8DNbT5wHaDX&pid=Api&P=0&w=393&h=179") ? "minecraft.jpeg" : "ssbu.png";
}

transition.addEventListener("mouseover", changeImage)

function changeImage1() {
  var transition1 = document.getElementById("transition1");
  // document.getElementById("transition1").style.transition = "all 2s";
  transition1.src = (transition1.src == "familypic.JPG") ? "me.png" : "familypic.JPG";
}

transition1.addEventListener("mouseover", changeImage1)
transition1.addEventListener("mouseleave", changeImage1)


function changeImage2() {
  var transition2 = document.getElementById("transition2");
  // document.getElementById("transition2").style.transition = "all 2s";
  transition2.src = (transition2.src == "https://tse3.mm.bing.net/th?id=OIP.TA7usWSUOqUquT0NZXcQMAHaCr&pid=Api&P=0&w=493&h=179") ? "https://tse1.mm.bing.net/th?id=OIP.Xj51V-paM7R7RVdzYSsd2wHaDt&pid=Api&P=0&w=363&h=182" : "https://tse3.mm.bing.net/th?id=OIP.TA7usWSUOqUquT0NZXcQMAHaCr&pid=Api&P=0&w=493&h=179";
}

transition2.addEventListener("mouseover", changeImage2)
transition2.addEventListener("mouseleave", changeImage2)


function changeImage3() {
  var transition3 = document.getElementById("transition3");
  // document.getElementById("transition3").style.transition = "all 2s";
  transition3.src = (transition3.src == "https://tse4.mm.bing.net/th?id=OIP._VssQ_l3NXk7O_nv_rNu9gHaDV&pid=Api&P=0&w=354&h=160") ? "https://tse4.mm.bing.net/th?id=OIP.xeYr2OL8VjZO6wSD_LG0XQHaHa&pid=Api&P=0&w=300&h=300" : "https://tse4.mm.bing.net/th?id=OIP._VssQ_l3NXk7O_nv_rNu9gHaDV&pid=Api&P=0&w=354&h=160";
}

transition3.addEventListener("mouseover", changeImage3)
transition3.addEventListener("mouseleave", changeImage3)