/**
 * Helper to smoothly scroll to the booking form in the footer area.
 * Supports auto-selecting a service option and focusing the first input.
 */
export const scrollToBookingForm = (serviceHint?: string) => {
  if (typeof window === "undefined") return;

  const target =
    document.getElementById("booking-form") ||
    document.getElementById("contact");

  if (target) {
    const yOffset = -90;
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });

    // Optional service preselection in intake dropdown
    if (serviceHint) {
      setTimeout(() => {
        const select = document.getElementById("intake-service") as HTMLSelectElement | null;
        if (select) {
          const query = serviceHint.toLowerCase();
          for (let i = 0; i < select.options.length; i++) {
            const optVal = select.options[i].value.toLowerCase();
            const optText = select.options[i].text.toLowerCase();
            if (
              optVal.includes(query) ||
              optText.includes(query) ||
              query.includes(optVal) ||
              (query.includes("aligner") && optVal.includes("aligner")) ||
              (query.includes("rutin") && (optVal.includes("rutin") || optVal.includes("pemeriksaan"))) ||
              (query.includes("pemeriksaan") && optVal.includes("pemeriksaan")) ||
              (query.includes("scaling") && optVal.includes("scaling")) ||
              (query.includes("veneer") && optVal.includes("veneer")) ||
              (query.includes("implan") && optVal.includes("implan")) ||
              (query.includes("anak") && optVal.includes("anak"))
            ) {
              select.selectedIndex = i;
              select.dispatchEvent(new Event("change", { bubbles: true }));
              break;
            }
          }
        }
      }, 250);
    }

    // Auto-focus name field gently once scroll lands
    setTimeout(() => {
      const nameInput = document.getElementById("intake-name") as HTMLInputElement | null;
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    }, 700);
  }
};
