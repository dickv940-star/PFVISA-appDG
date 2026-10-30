(() => {
  "use strict";
  const button = document.getElementById("install-app-btn");
  if (!button) return;

  let installPrompt = null;
  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const showButtonState = () => {
    // Keep the action visible in normal browser mode, even before the
    // browser dispatches beforeinstallprompt (or if it never does).
    button.hidden = false;
    if (isStandalone()) {
      button.textContent = "PFVISA Terpasang";
      button.disabled = true;
      button.title = "PFVISA sudah berjalan sebagai aplikasi.";
    } else {
      button.textContent = "↓ Install Aplikasi";
      button.disabled = false;
      button.title = "Pasang PFVISA sebagai aplikasi di perangkat.";
    }
  };

  showButtonState();
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    showButtonState();
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    showButtonState();
  });

  button.addEventListener("click", async () => {
    if (isStandalone()) {
      showButtonState();
      return;
    }
    if (installPrompt) {
      const promptEvent = installPrompt;
      installPrompt = null;
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          button.textContent = "Menyiapkan aplikasi…";
        } else {
          showButtonState();
        }
      } catch (error) {
        console.warn("PFVISA install prompt failed:", error);
        showInstallHelp();
      }
      return;
    }
    showInstallHelp();
  });

  function showInstallHelp() {
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isEdge = /edg\//i.test(ua);
    const isChrome = /chrome\//i.test(ua) && !isEdge;
    let message;
    if (isIOS) {
      message = 'Untuk memasang PFVISA di iPhone/iPad: buka halaman ini di Safari, ketuk tombol Bagikan, lalu pilih "Add to Home Screen" / "Tambahkan ke Layar Utama".';
    } else if (isEdge) {
      message = 'Untuk memasang PFVISA di Microsoft Edge: buka menu ⋯, lalu pilih Apps > Install this site as an app.';
    } else if (isChrome) {
      message = 'Chrome belum menampilkan dialog instal otomatis. Buka menu ⋮ > Cast, save, and share (atau Simpan dan bagikan) > Install page as app / Install PFVISA. Jika opsi belum ada, muat ulang halaman setelah beberapa saat.';
    } else {
      message = 'Buka menu browser dan cari Install app / Instal aplikasi / Tambahkan ke layar utama. Jika opsi tidak tersedia, coba buka PFVISA melalui Chrome atau Edge versi terbaru.';
    }
    window.alert(message);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("PFVISA service worker registration failed:", error);
      });
    });
  }
})();