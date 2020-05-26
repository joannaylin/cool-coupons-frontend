// Joanna's script
var currentUser;

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
          currentUser = user;
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
  let couponCard = `<div>
  <h1>${coupon.name}</h1>
  <h3>${coupon.code}</h3>
  <p>${coupon.expiration_date}</p>
  <p data-id="${coupon.id}">${coupon.likes.length} ${
    coupon.likes.length === 1 ? "Like" : "Likes"
  } <button>Like</button></p>
  </div>`;
  couponContainer.innerHTML += couponCard;
}

// added line 15 above, and line 38, changed line 34, added navbar lines 54-59 in index.html
// new stuff below:

let couponContainer = document.getElementById("couponContainer");
couponContainer.addEventListener("click", (event) => {
  if (event.target.nodeName === "BUTTON") {
    event.preventDefault();
    let couponId = event.target.parentElement.dataset.id;
    let likeElement = event.target.parentElement;
    let likeNum = parseInt(event.target.parentElement.innerText);
    likeElement.innerHTML = `${likeNum + 1} Likes <button>Like</button>`;

    let formData = {
      id: currentUser.id,
      coupon_id: couponId,
    };

    let formObj = {
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
});
