document.addEventListener("DOMContentLoaded", async () => {
  const menuTabsContainer = document.querySelector("#menu .nav-tabs");           // 📌 انتخاب کانتینر تب‌های منو
  const menuTabContent = document.querySelector("#menu .tab-content");           // 📌 انتخاب بخش محتوای تب‌ها

  if (!menuTabsContainer || !menuTabContent) {                                   // 📌 بررسی وجود عناصر ضروری در DOM
    console.error("❌ المان‌های تب منو پیدا نشدند.");
    return;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/menu-sections?populate=menu_categories.menu_items.Image`);  // 📌 دریافت داده از API استرپی
    if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);                  // 📌 بررسی صحت پاسخ از سرور
    const json = await res.json();                                              // 📌 تبدیل پاسخ به فرمت JSON
    const sections = json?.data;                                                // 📌 استخراج داده‌ی اصلی

    if (!Array.isArray(sections) || sections.length === 0) {                    // 📌 اگر بخشی برای منو وجود نداشت
      menuTabsContainer.innerHTML = '<p class="text-warning text-center">هیچ بخش منویی پیدا نشد.</p>';
      return;
    }

    const tabsHTML = [];                                                        // 📌 آرایه‌ای برای ذخیره HTML تب‌ها
    const tabContentsHTML = [];                                                 // 📌 آرایه‌ای برای ذخیره محتوای تب‌ها

    sections.forEach((section, secIdx) => {                                     // 📌 پیمایش هر بخش از منو
      const categories = section.menu_categories || [];                         // 📌 استخراج دسته‌بندی‌های هر بخش
      if (!Array.isArray(categories) || categories.length === 0) return;        // 📌 رد کردن بخش‌های بدون دسته‌بندی

      categories.forEach((category, catIdx) => {                                // 📌 پیمایش هر دسته
        const categoryId = `menu-cat-${secIdx}-${catIdx}`;                      // 📌 ساخت ID یکتا برای تب
        const categoryName = category.title || `دسته ${catIdx + 1}`;           // 📌 نام دسته یا مقدار پیش‌فرض
        const menuItems = category.menu_items || [];                            // 📌 آیتم‌های غذا

        if (!menuItems.length) return;                                          // 📌 اگر آیتمی وجود نداشت رد کن

        tabsHTML.push(`                                                         
          <li class="nav-item">
            <a class="nav-link ${tabsHTML.length === 0 ? "active show" : ""}" data-bs-toggle="tab" data-bs-target="#${categoryId}">
              <h4>${categoryName}</h4>
            </a>
          </li>
        `);                                                                     // 📌 ساخت تب HTML برای دسته جاری

        const itemsHTML = menuItems.map((item, idx) => generateMenuItemHTML(item, idx)).join("");  // 📌 ساخت HTML آیتم‌ها

        tabContentsHTML.push(`                                                  
          <div class="tab-pane fade ${tabContentsHTML.length === 0 ? "active show" : ""}" id="${categoryId}">
            <div class="tab-header text-center">
              <h3>${categoryName}</h3>
            </div>
            <div class="row gy-5">
              ${itemsHTML}
            </div>
          </div>
        `);                                                                     // 📌 ساخت محتوای تب مربوط به دسته
      });
    });

    if (!tabsHTML.length) {                                                     // 📌 اگر تب قابل نمایشی نبود
      menuTabsContainer.innerHTML = '<p class="text-warning text-center">هیچ دسته‌ای برای منو وجود ندارد.</p>';
    } else {
      menuTabsContainer.innerHTML = tabsHTML.join("");                          // 📌 درج تب‌ها در HTML
      menuTabContent.innerHTML = tabContentsHTML.join("");                      // 📌 درج محتوا در تب‌ها
    }
  } catch (err) {
    console.error("❌ خطا در دریافت منو:", err.message);                        // 📌 در صورت بروز خطا در دریافت داده
    menuTabContent.innerHTML = '<p class="text-danger text-center">خطا در دریافت منو.</p>';
  }
});

function generateMenuItemHTML(item, idx) {                                      // 📌 تابع تولید HTML برای هر آیتم منو
  const title = item.Title || "بدون عنوان";                                     // 📌 عنوان غذا
  const price = item.Price != null ? Number(item.Price).toLocaleString() + " تومان" : "قیمت نامشخص";  // 📌 قیمت غذا
  const description = item.Description?.[0]?.children?.[0]?.text || "بدون توضیح";  // 📌 توضیحات غذا
  const imageUrl = item.Image?.formats?.medium?.url || item.Image?.url || "";   // 📌 آدرس عکس
  const finalUrl = imageUrl ? STRAPI_URL + imageUrl : "assets/img/menu/default.jpg";  // 📌 URL نهایی عکس

  return `                                                                      // 📌 HTML نهایی آیتم غذا برای درج در صفحه
    <div class="col-lg-4 menu-item" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
      <a href="${finalUrl}" class="glightbox">
        <img src="${finalUrl}" class="menu-img img-fluid" alt="${title}">
      </a>
      <h4>${title}</h4>
      <p class="ingredients">${description}</p>
      <p class="price">${price}</p>
    </div>
  `;
}
