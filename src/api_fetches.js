// API fetches go here

const mainAPIFetches = () => {
  userLogin()
  // businessLogin()
}

// user login
const userLogin = () => {
  let userLoginForm = document.getElementById("userLoginForm");
  let loginsContainer = document.getElementById("loginsContainer");
  let couponContainer = document.getElementById("couponContainer");

  userLoginForm.addEventListener("submit", (event) => {

    event.preventDefault();
    let userValue = event.target[0].value;

    fetch("http://localhost:3000/users")
      .then((resp) => resp.json())
      .then((users) => {
        users.forEach((user) => {
          if (user.username === userValue) {
            loginsContainer.hidden = true;
            couponContainer.hidden = false;
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
      </div>
    </div>`;
  couponContainer.innerHTML += couponCard;
}

// business login
// const businessLogin = () => {
//   let businessLoginForm = document.getElementById("businessLoginForm");
//   let loginsContainer = document.getElementById("loginsContainer");
//   let couponContainer = document.getElementById("couponContainer");

//   businessLoginForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     let businessValue = event.target[0].value;

//     fetch("http://localhost:3000/businesses")
//       .then((resp) => resp.json())
//       .then((businesses) => {
//         businesses.forEach((business) => {
//           if (business.name === businessValue) {
//             loginsContainer.hidden = true;
//             couponContainer.hidden = false;
//             renderBusinessCoupons(business);
//           }
//         });
//       });
//   });
// }

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

mainAPIFetches()