// ---------- LIVE TIME  ----------
function updateTime() {
  const now = new Date();
  const timeElement = document.getElementById("time");

  const options = {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  
  // Example: Fri, 21:37:04
  timeElement.textContent = now.toLocaleString("en-GB", options);
}

// Update every second
setInterval(updateTime, 1000);
updateTime();


// ---------- TYPING ANIMATION ----------
function typeWriterEffect(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// Example: animate main title
document.addEventListener("DOMContentLoaded", () => {
  const mainTitle = document.querySelector("header h1");
  const text = mainTitle.textContent;
  typeWriterEffect(mainTitle, text, 70);
});


// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});