// API fetches go here

const mainAPIFetches = () => {
  userLogin();
  addLike();
  navbarSort();
  navbarSearch();
  businessLogin();
  createCoupon();
  editCoupon();
  deleteCoupon();
};

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

    const formData = {
      name: userValue,
    };

    const formObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    };

    fetch("http://localhost:3000/users", formObj)
      .then((resp) => resp.json())
      .then((user) => {
        currentUser = user;
        loginsContainer.hidden = true;
        couponContainer.hidden = false;
        navbar.hidden = false;
        fetchCoupons();
      });
  });
};

// fetch coupons
const fetchCoupons = () => {
  fetch("http://localhost:3000/coupons")
    .then((resp) => resp.json())
    .then((coupons) => coupons.forEach((coupon) => renderCoupon(coupon)));
};

function renderCoupon(coupon) {
  let couponCard = `
    <div data-id="${coupon.id}">
      <div class="coupon-info-container">
        <h1>${coupon.name}</h1>
        <h3>${coupon.code}</h3>
        <p>${coupon.expiration_date}</p>
        <p data-id="${coupon.id}">${coupon.likes} ${
    coupon.likes === 1 ? "Like" : "Likes"
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
      likeElement.innerHTML = `${
        likeNum + 1
      } Likes <button id="like-btn">Like</button>`;

      const formData = {
        id: currentUser.id,
        coupon_id: couponId,
      };

      const formObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      };

      fetch("http://localhost:3000/likes", formObj)
        .then((resp) => resp.json())
        .then((like) => like);
    }
  });
};

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
            .sort((a, b) => b.likes - a.likes)
            .forEach((coupon) => renderCoupon(coupon))
        );
    }
  });
};

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
          .filter((coupon) =>
            coupon.business.name.toLowerCase().includes(search)
          )
          .forEach((coupon) => renderCoupon(coupon))
      );
  });
};

// business login
const businessLogin = () => {
  let businessLoginForm = document.getElementById("businessLoginForm");
  let loginsContainer = document.getElementById("loginsContainer");
  let couponContainer = document.getElementById("couponContainer");
  let createCouponBtn = document.getElementById("createCouponBtn");
  let validationText = document.getElementById('validationText')

  businessLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    fetch('http://localhost:3000/businesses')
      .then(response => {
        return response.json()
      })
      .then(businesses => {
        businesses.forEach(business => {
          if (business.name === event.target[0].value) {
            currentBusiness = business
            loginsContainer.hidden = true;
            couponContainer.hidden = false;
            createCouponBtn.hidden = false;
            renderBusinessCoupons(business);
          } else {
            validationText.hidden = false
          }
        })
      })
  });
};

// render business coupons
const renderBusinessCoupons = (business) => {
  business.coupons.forEach((coupon) => {
    let couponCard = `
    <div class="coupon-card" data-id="${coupon.id}">
      <h1>${coupon.name}</h1>
      <h3>Code: ${coupon.code}</h3>
      <p>${coupon.likes} Likes</p>
      <p>Exp. date: ${coupon.expiration_date}</p>
      <button class="btn-lg" id="editCouponBtn" data-id="${coupon.id}">Edit Coupon</button>
      <button class="btn-lg" id="deleteCouponBtn" data-id="${coupon.id}">Delete Coupon</button>
    </div>`;
    couponContainer.innerHTML += couponCard;
  });
};

const createCoupon = () => {
  let createCouponBtn = document.getElementById("createCouponBtn");
  let couponContainer = document.getElementById("couponContainer");
  let newCouponContainer = document.getElementById("newCouponContainer");

  let newCouponForm = document.getElementById("newCouponForm");

  newCouponForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newCouponURL = "http://localhost:3000/coupons";

    const formData = {
      name: event.target[0].value,
      code: event.target[1].value,
      expiration_date: event.target[2].value,
      business_id: currentBusiness.id
    };

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
      body: JSON.stringify({coupon: formData}),
    };

    fetch(newCouponURL, configObj)
      .then((response) => {
        return response.json();
      })
      .then((coupon) => {
        createCouponBtn.hidden = false;
        couponContainer.hidden = false;
        newCouponContainer.hidden = true;

        renderBusinessCoupon(coupon);
      });
  });
};

const renderBusinessCoupon = (coupon) => {
  let couponContainer = document.getElementById("couponContainer");

  let couponCard = `
  <div class="coupon-card" data-id="${coupon.id}">
    <h1>${coupon.name}</h1>
    <h3>Code: ${coupon.code}</h3>
    <p>${coupon.likes} Likes</p>
    <p>Exp. date: ${coupon.expiration_date}</p>
    <button class="btn-lg" id="editCouponBtn" data-id="${coupon.id}">Edit Coupon</button>
    <button class="btn-lg" id="deleteCouponBtn" data-id="${coupon.id}">Delete Coupon</button>
  </div>`;
  couponContainer.innerHTML += couponCard;
};

const editCoupon = () => {
  document.addEventListener('click', (event) => {
    if (event.target.id === "editCouponBtn") {
      let createCouponBtn = document.getElementById("createCouponBtn");
      let couponContainer = document.getElementById("couponContainer");
      let editCouponContainer = document.getElementById("editCouponContainer");

      createCouponBtn.hidden = true
      couponContainer.hidden = true
      editCouponContainer.hidden = false
      
      let editBtn = event.target;
      let couponCard = editBtn.parentElement
      let couponId = editBtn.dataset.id

      let editCouponForm = document.getElementById('editCouponForm')

      editCouponForm[0].value = couponCard.firstElementChild.innerText
      editCouponForm[1].value = couponCard.getElementsByTagName('h3')[0].innerText.split(' ')[1]
      editCouponForm[2].value = couponCard.getElementsByTagName('p')[1].innerText.split(' ')[2]

      editCouponForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const editCouponURL = `http://localhost:3000/coupons/${couponId}`

        const formData = {
          name: event.target[0].value,
          code: event.target[1].value,
          expiration_date: event.target[2].value,
          business_id: currentBusiness.id
        }

        const formObj = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json' 
          },
          body: JSON.stringify({coupon: formData})
        }

        fetch(editCouponURL, formObj)
          .then(response => {
            return response.json()
          })
          .then(coupon => {
            createCouponBtn.hidden = false;
            couponCard.remove()
            couponContainer.hidden = false;
            editCouponContainer.hidden = true;

            renderBusinessCoupon(coupon);
          })
      })
    }
  })
}

const deleteCoupon = () => {
  document.addEventListener("click", (event) => {
    if (event.target.id === "deleteCouponBtn") {
      let deleteBtn = event.target;
      let couponCard = deleteBtn.parentElement;
      let couponId = deleteBtn.dataset.id;

      const deleteCouponURL = `http://localhost:3000/coupons/${couponId}`;

      const configObj = {
        method: "DELETE",
      };

      fetch(deleteCouponURL, configObj)
        .then((response) => {
          return response;
        })
        .then(() => {
          couponCard.remove();
        });
    }
  });
};

mainAPIFetches();
