// Mettre le code JavaScript lié à la page photographer.html
import PhotographerFactory from '../factories/PhotographerFactory.js'
import PhotographerTemplate from '../templates/PhotographerTemplate.js'
import MediaFactory from '../factories/MediaFactory.js'
import MediaTemplate from '../templates/MediaTemplate.js'
import contactForm from '../utils/contactForm.js'
import dropdown from '../utils/dropdown.js'

class Portfolio {
  constructor () {
    this.photographerFactory = new PhotographerFactory()
    this.mediaFactory = new MediaFactory('')
    this.$mainContainer = document.querySelector('.main-container')
    this.$headerContainer = document.getElementById('main')
    this.$mediaContainer = document.querySelector('.portfolio-section')
    this.$dropdownContainer = document.querySelector('.dropdown-container')
    this.$cardContainer = document.querySelector('.card-container')
    this.$infoBarContainer = document.querySelector('.info-bar-container')
  }

  async getPhotographerIdFromUrl () {
    const urlParams = new URLSearchParams(window.location.search)

    const extractphotographerId = urlParams.get('id')

    return parseInt(extractphotographerId, 10)
  }

  async getPhotographers () {
    try {
      const photographersObject = await fetch('./data/photographers.json').then(response => response.json())
      const photographersData = photographersObject.photographers.map(photographer =>
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

    return photographers.find(photographer => photographer.id === photographerId)
  }

  async getMedia (mediaPhotographerId) {
    try {
      const mediaObject = await fetch('./data/photographers.json').then((response) => response.json())

      const mediasData = mediaObject.media.map(media => this.mediaFactory.createMedia(media))
      return mediasData
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON :', error)
      return { media: [] }
    }
  }

  async getMediaByPhotographer (mediaPhotographerId) {
    const mediaPhotographId = await this.getPhotographerIdFromUrl()
    const media = await this.getMedia()
    return media.filter(media => media.photographerId === mediaPhotographId)
  }

  async displayHeaderData () {
    const photographerId = await this.getPhotographerIdFromUrl()
    const photographerData = await this.getPhotographerById(photographerId)
    const photographerModel = new PhotographerTemplate(photographerData)
    const photographerHeaderDOM = photographerModel.createPhotographerHeaderDOM()
    const contactFormDOM = contactForm.createContactForm()

    this.$mainContainer?.appendChild(contactFormDOM)

    const photographerName = document.querySelector('.photograph-name')
    if (photographerName) {
      photographerName.textContent = photographerData._name
    }

    this.$headerContainer?.insertBefore(photographerHeaderDOM, this.$mediaContainer)
  }

  async displayPortfolioData () {
    const photographerId = await this.getPhotographerIdFromUrl()
    const photographerData = await this.getPhotographerById(photographerId)
    const photographerFirstName = photographerData._name.split(' ')[0].replace(/-/g, ' ')
    // console.log(photographerFirstName)

    const dropdownData = dropdown.createDropdown()
    this.$dropdownContainer?.appendChild(dropdownData)

    const mediasData = await this.getMediaByPhotographer()
    console.log(mediasData)

    mediasData.forEach((media) => {
      const mediaModel = new MediaTemplate(media)
      const mediaCardDOM = mediaModel.createMediaCardDOM()
      const mediaThumbnail = mediaModel.createMediaThumbnail()
      const mediaFullPath = window.location.origin + '/assets/photographers/Sample_Photos/' + photographerFirstName + '/' + mediaThumbnail.src

      this.$cardContainer?.appendChild(mediaCardDOM)

      if (mediaThumbnail.type === 'img') {
        const $images = document.querySelectorAll('.img-media.' + mediaThumbnail.mediaId)
        $images.forEach((img) => {
          img.src = mediaFullPath.trim()
        })
      } else if (mediaThumbnail.type === 'video') {
        const $videos = document.querySelectorAll('.video-media.' + mediaThumbnail.mediaId)
        $videos.forEach((video) => {
          video.src = mediaFullPath
        })
      }
      const mediaLikes = mediaModel.setMediaLikes()
      const mediaCardId = mediaLikes.mediaCardId

      const figure = document.querySelector('.card-content.' + mediaCardId)

      if (figure) {
        const $cardLikesIcon = figure.querySelector('.card-likes-icons')
        const $likesElement = figure.querySelector('.card-likes-number')
        this.handleLikesClick($cardLikesIcon, $likesElement)
      }
    })

    const photographerModel = new PhotographerTemplate(photographerData)
    const photographerInfoBar = photographerModel.createPhotographerInfoBar()
    this.$infoBarContainer?.appendChild(photographerInfoBar)
    this.setTotalLikes()
  }

  async handleLikesClick ($cardLikesIcon, $likesElement) {
    let isLiked = false

    $cardLikesIcon.addEventListener('click', () => {
      isLiked = !isLiked
      let currentLikes = parseInt($likesElement.textContent)
      currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1
      $likesElement.textContent = currentLikes
      $cardLikesIcon.classList.toggle('liked', isLiked)
      this.setTotalLikes()
    })
  }

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


  async init () {
    await this.displayHeaderData()
    await this.getMediaByPhotographer()
    await this.displayPortfolioData()
  }
}

const portfolio = new Portfolio()
portfolio.init()
