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
    this.$mainContainer = document.querySelector('.main-container')
    this.$main = document.getElementById('main')
    this.$mediaContainer = document.querySelector('.portfolio-section')
    this.$dropdownContainer = document.querySelector('.dropdown-container')
    this.$cardContainer = document.querySelector('.card-container')
    this.$infoBarContainer = document.querySelector('.info-bar-container')
    this.$slideshowDOM = slideshow.createSlideshow()
    this.slideshowCardList = []
    this.clickedIndex = this.currentElement
    this.globalMediaData = null
    this.globalCloneMediaElement = null
    this.slideshowFirstOpen = false
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
      const mediasData = mediaObject.media.map((media) =>
        this.mediaFactory.createMedia(media)
      )
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
    let sortedMedia
    if (sortOption === 'Popularité') {
      sortedMedia = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.likes - a.likes)
      // console.log('1', sortedMedia)
    } else if (sortOption === 'Date') {
      sortedMedia = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.date.localeCompare(a.date))
      // console.log('2', sortedMedia)
    } else if (sortOption === 'Titre') {
      sortedMedia = media
        .filter((media) => media.photographerId === mediaPhotographerId)
        .sort((a, b) => b.title.localeCompare(a.title))
      // console.log('3', sortedMedia)
    }

    // console.log('Sorted Media:', sortedMedia)
    //  console.log(sortOption)

    return sortedMedia
  }

  async displayHeaderData () {
    const photographerId = await this.getPhotographerIdFromUrl()

    // Retrieve photographer data based on the ID
    const photographer = await this.getPhotographerById(photographerId)

    // Instantiating PhotographerTemplate with phothographer object passed in parameters
    const photographerModel = new PhotographerTemplate(photographer)

    // Create the DOM for the detailed photographer information section, including portrait
    const $photographerContainer =
      photographerModel.createPhotographerContainerDOM()

    // Contact Form logic
    const $contactFormDOM = contactForm.createContactForm()
    this.$mainContainer?.appendChild($contactFormDOM)
    // Update the photographer's name in the contact form dynamically
    const $photographerName = document.querySelector('h2.photograph-name')
    if ($photographerName) {
      $photographerName.textContent = photographer._name
    }

    this.$main?.insertBefore($photographerContainer, this.$mediaContainer)
    // Handle interactions with the contact form after inserting the photographer section
    this.handleContactForm(photographerId)
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

  async displayPortfolioData (sortOption = 'Popularité') {
    const photographerId = await this.getPhotographerIdFromUrl()

    // Retrieve photographer data based on the ID
    const photographer = await this.getPhotographerById(photographerId)
    const photographerFirstName = photographer._name
      .split(' ')[0]
      .replace(/-/g, ' ')
    // console.log(photographerFirstName)
    const dropdownData = dropdown.createDropdown()
    this.$dropdownContainer?.appendChild(dropdownData)
    console.log(dropdownData);
    
    // Retrieve and sort media items for the current photographer
    const mediasData = await this.getMediaByPhotographer(
      photographerId,
      sortOption
      )
      const test = dropdown.initDropdown(sortOption)
     console.log('test')
    

    this.$mainContainer?.appendChild(this.$slideshowDOM)

    if (mediasData !== undefined) {
      mediasData.forEach((media) => {
      // Instantiating MediaTemplate with media object passed in parameters.
        const mediaModel = new MediaTemplate(media)
        console.log(mediaModel)
        // Creation of the DOM of the article containing the media and their information.
        const mediaCardDOM = mediaModel.createMediaCardDOM()
        console.log(mediaCardDOM)

        this.$cardContainer?.appendChild(mediaCardDOM)

        // Create a media thumbnail and retrieve information about the media, including
        // the media element (<img> or <video>), its ID, the complete <figure> container,
        // the source URL, alt text, media type (image or video), and video format if applicable.
        const mediaThumbnail = mediaModel.createMediaThumbnail()

        const mediaFullPath =
        window.location.origin +
        '/assets/photographers/Sample_Photos/' +
        photographerFirstName +
        '/' +
        mediaThumbnail.src

        // Media Likes Logic:
        // Obtain information about the likes for the current media using the media model, including the unique media card ID.
        // Find the corresponding media card in the document based on its ID and,
        // if found, handle click events for the likes icon and likes count.
        const mediaLikes = mediaModel.setMediaLikes()
        const mediaCardId = mediaLikes.mediaCardId
        console.log(mediaCardId)
        const $figureMediaCard = document.querySelector(
          '.card-content.' + mediaCardId
        )

        if ($figureMediaCard) {
          const $cardLikesIcon =
          $figureMediaCard.querySelector('.card-likes-icons')
          const $likesElement =
          $figureMediaCard.querySelector('.card-likes-number')
          this.handleLikesClick($cardLikesIcon, $likesElement)
        }

        // Construct a CSS selector to target media elements based on their type and ID
        const mediaSelector = `.${mediaThumbnail.type}-media.${mediaThumbnail?.mediaId}`
        const $mediaList = document.querySelectorAll(mediaSelector)
        // console.log($mediaList)

        $mediaList.forEach((mediaElement) => {
        // Set the source and accessibility attributes for the media element
          mediaElement.src = mediaFullPath
          mediaElement.setAttribute('aria-label', 'image closeup view')
          mediaElement.focus()

          // Clone the clicked media element to create a duplicate for the slideshow
          const cloneMediaElement = mediaElement.cloneNode(false)
          // Add the cloned media element to the slideshowCardList, which keeps track of all media elements.
          this.slideshowCardList.push(cloneMediaElement)
          console.log('cloneMediaElement', cloneMediaElement)

          mediaElement?.addEventListener('click', () => {
          // Extract the unique media ID from the element's class and parse it for further use
            const elementClass = mediaElement.classList[1]
            console.log('elementClass', elementClass)
            const mediaId = parseInt(elementClass.split('-')[1])
            console.log('mediaId', mediaId)

            // Find the index of the clicked media in the mediasData array
            this.clickedIndex = mediasData.findIndex(
              (media) => media._id === mediaId
            )
            console.log('Clicked Index:', this.clickedIndex) // Ajoutez ce log pour voir la valeur de clickedIndex

            // Trigger slideshow actions when a media element is clicked
            slideshow.handleSlideshow(true)
            // this.setElementsSlideshow(cloneMediaElement, media)

            // Set the current element to the index of the media that was clicked
            // This ensures that the slideshow starts from the clicked media and synchronizes
            // with the corresponding index in the mediasData array
            this.currentElement = this.clickedIndex
            console.log('Initial Current Element:', this.currentElement)

            //  this.handleSlideshowPosition(this.slideshowCardList, mediasData, cloneMediaElement)
            console.log('mediasData', mediasData)
          })
        })
      })
    } else {
      console.error('Array is undefined')
    }
    // Instantiate PhotographerTemplate to display photographer information in the info bar
    const photographerModel = new PhotographerTemplate(photographer)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.$infoBarContainer?.appendChild(photographerInfoBar)
    this.setTotalLikes() // Update total likes count
  }

  /**
   * Create a cloned copy of a media element.
   * @param {HTMLElement} mediaElement - The original media element to be cloned.
   * @returns {HTMLElement} - The cloned media element.
   */
  async createCloneElementFromMedia (mediaElement) {
    const cloneMediaElement = mediaElement.cloneNode(true)
    console.log('cloneMediaElement', cloneMediaElement)

    return cloneMediaElement
  }

  /**
   * Display sorted media elements in the slideshow.
   * @param {Array<Promise<HTMLElement>>} sortedMediasPromises - Array of promises representing media elements.
   */
  async displaySortedMedias (sortedMediasPromises) {
    this.slideshowCardList.length = 0

    const promisesArray = Array.from(sortedMediasPromises)

    //  Iterate through an array of promises representing media elements, resolve each promise,
    // create cloned copies of the media elements and add them to the slideshow card list.
    for (const mediaElementPromise of promisesArray) {
      const mediaElement = await mediaElementPromise
      const cloneMediaElement = this.createCloneElementFromMedia(mediaElement)
      this.slideshowCardList.push(cloneMediaElement)
    }
  }

  /**
   * Handle the sorting dropdown selection by updating the displayed portfolio data,
   * changing the sorting dropdown label, and refreshing the displayed media.
   * @param {string} sortOption - The selected sorting option ('popularity', 'date', or 'title').
   */
  async handleSortDropdown (sortOption) {
    this.$cardContainer.innerHTML = ''
    this.$dropdownContainer.innerHTML = ''
    this.$infoBarContainer.innerHTML = ''
    await this.displayPortfolioData(sortOption)
    console.log(sortOption)

    const $sortingDropdown = document.querySelector('.sortingDropdown')
    if ($sortingDropdown) {
      $sortingDropdown.textContent = sortOption
    } else {
      console.error('Unable to find element with class sortingDropdown')
    }

    const mediasPromises = this.getMediaByPhotographer()
    this.displaySortedMedias(mediasPromises)
  }

  /**
   * Handle the click event on media likes icon, toggle the 'liked' class, and update the likes count.
   * @param {Element} $cardLikesIcon - The likes icon element.
   * @param {Element} $likesElement - The element displaying the likes count.
   * @returns {boolean} - The updated like status (true if liked, false otherwise).
   */
  async handleLikesClick ($cardLikesIcon, $likesElement) {
    let isLiked = false

    $cardLikesIcon.addEventListener('click', () => {
      isLiked = !isLiked
      $cardLikesIcon.classList.toggle('liked', isLiked)

      let currentLikes = parseInt($likesElement.textContent)
      currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1
      $likesElement.textContent = currentLikes

      this.setTotalLikes() // Update total likes in the info bar
    })

    return isLiked
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
    $totalLikes.textContent = totalLikes

    return totalLikes
  }

  /**
   * Sets the elements in the slideshow with the provided media element and associated data.
   * @param {Node} cloneMediaElement - The cloned media element to be added to the slideshow.
   * @param {Object} media - The media data associated with the cloned element.
   */
  /* async setElementsSlideshow (cloneMediaElement, media) {
    // console.log('setElementsSlideshow', media)
    // console.log('setElementsSlideshow', cloneMediaElement)
    const $slideshowCard = this.$slideshowDOM.querySelector('figure')
    const $slideshowCardLegend = this.$slideshowDOM.querySelector('figcaption')
    const $slideshowCardTitle = this.$slideshowDOM.querySelector('h3')
    // Remove all child nodes from the slideshow figure
    while ($slideshowCard.firstChild) {
      $slideshowCard.removeChild($slideshowCard.firstChild)
    }
    // Check if cloneMediaElement is a DOM node before adding it to the slideshow
    if (cloneMediaElement instanceof Node) {
      $slideshowCard.appendChild(cloneMediaElement)
      // Update the title in the slideshow with the provided media's title
      if (media) {
        $slideshowCardTitle.textContent = media.title
      }

      if (cloneMediaElement.classList.contains('video-media')) {
        cloneMediaElement.setAttribute('controls', '')
      }
    }
    // console.log('setElementsSlideshow', $slideshowCard)
    // console.log('setElementsSlideshow', $slideshowCardLegend)
    $slideshowCard.appendChild($slideshowCardLegend)
  }

  leftListener () {
    this.handleArrowClick(-1, this.slideshowCardList, this.globalMediaData, this.globalCloneMediaElement)
  }

  rightListener () {
    this.handleArrowClick(1, this.slideshowCardList, this.globalMediaData, this.globalCloneMediaElement)
  }

  /**
 * Handles the position (left or right) in the slideshow and updates the displayed content accordingly.
 * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
 * @param {Media[]} mediasData - List of media data objects.
 * @param {Element} cloneMediaElement - Cloned media element for the slideshow.
 */
  /*  async handleSlideshowPosition (slideshowCardList, mediasData, cloneMediaElement) {
    //   console.log('handleSlideshowPosition', this.slideshowCardList)
    console.log('handleSlideshowPosition', mediasData)
    console.log('handleSlideshowPosition', cloneMediaElement)
    const $leftArrow = this.$slideshowDOM.querySelector('.left-control')
    const $rightArrow = this.$slideshowDOM.querySelector('.right-control')

    this.globalMediaData = mediasData
    this.globalCloneMediaElement = cloneMediaElement

    // if (!this.slideshowFirstOpen) {
    $leftArrow?.removeEventListener('click', this.leftListener.bind(this))
    $rightArrow?.removeEventListener('click', this.rightListener.bind(this))

    this.currentElement = this.clickedIndex

    $leftArrow?.addEventListener('click', this.leftListener.bind(this))
    $rightArrow?.addEventListener('click', this.rightListener.bind(this))

    // this.slideshowFirstOpen = true
    //  }

    document.removeEventListener('keydown', (event) => {
      this.handleKeyboardControls(event, this.slideshowCardList, mediasData, cloneMediaElement)
    })

    document.addEventListener('keydown', (event) => {
      this.handleKeyboardControls(event, this.slideshowCardList, mediasData, cloneMediaElement)
    })

    const closeButton = document.getElementById('close-control')
    closeButton?.addEventListener('click', () => {
      slideshow.handleSlideshow(false)
      this.currentElement = 0
      console.log(this.currentElement);
    })

  }
/*
  /**
   * Handles arrow clicks for slideshow navigation.
   * @param {number} direction - The direction of the navigation (-1 for left, 1 for right).
   * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
   * @param {Media[]} mediasData - List of media data objects.
   * @param {Element} cloneMediaElement - Cloned media element for the slideshow.
   */
  /* async handleArrowClick (direction, slideshowCardList, mediasData, cloneMediaElement) {
  //  console.log('handleArrowClick', direction)
  //  console.log('handleArrowClick', this.slideshowCardList)
  //  console.log('handleArrowClick', mediasData)
    // console.log('handleArrowClick', cloneMediaElement)

    console.log(this.currentElement);
    console.log(this.clickedIndex);fg

    console.log(this.currentElement);
    console.log(this.clickedIndex);

    this.setElementsSlideshow(this.slideshowCardList[this.currentElement], mediasData[this.currentElement], cloneMediaElement)
    this.currentElement = (this.currentElement + direction + mediasData.length) % mediasData.length

    console.log(this.currentElement);
    console.log(this.clickedIndex);

  }

  /**
 * Handles keyboard controls for the slideshow.
 * @param {Element[]} slideshowCardList - List of media elements in the slideshow.
 * @param {Media[]} mediasData - List of media data objects.
 * @param {Element} cloneMediaElement - Cloned media element for the slideshow.
 */
  /* async handleKeyboardControls (event, slideshowCardList, mediasData, cloneMediaElement) {
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
        if (cloneMediaElement.tagName === 'VIDEO') {
          event.preventDefault()
          cloneMediaElement.paused || cloneMediaElement.ended ? cloneMediaElement.play() : cloneMediaElement.pause()
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
*/
  async init () {
    await this.displayHeaderData()
    await this.displayPortfolioData()
  }
}

const portfolio = new Portfolio()
portfolio.init()
