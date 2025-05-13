document.addEventListener("DOMContentLoaded", () => {                             // 📌 اجرای کد پس از لود کامل DOM
  new Swiper(".brand-swiper", {                                                   // 📌 ایجاد یک اسلایدر Swiper برای نمایش برندها
    slidesPerView: 5,                                                             // 📌 تعداد اسلاید قابل نمایش در هر لحظه (پیش‌فرض ۵)
    spaceBetween: 30,                                                             // 📌 فاصله بین اسلایدها (پیکسل)
    loop: true,                                                                   // 📌 فعال‌سازی حالت چرخشی (loop) اسلایدر
    autoplay: {
      delay: 2500,                                                                // 📌 فاصله بین اسلایدها در حالت اتوپلی (۲.۵ ثانیه)
      disableOnInteraction: false,                                                // 📌 توقف نکردن autoplay پس از تعامل کاربر
    },
    breakpoints: {
      0: {
        slidesPerView: 2,                                                         // 📌 نمایش فقط ۲ اسلاید در عرض‌های کم (موبایل)
        spaceBetween: 15,                                                         // 📌 کاهش فاصله اسلایدها در موبایل
      },
      768: {
        slidesPerView: 5,                                                         // 📌 نمایش ۵ اسلاید برای تبلت و بزرگ‌تر
        spaceBetween: 30,                                                         // 📌 افزایش فاصله بین اسلایدها
      }
    }
  });
});
