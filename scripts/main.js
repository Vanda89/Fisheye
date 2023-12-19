// Vérifiez l'URL de la page
const path = window.location.pathname

if (path.includes('index.html')) {
  // Chargez les scripts nécessaires pour index.html
  import('./pages/App.js').then((module) => {
    // Utilisez les fonctions ou les classes exportées par app.js
    const app = new module.App()
    app.init()
  })
} else if (path.includes('photographer.html')) {
  // Chargez les scripts nécessaires pour photographer.html
  import('./pages/Portfolio.js').then((module) => {
    // Utilisez les fonctions ou les classes exportées par portfolio.js
    const portfolio = new module.Portfolio()
    portfolio.init(getIdFromUrl())
  })
}

const getIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  return parseInt(id) || null
}
