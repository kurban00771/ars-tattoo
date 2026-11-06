const menuBtn = document.querySelector('.menu__btn');
const menuClose = document.querySelector('.menu__close');
const menuList = document.querySelector('.menu__list');
const menuShadow = document.querySelector('.menu--close');
const header = document.querySelector('.header');

// ID вашего счетчика Яндекс Метрики (Арсен Тату)
const METRIKA_ID = 114107350;

// 1. Открытие меню
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuList.classList.toggle('menu__list--open');
        menuShadow.classList.toggle('menu--open');
        document.body.classList.toggle('lock-scroll');
        menuBtn.classList.toggle('menu__btn--active'); // Плавное превращение в крестик
    });
}

// 2. Закрытие меню через внутренний крестик (если он есть в HTML)
if (menuClose) {
    menuClose.addEventListener('click', () => {
        menuList.classList.remove('menu__list--open');
        menuShadow.classList.remove('menu--open');
        document.body.classList.remove('lock-scroll');
        menuBtn.classList.remove('menu__btn--active');
    });
}

// 3. Закрытие меню кликом по затемненному фону
if (menuShadow) {
    menuShadow.addEventListener('click', () => {
        menuList.classList.remove('menu__list--open');
        menuShadow.classList.remove('menu--open');
        document.body.classList.remove('lock-scroll');
        if (menuBtn) menuBtn.classList.remove('menu__btn--active');
    });
}

// 4. Закрытие меню при клике на активную ссылку
const currentLink = document.querySelector('.menu__link--current');

if (currentLink) {
    currentLink.addEventListener('click', () => {
        menuList.classList.remove('menu__list--open');
        if (menuShadow) menuShadow.classList.remove('menu--open');
        document.body.classList.remove('lock-scroll');
        if (menuBtn) menuBtn.classList.remove('menu__btn--active');
    });
}

// 5. Скрытие/показ хедера при скролле (работает благодаря проверкам выше)
let lastScrollTop = 0;
const threshold = 10;

window.addEventListener('scroll', () => {
    // Если экран широкий, принудительно показываем хедер
    if (window.innerWidth > 860) {
        if (header) header.classList.remove('header--hidden');
        return;
    }

    const currentScroll = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);

    // Если мы в самом верху, показываем хедер
    if (currentScroll <= 80) {
        if (header) header.classList.remove('header--hidden');
        lastScrollTop = currentScroll;
        return;
    }

    // Если меню открыто, не скрываем хедер
    if (menuList && menuList.classList.contains('menu__list--open')) {
        return;
    }

    // Игнорируем мелкие дерганья скролла
    if (Math.abs(currentScroll - lastScrollTop) <= threshold) return;
    
    // Логика скрытия/показа
    if (currentScroll > lastScrollTop) {
        if (header) header.classList.add('header--hidden'); // Скролл вниз - скрываем
    } else {
        if (header) header.classList.remove('header--hidden'); // Скролл вверх - показываем
    }

    lastScrollTop = currentScroll;
}, { passive: true });

// 6. Плавный скролл наверх при клике на логотип
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', (e) => {
        const isHomePage = document.querySelector('.top') !== null;

        if (isHomePage) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// 7. Раскодировка номеров телефонов + отправка цели в Метрику
const securePhones = document.querySelectorAll('.phone-secure');

securePhones.forEach(phone => {
    const reveal = () => {
        if (phone.dataset.assembled) return;

        const rawNumber = atob(phone.dataset.p1) + atob(phone.dataset.p2);
        const visibleText = atob(phone.dataset.view);

        phone.href = 'tel:' + rawNumber;

        const textContainer = phone.querySelector('span') || phone;
        textContainer.textContent = visibleText;

        phone.dataset.assembled = 'true';

        // Отправляем событие в Яндекс Метрику при раскрытии номера
        if (typeof ym === 'function') {
            ym(METRIKA_ID, 'reachGoal', 'reveal_phone');
        }
    };

    phone.addEventListener('pointerenter', reveal, { once: true });
    phone.addEventListener('pointerdown', reveal, { once: true });
    phone.addEventListener('touchstart', reveal, { passive: true, once: true });
    phone.addEventListener('focus', reveal, { once: true });
});

// 8. Отслеживание кликов по ссылкам на мессенджеры и телефон
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    if (href.includes('t.me') || href.includes('telegram')) {
        if (typeof ym === 'function') ym(METRIKA_ID, 'reachGoal', 'click_telegram');
    } else if (href.includes('wa.me') || href.includes('whatsapp')) {
        if (typeof ym === 'function') ym(METRIKA_ID, 'reachGoal', 'click_whatsapp');
    } else if (href.startsWith('tel:')) {
        if (typeof ym === 'function') ym(METRIKA_ID, 'reachGoal', 'click_phone');
    }
});
