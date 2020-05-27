// Isaac's script
var currentBusiness;

const isaacMain = () => {
    businessLogin()
    createCouponDiv()
    createCoupon()
    deleteCoupon()
}

// business login
const businessLogin = () => {
    let businessLoginForm = document.getElementById("businessLoginForm");
    let loginsContainer = document.getElementById("loginsContainer");
    let couponContainer = document.getElementById("couponContainer");
    let createCouponBtn = document.getElementById('createCouponBtn')
  
    businessLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let businessValue = event.target[0].value;
  
      fetch("http://localhost:3000/businesses")
        .then((resp) => resp.json())
        .then((businesses) => {
          businesses.forEach((business) => {
            if (business.name === businessValue) {
              currentBusiness = business
              loginsContainer.hidden = true;
              couponContainer.hidden = false;
              createCouponBtn.hidden = false;

              renderBusinessCoupons(business);
            }
          });
        });
    });
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

const createCoupon = () => {
    let createCouponBtn = document.getElementById('createCouponBtn')
    let couponContainer = document.getElementById("couponContainer");
    let newCouponContainer = document.getElementById('newCouponContainer')

    let newCouponForm = document.getElementById('newCouponForm')

    newCouponForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const newCouponURL = 'http://localhost:3000/coupons'

        const formData = {
            name: event.target[0].value,
            code: event.target[1].value,
            expiration_date: event.target[2].value,
            business_id: currentBusiness.id
        }

        const configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            },
            body: JSON.stringify(formData)
        }

        fetch(newCouponURL, configObj)
            .then(response => {
                return response.json()
            })
            .then(coupon => {
                createCouponBtn.hidden = false
                couponContainer.hidden = false
                newCouponContainer.hidden = true

                renderBusinessCoupon(coupon)

            })
    })
}

const renderBusinessCoupon = (coupon) => {
    let couponContainer = document.getElementById("couponContainer");

    let couponCard = `
    <div class="coupon-card" data-id="${coupon.id}">
      <h1>${coupon.name}</h1>
      <h3>Code: ${coupon.code}</h3>
      <p>${coupon.likes.length} Likes</p>
      <p>Exp. date: ${coupon.expiration_date}</p>
      <button class="btn-lg" id="editCouponBtn">Edit Coupon</button>
      <button class="btn-lg" id="deleteCouponBtn">Delete Coupon</button>
    </div>`;
    couponContainer.innerHTML += couponCard;
}

const deleteCoupon = () => {
    document.addEventListener('click', (event) => {
        if(event.target.id === 'deleteCouponBtn') {
            let deleteBtn = event.target
            let couponCard = deleteBtn.parentElement
            let couponId = couponCard.dataset.id

            const deleteCouponURL = `http://localhost:3000/coupons/${couponId}`

            const configObj = {
                method: 'DELETE'
            }

            fetch(deleteCouponURL, configObj)
            .then(response => {
                return response
            })
            .then(() => {
                couponCard.remove()
            })
        }
    })
}

isaacMain()