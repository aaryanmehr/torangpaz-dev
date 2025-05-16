export default function initHeroTyping() {                                             // 📌 تابع اصلی برای راه‌اندازی افکت تایپ

    const element = document.querySelector("#hero h1");                                  // 📌 انتخاب تگ h1 در سکشن hero
    if (!element) return;                                                                // 📌 اگر وجود نداشت، خروج
  
    const text = element.textContent.trim();                                             // 📌 ذخیره متن کامل موجود در H1
    element.textContent = "";                                                            // 📌 پاک کردن محتوا برای شروع تایپ
  
    const typingSpeed = 80;                                                              // 📌 سرعت تایپ به میلی‌ثانیه
    let index = 0;                                                                        // 📌 موقعیت فعلی تایپ
  
    // 📌 ساختن عنصر cursor چشمک‌زن (اختیاری)
    const cursor = document.createElement("span");
    cursor.textContent = "|";
    cursor.style.marginLeft = "4px";
    cursor.style.animation = "blink 1s infinite";
    element.appendChild(cursor);
  
    const interval = setInterval(() => {
      if (index < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(index)), cursor);       // 📌 افزودن حرف بعدی
        index++;
      } else {
        clearInterval(interval);                                                         // 📌 پایان تایپ
        cursor.remove();                                                                 // 📌 حذف cursor پس از پایان (در صورت تمایل)
      }
    }, typingSpeed);
  }
  
  // 📌 افزودن استایل چشمک‌زن برای cursor با جاوااسکریپت (در صورت نداشتن فایل CSS مجزا)
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes blink {
      0%   { opacity: 1; }
      50%  { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  