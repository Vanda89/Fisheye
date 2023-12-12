// Importing modules
import PhotographerFactory from '../factories/PhotographerFactory.js'
import PhotographerTemplate from '../templates/PhotographerTemplate.js'
import MediaFactory from '../factories/MediaFactory.js'
import MediaTemplate from '../templates/MediaTemplate.js'
import contactForm from '../utils/contactForm.js'
import dropdown from '../utils/dropdown.js'
import slideshow from '../utils/slideshow.js'

/**
 * Class representing the Photographer Portfolio page.
 */
export class Portfolio {
  constructor () {
    this.photographerFactory = new PhotographerFactory()
    this.mediaFactory = new MediaFactory('')
    this.$slideshowDOM = slideshow.createSlideshow()
    this.slideshowCardList = []
    this.clickedIndex = this.currentElement
    this.globalMediaData = null
    this.leftListener = this.leftListener.bind(this)
    this.rightListener = this.rightListener.bind(this)

    this.photographer = null
    this.mediasData = []
    this.globalMediaElement = null

    this.$mainContainer = document.querySelector('.main-container')
    this.$main = document.getElementById('main')
    this.$mediaContainer = document.querySelector('.portfolio-section')
    this.$dropdownContainer = document.querySelector('.dropdown-container')
    this.$dropdown = document.querySelector('.dropdown')
    this.$cardContainer = document.querySelector('.card-container')
    this.$infoBarContainer = document.querySelector('.info-bar-container')
  }

  /**
   * Extracts the photographer ID from the URL query parameters.
   * @returns {number|null} Extracted photographer ID or null if not found or invalid.
   */
  async getPhotographerIdFromUrl () {
    const urlParams = new URLSearchParams(window.location.search)

    const extractedPhotographerId = urlParams.get('id')

    // Convert the extracted ID to an integer, or return null if it's not a valid number
    return parseInt(extractedPhotographerId, 10) || null
  }

  /**
   * Fetches photographers' data from the 'photographers.json' file.
   * @returns {Array} Array of photographer objects created from the fetched data.
   */
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

  /**
   * Retrieves the details of a photographer by their ID.
   * @param {number} photographerId - The ID of the photographer to retrieve.
   * @returns {Object|null} The photographer object with the specified ID, or null if not found.
   */
  async getPhotographerById (photographerId) {
    // Get the list of all photographers
    const photographers = await this.getPhotographers()

    return photographers.find(
      (photographer) => photographer.id === photographerId
    )
  }

  /**
   * Retrieves media data, including photos and videos.
   * @param {number} mediaPhotographerId - The ID of the photographer whose media is to be retrieved.
   * @returns {Array} Array of media objects associated with the specified photographer.
   */
  async getMedia (mediaPhotographerId) {
    try {
      const mediaObject = await fetch('./data/photographers.json').then(
        (response) => response.json()
      )
      // Map each media item in the JSON data to a media object using the factory
      const mediasData = mediaObject.media.map((media) => {
        // Add isLiked property to media and set it to false
        media.isLiked = false
        // console.log(media);
        return this.mediaFactory.createMedia(media)
      })
      return mediasData
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON :', error)
      return { media: [] }
    }
  }

