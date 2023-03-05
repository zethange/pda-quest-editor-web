export let feedbacks: any[] = [];

export const addFeedback = (feedback: any) => {
  const newFeedback = {
    id: feedbacks.length + 1,
    ...feedback,
  };

  feedbacks = [...feedbacks, newFeedback];
  console.log("Новый отзыв!");
};
