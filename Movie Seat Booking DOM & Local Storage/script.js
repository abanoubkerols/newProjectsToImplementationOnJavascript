const container = document.querySelector('.container')
const seats = document.querySelectorAll('.row .seat:not(.occupied)')
const count = document.getElementById('count')
const total = document.getElementById('total')
const movieSelect = document.getElementById('movie')

let ticketPrice = +movieSelect.value
populateUi()
function setMovieData(movieIndex , moviePrice){
    localStorage.setItem('selectedMovieIndex' , movieIndex)
    localStorage.setItem('selectedMoviePrice' , moviePrice)
}


function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected')

    const seatsIndex = [...selectedSeats].map((seat)=>{
        return [...seats].indexOf(seat)

    })

    localStorage.setItem('Selected Seats' , JSON.stringify(seatsIndex))

    const selectedSeatsCount = selectedSeats.length

    count.innerText = selectedSeatsCount
    total.innerText = selectedSeatsCount * ticketPrice
}


function populateUi(){
    const selectedSeats = JSON.parse( localStorage.getItem('Selected Seats'))

    if(selectedSeats!==null && selectedSeats.length>0 ){
        seats.forEach((seat , index)=>{
            if(selectedSeats.indexOf(index)  > -1){
                seat.classList.add('selected')
            }
        })
    }


    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex')
    
    if(selectedMovieIndex !== null){
        movieSelect.selectedIndex = selectedMovieIndex
    }

}
// movie select event 
movieSelect.addEventListener('change',(e)=>{
    ticketPrice  = +e.target.value
    setMovieData(e.target.selectedIndex , e.target.value)
    updateSelectedCount()
})

//seat click event
container.addEventListener('click', (e)=>{
    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied')){
        e.target.classList.toggle('selected')
        updateSelectedCount()
    }
})


updateSelectedCount()