// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentLangBtn = document.getElementById('currentLang');
    const languageDropdown = document.getElementById('languageDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const carRentButtons = document.querySelectorAll('.car-rent-btn');

    // Highlight active navigation
    highlightActiveNav();

    // Car rent buttons functionality
    carRentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carCard = this.closest('.premium-car-card');
            const carName = carCard.querySelector('h3').textContent;
            const carPrice = carCard.querySelector('.car-price').textContent;

            // Show confirmation message
            const userConfirmed = confirm(`Вы выбрали: ${carName}\n${carPrice}\n\nХотите перейти к оформлению заказа?`);

            if (userConfirmed) {
                // Here you would typically redirect to booking page
                console.log(`Rent request confirmed: ${carName} - ${carPrice}`);
                showNotification('Заявка принята! Наш менеджер свяжется с вами для подтверждения заказа.', 'success');

                // Simulate redirect to contacts page
                setTimeout(() => {
                    window.location.href = 'contacts.html';
                }, 2000);
            }
        });
    });

    // Toggle dropdown
    if (currentLangBtn) {
        currentLangBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (languageDropdown) {
                languageDropdown.classList.toggle('show');

                // Rotate chevron
                const icon = this.querySelector('i');
                icon.style.transform = languageDropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    // Handle language selection
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');

            // Update current language button
            if (currentLangBtn) {
                currentLangBtn.querySelector('span').textContent = selectedLang;
            }

            // Update active state
            langOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            // Close dropdown
            if (languageDropdown) {
                languageDropdown.classList.remove('show');
            }

            if (currentLangBtn) {
                currentLangBtn.querySelector('i').style.transform = 'rotate(0deg)';
            }

            // Here you would typically implement actual language switching
            console.log('Language changed to:', selectedLang);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (languageDropdown) {
            languageDropdown.classList.remove('show');
        }

        if (currentLangBtn) {
            currentLangBtn.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });

    // Prevent dropdown from closing when clicking inside it
    if (languageDropdown) {
        languageDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Add smooth animation to elements on scroll
    const animatedElements = document.querySelectorAll('.premium-car-card, .hero-block, .car-card-detailed, .contact-card, .condition-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Initialize all functionality
    initFAQ();
    initContactForm();
    initRentButtons();
    initModal();
    initCustomDropdowns();

    // Инициализируем фильтры если мы на странице каталога
    if (window.location.pathname.includes('catalog.html') ||
        document.querySelector('.catalog-hero')) {
        initFilters();
        renderCars();
    }
});

// Function to highlight active navigation
function highlightActiveNav() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Find all navigation links
    const navLinks = document.querySelectorAll('.nav a, .footer-nav-btn');

    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page link
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// FAQ functionality for conditions page
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                department: document.getElementById('department').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!formData.name || !formData.phone) {
                alert('Пожалуйста, заполните обязательные поля: Имя и Телефон');
                return;
            }

            // Here you would typically send the data to a server
            console.log('Form submitted:', formData);

            // Show success message
            showNotification('Сообщение отправлено! Специалист свяжется с вами в ближайшее время.', 'success');

            // Reset form
            contactForm.reset();
        });
    }
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('rentModal');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !closeBtn) return;

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal on X click
    closeBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Modal action buttons
    const modalRentBtn = document.getElementById('modalRentBtn');
    const modalContactBtn = document.getElementById('modalContactBtn');

    if (modalRentBtn) {
        modalRentBtn.addEventListener('click', function() {
            const carTitle = document.getElementById('modalCarTitle').textContent;
            const selectedDiscount = document.querySelector('.discount-item.active');
            const days = selectedDiscount ? selectedDiscount.getAttribute('data-days') : '1';
            const price = selectedDiscount ? selectedDiscount.getAttribute('data-price') : 'стандартная';

            showNotification(`Заявка на аренду ${carTitle} на ${days} дней по цене ${price} ₸/сутки отправлена! Менеджер свяжется с вами.`, 'success');
            closeModal();
        });
    }

    if (modalContactBtn) {
        modalContactBtn.addEventListener('click', function() {
            closeModal();
            setTimeout(() => {
                window.location.href = 'contacts.html';
            }, 300);
        });
    }
}

