document.addEventListener("DOMContentLoaded", () => {
  initTestimonials();                                 // 📌 بعد از بارگذاری کامل DOM، تابع نظرات اجرا می‌شود
});

async function initTestimonials() {
  const container = document.getElementById("testimonial-container");  // 📌 انتخاب المان محل نمایش اسلایدر نظرات
  if (!container) return;                                              // 📌 اگر این المان وجود نداشت، تابع متوقف شود

  const url = `${STRAPI_URL}/api/testimonials?populate=avatar`;       // 📌 آدرس API برای دریافت نظرات همراه با تصویر مشتری

  try {
      const response = await fetch(url);                               // 📌 ارسال درخواست به API
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);  // 📌 بررسی وضعیت پاسخ

      const data = await response.json();                              // 📌 تبدیل پاسخ به فرمت JSON
      const testimonials = data?.data || [];                           // 📌 استخراج آرایه نظرات

      if (testimonials.length === 0) {                                 // 📌 اگر نظری وجود نداشت
          container.innerHTML = `<p class="text-center">هیچ نظری ثبت نشده است.</p>`;
          return;
      }

      const slidesHTML = testimonials.map(createTestimonialSlide).join("");  // 📌 ساخت HTML اسلایدها از نظرات
      const shouldLoop = testimonials.length >= 3;                             // 📌 اگر حداقل ۳ نظر بود، اسلایدر به صورت loop اجرا شود

      // حذف Swiper قبلی (در صورت وجود)
      if (window.testimonialSwiper?.destroy instanceof Function) {
          window.testimonialSwiper.destroy(true, true);               // 📌 نابود کردن اسلایدر قبلی برای جلوگیری از تکرار
      }

      // درج DOM
      container.innerHTML = `                                        
          <div class="swiper testimonial-swiper">
            <div class="swiper-wrapper">
              ${slidesHTML}
            </div>
            <div class="swiper-pagination testimonial-pagination"></div>
          </div>
      `;                                                              // 📌 قرار دادن HTML اسلایدر و ساختار پایه آن در DOM

      // مقداردهی Swiper خاص این بخش
      requestAnimationFrame(() => {
          window.testimonialSwiper = new Swiper(".testimonial-swiper", {   // 📌 راه‌اندازی اسلایدر Swiper برای نمایش نظرات
              loop: shouldLoop,
              speed: 600,
              autoplay: { delay: 5000 },
              slidesPerView: 1,
              pagination: {
                  el: ".testimonial-pagination",
                  type: "bullets",
                  clickable: true
              }
          });
      });

  } catch (err) {
      console.error("❌ خطا در دریافت نظرات:", err);                 // 📌 چاپ خطا در کنسول مرورگر
      container.innerHTML = `<p class="text-danger text-center">خطا در بارگذاری نظرات. لطفاً بعداً امتحان کنید.</p>`;  // 📌 نمایش پیغام خطا به کاربر
  }
}

function createTestimonialSlide(item) {
  const {
      text = [],                                                     // 📌 متن نظر مشتری
      customer_name = "نام ناشناس",                                 // 📌 نام مشتری یا مقدار پیش‌فرض
      job_title = "بدون عنوان شغلی",                                // 📌 عنوان شغلی مشتری یا مقدار پیش‌فرض
      avatar                                                        // 📌 عکس مشتری
  } = item;

  const comment = sanitizeText(text?.[0]?.children?.[0]?.text || "بدون متن نظر");  // 📌 استخراج متن امن‌شده نظر
  const imgUrl = avatar?.formats?.medium?.url || avatar?.formats?.small?.url;       // 📌 گرفتن آدرس تصویر با بهترین کیفیت موجود
  const fullImageUrl = imgUrl ? STRAPI_URL + imgUrl : "assets/img/testimonials/default.jpg";  // 📌 در صورت نبود تصویر، آدرس پیش‌فرض استفاده می‌شود

  return `                                                           // 📌 ساخت HTML مربوط به یک اسلاید نظر
    <div class="swiper-slide">
      <div class="testimonial-item">
        <div class="row gy-4 justify-content-center">
          <div class="col-lg-6">
            <div class="testimonial-content">
              <p>
                
                <span>${comment}</span>
               
              </p>
              <h3>${customer_name}</h3>
              <h4>${job_title}</h4>

            </div>
          </div>
          <div class="col-lg-2 text-center">
            <img src="${fullImageUrl}" class="img-fluid testimonial-img" alt="${customer_name}">
          </div>
        </div>
      </div>
    </div>
  `;
}

function sanitizeText(str) {
  return str?.replace(/[&<>"']/g, function (m) {                    // 📌 تبدیل کاراکترهای خاص به HTML Entity برای جلوگیری از XSS
      return ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
      })[m];
  }) || '';
}
