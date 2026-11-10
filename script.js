

// Navbar, mobile menu ar Learn More er element gulo dhorchi
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

const learnMoreBtn = document.getElementById("learn-more-btn");
const learnMoreText = document.getElementById("learn-more-text");
const moreInfo = document.getElementById("more-info");
const aboutSection = document.getElementById("about");


/* =========================================================
   2. MOBILE MENU OPEN / CLOSE
   ========================================================= */

// Hamburger button e click korle mobile menu show / hide hobe
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });

  // Mobile menu theke kono link e click korle menu bondho hobe
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    });
  });
}


/* =========================================================
   3. NAVBAR SCROLL EFFECT
   ========================================================= */

// Page e scroll korle navbar e dark background ar shadow ashbe
function updateNavbar() {
  if (!navbar) return;

  if (window.scrollY > 20) {
    navbar.classList.add(
      "bg-dark/90",
      "backdrop-blur-sm",
      "shadow-lg"
    );
  } else {
    navbar.classList.remove(
      "bg-dark/90",
      "backdrop-blur-sm",
      "shadow-lg"
    );
  }
}

window.addEventListener("scroll", updateNavbar, { passive: true });
window.addEventListener("load", updateNavbar);


/* =========================================================
   4. SCROLL REVEAL EFFECT
   ========================================================= */

// Reveal class thaka element screen e ashle fade-in animation hobe
const revealItems = document.querySelectorAll(".reveal");

// Browser IntersectionObserver support korle animation cholbe
if ("IntersectionObserver" in window) {
  revealItems.forEach((item) => {
    item.classList.add(
      "opacity-0",
      "translate-y-8",
      "transition-all",
      "duration-700"
    );
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element visible hole hidden class gulo remove hobe
          entry.target.classList.remove(
            "opacity-0",
            "translate-y-8"
          );

          // Ekbar animation hole abar observe korar dorkar nai
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}


/* =========================================================
   5. LEARN MORE BUTTON + AUTOMATIC SMOOTH SCROLL
   ========================================================= */

// Learn More e click korle cards open hobe
// Tarpor automatic scroll kore cards er kache niye jabe
if (learnMoreBtn && learnMoreText && moreInfo) {
  learnMoreBtn.addEventListener("click", () => {

    // Cards ekhon open ache kina check korchi
    const isOpen = moreInfo.hasAttribute("data-open");

    if (!isOpen) {

      // -------- LEARN MORE OPEN --------

      // Cards show korar jonno data-open attribute add korchi
      moreInfo.setAttribute("data-open", "");

      // Button er accessibility state update korchi
      learnMoreBtn.setAttribute("aria-expanded", "true");

      // Button er text change hobe
      learnMoreText.textContent = "Show Less";

      // Animation er jonno ektu time diye cards e scroll korchi
      requestAnimationFrame(() => {
        setTimeout(() => {
          const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

          const cardPosition =
            moreInfo.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight -
            20;

          window.scrollTo({
            top: Math.max(0, cardPosition),
            behavior: "smooth"
          });
        }, 200);
      });

    } else {

      // -------- SHOW LESS / CLOSE --------

      // Cards hide korar jonno data-open remove korchi
      moreInfo.removeAttribute("data-open");

      // Accessibility state update korchi
      learnMoreBtn.setAttribute("aria-expanded", "false");

      // Button er ager text fire ashbe
      learnMoreText.textContent = "Learn More";

      // About section e smooth scroll kore fire jabe
      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
}



/* AUTO HIDE LEARN MORE CARDS */

function closeMoreInfo() {
  if (!moreInfo || !learnMoreBtn || !learnMoreText) return;

  moreInfo.removeAttribute("data-open");
  learnMoreBtn.setAttribute("aria-expanded", "false");
  learnMoreText.textContent = "Learn More";
}

// Navbar link click korle cards close hobe
document.querySelectorAll(
  'header nav a[href^="#"], #mobile-menu a[href^="#"]'
).forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").slice(1);

    // About chara onno section e gele close hobe
    if (targetId !== "about") {
      closeMoreInfo();
    }
  });
});


/* CLOSE CARDS WHEN SCROLLING TO ANOTHER SECTION */

const allSections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
  if (!aboutSection || !moreInfo) return;

  const offset = (navbar ? navbar.offsetHeight : 0) + 40;
  let currentSection = "";

  allSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= offset) {
      currentSection = section.id;
    }
  });

  // Page er bottom e gele last section active dhorbo
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2
  ) {
    currentSection = allSections.length
      ? allSections[allSections.length - 1].id
      : "";
  }

  // About chara onno section e scroll korle cards close
  if (currentSection && currentSection !== "about") {
    closeMoreInfo();
  }
}, { passive: true });





/* =========================================================
   6. ACTIVE NAVIGATION LINK
   ========================================================= */

// Je section e thakbe, navbar e oi section er link blue hobe
(function () {
  const header = document.getElementById("navbar");

  const links = document.querySelectorAll(
    "header nav ul a, #mobile-menu a"
  );

  const sectionEls = document.querySelectorAll(
    "main section[id]"
  );

  // Section na thakle function bondho thakbe
  if (!header || !links.length || !sectionEls.length) {
    return;
  }

  function setActiveLink() {

    // Fixed navbar er niche koto tuku offset rakhbo
    const offset = header.offsetHeight + 40;

    // Default section hisebe first section dhorchi
    let currentId = sectionEls[0].id;

    // Scroll position onujayi current section ber korchi
    sectionEls.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) {
        currentId = section.id;
      }
    });

    // Page er ekdom niche gele last section active hobe
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (atBottom) {
      currentId = sectionEls[sectionEls.length - 1].id;
    }

    // Current section er link blue, baki link normal thakbe
    links.forEach((link) => {
      const isCurrent =
        link.getAttribute("href") === `#${currentId}`;

      link.classList.toggle("text-primary", isCurrent);
    });
  }

  // Scroll, page load ar window resize hole active link update hobe
  window.addEventListener("scroll", setActiveLink, {
    passive: true
  });

  window.addEventListener("load", setActiveLink);
  window.addEventListener("resize", setActiveLink);

  // Page load howar sathe sathe active link set korchi
  setActiveLink();
})();
 
 
/* =========================================================
   7. CONTACT FORM + FOOTER YEAR
   ========================================================= */
 
// EDIT YOUR EMAIL HERE (message ei email e jabe)
const MY_EMAIL = "saidul.islam11104@gmail.com";
 
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
 
// Status message dekhanor chhoto function (state = "error" ba "success")
function showStatus(message, state) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.setAttribute("data-state", state);
}
 
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    // Page reload hoye jawa atkachchi
    event.preventDefault();
 
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();
 
    // 1) Khali field check
    if (!name || !email || !message) {
      showStatus("Please fill in all the fields.", "error");
      return;
    }
 
    // 2) Simple email format check (kichu@kichu.kichu)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }
 
    // 3) Sob thik hole user er email app khule message ready hoye jabe
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
    window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
 
    showStatus("Thanks! Your email app should open now.", "success");
    contactForm.reset();
  });
}
 
// Footer er year automatic update hobe
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}