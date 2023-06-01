const db = {
  reviews: [],
};

// export const getAllReviews = () => {
//   return { reviews: db.reviews };
// };

export const findReviewById = (reviewId) => {
  return db.reviews.find((r) => {
    r.id.toString() === reviewId;
  });
};

export const createReview = (review, username) => {
  const newReview = {
    id: Date.now(),
    review: review,
    username: username,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  db.reviews.push(newReview);
  return newReview;
};

export const updateReview = (reviewId, text) => {
  let indexToUpdate = -1;

  const currentReview = db.reviews.find((t, i) => {
    indexToUpdate = i;
    return t.id.toString() === tweetId;
  });

  if (currentReview) {
    db.reviews.splice(indexToUpdate, 1, {
      ...currentReview,
      text: text,
      updatedAt: Date.now(),
    });
    return true;
  }
  return false;
};
