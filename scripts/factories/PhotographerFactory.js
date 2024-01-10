/**
 * @typedef {Object} PhotographerData
 * @property {number} id
 * @property {string} name
 * @property {string} city
 * @property {string} country
 * @property {string} tagline
 * @property {number} price
 * @property {string} portrait
 */

/**
 * Class representing a Photographer.
 */
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

  /**
   * Photographer's name.
   * @type {string}
   */
  get name () {
    return this._name
  }

  /**
   * Photographer's ID.
   * @type {number}
   */
  get id () {
    return this._id
  }

  /**
   * Photographer's location (formatted as 'city, country').
   * @type {string}
   */
  get location () {
    return `${this._city}, ${this._country}`
  }

  /**
   * Photographer's tagline.
   * @type {string}
   */
  get tagline () {
    return this._tagline
  }

  /**
   * Photographer's price (formatted as 'price €/day').
   * @type {string}
   */
  get price () {
    return `${this._price}€/jour`
  }

  /**
   * Photographer's portrait image path.
   * @type {string}
   */
  get portrait () {
    return (
      window.location.origin +
      '/Fisheye/assets/photographers/Sample_Photos/Photographers_ID_Photos/' +
      `${this._portrait}`
    )
  }
}

/**
 * Factory for creating instances of the Photographer class.
 */
class PhotographerFactory {
  /**
   * Creates an instance of the Photographer class from photographer data.
   * @param {Object} photographerData - Photographer data.
   * @returns {Photographer} Instance of the Photographer class.
   */
  createPhotographer (photographerData) {
    return new Photographer(photographerData)
  }
}
