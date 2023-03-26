const boxes = document.querySelectorAll(".box")

window.addEventListener('scroll' , checkBoxes)

function checkBoxes(){ 
    let triggerBottom =  window.innerHeight -100
    

    boxes.forEach(box =>{
        const boxTop = box.getBoundingClientRect().top
        
        if(boxTop < triggerBottom){
            box.classList.add('show')
         
        }
        else{
            box.classList.remove('show')
        }
        

    })
}