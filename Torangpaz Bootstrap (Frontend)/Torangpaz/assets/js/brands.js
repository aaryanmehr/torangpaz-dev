document.addEventListener("DOMContentLoaded", async () => {                                  // 📌 اجرای کد پس از بارگذاری کامل DOM
  const swiperWrapper = document.querySelector("#brands .swiper-wrapper");                  // 📌 انتخاب المان wrapper مربوط به اسلایدر برندها
  if (!swiperWrapper) {                                                                     // 📌 بررسی وجود عنصر مورد نیاز
    console.error("❌ عنصر swiper-wrapper در بخش برندها پیدا نشد.");
    return;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/brands?populate=brand_image`);               // 📌 ارسال درخواست به API برای دریافت برندها با تصویرشان

    if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);                              // 📌 بررسی موفقیت‌آمیز بودن پاسخ سرور
    const json = await res.json();                                                           // 📌 تبدیل پاسخ به JSON
    const brands = json?.data;                                                               // 📌 استخراج آرایه برندها از داده دریافتی

    if (!Array.isArray(brands) || brands.length === 0) {                                     // 📌 بررسی وجود برند برای نمایش
      swiperWrapper.innerHTML = '<p class="text-warning text-center">برندی برای نمایش وجود ندارد.</p>';
      return;
    }

    const brandHTML = brands.map((brand) => {                                                // 📌 تولید HTML برای هر برند
      const imageUrl = brand.brand_image?.formats?.medium?.url || brand.brand_image?.url;   // 📌 گرفتن URL عکس برند
      const finalUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : "assets/img/brands/default.png";  // 📌 آدرس نهایی عکس (یا پیش‌فرض)

      return `
        <div class="swiper-slide">
          <img src="${finalUrl}" alt="${brand.brand_name || 'لوگو'}" class="img-fluid brand-logo" />
        </div>
      `;
    }).join("");                                                                              // 📌 تبدیل آرایه به رشته HTML

    swiperWrapper.innerHTML = brandHTML;                                                     // 📌 درج برندها در داخل اسلایدر

    // راه‌اندازی Swiper (اگر تا الان راه‌اندازی نشده باشد)
    if (typeof Swiper !== "undefined") {
      new Swiper(".brands-slider", {                                                         // 📌 راه‌اندازی اسلایدر Swiper برای برندها
        loop: true,                                                                          // 📌 حالت چرخشی فعال
        autoplay: {
          delay: 2000,                                                                       // 📌 تاخیر بین اسلایدها (۲ ثانیه)
          disableOnInteraction: false                                                        // 📌 عدم توقف اتوپلی پس از تعامل کاربر
        },
        slidesPerView: 2,                                                                    // 📌 تعداد اسلاید نمایشی در حالت موبایل
        breakpoints: {
          576: { slidesPerView: 3 },                                                         // 📌 تبلت
          768: { slidesPerView: 4 },                                                         // 📌 لپ‌تاپ
          992: { slidesPerView: 5 }                                                          // 📌 دسکتاپ بزرگ
        }
      });
    }

  } catch (err) {
    console.error("❌ خطا در دریافت برندها:", err.message);                                 // 📌 نمایش خطا در کنسول
    swiperWrapper.innerHTML = '<p class="text-danger text-center">خطا در دریافت برندها.</p>'; // 📌 نمایش پیام خطا در صفحه
  }
});
