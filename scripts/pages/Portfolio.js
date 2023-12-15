// Importing modules
import PhotographerFactory from '../factories/PhotographerFactory.js'
import PhotographerTemplate from '../templates/PhotographerTemplate.js'
import MediaFactory from '../factories/MediaFactory.js'
import MediaTemplate from '../templates/MediaTemplate.js'
import contactForm from '../utils/contactForm.js'
import dropdown from '../utils/dropdown.js'
import slideshow from '../utils/slideshow.js'

export class Portfolio {
  constructor () {
    this.photographerFactory = new PhotographerFactory()
    this.mediaFactory = new MediaFactory('')
    this.$slideshowDOM = slideshow.createSlideshow()
    this.slideshowCardList = []
    this.clickedIndex = this.currentElement
    this.leftListener = this.leftListener.bind(this)
    this.rightListener = this.rightListener.bind(this)

    this.photographer = null
    this.mediasData = null
    this.sortedMedias = null

    this.$mainContainer = document.querySelector('.main-container')
    this.$main = document.getElementById('main')
    this.$mediaContainer = document.querySelector('.portfolio-section')
    this.$dropdownContainer = document.querySelector('.dropdown-container')
    this.$dropdown = document.querySelector('.dropdown')
    this.$cardContainer = document.querySelector('.card-container')
    this.$infoBarContainer = document.querySelector('.info-bar-container')
  }

  async getPhotographers () {
    try {
      const photographersObject = await fetch('./data/photographers.json').then(
        (response) => response.json()
      )
      // Map each photographer in the JSON data to a photographer object using the factory
      const photographersData = photographersObject.photographers.map(
        (photographer) =>
          this.photographerFactory.createPhotographer(photographer)
      )
      return photographersData
    } catch (error) {
      console.error('Error fetching photographers:', error)
      return []
    }
  }

  async getPhotographerById (photographerId) {
    const photographers = await this.getPhotographers()

    return photographers.find(
      (photographer) => photographer.id === photographerId
    )
  }

  async getMedias (mediaPhotographerId) {
    try {
      const mediaObject = await fetch('./data/photographers.json').then(
        (response) => response.json()
      )
      const mediasData = mediaObject.media.map((media) => {
        media.isLiked = false
        return this.mediaFactory.createMedia(media)
      })
      return mediasData
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON :', error)
      return { media: [] }
    }
  }

  async getMediasByPhotographerId (mediaPhotographerId, sortOption = 'popularity') {
    const medias = await this.getMedias()

    return medias.filter((media) => media.photographerId === mediaPhotographerId)
  }

  findMediaById (sortedMedias, mediaCardId) {
    const mediaIndex = sortedMedias.findIndex(
      (media) => media._id === mediaCardId
    )
    return mediaIndex
  }

  sortMediasByOption (sortOption) {
    let sortedMediasData = []

    if (sortOption === 'Popularité') {
      sortedMediasData = this.mediasData.sort((a, b) => b.likes - a.likes)
    } else if (sortOption === 'Date') {
      sortedMediasData = this.mediasData.sort((a, b) => b.date.localeCompare(a.date))
    } else if (sortOption === 'Titre') {
      sortedMediasData = this.mediasData.sort((a, b) => b.title.localeCompare(a.title))
    }

    return sortedMediasData
  }

