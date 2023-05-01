
let imgContainer = document.getElementById('img-container')
let loader = document.getElementById('loader')

let photosArr = []
let ready = false
let imagesLoaded = 0
let totalImg = 0


let count = 15
let apiKey = 'DNCrW_lGPy7plf6lGkrZu9nM5BMqxfpdP_XDuu2ZrdQ'
let APIurl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`


async function getPhotos() {
    try {
        const res = await fetch(APIurl)
        photosArr = await res.json();
        console.log(photosArr)
        displayPhotos()
    } catch (error) {
        console.log(error);
    }


}

getPhotos()


function displayPhotos() {
    imagesLoaded = 0
    totalImg = photosArr.length
    photosArr.forEach((photo) => {
        let item = document.createElement('a')
        // item.setAttribute('href' , photo.links.html)
        // item.setAttribute('target' , '_blank')

        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        })

        let img = document.createElement('img')
        // img.setAttribute('src' , photo.urls.regular)
        // img.setAttribute('alt' , photo.alt_description)
        // img.setAttribute('title' , photo.alt_description)

        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })

        img.addEventListener('load', imageLoaded)

        item.appendChild(img)
        imgContainer.appendChild(item)

    })
}

function setAttributes(ele, attributes) {
    for (let key in attributes) {
        ele.setAttribute(key, attributes[key])
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false
        getPhotos()
    }
})

function imageLoaded() {
    imagesLoaded++
    if (imagesLoaded === totalImg) {
        ready = true
        loader.hidden = true
   
        count = 20

    }


}