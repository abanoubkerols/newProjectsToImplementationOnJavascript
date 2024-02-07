const fromText = document.querySelector('.from-text'),
  toText = document.querySelector('.to-text'),
  exchangeIcon = document.querySelector('.exchange'),
  selectTag = document.querySelectorAll('select'),
  icons = document.querySelectorAll('.row i'),
  translateBtn = document.querySelector('button')

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected
    if (id == 0) {
      if (country_code == 'en-GB') {
        selected = 'selected'
      }
    } else if (id == 1) {
      if (country_code == 'ar-SA') {
        selected = 'selected'
      }
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`
    tag.insertAdjacentHTML('beforeend', option)
  }
})

exchangeIcon.addEventListener('click', () => {
  let tempText = fromText.value
  fromText.value = toText.value
  toText.value = tempText
  let tempLang = selectTag[0].value
  selectTag[0].value = selectTag[1].value
  selectTag[1].value = tempLang
})
fromText.addEventListener('keyup', () => {
  if (fromText.value == '') {
    toText.value = ''
    toText.setAttribute('placeholder', 'Translation')
  }
  if (!fromText.value) translateBtn.setAttribute('disabled', true)
  else translateBtn.removeAttribute('disabled')
})

translateBtn.addEventListener('click', () => {
  let text = fromText.value
  let langCode = selectTag[0].value
  let langCodet = selectTag[1].value
  if (!text) {
    return
  }
  toText.setAttribute('placeholder', 'Translating...')
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${langCode}|${langCodet}`
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText
      data.matches.forEach(data => {
        if (data.id == 0) toText.value = data.translation
      })
    })
})

icons.forEach(icon => {
  icon.addEventListener('click', ({ target }) => {
    if (target.classList.contains('fa-copy')) {
      if (target.id == 'from') {
        navigator.clipboard.writeText(fromText.value)
      } else {
        navigator.clipboard.writeText(toText.value)
      }
    } else {
      let utterance
      if (target.id == 'from') {
        utterance = new SpeechSynthesisUtterance(fromText.value)
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value)
      }
      speechSynthesis.speak(utterance)
    }
  })
})
