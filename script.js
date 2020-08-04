
var loop;

function changeImage(){
  var imageArray = ["https://tse1.mm.bing.net/th?id=OIP.zIxBq-ME4fezAyO8DNbT5wHaDX&pid=Api&P=0&w=393&h=179", "minecraft.jpeg", "ssbu.png"]
  var transition = document.getElementById("transition");

  var i = 0;

  loop = setInterval(function(){
    if(i == imageArray.length){
      i = 0
    }
    transition.src = imageArray[i]
    i++
  }, 1000)
}

function onMouseOut(){
  clearInterval(loop);
}

transition.addEventListener("mouseover", changeImage)
transition.addEventListener("mouseleave", onMouseOut)


function changeImage1(){
  var imageArray = ["familypic.JPG", "me.png"]
  var transition = document.getElementById("transition1");

  var i = 0;

  loop = setInterval(function(){
    if(i == imageArray.length){
      i = 0
    }
    transition.src = imageArray[i]
    i++
  }, 1000)
}

transition1.addEventListener("mouseover", changeImage1)
transition1.addEventListener("mouseleave", onMouseOut)


function changeImage2(){
  var imageArray = ["https://tse3.mm.bing.net/th?id=OIP.TA7usWSUOqUquT0NZXcQMAHaCr&pid=Api&P=0&w=493&h=179", "https://tse1.mm.bing.net/th?id=OIP.Xj51V-paM7R7RVdzYSsd2wHaDt&pid=Api&P=0&w=363&h=182","https://tse2.mm.bing.net/th?id=OIP.I9LWiWS-6tfvKNL-1fWeWgHaE7&pid=Api&P=0&w=239&h=160"]
  var transition = document.getElementById("transition2");

  var i = 0;

  loop = setInterval(function(){
    if(i == imageArray.length){
      i = 0
    }
    transition.src = imageArray[i]
    i++
  }, 1000)
}

transition2.addEventListener("mouseover", changeImage2)
transition2.addEventListener("mouseleave", onMouseOut)


//function changeImage3() {
//   var transition3 = document.getElementById("transition3");
//   transition3.src = (transition3.src == "https://tse4.mm.bing.net/th?id=OIP._VssQ_l3NXk7O_nv_rNu9gHaDV&pid=Api&P=0&w=354&h=160") ? "https://tse4.mm.bing.net/th?id=OIP.xeYr2OL8VjZO6wSD_LG0XQHaHa&pid=Api&P=0&w=300&h=300" : "https://tse4.mm.bing.net/th?id=OIP._VssQ_l3NXk7O_nv_rNu9gHaDV&pid=Api&P=0&w=354&h=160";
// }


//transition3.addEventListener("mouseover", changeImage3)
// transition3.addEventListener("mouseleave", changeImage3)

function changeImage3(){
  var imageArray = ["https://tse4.mm.bing.net/th?id=OIP._VssQ_l3NXk7O_nv_rNu9gHaDV&pid=Api&P=0&w=354&h=160","https://tse4.mm.bing.net/th?id=OIP.xeYr2OL8VjZO6wSD_LG0XQHaHa&pid=Api&P=0&w=300&h=300","time.png"]
  var transition = document.getElementById("transition3");

  var i = 0;

  loop = setInterval(function(){
    if(i == imageArray.length){
      i = 0
    }
    transition.src = imageArray[i]
    i++
  }, 1000)
}

transition3.addEventListener("mouseover", changeImage3)
transition3.addEventListener("mouseleave", onMouseOut)