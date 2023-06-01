const reviewForm = document.querySelector(".movie-form");
const reviewList = document.querySelector(".movies-list");
const detailsDiv = document.querySelector(".details");

const refreshAllReviews = () => {
  fetch("http://localhost:8000/reviews") // get API
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const html = data.reviews
        .map(
          (review) =>
            `<li class="movie">
              <p>${review.title}</p> 
              <span>Created by: ${review.username}</span>
              <button type="button" class="detail-btn btn btn-warning" data-id="${review.id}">📚Show Details</button>
              <button class="edit-btn btn btn-primary" data-id="${review.id}">✍ Edit Review</button>
              <button class="delete-btn btn btn-danger" data-id="${review.id}">⚠️ Delete Review</button>
            </li>`
        )
        .join("");
      reviewList.innerHTML = html;
      addBtnListeners();
    });
};

let addBtnListeners = () => {
  const editBtns = document.querySelectorAll(".edit-btn");
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const detailBtns = document.querySelectorAll('.detail-btn')

  editBtns.forEach((btn) => {
    btn.addEventListener("click", onEditBtnClick);
  });
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", onDeleteBtnClick);
  });
  detailBtns.forEach((btn) => {
    btn.addEventListener("click", onDetailBtnClick)
  })
};

let onDetailBtnClick = (evt) => {
  const reviewId = evt.target.dataset.id

  fetch(`http://localhost:8000/reviews/${reviewId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.json()
    })
    .then((review) => {
      let html = `
        <h3>Review Details👇</h3>
        <p>ID: ${review.id}</p>
        <p>title: ${review.title}</p>
        <p>createdAt: ${review.createdAt}</p>
        <p>updatedAt: ${review.updatedAt}</p>
      `
      detailsDiv.innerHTML = html
    })
    .catch((e) => console.error("err"))
}

let onEditBtnClick = (evt) => {
  let reviewId = evt.target.dataset.id;
  let updatedReview = prompt("Enter a new review");

  if (updatedReview) {
    fetch(`http://localhost:8000/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: updatedReview }),
    })
      .then((res) => {
        if (res.ok) {
          refreshAllReviews();
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .catch((e) => console.error("error:", e));
  }
};

let onDeleteBtnClick = (evt) => {
  let reviewId = evt.target.dataset.id;

  fetch(`http://localhost:8000/reviews/${reviewId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        refreshAllReviews();
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    })
    .catch((e) => console.error("error:", e));
};

const insertOneReview = (newReview) => {
  const htmlElement = `<li class="movie">
      <p>Movie Reviews: ${newReview.title}</p> 
      <span>Created by: ${newReview.username}</span>
      <button type="button" class="detail-btn btn btn-warning">📚Show Details</button>
      <button class="edit-btn" data-id="${newReview.id}">✍Edit Review</button>
      <button class="delete-btn" data-id="${newReview.id}">⚠️Delete Review</button>
    </li>`;
  reviewList.insertAdjacentHTML("afterbegin", htmlElement); // insert at beginning of the list
};

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newReview = {
    // get text, username from input form
    title: e.currentTarget.movie.value,
    username: e.currentTarget.username.value,
  };

  fetch("http://localhost:8000/reviews", {
    method: "POST",
    headers: {
      // include header for json within body
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newReview), // return in string
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      e.target.reset(); // remove fields from form
      insertOneReview(newReview); // call insert
      refreshAllReviews()
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

refreshAllReviews();