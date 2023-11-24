import PhotographerFactory from '../factories/PhotographerFactory.js'
import PhotographerTemplate from '../templates/PhotographerTemplate.js'

class App {
  constructor () {
    this.$photographerContainer = document.querySelector(
      '.photographers-section'
    )

    this.photographerFactory = new PhotographerFactory()
  }

  async getPhotographers () {
    try {
      const photographersObject = await fetch('data/photographers.json').then(
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
    console.log('Photographers Data: ', photographersData)

    const photographerInstances = photographersData.photographers.map(
      (photographerData) =>
        this.photographerFactory.createPhotographer(photographerData)
    )
    console.log('Photographer Instances: ', photographerInstances)

    photographerInstances.forEach((photographer) => {
      const photographerModel = new PhotographerTemplate(photographer)
      console.log('Photographer Model', photographerModel)

      const photographerCardDOM = photographerModel.createPhotographerCardDOM()
      console.log('photographerCardDOM', photographerCardDOM)

      // Sélectionnez le lien dans le DOM
      const portfolioLink = photographerCardDOM.querySelector('.portfolio-link')
      console.log('portfolio link', portfolioLink)

      portfolioLink.dataset.photographerId = photographer.id
      // Ajoutez l'écouteur d'événements au lien existant
      portfolioLink?.addEventListener('click', (event) => {
        event.preventDefault() // Empêche le comportement par défaut du lien

        window.location.href = `../../photographer.html?id=${photographer.id}`// Redirige vers la page du photographe
      })

      this.$photographerContainer.appendChild(photographerCardDOM)
    })
  }

  async init () {
    // Récupère les datas des photographes
    await this.displayData()
  }
}

const app = new App()
app.init()
