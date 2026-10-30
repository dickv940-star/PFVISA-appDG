(() => {
  "use strict";
  const button = document.getElementById("install-app-btn");
  if (!button) return;

  let installPrompt = null;
  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const syncButton = () => {
    button.hidden = isStandalone();
  };

  syncButton();
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    syncButton();
    button.textContent = "Aplikasi Terpasang";
    button.disabled = true;
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    syncButton();
  });

  button.addEventListener("click", async () => {
    if (isStandalone()) {
      syncButton();
      return;
    }
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installPrompt = null;
      if (choice && choice.outcome === "accepted") {
        button.textContent = "Menyiapkan aplikasi…";
      }
      return;
    }

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const message = isIOS
      ? 'Untuk memasang PFVISA di iPhone/iPad: ketuk tombol Bagikan di Safari, lalu pilih "Add to Home Screen" / "Tambahkan ke Layar Utama".'
      : 'Jika opsi instal belum muncul, buka menu browser (⋮ atau ⋯), lalu pilih "Install app", "Instal aplikasi", atau "Tambahkan ke layar utama".';
    window.alert(message);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("PFVISA service worker registration failed:", error);
      });
    });
  }
})();