  handleClickOption (sortOption) {
    const $sortingDropdown = document.getElementById('sortingDropdown')
    const $popularityButton = document.getElementById('popularity')
    const $dateButton = document.getElementById('date')
    const $titleButton = document.getElementById('title')
    const $dropdown = document.querySelector('.dropdown')

    if ($sortingDropdown) { $sortingDropdown.textContent = sortOption }

    $popularityButton?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.handleSortDropdown('Popularité')
      const newSortOption = 'Popularité'
      $sortingDropdown.textContent = newSortOption
      if ($dropdown?.classList.contains('open')) {
        dropdown.updateButtonContent($popularityButton, $dateButton, $titleButton)
      }
      $dropdown.classList.remove('open')
    })

    $dateButton?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.handleSortDropdown('Date')
      const newSortOption = 'Date'
      $sortingDropdown.textContent = newSortOption
      if ($dropdown?.classList.contains('open')) {
        dropdown.updateButtonContent($dateButton, $titleButton, $popularityButton)
      }
      $dropdown.classList.remove('open')
    })

    $titleButton?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.handleSortDropdown('Titre')
      const newSortOption = 'Titre'
      $sortingDropdown.textContent = newSortOption
      if ($dropdown?.classList.contains('open')) {
        dropdown.updateButtonContent($titleButton, $popularityButton, $dateButton)
      }
      $dropdown.classList.remove('open')
    })

    if ($dropdown) {
      $dropdown.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        $dropdown.classList.toggle('open', true)
      })
    }
  }

  appendChildToParent (parent, child) {
    parent.appendChild(child)
  }

  removeAllChildrenFromParent (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  getTextContent (element) {
    return element.textContent
  }

  setTextContent (element, text) {
    element.textContent = text
  }

  async displayHeaderData () {
    const photographerModel = new PhotographerTemplate(this.photographer)
    const $photographerContainer =
      photographerModel.createPhotographerContainerDOM()

    const $contactFormDOM = contactForm.createContactForm()
    this.appendChildToParent(this.$mainContainer, $contactFormDOM)

    const $photographerName = document.querySelector('h2.photograph-name')
    if ($photographerName) {
      this.setTextContent($photographerName, this.photographer._name)
    }

    this.$main?.insertBefore($photographerContainer, this.$mediaContainer)

    this.handleContactForm(this.photographer._id)
  }

  async handleContactForm (photographerId) {
    const $form = document.querySelector('.contact-form')
    const $contactButton = document.querySelector('.contact-button')
    const $closeButton = document.querySelector('.close-button')
    const $sendButton = document.querySelector('.send-button')

    $contactButton?.addEventListener('click', () => {
      contactForm.handleContactForm()
      this.$mainContainer?.classList.toggle('form-filter')
    })

    $closeButton?.addEventListener('click', () => {
      this.$mainContainer?.classList.toggle('form-filter')
    })

    const getFieldValue = (id) => $form.querySelector(`#${id}`).value

    if ($form) {
      $form.setAttribute(
        'action',
        window.location.origin + '/photographer.html?id=' + photographerId
      )

      $sendButton.addEventListener('click', (event) => {
        event.preventDefault()
        this.$mainContainer?.classList.toggle('form-filter')
        contactForm.handleContactForm()

        const firstNameValue = getFieldValue('firstName')
        const lastNameValue = getFieldValue('lastName')
        const emailValue = getFieldValue('email')
        const messageValue = getFieldValue('message')

        console.log(
          'Prénom:',
          firstNameValue,
          '| Nom:',
          lastNameValue,
          '| Email:',
          emailValue,
          '| Message:',
          messageValue
        )

        $form.reset()
      })
    }
  }

  setMediaFullPaths (src) {
    const photographerFirstName = this.photographer._name
      .split(' ')[0]
      .replace(/-/g, ' ')

    const mediaFullPath =
    window.location.origin +
    '/assets/photographers/Sample_Photos/' +
    photographerFirstName +
    '/' +
    src

    return mediaFullPath
  }

  async displayPortfolioData (sortOption = 'Popularité') {
    const dropdownData = dropdown.createDropdown()
    this.sortedMedias = this.sortMediasByOption(sortOption)
    this.slideshowCardList = this.sortedMedias

    this.appendChildToParent(this.$dropdownContainer, dropdownData)

    this.handleClickOption(sortOption)

    const $slideshowDOM = document.querySelector('.slideshow-modal')
    if (!$slideshowDOM) {
      this.appendChildToParent(this.$mainContainer, this.$slideshowDOM)
    }

    if (this.sortedMedias.length) {
      this.sortedMedias.forEach((media) => {
        const mediaModel = new MediaTemplate(media)
        const mediaCardDOM = mediaModel.createMediaCardDOM()

        this.appendChildToParent(this.$cardContainer, mediaCardDOM)

        const mediaThumbnail = mediaModel.createMediaThumbnail()

        const mediaLikes = mediaModel.setMediaLikes()
        const mediaCardId = mediaLikes.mediaCardId
        const $figureMediaCard = document.querySelector(
          '.card-content.' + mediaCardId
        )
        if ($figureMediaCard) {
          const $cardLikesIcon =
          $figureMediaCard.querySelector('.card-likes-icons')
          const $likesElement =
          $figureMediaCard.querySelector('.card-likes-number')

          this.mapMediaList(mediaThumbnail.type, mediaThumbnail.mediaId, mediaThumbnail.src)
          this.handleLikesClick($cardLikesIcon, $likesElement, this.sortedMedias, mediaCardId, (updatedMediasDataClone, isLiked) => {
            this.sortedMedias = updatedMediasDataClone
          })
        }
      })
    }
    const photographerModel = new PhotographerTemplate(this.photographer)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.appendChildToParent(this.$infoBarContainer, photographerInfoBar)
    this.setTotalLikes()
  }

  mapMediaList (type, mediaId, src) {
    const mediaSelector = `.${type}-media.${mediaId}`
    const $mediaList = document.querySelectorAll(mediaSelector)

    $mediaList.forEach((mediaElement) => {
      mediaElement.src = this.setMediaFullPaths(src)
      mediaElement.setAttribute('aria-label', 'image closeup view')
      mediaElement.focus()
      this.handleClickMedia(mediaElement)
    })
  }

  handleClickMedia (mediaElement) {
    mediaElement?.addEventListener('click', () => {
      const elementClass = mediaElement.classList[1]
      const mediaId = parseInt(elementClass.split('-')[1])

      this.clickedIndex = this.findMediaById(this.sortedMedias, mediaId)

      slideshow.handleSlideshow(true)
      this.setElementsSlideshow(mediaId)

      this.currentElement = this.clickedIndex

      this.handleSlideshowPosition(
        this.slideshowCardList,
        this.sortedMedias
      )
    })
  }

  setElementsSlideshow (mediaId) {
    const $slideshowCard = this.$slideshowDOM.querySelector('figure')
    const $slideshowCardLegend = this.$slideshowDOM.querySelector('figcaption')
    const $slideshowCardTitle = this.$slideshowDOM.querySelector('h3')

    this.removeAllChildrenFromParent($slideshowCard)

    const slide = this.slideshowCardList.find((slide) => slide._id === mediaId)

    let $slideshowElement
    if (slide._video) {
      $slideshowElement = document.createElement('video')
      $slideshowElement.setAttribute('controls', '')
    } else {
      $slideshowElement = document.createElement('img')
    }

    $slideshowElement.src = slide._video ? this.setMediaFullPaths(slide._video) : this.setMediaFullPaths(slide._image)
    $slideshowElement.classList = slide._video ? 'video-media' : 'img-media'
    $slideshowElement.type = slide._video ? 'video/mp4' : ''

    if ($slideshowCardTitle) {
      $slideshowCardTitle.textContent = slide._title
    }

    $slideshowCard?.appendChild($slideshowCardLegend)
    $slideshowCard?.insertBefore($slideshowElement, $slideshowCardLegend)

    return (slide)
  }

  leftListener () {
    this.handleArrowClick(-1)
  }

  rightListener () {
    this.handleArrowClick(1)
  }

  handleSlideshowPosition (
    slideshowCardList,
    sortedMedias
  ) {
    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')

    $leftArrow.removeEventListener('click', this.leftListener)
    $rightArrow.removeEventListener('click', this.rightListener)

    this.currentElement = this.clickedIndex
    $leftArrow.addEventListener('click', this.leftListener)
    $rightArrow.addEventListener('click', this.rightListener)

    document.removeEventListener('keydown', (event) => {
      this.handleKeyboardControls(event, this.slideshowCardList[this.currentElement]._id)
      console.log(event);
    })

    document.addEventListener('keydown', (event) => {
      this.handleKeyboardControls(event, this.slideshowCardList[this.currentElement]._id)
      console.log(event);
    })

    const closeButton = document.getElementById('close-control')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        slideshow.handleSlideshow(false)
        this.currentElement = this.clickedIndex
      })
    }
  }

  async handleArrowClick (
    direction
  ) {
    try {
      if (this.slideshowCardList?.length) {
        this.currentElement = (this.currentElement + direction + this.slideshowCardList.length) % this.slideshowCardList.length

        console.log(this.slideshowCardList[this.currentElement])
        this.setElementsSlideshow(
          this.slideshowCardList[this.currentElement]._id
        )
      }
    } catch (error) {
      console.error(
        'Une erreur est survenue lors de la gestion du clic sur la flèche :',
        error
      )
    }
  }

  async handleKeyboardControls (event, currentElement) {
    console.log('handleKeyboardControls', event)

    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')
    const $slideshow = this.$slideshowDOM
    const slide = this.setElementsSlideshow(this.slideshowCardList[this.currentElement]._id)
    console.log(slide)
    switch (event.key) {
      case 'ArrowLeft':

        $leftArrow.click()
        break
      case 'ArrowRight':

        $rightArrow.click()
        break
      case ' ':
      case 'Space':
        console.log(this.slideshowCardList[this.currentElement])
        if (slide._video !== undefined) {
          event.preventDefault()
          const video = this.$slideshowDOM.querySelector('video')
          console.log(video.paused)
          if (video.paused === true) {
            video.play()
          } else {
            video.pause()
          }
        }
        break
      case 'Escape':
        slideshow.handleSlideshow(false)
        break
    }

    $slideshow.setAttribute('tabindex', '0')
  }

  /**
   * Handle the click event on media likes icon, toggle the 'liked' class, and update the likes count.
   * @param {Element} $cardLikesIcon - The likes icon element.
   * @param {Element} $likesElement - The element displaying the likes count.
   * @returns {boolean} - The updated like status (true if liked, false otherwise).
   */
  handleLikesClick (
    $cardLikesIcon,
    $likesElement,
    sortedMedias,
    mediaCardId,
    callback
  ) {
    // console.log('Inside handleLikesClick before like click', mediasData)
    $cardLikesIcon.addEventListener('click', () => {
      let isLiked = $cardLikesIcon.classList.contains('liked')
      try {
        // Toggle the 'liked' state and toggle the 'liked' class on the icon, depending on whether the card is liked.
        isLiked = !isLiked
        $cardLikesIcon.classList.toggle('liked', isLiked)

        // Update the likes count
        let currentLikes = parseInt(this.getTextContent($likesElement))
        currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1
        this.setTextContent($likesElement, currentLikes.toString())

        this.setTotalLikes() // Update total likes in the info bar

        // Find the index of the media with the matching mediaCardId in mediasData
        const mediaIndex = this.findMediaById(
          sortedMedias,
          parseInt(mediaCardId.split('-')[1])
        )

        if (mediaIndex !== -1) {
          // Update the media data
          sortedMedias[mediaIndex]._isLiked = isLiked
          sortedMedias[mediaIndex]._likes = currentLikes
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
      callback(sortedMedias, isLiked)
    })
  }

  /**
   * Update the total likes count in the info bar by summing up individual likes from all media cards.
   * @returns {number} - The total likes count.
   */
  async setTotalLikes () {
    const $likesList = document.querySelectorAll('.card-likes-number')
    let totalLikes = 0

    $likesList.forEach((likes, index) => {
      const likesValue = parseInt(likes.textContent)
      totalLikes += likesValue
    })

    const $totalLikes = document.querySelector('.likes-number')
    this.setTextContent($totalLikes, totalLikes)

    return totalLikes
  }

  /**
   * Handle the sorting dropdown selection by updating the displayed portfolio data,
   * changing the sorting dropdown label, and refreshing the displayed media.
   * @param {string} sortOption - The selected sorting option ('popularity', 'date', or 'title').
   */
  async handleSortDropdown (sortOption) {
    this.removeAllChildrenFromParent(this.$cardContainer)
    this.removeAllChildrenFromParent(this.$infoBarContainer)
    this.removeAllChildrenFromParent(this.$dropdownContainer)

    await this.displayPortfolioData(sortOption)
    this.slideshowCardList = this.sortedMedias
    // console.log('handleSortDropdown this.sortedMedias', this.sortedMedias)
    // console.log('handleSortDropdown this.slideshowCardList', this.slideshowCardList)
    const $sortingDropdown = document.querySelector('.sortingDropdown')
    if ($sortingDropdown) {
      this.setTextContent($sortingDropdown, sortOption)
    } else {
      console.error('Unable to find element with class sortingDropdown')
    }
  }

  async init (photographerId) {
    this.photographer = await this.getPhotographerById(photographerId)
    this.mediasData = await this.getMediasByPhotographerId(photographerId)
    await this.displayHeaderData()
    await this.displayPortfolioData()
  }
}

const getIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  return parseInt(id) || null
}

const portfolio = new Portfolio()

portfolio.init(getIdFromUrl())
