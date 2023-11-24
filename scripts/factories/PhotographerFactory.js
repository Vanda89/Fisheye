class Photographer {
  constructor (photographers) {
    this._name = photographers.name
    this._id = photographers.id
    this._city = photographers.city
    this._country = photographers.country
    this._tagline = photographers.tagline
    this._price = photographers.price
    this._portrait = photographers.portrait
  }

  get name () { return this._name }

  get id () { return this._id }

  get location () {
    return `${this._city}, ${this._country}`
  }

  get tagline () { return this._tagline }

  get price () {
    return `${this._price}€/jour`
  }

  get portrait () {
    return window.location.origin + '/assets/photographers/Sample_Photos/Photographers_ID_Photos/' + `${this._portrait}`
  }
}

class PhotographerFactory {
  createPhotographer (photographerData) {
    return new Photographer(photographerData)
  }
}

export default PhotographerFactory
