const quoteContainer = document.getElementById("quote-container")
const quoteText = document.getElementById("quote")
const author = document.getElementById("author")
const twitterBtn = document.getElementById("twitter")
const newQuoteBtn = document.getElementById("new-quote")
const loader = document.getElementById('loader')

function showLoading() {
    loader.hidden = false
    quoteContainer.hidden = true
}

function removeLoading() {
    quoteContainer.hidden = false
    loader.hidden = true
}

let apiQuotes = []

async function getQuote() {
    showLoading()
    const apiURL = `https://type.fit/api/quotes`
    try {
        const response = await fetch(apiURL)
        apiQuotes = await response.json()
        newQuote()
    } catch (error) {
        // catch Error here
        console.log(error);
    }
}

function tweetQuote() {
    const twitterURL = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${author.textContent}`

    window.open(twitterURL, '_blank')
}



function newQuote() {
    showLoading()
    let quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)]
    if (!quote.author) {
        author.textContent = "Unknown"
    } else {
        author.textContent = quote.author
    }

    if (quote.text.length > 50) {
        quoteText.classList.add('long-quote')
    } else {
        quoteText.classList.remove('long-quote')
    }
    quoteText.textContent = quote.text
    removeLoading()
}

newQuoteBtn.addEventListener('click', getQuote)
twitterBtn.addEventListener('click', tweetQuote)
getQuote()