// Rent buttons functionality
function initRentButtons() {
    const rentButtons = document.querySelectorAll('.rent-btn:not([data-car])');

    rentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carCard = this.closest('.car-card-detailed');
            if (carCard) {
                const carName = carCard.querySelector('h3').textContent;
                const carPrice = carCard.querySelector('.price-main').textContent;

                // Show confirmation message
                const userConfirmed = confirm(`Вы выбрали: ${carName}\n${carPrice}\n\nХотите перейти к оформлению заказа?`);

                if (userConfirmed) {
                    console.log(`Rent request confirmed: ${carName} - ${carPrice}`);
                    showNotification('Заявка принята! Наш менеджер свяжется с вами для подтверждения заказа.', 'success');

                    // Simulate redirect to contacts page
                    setTimeout(() => {
                        window.location.href = 'contacts.html';
                    }, 2000);
                }
            }
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(40, 40, 40, 0.9);
                backdrop-filter: blur(10px);
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                border-left: 4px solid #4a7bc8;
                max-width: 400px;
                animation: slideIn 0.3s ease;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .notification-success {
                border-left-color: #28a745;
            }
            .notification-error {
                border-left-color: #dc3545;
            }
            .notification-content {
                display: flex;
                justify-content: between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #ccc;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Add loaded styles
    const loadedStyles = document.createElement('style');
    loadedStyles.textContent = `
        body.loaded * {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(loadedStyles);
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[7]?[8]?[0-9]{10}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Функция для рендеринга автомобилей
function renderCars(cars = Object.values(carData)) {
    const catalogGrid = document.getElementById('catalogGrid');

    if (!catalogGrid) return;

    if (cars.length === 0) {
        catalogGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-car"></i>
                <h3>Автомобили не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }

    catalogGrid.innerHTML = cars.map(car => `
        <div class="car-card-detailed" data-car="${car.id}" data-type="${car.type}" data-price="${car.priceSegment}" data-city="${car.city}">
            <div class="car-image-detailed">
                <img src="images/cars/${car.id}/${car.images[0]}" alt="${car.title}"
                     onerror="this.onerror=null; this.src='images/cars/default.jpg'; this.alt='Фото автомобиля'">
                <div class="car-badge">${getBadgeText(car.priceSegment)}</div>
                <div class="city-badge">${getCityName(car.city)}</div>
            </div>
            <div class="car-info">
                <h3>${car.title}</h3>
                <p class="car-description">${car.description}</p>

                <div class="car-specs">
                    <div class="spec">
                        <i class="fas fa-users"></i>
                        <span>${car.seats}</span>
                    </div>
                    <div class="spec">
                        <i class="fas fa-cog"></i>
                        <span>${car.transmission}</span>
                    </div>
                    <div class="spec">
                        <i class="fas fa-gas-pump"></i>
                        <span>${car.fuel}</span>
                    </div>
                    <div class="spec">
                        <i class="fas fa-car"></i>
                        <span>${car.carType}</span>
                    </div>
                </div>

                <div class="car-price-section">
                    <div class="price-main">${car.priceMain}</div>
                    <div class="price-discount">${car.priceDiscount}</div>
                </div>

                <button class="rent-btn" data-car="${car.id}">Арендовать</button>
            </div>
        </div>
    `).join('');

    // Обновляем счетчик результатов
    updateResultsCount(cars.length);

    // Добавляем обработчики событий для новых кнопок аренды
    document.querySelectorAll('.rent-btn[data-car]').forEach(button => {
        button.addEventListener('click', function() {
            const carId = this.getAttribute('data-car');
            const car = carData[carId];
            if (car) {
                openCarModal(car);
            }
        });
    });
}

// Функция для получения текста бейджа
function getBadgeText(priceSegment) {
    const badges = {
        'economy': 'Эконом',
        'comfort': 'Комфорт',
        'business': 'Бизнес',
        'premium': 'Премиум'
    };
    return badges[priceSegment] || 'Комфорт';
}

// Функция для получения названия города
function getCityName(cityCode) {
    const cities = {
        'astana': 'Астана',
        'almaty': 'Алматы',
        'karaganda': 'Караганда'
    };
    return cities[cityCode] || cityCode;
}

// Функция обновления счетчика результатов
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Найдено ${count} автомобилей`;
    }
}

