export default function initHeroTyping() {
    const startTyping = () => {
        const element = document.querySelector("#hero-title");

      if (!element) return;
  
      const text = element.textContent.trim();
      element.textContent = "";
  
      const typingSpeed = 80;
      let index = 0;
  
      const cursor = document.createElement("span");
      cursor.textContent = "|";
      cursor.style.marginLeft = "4px";
      cursor.style.animation = "blink 1s infinite";
      element.appendChild(cursor);
  
      const interval = setInterval(() => {
        if (index < text.length) {
          element.insertBefore(document.createTextNode(text.charAt(index)), cursor);
          index++;
        } else {
          clearInterval(interval);
          cursor.remove();
        }
      }, typingSpeed);
    };
  
    // 📌 منتظر بمان تا preloader حذف شود، سپس افکت تایپ را اجرا کن
    const preloader = document.querySelector("#preloader");
  
    if (preloader) {
      const observer = new MutationObserver(() => {
        if (preloader.classList.contains("loaded") || preloader.style.display === "none") {
          observer.disconnect();
          startTyping();
        }
      });
      observer.observe(preloader, { attributes: true, attributeFilter: ["class", "style"] });
    } else {
      startTyping(); // اگر preloadery نیست، بلافاصله تایپ را اجرا کن
    }
  }
  