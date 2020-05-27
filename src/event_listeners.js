// Event listeners go here

const mainListeners = () => {
    userBtnListener()
    businessBtnListener()
    createCouponDiv()
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


const createCouponDiv = () => {
    let createCouponBtn = document.getElementById('createCouponBtn')
    createCouponBtn.addEventListener('click', (event) => {
        let couponContainer = document.getElementById("couponContainer");
        let createCouponBtn = document.getElementById('createCouponBtn')
        let newCouponContainer = document.getElementById('newCouponContainer')

        couponContainer.hidden = true
        createCouponBtn.hidden = true
        newCouponContainer.hidden = false
    })
}

mainListeners()