var dog, happyDog,database,dogS,foodStock;
var feedme, buyFood, foodObj,hTime ,lastFed ,fedTime;
var form,petName;
var SApp;
var bedroom, garden , washroom;
var currentT;
function preload(){
dog = loadImage("dogImg.png");
happyDog = loadImage("dogImg1.png")
bedroom = loadImage("Bed Room.png");
washroom = loadImage("Wash Room.png");
garden = loadImage("Garden.png");
}
function getTime(){
  lastFed = hour();

  database.ref('/').update({
    "Hour":lastFed
  })
  if(lastFed<12){
    textSize(20);
    fill("black");
    text("Last Fed:"+lastFed+"AM",10,35);
  }
    if(lastFed>12){
      textSize(20);
      fill("black");
      text("Last Fed:"+(lastFed-12)+"PM",10,35);
    }
}
function setup() {
  database = firebase.database();
  createCanvas(800, 500);
  form=new Form();
  dogS = createSprite(600,400,10,10);
  dogS.addImage(dog);
  dogS.scale =0.15
  foodObj = new Food();
 feedMe = createButton();
 buyFood = createButton();
var appRef = database.ref("AppState");
appRef.on("value",function(data){
SApp = data.val();
});

 
 feedMe.position(150,20);
 buyFood.html("Buy More Food");
 buyFood.position(300,20);
 fedTime = database.ref("Hour");
 fedTime.on("value",function(data){
   lastFed = data.val();
 })
 
feedMe.hide();
buyFood.hide();
changeState("start");
updateState("start");
hTime = 60*3600*4;
foodObj.getStock();
currentT = hour();
getTime();
}


function draw() {  
  
 
  if(SApp==="hungry"){
  
feedMe.show();
buyFood.show();
foodObj.display();
 
 
feedMe.mousePressed(function (){
  if(foodStock>0){
    foodObj.deductStock(foodStock);
    foodObj.updateStock(foodStock);
    dogS.addImage(happyDog);
    
    hTime = 60*3600*4;
    
  }
 
},hTime=hTime--,getTime());
if(foodStock!=undefined){
  fill ("black");
  textSize(20);
  text("Food Remaining:"+foodStock,420,35);
 }
 if(foodStock===0){
  text("You have run out of food",200,200);
}
if(hTime>0){
foodObj.display2();
}
if(hTime<=0){
  dogS.addImage(dog);
  text(petName+"'s hungry",100,400);
  changeState("hungry");
  updateState("hungry");
}
  
drawSprites();

buyFood.mousePressed(function (){
  database.ref('/').set({
    "Food":20
  });
  });
  }
  if(SApp==="playing"){
    foodObj.garden();
  }else if(SApp==="inWashRoom"){
    foodObj.washroom();
  }else if(SApp==="bedtime"){
    foodObj.bedroom();
  }
  if(SApp==="start"){
    form.button.mousePressed(function(){
      form.input.hide();
      form.button.hide();
      form.title.hide();
      if( lastFed!==undefined){
        if(currentT===lastFed+1 ){
          changeState("playing");
          updateState("playing");
            }else if(currentT>lastFed+2 && currentT<lastFed+4){
              changeState("inWashRoom");
              updateState("inWashRoom");
            }else if(currentT===lastFed+5){
              changeState("bedtime");
              updateState("bedtime");
            }
           
      }
      if(hTime<=0){
        
        changeState("hungry");
        updateState("hungry");
        
      }
      if(currentT = lastFed){
        changeState("playing");
        updateState("playing");
      }
  });
  displayForm();
}

}
 
 

function displayForm(){
  
    buyFood.hide();
    feedMe.hide();
    background(255);
    form.display();
    petName = form.input.value();
    feedMe.html("Feed "+petName);
  }


function changeState(x){
    database.ref('/').set({
      "AppState":x
    })
}
function updateState(state){
  database.ref('/').update({
"AppState":state
  })
}