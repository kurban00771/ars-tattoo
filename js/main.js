const menuBtn = document.querySelector('.menu__btn');
const menuClose = document.querySelector('.menu__close');
const menuList = document.querySelector('.menu__list');
const menuShadow = document.querySelector('.menu--close');
const header = document.querySelector('.header');

menuBtn.addEventListener('click', () => {
    menuList.classList.toggle('menu__list--open');
    menuShadow.classList.toggle('menu--open');
    document.body.classList.toggle('lock-scroll');
});

menuClose.addEventListener('click', () => {
    menuList.classList.remove('menu__list--open');
    menuShadow.classList.remove('menu--open');
    document.body.classList.remove('lock-scroll');
});

if (menuShadow) {
    menuShadow.addEventListener('click', () => {
        menuList.classList.remove('menu__list--open');
        menuShadow.classList.remove('menu--open');
        document.body.classList.remove('lock-scroll');
    });
}

let lastScrollTop = 0;
const threshold = 10;

window.addEventListener('scroll', () => {
    if (window.innerWidth > 860) {
        header.classList.remove('header--hidden');
        return;
    }

    const currentScroll = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);

    if (currentScroll <= 80) {
        header.classList.remove('header--hidden');
        lastScrollTop = currentScroll;
        return;
    }

    if (menuList && menuList.classList.contains('menu__list--open')) {
        return;
    }

    if (Math.abs(currentScroll - lastScrollTop) <= threshold) return;
    
    if (currentScroll > lastScrollTop) {
        header.classList.add('header--hidden');
    } else {
        header.classList.remove('header--hidden');
    }

    lastScrollTop = currentScroll;
}, {passive: true });

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

const currentLink = document.querySelector('.menu__link--current');

if (currentLink) {
    currentLink.addEventListener('click', () => {
        menuList.classList.remove('menu__list--open');
        if (menuShadow) menuShadow.classList.remove('menu--open');
        document.body.classList.remove('lock-scroll');
    });
}

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
    };

    phone.addEventListener('pointerenter', reveal, { once: true });
    phone.addEventListener('pointerdown', reveal, { once: true });
    phone.addEventListener('touchstart', reveal, { passive: true, once: true });
    phone.addEventListener('focus', reveal, { once: true });
});