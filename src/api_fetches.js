// API fetches go here

// user login
let userLoginForm = document.getElementById("userLoginForm");
userLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let userValue = event.target[0].value;

  fetch("http://localhost:3000/users")
    .then((resp) => resp.json())
    .then((users) => {
      users.forEach((user) => {
        if (user.username === userValue) {
          let loginsContainer = document.getElementById("loginsContainer");
          loginsContainer.hidden = true;
          let couponContainer = document.getElementById("couponContainer");
          couponContainer.hidden = false;
          fetchCoupons();
        }
      });
    });
});

// fetch coupons
function fetchCoupons() {
  fetch("http://localhost:3000/coupons")
    .then((resp) => resp.json())
    .then((coupons) => coupons.forEach((coupon) => renderCoupon(coupon)));
}

function renderCoupon(coupon) {
  let couponCard = `<div data-id="${coupon.id}">
  <h1>${coupon.name}</h1>
  <h3>${coupon.code}</h3>
  <p>${coupon.expiration_date}</p>
  </div>`;
  couponContainer.innerHTML += couponCard;
}

// business login
let businessLoginForm = document.getElementById("businessLoginForm");
businessLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let businessValue = event.target[0].value;

  fetch("http://localhost:3000/businesses")
    .then((resp) => resp.json())
    .then((businesses) => {
      businesses.forEach((business) => {
        if (business.name === businessValue) {
          let loginsContainer = document.getElementById("loginsContainer");
          loginsContainer.hidden = true;
          let couponContainer = document.getElementById("couponContainer");
          couponContainer.hidden = false;
          renderBusinessCoupons(business);
        }
      });
    });
});

// render business coupons
function renderBusinessCoupons(business) {
  business.coupons.forEach((coupon) => {
    let couponCard = `<div data-id="${coupon.id}">
    <h1>${coupon.name}</h1>
    <h3>${coupon.code}</h3>
    <p>${coupon.expiration_date}</p>
    </div>`;
    couponContainer.innerHTML += couponCard;
  });
}
