(() => {
  const navbar = document.querySelector(".site-navbar");
  const navCollapse = document.querySelector("#mainNav");
  const year = document.querySelector("#year");
  const filters = document.querySelectorAll(".rate-filter");
  const cards = document.querySelectorAll(".rate-card");
  const reveals = document.querySelectorAll(".reveal");
  const profileImages = document.querySelectorAll(".js-profile-img");

  const PROFILE_CACHE_KEY = "natasha-profile-image-v1";
  const PROFILE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  const PROFILE_FALLBACK = "assets/profile.jpg";

  const PROFILE_SOURCES = [
    {
      name: "threads",
      endpoint:
        "https://api.microlink.io/?url=" +
        encodeURIComponent("https://www.threads.com/@natashastella_") +
        "&meta=true",
    },
    {
      name: "tiktok",
      endpoint:
        "https://api.microlink.io/?url=" +
        encodeURIComponent("https://www.tiktok.com/@natashastella_") +
        "&meta=true",
    },
    {
      name: "instagram",
      endpoint:
        "https://api.microlink.io/?url=" +
        encodeURIComponent("https://www.instagram.com/natashastella_/") +
        "&meta=true",
    },
  ];

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const backTopFab = document.querySelector("#back-top-fab");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#top");
  };

  document.querySelectorAll(".logo").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href !== "#top") return;
      event.preventDefault();
      scrollToTop();
    });
  });

  backTopFab?.addEventListener("click", scrollToTop);

  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    if (navbar) navbar.classList.toggle("is-scrolled", scrolled);

    if (backTopFab) {
      backTopFab.hidden = false;
      backTopFab.classList.toggle("is-visible", scrolled);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navCollapse && window.bootstrap) {
    navCollapse.addEventListener("show.bs.collapse", () => {
      navbar?.classList.add("menu-open");
    });

    navCollapse.addEventListener("hidden.bs.collapse", () => {
      navbar?.classList.remove("menu-open");
    });

    navCollapse.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        const instance = bootstrap.Collapse.getInstance(navCollapse);
        if (instance && navCollapse.classList.contains("show")) {
          instance.hide();
        }
      });
    });
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      cards.forEach((card) => {
        const type = card.dataset.type;
        const show = filter === "all" || type === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const readProfileCache = () => {
    try {
      const raw = localStorage.getItem(PROFILE_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.url || !parsed?.expiresAt) return null;
      if (Date.now() > parsed.expiresAt) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const writeProfileCache = (url, source) => {
    try {
      localStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify({
          url,
          source,
          expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
        })
      );
    } catch {
      // ignore
    }
  };

  const clearProfileCache = () => {
    try {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    } catch {
      // ignore
    }
  };

  const applyProfileImage = (url) => {
    profileImages.forEach((img) => {
      if (img.dataset.currentProfile === url) return;
      img.dataset.currentProfile = url;
      img.src = url;
    });
  };

  const fetchImageFromSource = async (source) => {
    const response = await fetch(source.endpoint, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;

    const payload = await response.json();
    const imageUrl = payload?.data?.image?.url;
    if (!imageUrl || typeof imageUrl !== "string") return null;
    return imageUrl;
  };

  const resolveLiveProfileImage = async () => {
    for (const source of PROFILE_SOURCES) {
      try {
        const imageUrl = await fetchImageFromSource(source);
        if (!imageUrl) continue;
        writeProfileCache(imageUrl, source.name);
        return imageUrl;
      } catch {
        // next source
      }
    }
    return null;
  };

  const syncProfileImages = async () => {
    if (!profileImages.length) return;

    profileImages.forEach((img) => {
      img.addEventListener("error", () => {
        const fallback = img.dataset.profileFallback || PROFILE_FALLBACK;
        if (img.src.includes(fallback)) return;
        clearProfileCache();
        img.src = fallback;
      });
    });

    const cached = readProfileCache();
    if (cached?.url) {
      applyProfileImage(cached.url);
    }

    const liveUrl = await resolveLiveProfileImage();
    if (liveUrl) {
      applyProfileImage(liveUrl);
    }
  };

  syncProfileImages();

  /* Share */
  const shareFab = document.querySelector("#share-fab");
  const sharePanel = document.querySelector("#share-panel");
  const shareBackdrop = document.querySelector("#share-backdrop");
  const shareClose = document.querySelector("#share-close");
  const shareToast = document.querySelector("#share-toast");
  const nativeShareBtn = document.querySelector('[data-share="native"]');

  const shareTitle = "Natasha Stella — Content Creator";
  const shareText =
    "Portofolio Natasha Stella — beauty, lifestyle & foodies. Cek rate card & kolaborasi:";

  const getShareUrl = () => window.location.href.split("#")[0];

  const showToast = (message) => {
    if (!shareToast) return;
    shareToast.textContent = message;
    shareToast.hidden = false;
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      shareToast.hidden = true;
    }, 2600);
  };

  const setShareOpen = (open) => {
    if (!sharePanel || !shareFab || !shareBackdrop) return;
    sharePanel.hidden = !open;
    shareBackdrop.hidden = !open;
    shareFab.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  const copyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      return true;
    } catch {
      return false;
    }
  };

  const shareNative = async () => {
    if (!navigator.share) return false;
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: getShareUrl(),
      });
      return true;
    } catch (error) {
      if (error?.name === "AbortError") return true;
      return false;
    }
  };

  if (nativeShareBtn && typeof navigator.share === "function") {
    nativeShareBtn.hidden = false;
  }

  shareFab?.addEventListener("click", () => {
    setShareOpen(sharePanel?.hidden !== false);
  });

  shareClose?.addEventListener("click", () => setShareOpen(false));
  shareBackdrop?.addEventListener("click", () => setShareOpen(false));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setShareOpen(false);
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      const type = button.dataset.share;
      const url = getShareUrl();
      const message = `${shareText} ${url}`;

      if (type === "native") {
        const ok = await shareNative();
        if (ok) setShareOpen(false);
        return;
      }

      if (type === "copy") {
        const ok = await copyLink();
        showToast(ok ? "Link berhasil disalin" : "Gagal menyalin link");
        return;
      }

      if (type === "whatsapp") {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer"
        );
        setShareOpen(false);
        return;
      }

      if (type === "instagram" || type === "tiktok") {
        const ok = await copyLink();
        const appUrl =
          type === "instagram"
            ? "https://www.instagram.com/"
            : "https://www.tiktok.com/";
        showToast(
          ok
            ? `Link disalin. Tempel di ${type === "instagram" ? "Instagram" : "TikTok"}.`
            : "Gagal menyalin link"
        );
        window.setTimeout(() => {
          window.open(appUrl, "_blank", "noopener,noreferrer");
          setShareOpen(false);
        }, 450);
      }
    });
  });
})();