  /**
   * Asynchronous function to retrieve and sort media items for a given photographer.
   * @param {number} mediaPhotographerId - The photographer ID.
   * @param {string} sortOption - The sorting option: 'popularity', 'date', or 'title'.
   * @returns {Promise<Array>} - A Promise that resolves to an array of sorted media items.
   */
  async getMediaByPhotographer (mediaPhotographerId, sortOption = 'popularity') {
    const media = await this.getMedia()
    // console.log('mediaPhotographerId:', mediaPhotographerId)
    // console.log('All Media:', media)

    // Filter and sort media based on the specified sort option
    let result = []
    if (sortOption === 'Popularité') {
      result = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.likes - a.likes)
      // console.log('1', sortedMedia)
    } else if (sortOption === 'Date') {
      result = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.date.localeCompare(a.date))
      // console.log('2', sortedMedia)
    } else if (sortOption === 'Titre') {
      result = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.title.localeCompare(a.title))
      // console.log('3', sortedMedia)
    }
    console.log(result);
    return result
  }

  /**
   * Appends a child to a parent element.
   * @param {Node} parent - The parent element.
   * @param {Node} child - The child element to be appended.
   */
  appendChildToParent (parent, child) {
    if (!(parent instanceof Node)) {
      console.error('parent must be a Node')
      return
    }
    if (!(child instanceof Node)) {
      console.error('child must be a Node')
      return
    }
    parent.appendChild(child)
  }

  /**
   * Removes all child nodes from a parent node.
   * @param {Node} parent - The parent node.
   */
  removeAllChildrenFromParent (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  /**
   * Gets the text content of an element.
   * @param {Node} element - The element.
   * @return {string} The text content of the element.
   */
  getTextContent (element) {
    if (!(element instanceof Node)) {
      console.error('element must be a Node')
      return
    }
    return element.textContent
  }

  /**
   * Sets the text content of an element.
   * @param {Node} element - The element.
   * @param {string} text - The text content to set.
   * @return {void}
   */
  setTextContent (element, text) {
    if (!(element instanceof Node)) {
      console.error('element must be a Node')
      return
    }
    element.textContent = text
  }

  async handlePhotographersData () {
    const photographerId = await this.getPhotographerIdFromUrl()

    // Retrieve photographer data based on the ID
    this.photographer = await this.getPhotographerById(photographerId)

    console.log(this.photographer)
  }

  async displayHeaderData () {
    console.log(this.photographer)
    // Instantiating PhotographerTemplate with phothographer object passed in parameters
    const photographerModel = new PhotographerTemplate(this.photographer)
    console.log(photographerModel)

    // Create the DOM for the detailed photographer information section, including portrait
    const $photographerContainer =
      photographerModel.createPhotographerContainerDOM()

    // Contact Form logic
    const $contactFormDOM = contactForm.createContactForm()
    this.appendChildToParent(this.$mainContainer, $contactFormDOM)

    // Update the photographer's name in the contact form dynamically
    const $photographerName = document.querySelector('h2.photograph-name')
    if ($photographerName) {
      this.setTextContent($photographerName, this.photographer._name)
    }

    this.$main?.insertBefore($photographerContainer, this.$mediaContainer)

    // Handle interactions with the contact form after inserting the photographer section
    this.handleContactForm(this.photographer._id)
  }

  /**
   * Handles interactions with the contact form.
   * @param {number} photographerId - The ID of the photographer.
   */
  async handleContactForm (photographerId) {
    const $form = document.querySelector('.contact-form')
    const $contactButton = document.querySelector('.contact-button')
    const $closeButton = document.querySelector('.close-button')
    const $sendButton = document.querySelector('.send-button')

    // Open the contact form
    $contactButton?.addEventListener('click', () => {
      contactForm.handleContactForm()
      this.$mainContainer?.classList.toggle('form-filter')
    })
    // Close the contact form
    $closeButton?.addEventListener('click', () => {
      this.$mainContainer?.classList.toggle('form-filter')
    })

    /**
     * Helper function to get the value of a form field by its ID.
     * @param {string} id - The ID of the form field.
     * @returns {string} - The value of the form field.
     */
    const getFieldValue = (id) => $form.querySelector(`#${id}`).value

    if ($form) {
      // Set the form action dynamically
      $form.setAttribute(
        'action',
        window.location.origin + '/photographer.html?id=' + photographerId
      )

      // Add event listener to handle form submission and close the form after dysplaying the form user entries
      $sendButton.addEventListener('click', (event) => {
        event.preventDefault()
        this.$mainContainer?.classList.toggle('form-filter')
        contactForm.handleContactForm()

        // Get values from the form fields
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
    // console.log(photographerFirstName)

    const mediaFullPath =
    window.location.origin +
    '/assets/photographers/Sample_Photos/' +
    photographerFirstName +
    '/' +
    src

    return mediaFullPath
  }

  mapMediaList (type, mediaId, src, media) {
    // Construct a CSS selector to target media elements based on their type and ID
    const mediaSelector = `.${type}-media.${mediaId}`
    // console.log(mediaSelector)
    const $mediaList = document.querySelectorAll(mediaSelector)
    // console.log($mediaList)

    // Iterate through the list of media elements and set the source and accessibility attributes
    $mediaList.forEach((mediaElement) => {
      // Set the source and accessibility attributes for the media element
      mediaElement.src = this.setMediaFullPaths(src)
      mediaElement.setAttribute('aria-label', 'image closeup view')
      mediaElement.focus()

      // Add the cloned media element to the slideshowCardList, which keeps track of all media elements.
      this.slideshowCardList.push(mediaElement)
      // console.log('cloneMediaElement', cloneMediaElement)
      this.handleClickMedia(mediaElement, media)
    })
    // console.log('cool')
    // console.log($mediaList)
  }

  handleClickMedia (mediaElement, media) {
    // Add a click event listener to the media element to trigger the slideshow
    mediaElement?.addEventListener('click', () => {
      // Extract the unique media ID from the element's class and parse it for further use
      const elementClass = mediaElement.classList[1]
      // console.log('elementClass', elementClass)
      const mediaId = parseInt(elementClass.split('-')[1])
      // console.log('mediaId', mediaId)

      // Find the index of the clicked media in the mediasData array
      this.clickedIndex = this.findMediaById(this.mediasData, mediaId)
      // console.log('Clicked Index:', this.clickedIndex) // Ajoutez ce log pour voir la valeur de clickedIndex

      // Trigger slideshow actions when a media element is clicked
      slideshow.handleSlideshow(true)
      this.setElementsSlideshow(mediaElement, media)

      // Set the current element to the index of the media that was clicked
      // This ensures that the slideshow starts from the clicked media and synchronizes
      // with the corresponding index in the mediasData array
      this.currentElement = this.clickedIndex
      // console.log('Initial Current Element:', this.currentElement)

      this.handleSlideshowPosition(
        this.slideshowCardList,
        this.mediasData
      )
      console.log('mediasData', this.slideshowCardList)
      console.log('mediasData', this.mediasData)
    })
  }

  async displayPortfolioData (sortOption = 'Popularité') {
    const dropdownData = dropdown.createDropdown()
    this.appendChildToParent(this.$dropdownContainer, dropdownData)

    console.log(this.photographer._id);
    // Retrieve and sort media items for the current photographer
    dropdown.initDropdown(sortOption)
    console.log('before', this.mediasData);
    this.mediasData = await this.getMediaByPhotographer(
      this.photographer.id,
      sortOption
      )
      console.log(this.mediasData);
      console.log('after', this.mediasData);


    const $slideshowDOM = document.querySelector('.slideshow-modal')
    if (!$slideshowDOM) {
      // Only append the slideshow modal if it doesn't exist yet
      this.appendChildToParent(this.$mainContainer, this.$slideshowDOM)
    }

    if (this.mediasData !== undefined) {
      this.mediasData.forEach((media) => {
        // Instantiating MediaTemplate with media object passed in parameters.
        const mediaModel = new MediaTemplate(media)

        // Creation of the DOM of the article containing the media and their information.
        const mediaCardDOM = mediaModel.createMediaCardDOM(media)
        // console.log(mediaCardDOM)

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
          // console.log($likesElement)

          this.handleLikesClick($cardLikesIcon, $likesElement, this.mediasData, mediaCardId, (updatedMediasDataClone, isLiked) => {
            console.log(updatedMediasDataClone, isLiked)
            this.mediasData = updatedMediasDataClone
          })

          // console.log('After calling handleLikesClick', mediasDataClone)
        }

        const test = this.mapMediaList(mediaThumbnail.type, mediaThumbnail.mediaId, mediaThumbnail.src, media)
        console.log(test)
      })
    } else {
      console.error('Array is undefined')
    }
    // Instantiate PhotographerTemplate to display photographer information in the info bar
    const photographerModel = new PhotographerTemplate(this.photographer)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.appendChildToParent(this.$infoBarContainer, photographerInfoBar)
    this.setTotalLikes() // Update total likes count
  }

  async displaySortedMedias (sortedMediasPromises) {
    this.slideshowCardList.length = 0

    if (!Array.isArray(sortedMediasPromises)) {
      console.error('sortedMediasPromises is not an array')
      return
    }

    const promisesArray = [...sortedMediasPromises]

    //  Iterate through an array of promises representing media elements, resolve each promise,
    // create cloned copies of the media elements and add them to the slideshow card list.
    for (const mediaElementPromise of promisesArray) {
      const mediaElement = await mediaElementPromise
      const cloneMediaElement = this.createCloneMediaElement(mediaElement)
      this.slideshowCardList.push(cloneMediaElement)
    }

    /*   // After displaying the sorted medias...
    const $newFigureMediaCards = document.querySelectorAll('.card-content')
    const likes = this.updateLikesData($newFigureMediaCards, mediasDataClone)
    console.log(likes)
    this.updateLikesData($newFigureMediaCards, mediasDataClone) */
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

    this.handlePhotographersData()
    const mediasData = await this.displayPortfolioData(sortOption)
    // console.log(sortOption)
    // console.log(mediasDataClone);
    console.log(mediasData);

    const $sortingDropdown = document.querySelector('.sortingDropdown')
    if ($sortingDropdown) {
      this.setTextContent($sortingDropdown, sortOption)
    } else {
      console.error('Unable to find element with class sortingDropdown')
    }

    const sortedMediasPromises = mediasData.map((media) =>
      Promise.resolve(media)
    )

    if (!Array.isArray(sortedMediasPromises)) {
      console.error('sortedMediasPromises is not an array')
      return
    }

    await this.displaySortedMedias(sortedMediasPromises)
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
    mediasData,
    mediaCardId,
    callback
  ) {
    let isLiked = false
    // console.log('Inside handleLikesClick before like click', mediasData)
    $cardLikesIcon.addEventListener('click', () => {
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
          mediasData,
          parseInt(mediaCardId.split('-')[1])
        )

        if (mediaIndex !== -1) {
          // Update the media data
          mediasData[mediaIndex]._isLiked = isLiked
          mediasData[mediaIndex]._likes = currentLikes
        }
        console.log(parseInt(mediaCardId.split('-')[1]))
        console.log(mediaIndex)
        console.log(isLiked)
        console.log('Inside handleLikesClick', mediasData[mediaIndex]._isLiked)
        console.log('Inside handleLikesClick', mediasData[mediaIndex]._likes)
        console.log('Inside handleLikesClick', mediasData)
      } catch (error) {
        console.error('An error occurred:', error)
      }
      callback(mediasData, isLiked)
    })
  }

  /**
   * Finds the index of a media item in the given array by its id.
   * @param {Array} mediasData - The array of media items.
   * @param {string} mediaCardId - The ID of the media item.
   * @returns {number} - The index of the media item in the array, or -1 if not found.
   */
  findMediaById (mediasDataClone, mediaCardId) {
    console.log('mediaCardId:', mediaCardId)

    // Check if mediaCardId is a number
    if (typeof mediaCardId !== 'number') {
      console.error('mediaCardId must be a number')
      return -1
    }
    console.log(mediasDataClone)
    const mediaIndex = mediasDataClone.findIndex(
      (media) => media._id === mediaCardId
    )
    console.log('findMediaById mediaIndex:', mediaIndex)
    return mediaIndex
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

  async setElementsSlideshow (mediaElement, media) {
    const $slideshowCard = this.$slideshowDOM.querySelector('figure')
    const $slideshowCardLegend = this.$slideshowDOM.querySelector('figcaption')
    const $slideshowCardTitle = this.$slideshowDOM.querySelector('h3')

    // Remove all child nodes from the slideshow figure
    this.removeAllChildrenFromParent($slideshowCard)

    // Create a new media element for the slideshow
    let slideshowMediaElement
    if (mediaElement.classList.contains('video-media')) {
      slideshowMediaElement = document.createElement('video')
      slideshowMediaElement.setAttribute('controls', '')
    } else {
      slideshowMediaElement = document.createElement('img')
    }
    slideshowMediaElement.src = mediaElement.src
    slideshowMediaElement.classList = mediaElement.classList

    // Add the new media element to the slideshow
    this.appendChildToParent($slideshowCard, slideshowMediaElement)

    // Update the title in the slideshow with the provided media's title
    if (media) {
      this.setTextContent($slideshowCardTitle, media.title)
    } else {
      console.error('mediaElement must be a Node')
      return
    }

    this.appendChildToParent($slideshowCard, $slideshowCardLegend)
  }

  leftListener () {
    this.handleArrowClick(-1)
  }

  rightListener () {
    this.handleArrowClick(1)
  }

  /**
   * Handles the position (left or right) in the slideshow and updates the displayed content accordingly.
   * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
   * @param {Media[]} mediasData - List of media data objects.
   * @param {Element} mediaElement - Cloned media element for the slideshow.
   */
  handleSlideshowPosition (
    slideshowCardList,
    mediasData
  ) {
    //   console.log('handleSlideshowPosition', this.slideshowCardList)
    // console.log('handleSlideshowPosition', mediasData)
    // console.log('handleSlideshowPosition', mediaElement)
    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')

    if (!$leftArrow || !$rightArrow) {
      console.error(
        'Les éléments de contrôle de la diapositive ne sont pas trouvés'
      )
      return
    }

    $leftArrow.removeEventListener('click', this.leftListener)
    $rightArrow.removeEventListener('click', this.rightListener)

    this.currentElement = this.clickedIndex

    $leftArrow.addEventListener('click', this.leftListener)
    $rightArrow.addEventListener('click', this.rightListener)

    document.addEventListener('keydown', (event) => {
      this.handleKeyboardControls(event, this.mediasData, this.slideshowCardList[this.currentElement])
    })

    const closeButton = document.getElementById('close-control')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        slideshow.handleSlideshow(false)
        this.currentElement = 0
      //  console.log(this.currentElement)
      })
    } else {
      console.error("Le bouton de fermeture de la diapositive n'est pas trouvé")
    }
  }

  /**
   * Handles arrow clicks for slideshow navigation.
   * @param {number} direction - The direction of the navigation (-1 for left, 1 for right).
   * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
   * @param {Media[]} mediasData - List of media data objects.
   * @param {Element} mediaElement - Cloned media element for the slideshow.
   */
  async handleArrowClick (
    direction,
    slideshowCardList,
    mediasData,
    mediaElement
  ) {
    //  console.log('handleArrowClick', direction)
    //  console.log('handleArrowClick', this.slideshowCardList)
    //  console.log('handleArrowClick', mediasData)
    // console.log('handleArrowClick', mediaElement)
    try {
      // console.log(this.currentElement)
    //  console.log(this.clickedIndex)

      this.currentElement = (this.currentElement + direction + this.mediasData.length) % this.mediasData.length

      this.setElementsSlideshow(
        this.slideshowCardList[this.currentElement],
        this.mediasData[this.currentElement]
      )

      console.log(this.currentElement)
      console.log(this.clickedIndex)
    } catch (error) {
      console.error(
        'Une erreur est survenue lors de la gestion du clic sur la flèche :',
        error
      )
    }
  }

  /**
   * Handles keyboard controls for the slideshow.
   * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
   * @param {Media[]} mediasData - List of media data objects.
   * @param {Element} cloneMediaElement - Cloned media element for the slideshow.
   */
  async handleKeyboardControls (event, mediasData, slideshowCardList) {
  //  console.log('Before Key Press - Current Element:', this.currentElement)
    console.log('Before Key Press - Media Data:', mediasData[this.currentElement])
    //   const $slideshow = this.$slideshowDOM
    //  console.log('handleKeyboardControls', event)
    //  console.log('handleKeyboardControls', this.slideshowCardList)
    // console.log('handleKeyboardControls', mediasData)
    // console.log('handleKeyboardControls', cloneMediaElement)
    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')
    const $slideshow = this.$slideshowDOM
    switch (event.key) {
      case 'ArrowLeft':
        $leftArrow.click()
        break
      case 'ArrowRight':
        $rightArrow.click()
        break
      case ' ':
      case 'Space':
        if (slideshowCardList.tagName === 'VIDEO') {
          event.preventDefault()
          const video = slideshowCardList
          console.log(video)
          video.paused || video.ended ? video.play() : video.pause()
        }
        break
      case 'Escape':
        slideshow.handleSlideshow(false)
        break
    }
    console.log('After Key Press - Current Element:', this.currentElement)
    console.log('After Key Press - Media Data:', mediasData[this.currentElement])

    $slideshow.setAttribute('tabindex', '0')
    this.setElementsSlideshow(this.slideshowCardList[this.currentElement], mediasData[this.currentElement])
  }

  async init () {
    await this.handlePhotographersData()
    await this.displayHeaderData()
    await this.displayPortfolioData()
  }
}

const portfolio = new Portfolio(

)
portfolio.init()
