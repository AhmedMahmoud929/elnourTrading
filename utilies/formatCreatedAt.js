module.exports = function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};
