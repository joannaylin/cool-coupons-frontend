// API fetches go here

const mainAPIFetches = () => {
  userLogin()
  addLike()
  navbarSort()
  navbarSearch()
  businessLogin()
  createCoupon()
  deleteCoupon()
}

let currentUser;
let currentBusiness;

// user login
const userLogin = () => {
  let userLoginForm = document.getElementById("userLoginForm");
  let loginsContainer = document.getElementById("loginsContainer");
  let couponContainer = document.getElementById("couponContainer");
  const navbar = document.getElementById("navbar");

  userLoginForm.addEventListener("submit", (event) => {

    event.preventDefault();
    let userValue = event.target[0].value;

    fetch("http://localhost:3000/users")
      .then((resp) => resp.json())
      .then((users) => {
        users.forEach((user) => {
          if (user.username === userValue) {
            currentUser = user;
            loginsContainer.hidden = true;
            couponContainer.hidden = false;
            navbar.hidden = false;
            fetchCoupons();
          }
        });
      });
  });
}

// fetch coupons
const fetchCoupons = () => {
  fetch("http://localhost:3000/coupons")
    .then((resp) => resp.json())
    .then((coupons) => coupons.forEach((coupon) => renderCoupon(coupon)));
}

function renderCoupon(coupon) {
  let couponCard = `
    <div data-id="${coupon.id}">
      <div class="coupon-info-container">
        <h1>${coupon.name}</h1>
        <h3>${coupon.code}</h3>
        <p>${coupon.expiration_date}</p>
        <p data-id="${coupon.id}">${coupon.likes.length} ${
          coupon.likes.length === 1 ? "Like" : "Likes"
        } <button id="like-btn">Like</button></p>
      </div>
    </div>`;
  couponContainer.innerHTML += couponCard;
}

// add like to coupon
const addLike = () => {
  const couponContainer = document.getElementById("couponContainer");
  couponContainer.addEventListener("click", (event) => {
    if (event.target.id === "like-btn") {
      event.preventDefault();
      const couponId = event.target.parentElement.dataset.id;
      const likeElement = event.target.parentElement;
      const likeNum = parseInt(event.target.parentElement.innerText);
      likeElement.innerHTML = `${likeNum + 1} Likes <button id="like-btn">Like</button>`;

      const formData = {
        id: currentUser.id,
        coupon_id: couponId,
      };

      const formObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      };

      fetch("http://localhost:3000/likes", formObj)
        .then((resp) => resp.json())
        .then((like) => like);
    }
  })
}


// navbar sort
const navbarSort = () => {
  const navbar = document.getElementById("navbar");
  navbar.addEventListener("click", (event) => {
    if (event.target.id === "sortBtn") {
      event.preventDefault();
      couponContainer.innerHTML = "";

      fetch("http://localhost:3000/coupons")
        .then((resp) => resp.json())
        .then((coupons) =>
          coupons
            .sort((a, b) => b.likes.length - a.likes.length)
            .forEach((coupon) => renderCoupon(coupon))
        );
    }
  })
}

// navbar search
const navbarSearch = () => {
  const navSearch = document.getElementById("navSearch");
  navSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const search = event.target[0].value;
    couponContainer.innerHTML = "";

    fetch("http://localhost:3000/coupons")
      .then((resp) => resp.json())
      .then((coupons) =>
        coupons
          .filter((coupon) => coupon.business.name.toLowerCase().includes(search))
          .forEach((coupon) => renderCoupon(coupon))
      );
  })
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

// render business coupons
const renderBusinessCoupons = (business) => {
  business.coupons.forEach((coupon) => {
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
  });
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



mainAPIFetches()