document.addEventListener("DOMContentLoaded", () => {
  const viewCartBtn = document.getElementById("viewCartBtn");

  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Esperar a que el script del sidebar esté disponible
      if (window.showCartSidebar) {
        await window.showCartSidebar();
      } else {
        // Si no está disponible, esperar un poco y volver a intentar
        setTimeout(async () => {
          if (window.showCartSidebar) {
            await window.showCartSidebar();
          }
        }, 100);
      }
    });
  }
});
