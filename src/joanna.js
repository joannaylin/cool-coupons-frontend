// Joanna's script
let currentUser;


// user login
const userLoginForm = document.getElementById("userLoginForm");
userLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userValue = event.target[0].value;

  fetch("http://localhost:3000/users")
    .then((resp) => resp.json())
    .then((users) => {
      users.forEach((user) => {
        if (user.username === userValue) {
          currentUser = user;
          const loginsContainer = document.getElementById("loginsContainer");
          loginsContainer.hidden = true;
          const couponContainer = document.getElementById("couponContainer");
          couponContainer.hidden = false;
          const navbar = document.getElementById("navbar");
          navbar.hidden = false;
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
  const couponCard = `<div>
  <h1>${coupon.name}</h1>
  <h3>${coupon.code}</h3>
  <p>${coupon.expiration_date}</p>
  <p data-id="${coupon.id}">${coupon.likes.length} ${
    coupon.likes.length === 1 ? "Like" : "Likes"
  } <button id="like-btn">Like</button></p>
  </div>`;
  couponContainer.innerHTML += couponCard;
}

// added line 15 above, and line 38, changed line 34, added navbar lines in index.html, added padding-top for body
// 
// new stuff below:

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
});

// navbar sort
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
});

// navbar search
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
});
