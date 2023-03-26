const tagsEl = document.getElementById('tags')
const textarea = document.getElementById('textarea')

// textarea.focus()

textarea.addEventListener('keyup', (e) => {
    createTags(e.target.value)
    if (e.key == 'Enter') {
        setTimeout(() => {
            e.target.value = ''
        }, 1000)
        randomSelect()
    }
})

function createTags(input) {
    const tags = input.split(',').filter(tag => tag.trim() !== " ").map(tag => tag.trim())

    tagsEl.innerHTML = ''

    tags.forEach(a => {
        const tagEl = document.createElement('span')
        tagEl.classList.add('tag')
        tagEl.innerText = a
        tagsEl.appendChild(tagEl)

    });
}

function randomSelect() {
    const times = 30
    const interval = setInterval(() => {
        const randomTag = pickRandomTag()
        highlightTag(randomTag)

        setTimeout(()=>{
            unghlightTag(randomTag)
        },100)
    }, 100)


    setTimeout(()=>{
        clearInterval(interval)
        
        setTimeout(()=>{
            const randomtag = pickRandomTag() 
            highlightTag(randomtag)
        },100)

    },times * 100)
}



function pickRandomTag() {
    const tags = document.querySelectorAll('.tag')
    return tags[Math.floor(Math.random() * tags.length)]

}

function highlightTag(tag) {
    tag.classList.add('highlight')
}


function unghlightTag(tag) {
    tag.classList.remove('highlight')
}

