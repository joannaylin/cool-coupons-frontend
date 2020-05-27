// Event listeners go here

const mainListeners = () => {
    userBtnListener()
    businessBtnListener()
}

const userBtnListener = () => {
    let userBtn = document.getElementById('userBtn')
    let loginPage = document.getElementById('loginPage')
    let loginPageUser = document.getElementById('loginPageUser')

    userBtn.addEventListener('click', (event) => {
        loginPage.hidden = true
        loginPageUser.hidden = false
    })
}

const businessBtnListener = () => {
    let businessBtn = document.getElementById('businessBtn')
    let loginPage = document.getElementById('loginPage')
    let loginPageBusiness = document.getElementById('loginPageBusiness')

    businessBtn.addEventListener('click', (event) => {
        loginPage.hidden = true
        loginPageBusiness.hidden = false
    })
}

mainListeners()