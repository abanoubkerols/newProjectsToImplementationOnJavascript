const jokeEl = document.getElementById('joke')
const jokeBtn = document.getElementById('jokeBtn')

generateJoke()

jokeBtn.addEventListener('click' , generateJoke)

async function generateJoke(){
    const config = {
        headers:  {
            Accept : 'application/json'
          }
    }

    let res = await fetch('https://icanhazdadjoke.com/' , config)

    let data = await res.json()

    jokeEl.innerHTML = data.joke
    
   
}

