'use strict';

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


// btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});




btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect()

  // window. scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY ,
  //   behavior: 'smooth'
  // })

  section1.scrollIntoView({ behavior: 'smooth' })
})





document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault()
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })

  }
})



tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')
  if (!clicked) {
    return
  } else {
    tabs.forEach(t => t.classList.remove('operations__tab--active'))

    tabsContent.forEach(c => c.classList.remove('operations__content--active'))

    clicked.classList.add('operations__tab--active')

  }

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})




const hover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this
      }

    })

    logo.style.opacity = this
  }
}

nav.addEventListener('mouseover', hover.bind(.5))

nav.addEventListener('mouseout', hover.bind(1))

// let coords = section1.getBoundingClientRect()
// window.addEventListener('scroll', function () {

//   if (window.scrollY > coords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky')
//   }
// })


// const obsCallback = function(entries , observer){
//   entries.forEach(entry => {
//     console.log(entry)
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: [0,0.2]
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)



//Observing API for Nav
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height
const stickyNav = function (entries) {
  const [entry] = entries
  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})

headerObserver.observe(header)


//Observing API for All Sections to show it

const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) {
    return
  }
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}



const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: .15,

})

allSections.forEach(function (sec) {
  sectionObserver.observe(sec)
  sec.classList.add('section--hidden')
})


//Observing API for Images Lazy Loading

const imgTarget = document.querySelectorAll('img[data-src]')

const loadImg = function (entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) {
    return
  }

  entry.target.src = entry.target.dataset.src

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)

}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTarget.forEach(img => imgObserver.observe(img))



//working on Create Slider
const slides = document.querySelectorAll('.slide')
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const slider = document.querySelectorAll('.slider')
const dotContainer = document.querySelector('.dots')
let currentSlide = 0
let maxSlide = slides.length

const goToSlide = function (slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`)
}

goToSlide(0)
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0
  } else {
    currentSlide++
  }
  goToSlide(currentSlide)
  activeDot(currentSlide)

}

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1
  } else {
    currentSlide--
  }
  goToSlide(currentSlide)
  activeDot(currentSlide)

}

btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)


document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide()
  } else if (e.key === 'ArrowRight') {
    nextSlide()
  }
})

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset
    goToSlide(slide)
    activeDot(slide)

  }
})

const createDot = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}
createDot()

const activeDot = function (slide) {

  document.querySelectorAll('.dots__dot').forEach(function (dot) {
     dot.classList.remove('dots__dot--active')
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')

  })

}
