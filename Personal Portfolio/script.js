// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
});

// Load dark mode preference
window.onload = () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
};

// Mobile Navigation Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when clicking a link (for better UX)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Typing Animation for Hero Section
const typedText = document.getElementById("typedText");
const textArray = ["Web Developer", "AI Enthusiast", "Creative Designer"];
let textIndex = 0;
let charIndex = 0;

function typeText() {
  if (charIndex < textArray[textIndex].length) {
    typedText.textContent += textArray[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100);
  } else {
    setTimeout(eraseText, 1000);
  }
}

function eraseText() {
  if (charIndex > 0) {
    typedText.textContent = textArray[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, 50);
  } else {
    textIndex = (textIndex + 1) % textArray.length;
    setTimeout(typeText, 500);
  }
}

document.addEventListener("DOMContentLoaded", typeText);

// Scroll Reveal Animations
const scrollElements = document.querySelectorAll(".scroll-reveal");

const scrollReveal = () => {
  scrollElements.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", scrollReveal);
scrollReveal(); // Trigger on load

// Button Hover Effects
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseover", function (e) {
    const x = e.pageX - btn.offsetLeft;
    const y = e.pageY - btn.offsetTop;
    btn.style.setProperty("--xPos", `${x}px`);
    btn.style.setProperty("--yPos", `${y}px`);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadResume");

  downloadBtn.addEventListener("click", function () {
      const resumePath = "resumeCC1.pdf"; // Ensure this file is in the correct directory
      const link = document.createElement("a");
      link.href = resumePath;
      link.download = "Jainesh_Patel_Resume.pdf"; // Custom file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });
});
