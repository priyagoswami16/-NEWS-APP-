//getting device's lattitude and logitude

//console.log(navigator.geolocation);

var apiKey = "0f3b8e3fdba197ee3ab57fc1f39d6f66";
var lat;
var long;
const preLoader = document.querySelector('.pre-loader');



navigator.geolocation.getCurrentPosition( (position)=>{
	 lat = position.coords.latitude;
	 long = position.coords.longitude;
    // console.log(lat,long)


fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
.then(res=>{
	res.json()
	.then(data=>{

   //  console.log(data)
     const temp = data.main.temp;
     const city = data.name;
     const dsc = data.weather[0].main;
     const wind = data.wind.speed;

   document.querySelector('header h1 span').textContent = city;
   document.querySelector('header h2 .temp').textContent = Math.round(temp - 273);
    document.querySelector('header .right .weather-info .descript').textContent = dsc;
    document.querySelector('header .right .weather-info .wind').textContent = `${wind} km/h`;


	})
})


})


// set date , months and messges

const months = ['January','February','March','April','May','June','July','August','Sepetember','October','November','December'];
const dateSpan = document.querySelector('.place-info .date');

var message = "hello";

const date = new Date;
const hour = date.getHours();


if( hour >= 0 && hour < 6   ){
    message = "Monring, shin shine !"
}else if( hour >=6  && hour < 12){
    message = "Good Morning "
}else if( hour >=12 && hour < 16){
    message = "Good After Noon"
}else if(hour >=16 && hour <= 20){
    message = "Good Evening"
}else{
    message = "Good Evening";
}
document.querySelector('.wishes').textContent = message;

dateSpan.textContent = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;


 // set time 

function setTime(){

    const timeSpan = document.querySelector('.place-info .time');  
    const date = new Date;

    timeSpan.textContent = date.toLocaleTimeString();

    setTimeout( ()=>{
       setTime();

    },1000 )
}
setTime();


// get the articles

var posts;
var index = 0;

function getArticles(code){
    preLoader.style.display = 'block';
 fetch(`https://newsapi.org/v2/top-headlines?country=${code}&apiKey=1ea1a75da7dd437d8e954ee46e278cc9`)
  .then( res=>{
  	res.json()
  	.then( data=>{
          preLoader.style.display = 'none';
          posts = data.articles;
          console.log(posts);
          putArticles(index);
        
  	})
  	.catch( err=>console.log(err))
  	})

  .catch( err=>console.log(err))
  


}
getArticles("us");


function putArticles(indx){
//console.log(indx)
    if(indx >= 20){
        document.querySelector('#nextPost').setAttribute('disabled','');
        index = 19;
         return;

    }
    else{
        document.querySelector('#nextPost').removeAttribute('disabled');
    }

    if(indx <= -1){
        document.querySelector('#prevPost').setAttribute('disabled','');
        index = 0;
        return;
    }
    else{
        document.querySelector('#prevPost').removeAttribute('disabled');
    }


const post = posts[indx];

if(post.urlToImage){
   document.querySelector('article img').src = 'image/load.svg';
   let img = document.createElement('img');
   img.src = post.urlToImage;
   img.onload = ()=>{
       document.querySelector('article img').src = post.urlToImage;
   }
}else{
    document.querySelector('article img').src ='image/fault.png';
}


console.log(post)
document.querySelector('article h2').innerHTML = post.title;
document.querySelector('article p').innerHTML = post.description;
document.querySelector('article em').textContent = post.author;
document.querySelector('article a').href = post.url;

}

//next post
document.querySelector('#nextPost').onclick =()=>{
  
    index++;
    putArticles(index);
}

document.querySelector('#prevPost').onclick =()=>{
    
    index--;
    putArticles(index);
}


//get articles by country name

const spans = document.querySelectorAll('[data-code]');

spans.forEach( (span)=>{

    span.onclick = ()=>{

        spans.forEach( (sp)=>{
           if(span==sp){
               sp.setAttribute('active','')
           }else{
               sp.removeAttribute('active')
           }
        })

        let code = span.getAttribute('data-code');
        getArticles(code);
        index = 0;
    }
})



// adding touch event

let start;
let end;
window.addEventListener('touchstart',(e)=>{
   // console.log(e);
    start = e.changedTouches[0].clientX;
})

window.addEventListener('touchend',(e)=>{
   // console.log(e);
    end = e.changedTouches[0].clientX;

    if( Math.abs(start - end) >= 20){ 
        
        if(start > end){
          index++;
          putArticles(index);

    }else{
       index--;
       putArticles(index);
    }}
   
})


