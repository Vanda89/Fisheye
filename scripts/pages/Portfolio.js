// Importing modules Portfolio.js
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
    this.currentElement = this.clickedIndex

    this.leftListener = this.handleArrowClick.bind(this, -1)
    this.rightListener = this.handleArrowClick.bind(this, 1)
    this.handleKeyboardControls = this.handleKeyboardControls.bind(this)

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
      sortedMediasData = this.mediasData.sort((a, b) => a.title.localeCompare(b.title))
    }

    return sortedMediasData
  }

  handleChoiceOption (sortOption) {
    const $sortingDropdown = document.getElementById('sortingDropdown')
    const $popularityButton = document.getElementById('popularité')
    const $dateButton = document.getElementById('date')
    const $titleButton = document.getElementById('titre')
    const $dropdown = document.querySelector('.dropdown')

    if ($sortingDropdown) { $sortingDropdown.textContent = sortOption }

    const addListenerToOptionButton = (button, option) => {
      button?.addEventListener('click', (event) => {
        event.stopPropagation()
        this.handleSortDropdown(option)
        $sortingDropdown.textContent = option
        $dropdown.classList.remove('open')
      })

      button?.addEventListener('keydown', (event) => {
        event.stopPropagation()
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          this.handleSortDropdown(option)
          $sortingDropdown.textContent = option
          $dropdown.classList.remove('open')
        }
      })
    }

    addListenerToOptionButton($popularityButton, 'Popularité')
    addListenerToOptionButton($dateButton, 'Date')
    addListenerToOptionButton($titleButton, 'Titre')
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

  async displayHeaderData () {
    const photographerModel = new PhotographerTemplate(this.photographer)
    const $photographerContainer =
      photographerModel.createPhotographerContainerDOM()

    const $contactFormDOM = contactForm.createContactForm()
    this.appendChildToParent(this.$mainContainer, $contactFormDOM)

    const $photographerName = document.querySelector('h1.photograph-name')
    if ($photographerName) {
      this.setTextContent($photographerName, this.photographer._name)
    }

    this.$main?.insertBefore($photographerContainer, this.$mediaContainer)

    contactForm.initializeContactFormModal()

    const $form = document.querySelector('.contact-form')
    if ($form) {
      $form.setAttribute(
        'action',
        window.location.origin + '/photographer.html?id=' + this.photographer._id
      )
    }
  }

  async displayPortfolioData (sortOption = 'Popularité') {
    const dropdownData = dropdown.createDropdown()
    this.sortedMedias = this.sortMediasByOption(sortOption)
    this.slideshowCardList = this.sortedMedias

    this.appendChildToParent(this.$dropdownContainer, dropdownData)

    this.handleChoiceOption(sortOption)

    const $sortingDropdown = document.querySelector('.sortingDropdown')

    $sortingDropdown.addEventListener('click', () => {
      dropdown.toggleDropdown(true)
    })

    $sortingDropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        dropdown.toggleDropdown(true)
      }
    })

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

          this.handleMedia(mediaThumbnail.type, mediaThumbnail.mediaId, mediaThumbnail.src)

          this.handleLikes($cardLikesIcon, $likesElement, this.sortedMedias, mediaCardId, (updatedMediasDataClone, isLiked) => {
            this.sortedMedias = updatedMediasDataClone
          }, 'click')

          this.handleLikes($cardLikesIcon, $likesElement, this.sortedMedias, mediaCardId, (updatedMediasDataClone, isLiked) => {
            this.sortedMedias = updatedMediasDataClone
          }, 'keydown')
        }
      })
    }
    const photographerModel = new PhotographerTemplate(this.photographer)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.appendChildToParent(this.$infoBarContainer, photographerInfoBar)
    this.setTotalLikes()
  }

  handleMedia (type, mediaId, src) {
    const mediaSelector = `.${type}-media.${mediaId}`
    const $mediaList = document.querySelectorAll(mediaSelector)

    $mediaList.forEach((mediaElement) => {
      mediaElement.src = this.setMediaFullPaths(src)
      mediaElement.alt = 'Media du photographe ' + this.photographer._name + ' nommé ' + mediaElement.alt
      mediaElement.setAttribute('aria-label', 'Vignette du média ' + mediaElement.alt + '. Cliquez pour ouvrir la vue aggrandie dans le diaporama.')
      mediaElement.setAttribute('tabindex', '0')

      const handleClickMedia = (event) => {
        event.stopPropagation()
        const elementClass = mediaElement.classList[1]
        const mediaId = parseInt(elementClass.split('-')[1])

        this.clickedIndex = this.findMediaById(this.sortedMedias, mediaId)
        this.currentElement = this.clickedIndex

        slideshow.openSlideshow()
        dropdown.toggleDropdown(false)

        this.setElementsSlideshow(mediaId)

        this.handleSlideshowPosition()
      }

      mediaElement.addEventListener('click', handleClickMedia)
      mediaElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          handleClickMedia(event)
        }
      })
    })
  }

  setElementsSlideshow (mediaId) {
    const $slideshowCard = this.$slideshowDOM.querySelector('figure')
    const $slideshowCardLegend = this.$slideshowDOM.querySelector('figcaption')
    const $slideshowCardTitle = this.$slideshowDOM.querySelector('.slideshow-title')

    this.removeAllChildrenFromParent($slideshowCard)

    const slide = this.slideshowCardList.find((slide) => slide._id === mediaId)
    let $slideshowElement
    if (slide._video) {
      $slideshowElement = document.createElement('video')
    } else {
      console.log()
      $slideshowElement = document.createElement('img')
    }

    $slideshowElement.src = slide._video ? this.setMediaFullPaths(slide._video) : this.setMediaFullPaths(slide._image)
    $slideshowElement.classList = slide._video ? 'video-media' : 'img-media'
    $slideshowElement.type = slide._video ? 'video/mp4' : ''
    $slideshowElement.controls = !!slide._video
    $slideshowElement.alt = 'Vue aggrandie du média : ' + slide._title

    if ($slideshowCardTitle) {
      $slideshowCardTitle.textContent = slide._title
    }

    $slideshowCard?.appendChild($slideshowCardLegend)
    $slideshowCard?.insertBefore($slideshowElement, $slideshowCardLegend)

    return (slide)
  }

  handleSlideshowPosition (
  ) {
    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')
    // this.listener = this.handleArrowClick.bind(this, direction)
    $leftArrow.removeEventListener('click', this.leftListener)
    $leftArrow.addEventListener('click', this.leftListener)
    $rightArrow.removeEventListener('click', this.rightListener)
    $rightArrow.addEventListener('click', this.rightListener)

    // this.handleKeyboardControls = this.handleKeyboardControls.bind(this)
    document.removeEventListener('keydown', this.handleKeyboardControls)
    document.addEventListener('keydown', this.handleKeyboardControls)

    const closeButton = document.getElementById('close-control')
    // this.handleCloseClick = this.handleCloseClick.bind(this)
    closeButton.removeEventListener('click', this.handleCloseClick)
    closeButton.addEventListener('click', this.handleCloseClick)
    closeButton.removeEventListener('keydown', this.handleCloseKeydown)
    closeButton.addEventListener('keydown', this.handleCloseKeydown)
  }

  handleArrowClick (
    direction
  ) {
    try {
      if (this.slideshowCardList?.length) {
        this.currentElement = (this.currentElement + direction + this.slideshowCardList.length) % this.slideshowCardList.length
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

  handleCloseClick = (event) => {
    event.stopPropagation()
    slideshow.closeSlideshow()
  }

  handleCloseKeydown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.stopPropagation()
      slideshow.closeSlideshow()
    }
  }

  handleKeyboardControls (event) {
    const currentElement = this.slideshowCardList[this.currentElement]
    event.stopPropagation()

    switch (event.key) {
      case 'ArrowLeft':
        this.leftListener()
        break
      case 'ArrowRight':
        this.rightListener()
        break
      case ' ':
      case 'Space':
        if (currentElement._video !== undefined) {
          event.preventDefault()
          const video = this.$slideshowDOM.querySelector('video')
          if (video.paused || video.ended) {
            video.play()
          } else {
            video.pause()
          }
        }
        break
      case 'Escape':
        slideshow.closeSlideshow()
        break
    }
  }

  /**
   * Handle the click event on media likes icon, toggle the 'liked' class, and update the likes count.
   * @param {Element} $cardLikesIcon - The likes icon element.
   * @param {Element} $likesElement - The element displaying the likes count.
   * @returns {boolean} - The updated like status (true if liked, false otherwise).
   */
  handleLikes (
    $cardLikesIcon,
    $likesElement,
    sortedMedias,
    mediaCardId,
    callback,
    eventType
  ) {
    $cardLikesIcon.addEventListener(eventType, (event) => {
      if (eventType === 'keydown' && event.key !== 'Enter') {
        return
      }

      let isLiked = $cardLikesIcon.classList.contains('liked')
      try {
        isLiked = !isLiked
        $cardLikesIcon.classList.toggle('liked', isLiked)

        let currentLikes = parseInt(this.getTextContent($likesElement))
        currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1
        this.setTextContent($likesElement, currentLikes.toString())

        this.setTotalLikes()

        const mediaIndex = this.findMediaById(
          sortedMedias,
          parseInt(mediaCardId.split('-')[1])
        )

        if (mediaIndex !== -1) {
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
   * Handle the sorting dropdown selection by updating th e displayed portfolio data,
   * changing the sorting dropdown label, and refreshing the displayed media.
   * @param {string} sortOption - The selected sorting option ('popularity', 'date', or 'title').
   */
  async handleSortDropdown (sortOption) {
    this.removeAllChildrenFromParent(this.$cardContainer)
    this.removeAllChildrenFromParent(this.$infoBarContainer)
    this.removeAllChildrenFromParent(this.$dropdownContainer)

    await this.displayPortfolioData(sortOption)
    this.slideshowCardList = this.sortedMedias

    const $sortingDropdown = document.querySelector('.sortingDropdown')
    const $sortMenu = document.getElementById('listbox')

    if ($sortingDropdown) {
      this.setTextContent($sortingDropdown, sortOption)
    } else {
      console.error('Unable to find element with class sortingDropdown')
    }

    dropdown.reorderButtonsBySort(sortOption)
    const $dropdown = document.querySelector('.dropdown')
    if ($dropdown) {
      if ($sortMenu) {
        $sortMenu.setAttribute('aria-activedescendant', sortOption.toLowerCase())
      }
      dropdown.toggleDropdown(false)
    } else {
      console.error('Unable to find element with class dropdown')
    }
  }

  async init (photographerId) {
    this.photographer = await this.getPhotographerById(photographerId)
    this.mediasData = await this.getMediasByPhotographerId(photographerId)
    await this.displayHeaderData()
    await this.displayPortfolioData()
  }
}
