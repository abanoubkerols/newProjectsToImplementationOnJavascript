const labels = document.querySelectorAll('.form-control label')

labels.forEach(label =>{
    label.innerHTML = label.innerText
    .split('')
    .map((latter , idx ) => `<span style="transition-delay:${idx * 50 }ms">${latter}</span>`)
    .join('')

})