// Функция инициализации кастомных выпадающих списков
function initCustomDropdowns() {
    const dropdowns = document.querySelectorAll('.custom-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = dropdown.querySelectorAll('.dropdown-item');
        const text = dropdown.querySelector('.dropdown-text');

        if (!toggle || !menu || !text) return;

        // Toggle dropdown
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });

            document.querySelectorAll('.dropdown-toggle').forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.classList.remove('active');
                }
            });

            // Toggle current dropdown
            menu.classList.toggle('show');
            toggle.classList.toggle('active');
        });

        // Handle item selection
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const displayText = this.textContent;

                // Update selected item
                items.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                // Update toggle text
                text.textContent = displayText;

                // Close dropdown
                menu.classList.remove('show');
                toggle.classList.remove('active');

                // Trigger filter update
                updateFilters();
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
    });
}

// Функция обновления фильтров
function updateFilters() {
    const cityValue = document.querySelector('#cityDropdown .dropdown-item.active')?.getAttribute('data-value') || 'all';
    const typeValue = document.querySelector('#typeDropdown .dropdown-item.active')?.getAttribute('data-value') || 'all';
    const priceValue = document.querySelector('#priceDropdown .dropdown-item.active')?.getAttribute('data-value') || 'all';
    const searchValue = document.getElementById('searchInput')?.value.toLowerCase() || '';

    // Получаем все автомобили
    let filteredCars = Object.values(carData);

    // Применяем фильтры
    if (cityValue !== 'all') {
        filteredCars = filteredCars.filter(car => car.city === cityValue);
    }

    if (typeValue !== 'all') {
        filteredCars = filteredCars.filter(car => car.type === typeValue);
    }

    if (priceValue !== 'all') {
        filteredCars = filteredCars.filter(car => car.priceSegment === priceValue);
    }

    if (searchValue) {
        filteredCars = filteredCars.filter(car =>
            car.title.toLowerCase().includes(searchValue) ||
            car.description.toLowerCase().includes(searchValue) ||
            car.carType.toLowerCase().includes(searchValue)
        );
    }

    // Рендерим отфильтрованные автомобили
    renderCars(filteredCars);
}

// Функция инициализации фильтров
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetFilters');

    // Поиск
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            updateFilters();
        });
    }

    // Сброс фильтров
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Сбрасываем выпадающие списки
            document.querySelectorAll('.dropdown-item').forEach(item => {
                if (item.getAttribute('data-value') === 'all') {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Обновляем текст тогглов
            document.querySelectorAll('.dropdown-text').forEach((text, index) => {
                const defaultTexts = ['Все города', 'Все типы', 'Любой ценовой сегмент'];
                if (text && defaultTexts[index]) {
                    text.textContent = defaultTexts[index];
                }
            });

            // Сбрасываем поиск
            if (searchInput) {
                searchInput.value = '';
            }

            // Обновляем фильтры
            updateFilters();

            showNotification('Фильтры сброшены!', 'success');
        });
    }
}

// Функция для расчета скидок
function calculateDiscounts(basePrice, priceSegment) {
    // Разные коэффициенты скидок в зависимости от класса автомобиля
    const discountRates = {
        'premium': { 3: 0.88, 5: 0.85, 7: 0.80, 10: 0.75 },
        'business': { 3: 0.85, 5: 0.82, 7: 0.78, 10: 0.72 },
        'comfort': { 3: 0.83, 5: 0.80, 7: 0.76, 10: 0.70 },
        'economy': { 3: 0.80, 5: 0.77, 7: 0.73, 10: 0.68 }
    };

    const rates = discountRates[priceSegment] || discountRates.comfort;

    return [
        {
            days: 3,
            price: Math.round(basePrice * rates[3]),
            savings: Math.round(basePrice - (basePrice * rates[3]))
        },
        {
            days: 5,
            price: Math.round(basePrice * rates[5]),
            savings: Math.round(basePrice - (basePrice * rates[5]))
        },
        {
            days: 7,
            price: Math.round(basePrice * rates[7]),
            savings: Math.round(basePrice - (basePrice * rates[7]))
        },
        {
            days: 10,
            price: Math.round(basePrice * rates[10]),
            savings: Math.round(basePrice - (basePrice * rates[10]))
        }
    ];
}

