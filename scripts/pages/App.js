import PhotographerFactory from '../factories/PhotographerFactory.js'
import PhotographerTemplate from '../templates/PhotographerTemplate.js'

// App.js : Display the list of photographers on the homepage of the website
// and handle the redirection to the portfolio page when clicking on a photographer card
export class App {
  constructor () {
    this.$photographersContainer = document.querySelector(
      '.photographers-section'
    )
    this.photographerFactory = new PhotographerFactory()
  }

  async getPhotographers () {
    try {
      const photographersObject = await fetch('./data/photographers.json').then(
        (photographers) => photographers.json()
      )
      if (
        photographersObject &&
        Array.isArray(photographersObject.photographers)
      ) {
        return {
          photographers: [...photographersObject.photographers]
        }
      } else {
        console.error("Le fichier JSON ne contient pas un tableau d'objets.")
        return { photographers: [] }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du fichier JSON :', error)
      return { photographers: [] }
    }
  }

  async displayData () {
    const photographersData = await this.getPhotographers()

    const photographerInstances = photographersData.photographers.map(
      (photographer) =>
        this.photographerFactory.createPhotographer(photographer)
    )

    photographerInstances.forEach((photographer) => {
      const photographerModel = new PhotographerTemplate(photographer)

      const photographerCardDOM = photographerModel.createPhotographerCardDOM()

      const portfolioLink = photographerCardDOM.querySelector('.portfolio-link')

      portfolioLink.dataset.photographerId = photographer.id

      portfolioLink?.addEventListener('click', (event) => {
        event.stopPropagation()
        event.preventDefault()
        window.location.href = `../../photographer.html?id=${photographer.id}`
      })

      portfolioLink?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.stopPropagation()
          event.preventDefault()
          window.location.href = `../../photographer.html?id=${photographer.id}`
        }
      })

      this.$photographersContainer.appendChild(photographerCardDOM)
    })
  }

  async init () {
    await this.displayData()
  }
}
