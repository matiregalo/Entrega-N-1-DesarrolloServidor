const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category") || "all";
const selectedSort = urlParams.get("sort") || "default";
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

if (categoryFilter) {
  categoryFilter.value = selectedCategory;
}
if (sortFilter) {
  sortFilter.value = selectedSort;
}

categoryFilter?.addEventListener("change", function () {
  const category = this.value;
  const url = new URL(window.location.href);

  if (category === "all") {
    url.searchParams.delete("category");
  } else {
    url.searchParams.set("category", category);
  }
  url.searchParams.set("page", "1");

  window.location.href = url.toString();
});

sortFilter?.addEventListener("change", function () {
  const sort = this.value;
  const url = new URL(window.location.href);

  if (sort === "default") {
    url.searchParams.delete("sort");
  } else {
    url.searchParams.set("sort", sort);
  }

  url.searchParams.set("page", "1");

  window.location.href = url.toString();
});

