document.addEventListener("DOMContentLoaded", () => {
  const viewCartBtn = document.getElementById("viewCartBtn");

  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (window.showCartSidebar) {
        await window.showCartSidebar();
      } else {
        setTimeout(async () => {
          if (window.showCartSidebar) {
            await window.showCartSidebar();
          }
        }, 100);
      }
    });
  }
});