// Функция открытия модального окна с данными автомобиля
function openCarModal(car) {
    const modal = document.getElementById('rentModal');

    if (!modal) return;

    // Обновляем содержимое модального окна
    document.getElementById('modalCarTitle').textContent = car.title;
    document.getElementById('modalCarDescription').textContent = car.description;
    document.getElementById('modalSeats').textContent = car.seats;
    document.getElementById('modalTransmission').textContent = car.transmission;
    document.getElementById('modalFuel').textContent = car.fuel;
    document.getElementById('modalType').textContent = car.carType;
    document.getElementById('modalYear').textContent = car.year;
    document.getElementById('modalMileage').textContent = car.mileage;
    document.getElementById('modalPriceMain').textContent = car.priceMain;
    document.getElementById('modalPriceDiscount').textContent = car.priceDiscount;

    // Обновляем список особенностей
    const featuresList = document.getElementById('modalFeaturesList');
    if (featuresList) {
        featuresList.innerHTML = '';
        car.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }

    // Обновляем главное фото автомобиля в модальном окне
    const carImage = document.querySelector('.modal-car-image');
    if (carImage) {
        carImage.innerHTML = `<img src="images/cars/${car.id}/${car.images[0]}" alt="${car.title}"
                              onerror="this.onerror=null; this.src='images/cars/default.jpg'; this.alt='Фото автомобиля'">`;
    }

    // Обновляем миниатюры
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        const placeholder = thumbnail.querySelector('.thumbnail-placeholder');
        if (placeholder && car.images[index]) {
            // Заменяем placeholder на img
            const img = document.createElement('img');
            img.src = `images/cars/${car.id}/${car.images[index]}`;
            img.alt = `${car.title} - фото ${index + 1}`;
            img.onerror = function() {
                this.style.display = 'none';
                const fallbackPlaceholder = document.createElement('div');
                fallbackPlaceholder.className = 'thumbnail-placeholder';
                fallbackPlaceholder.textContent = index + 1;
                thumbnail.appendChild(fallbackPlaceholder);
            };

            // Удаляем placeholder и добавляем img
            placeholder.remove();
            thumbnail.appendChild(img);

            // Добавляем обработчик клика для миниатюр
            thumbnail.addEventListener('click', function() {
                // Обновляем главное фото
                if (carImage) {
                    carImage.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                }

                // Обновляем активную миниатюру
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });

    // ГЕНЕРИРУЕМ БЛОК СКИДОК
    generateDiscounts(car);

    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Функция генерации блока скидок
function generateDiscounts(car) {
    const discountsGrid = document.getElementById('discountsGrid');
    if (!discountsGrid) return;

    const discounts = calculateDiscounts(car.basePrice, car.priceSegment);

    discountsGrid.innerHTML = discounts.map(discount => `
        <div class="discount-item" data-days="${discount.days}" data-price="${discount.price}">
            <div class="discount-period">${discount.days} дней</div>
            <div class="discount-price">${discount.price} ₸/сутки</div>
            <div class="discount-savings">Экономия: ${discount.savings} ₸/сутки</div>
        </div>
    `).join('');

    // Добавляем обработчики для выбора периода аренды
    const discountItems = document.querySelectorAll('.discount-item');
    discountItems.forEach(item => {
        item.addEventListener('click', function() {
            // Убираем активный класс у всех элементов
            discountItems.forEach(i => i.classList.remove('active'));
            // Добавляем активный класс к выбранному элементу
            this.classList.add('active');

            // Обновляем основную цену на выбранный вариант
            const days = this.getAttribute('data-days');
            const price = this.getAttribute('data-price');
            const modalPriceMain = document.getElementById('modalPriceMain');
            const modalPriceDiscount = document.getElementById('modalPriceDiscount');
            const modalRentBtn = document.getElementById('modalRentBtn');

            if (modalPriceMain) {
                modalPriceMain.textContent = `${price} ₸/сутки`;
            }
            if (modalPriceDiscount) {
                modalPriceDiscount.textContent = `При аренде на ${days} дней`;
            }
            if (modalRentBtn) {
                modalRentBtn.textContent = `Забронировать на ${days} дней`;
            }
        });
    });

    // Активируем первую скидку по умолчанию
    if (discountItems[0]) {
        discountItems[0].click();
    }

    // Инициализируем аккордеон
    initDiscountsAccordion();
}

// Функция для управления аккордеоном скидок
function initDiscountsAccordion() {
    const discountsToggle = document.getElementById('discountsToggle');
    const discountsContent = document.getElementById('discountsContent');

    if (discountsToggle && discountsContent) {
        discountsToggle.addEventListener('click', function() {
            const isActive = this.classList.contains('active');

            // Переключаем состояние
            this.classList.toggle('active');
            discountsContent.classList.toggle('show');

            // Обновляем текст кнопки
            const icon = this.querySelector('i');
            if (isActive) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    }
}