document.addEventListener("DOMContentLoaded", () => {                               // 📌 اجرای کد پس از بارگذاری کامل DOM
  const form = document.getElementById("leads");                                    // 📌 انتخاب فرم با شناسه leads
  if (!form) return;                                                                // 📌 اگر فرم پیدا نشد، اجرای کد متوقف می‌شود

  const loading = form.querySelector(".loading");                                   // 📌 عنصر مربوط به وضعیت "در حال ارسال"
  const errorMessage = form.querySelector(".error-message");                        // 📌 پیام خطا
  const successMessage = form.querySelector(".sent-message");                      // 📌 پیام موفقیت
  const submitButton = form.querySelector("button[type='submit']");                // 📌 دکمه ارسال فرم

  form.addEventListener("submit", async (e) => {                                    // 📌 هندل ارسال فرم
    e.preventDefault();                                                             // 📌 جلوگیری از رفتار پیش‌فرض فرم (رفرش صفحه)

    const name = form.querySelector("input[name='name']").value.trim();            // 📌 دریافت مقدار نام
    const family_name = form.querySelector("input[name='family_name']").value.trim(); // 📌 دریافت مقدار نام خانوادگی
    const email = form.querySelector("input[name='email']").value.trim();          // 📌 دریافت ایمیل
    const company = form.querySelector("input[name='company']").value.trim();      // 📌 دریافت نام شرکت
    const number_of_employees = form.querySelector("input[name='number_of_employees']").value.trim(); // 📌 تعداد کارکنان
    const massage = form.querySelector("textarea[name='massage']").value.trim();   // 📌 متن پیام

    if (!validateEmail(email)) {                                                    // 📌 اعتبارسنجی ایمیل
      return showMessage(errorMessage, "لطفاً ایمیل معتبر وارد کنید.");
    }

    if (number_of_employees && (isNaN(number_of_employees) || Number(number_of_employees) < 0)) {
      return showMessage(errorMessage, "تعداد کارکنان باید یک عدد معتبر باشد."); // 📌 بررسی اعتبار عدد کارکنان
    }

    toggleState("loading");                                                         // 📌 فعال کردن حالت بارگذاری

    const payload = {                                                               // 📌 ساخت بدنه اطلاعات برای ارسال به API
      data: {
        name,
        family_name,
        email,
        company,
        number_of_employees: Number(number_of_employees),
        massage,
      },
    };

    try {
      const res = await fetch(`${STRAPI_URL}/api/leads`, {                          // 📌 ارسال درخواست POST به API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));                           // 📌 تبدیل پاسخ به JSON

      if (!res.ok) {
        const msg = resData.error?.message || "ارسال فرم با خطا مواجه شد.";       // 📌 نمایش پیام خطا در صورت عدم موفقیت
        return showMessage(errorMessage, msg);
      }

      showMessage(successMessage, "پیام شما با موفقیت ارسال شد.");                // 📌 نمایش پیام موفقیت
      form.reset();                                                                 // 📌 پاک‌کردن فرم پس از ارسال موفق

    } catch (err) {
      showMessage(errorMessage, "خطا در ارتباط با سرور.");                        // 📌 خطای کلی در صورت قطع ارتباط
    } finally {
      toggleState("idle");                                                          // 📌 بازگشت به حالت عادی
    }
  });

  // 📌 توابع کمکی

  function validateEmail(email) {                                                   // 📌 بررسی فرمت ایمیل با Regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMessage(el, msg) {                                                   // 📌 نمایش پیام خاص (خطا یا موفقیت)
    hideMessage(errorMessage);
    hideMessage(successMessage);
    el.textContent = msg;
    el.classList.add("d-block");
  }

  function hideMessage(el) {                                                        // 📌 مخفی‌کردن پیام‌ها
    el.textContent = "";
    el.classList.remove("d-block");
  }

  function toggleState(state) {                                                     // 📌 مدیریت وضعیت بارگذاری فرم
    if (state === "loading") {
      loading.classList.add("d-block");
      hideMessage(errorMessage);
      hideMessage(successMessage);
      submitButton.disabled = true;
    } else {
      loading.classList.remove("d-block");
      submitButton.disabled = false;
    }
  }
});
