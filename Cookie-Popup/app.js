const tL = gsap.timeline({ defaults:  {duration: 0.75, ease: "power1.out"}})

tL.fromTo('.cookie-container', {scale : 0 }, { scale : 1 , ease: "elastic.out(1, 0.4)", duration: 1.5} )
tL.fromTo('.cookie' , {opacity : 0 , x:-50 , rotation : '-45deg'}, {opacity :1 , x:0 , rotation :'0deg'},'<50%')
tL.fromTo('.text' , { x:30, opacity:0}, {  x:0,opacity :1 }, '<')

tL.fromTo('.cookie' , {y:0 , rotation : '0deg'} , {y:-20 , rotation : '-20deg', yoyo : true , repeat : -1 })
tL.fromTo('#crumbs' , {y:0 ,} , {y:-20 , yoyo : true , repeat : -1} ,'<')


const button = document.querySelector('button')

button.addEventListener('click' , ()=>{
    gsap.to('.cookie-container' , {opacity : 0 , y : 100 , duration : .75 , ease : "power1.out"})
})