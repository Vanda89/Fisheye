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
      const photographersData = photographersObject.photographers.map(
        (photographer) =>
          this.photographerFactory.createPhotographer(photographer)
      )
      return photographersData
    } catch (error) {
      console.error('Error fetching photographers:', error)
      return { photographer: [] }
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

  // this.mediasData = await this.getMediasByPhotographerId(photographerId)
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
    const $dropdown = document.querySelector('.dropdown')
    const $sortingDropdown = document.getElementById('sortingDropdown')
    const $popularityButton = document.getElementById('popularité')
    const $dateButton = document.getElementById('date')
    const $titleButton = document.getElementById('titre')

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

    dropdown.initializeDropdown()

    const $slideshowDOM = document.querySelector('.slideshow-modal')
    if (!$slideshowDOM) {
      this.appendChildToParent(this.$mainContainer, this.$slideshowDOM)
    }
    if ($slideshowDOM?.classList.contains('open')) {
      document.removeEventListener('keydown', this.handleKeyboardControls)
    }

    if (this.sortedMedias.length) {
      this.sortedMedias.forEach((media) => {
        const mediaModel = new MediaTemplate(media)
        const mediaCardDOM = mediaModel.createMediaCardDOM()

        this.appendChildToParent(this.$cardContainer, mediaCardDOM)

        const mediaThumbnail = mediaModel.createMediaThumbnail()
        const mediaCardId = mediaThumbnail.mediaId
        const $figureMediaCard = document.querySelector(
          '.card-content.' + mediaCardId
        )
        if ($figureMediaCard) {
          this.handleMediaThumbnail(mediaThumbnail.type, mediaThumbnail.mediaId, mediaThumbnail.src)

          const $likesNumber =
          $figureMediaCard.querySelector('.card-likes-number')
          const $cardLikesIcon =
          $figureMediaCard.querySelector('.card-likes-icons')

          this.handleLikes($likesNumber, $cardLikesIcon, this.sortedMedias, mediaCardId, 'click', (updatedSortedMedias, isLiked) => {
            this.sortedMedias = updatedSortedMedias
          })

          this.handleLikes($likesNumber, $cardLikesIcon, this.sortedMedias, mediaCardId, 'keydown', (updatedSortedMedias, isLiked) => {
            this.sortedMedias = updatedSortedMedias
          })
        }
      })
    }

    const photographerModel = new PhotographerTemplate(this.photographer)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.appendChildToParent(this.$infoBarContainer, photographerInfoBar)
    this.setTotalLikes()
  }

  findMediaById (sortedMedias, mediaCardId) {
    const mediaIndex = sortedMedias.findIndex(
      (media) => media._id === mediaCardId
    )
    return mediaIndex
  }

  handleMediaThumbnail (type, mediaId, src) {
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
        const $slideshow = document.querySelector('.slideshow-modal')
        if ($slideshow.classList.contains('open')) {
          dropdown.toggleDropdown(false)
          this.handleSlideshowPosition()
        }
        this.setElementsSlideshow(mediaId)
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
    $leftArrow.removeEventListener('click', this.leftListener)
    $leftArrow.addEventListener('click', this.leftListener)

    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')
    $rightArrow.removeEventListener('click', this.rightListener)
    $rightArrow.addEventListener('click', this.rightListener)

    document.removeEventListener('keydown', this.handleKeyboardControls)
    document.addEventListener('keydown', this.handleKeyboardControls)

    const closeButton = document.getElementById('close-control')
    closeButton.removeEventListener('click', this.handleCloseEvent)
    closeButton.addEventListener('click', this.handleCloseEvent)
    closeButton.removeEventListener('keydown', this.handleCloseKeydown)
    closeButton.addEventListener('keydown', this.handleCloseKeydown)
  }

  handleArrowClick (
    direction
  ) {
    if (this.slideshowCardList?.length) {
      this.currentElement = (this.currentElement + direction + this.slideshowCardList.length) % this.slideshowCardList.length
      this.setElementsSlideshow(
        this.slideshowCardList[this.currentElement]._id
      )
    }
  }

  handleCloseEvent = (event) => {
    if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === 'Escape'))) {
      event.stopPropagation()
      slideshow.closeSlideshow()
      document.removeEventListener(event.type, this.handleKeyboardControls)
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
   * This function receives two arguments:
   * `updatedSortedMedias`, an array of the updated media objects;
   * `isLiked`, a boolean indicating when the media item is liked.
   * @returns {Object} - An object containing the updated list of media objects with the new likes count and status.
   */
  handleLikes (
    $likesNumber,
    $cardLikesIcon,
    sortedMedias,
    mediaCardId,
    eventType,
    callback
  ) {
    $cardLikesIcon.addEventListener(eventType, (event) => {
      if (eventType === 'keydown' && event.key !== 'Enter') {
        return
      }

      let isLiked = $cardLikesIcon.classList.contains('liked')
      isLiked = !isLiked
      $cardLikesIcon.classList.toggle('liked', isLiked)

      $cardLikesIcon.setAttribute('aria-pressed', isLiked ? 'true' : 'false')

      let currentLikes = parseInt(this.getTextContent($likesNumber))
      currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1
      this.setTextContent($likesNumber, currentLikes.toString())

      this.setTotalLikes()

      const mediaIndex = this.findMediaById(
        sortedMedias,
        parseInt(mediaCardId.split('-')[1])
      )

      if (mediaIndex !== -1) {
        sortedMedias[mediaIndex]._isLiked = isLiked
        sortedMedias[mediaIndex]._likes = currentLikes
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
    }

    dropdown.reorderButtonsBySort(sortOption)
    const $dropdown = document.querySelector('.dropdown')
    if ($dropdown) {
      if ($sortMenu) {
        $sortMenu.setAttribute('aria-activedescendant', sortOption.toLowerCase())
        $sortingDropdown.focus()
      }
    }
  }

  async init (photographerId) {
    this.photographer = await this.getPhotographerById(photographerId)
    this.mediasData = await this.getMediasByPhotographerId(photographerId)
    await this.displayHeaderData()
    await this.displayPortfolioData()

    document.title = 'Fisheye - Portfolio de ' + this.photographer._name
  }
}
