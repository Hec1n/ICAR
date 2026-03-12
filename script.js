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

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            mainNav.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
                hamburger.classList.remove('open');
                mainNav.classList.remove('open');
            }
        });
        mainNav.querySelectorAll('a:not(.nav-mobile-phone)').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mainNav.classList.remove('open');
            });
        });
    }

    // Initialize all functionality
    initFAQ();
    initContactForm();
    initRentButtons();
    initModal();
    initCustomDropdowns();
    initDiscountsAccordion();

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
            const selectedPeriodRow = document.querySelector('.period-row.active');
            const periodText = selectedPeriodRow ? selectedPeriodRow.querySelector('.period-cell').textContent : '1-2 дня';
            const price = selectedPeriodRow ? selectedPeriodRow.querySelector('.price-cell').textContent : '35 000 ₸';

            showNotification(`Заявка на аренду ${carTitle} на период ${periodText} по цене ${price}/сутки отправлена! Менеджер свяжется с вами.`, 'success');
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
            <div class="car-image-detailed" data-car-id="${car.id}" style="cursor:pointer;">
                <img src="images/cars/${car.id}/${car.images[0] || 'default.jpg'}" alt="${car.title}"
                     onerror="this.onerror=null; this.src='images/cars/default.jpg'; this.alt='Фото автомобиля'">
                <div class="car-badge">${getBadgeText(car.priceSegment)}</div>
                <div class="city-badge">${getCityName(car.city)}</div>
            </div>
            <div class="car-info">
                <h3>${car.title}</h3>
                <p class="car-description">${car.description}</p>

                <div class="car-details-grid">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span class="detail-label">Год:</span>
                        <span class="detail-value">${car.year}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-palette"></i>
                        <span class="detail-label">Цвет:</span>
                        <span class="detail-value">${getColorName(car.color)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-car"></i>
                        <span class="detail-label">Тип:</span>
                        <span class="detail-value">${car.carType}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span class="detail-label">Мест:</span>
                        <span class="detail-value">${car.seats}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-cog"></i>
                        <span class="detail-label">КПП:</span>
                        <span class="detail-value">${car.transmission}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-gas-pump"></i>
                        <span class="detail-label">Топливо:</span>
                        <span class="detail-value">${car.fuel}</span>
                    </div>
                </div>

                <div class="car-price-section">
                    <div class="price-with-deposit">
                        <div class="price-main">от ${car.periods[0].price.toLocaleString()} ₸/сутки</div>
                        <div class="deposit-small">Залог: ${car.deposit}</div>
                    </div>
                    <div class="price-details">
                        <div class="price-period">
                            <span class="period-label">1-2 дня:</span>
                            <span class="period-price">${car.periods[0].price.toLocaleString()} ₸/сутки</span>
                        </div>
                        <div class="price-period">
                            <span class="period-label">3-5 дней:</span>
                            <span class="period-price discount">${car.periods[1].price.toLocaleString()} ₸/сутки</span>
                        </div>
                    </div>
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

    // Клик на изображение карточки открывает модалку
    document.querySelectorAll('.car-image-detailed').forEach(imageArea => {
        const carId = imageArea.getAttribute('data-car-id');
        const car = carData[carId];
        if (!car) return;
        imageArea.addEventListener('click', function() {
            openCarModal(car);
        });
    });
}

// Функция для получения текста бейджа
function getBadgeText(priceSegment) {
    const badges = {
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

// Функция для получения названия цвета
function getColorName(colorGradient) {
    const colors = {
        'linear-gradient(135deg, #ffffff, #e0e0e0)': 'Белый',
        'linear-gradient(135deg, #000000, #333333)': 'Черный',
        'linear-gradient(135deg, #808080, #a9a9a9)': 'Серый',
        'linear-gradient(135deg, #8B4513, #A0522D)': 'Коричневый',
        'linear-gradient(135deg, #8B4513, #000080)': 'Коричнево-Синий',
        'linear-gradient(135deg, #87CEEB, #4682B4)': 'Голубой'
    };
    return colors[colorGradient] || 'Разный';
}

// Функция обновления счетчика результатов
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const word = count % 10 === 1 && count % 100 !== 11 ? 'автомобиль' :
                    [2,3,4].includes(count % 10) && ![12,13,14].includes(count % 100) ? 'автомобиля' : 'автомобилей';
        resultsCount.textContent = `Найдено ${count} ${word}`;
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
            car.carType.toLowerCase().includes(searchValue) ||
            getColorName(car.color).toLowerCase().includes(searchValue)
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

    // Убедитесь что эти элементы существуют в HTML
    const modalColor = document.getElementById('modalColor');
    const modalAdditionalHours = document.getElementById('modalAdditionalHours');

    if (modalColor) modalColor.textContent = getColorName(car.color);

    // Добавляем информацию о дополнительных часах
    if (modalAdditionalHours && car.pricePerHour) {
        modalAdditionalHours.textContent = car.pricePerHour;
        modalAdditionalHours.style.display = 'block';
    }

    // Обновляем основную цену с залогом
    const modalPriceMain = document.getElementById('modalPriceMain');
    if (modalPriceMain) {
        modalPriceMain.textContent = `${car.periods[0].price.toLocaleString()} ₸/сутки`;
    }

    // Обновляем блок с залогом
    const modalPriceWithDeposit = document.getElementById('modalPriceWithDeposit');
    if (modalPriceWithDeposit) {
        modalPriceWithDeposit.innerHTML = `
            <div class="price-main">${car.periods[0].price.toLocaleString()} ₸/сутки</div>
            <div class="deposit-small">Залог: ${car.deposit}</div>
        `;
    }

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
        if (car.images.length > 0) {
            carImage.innerHTML = `<img src="images/cars/${car.id}/${car.images[0]}" alt="${car.title}"
                                  onerror="this.onerror=null; this.src='images/cars/default.jpg'; this.alt='Фото автомобиля'">`;
        } else {
            carImage.innerHTML = `<img src="images/cars/default.jpg" alt="Фото автомобиля">`;
        }
    }

    // Динамически генерируем миниатюры по реальному количеству фото
    const thumbnailsContainer = document.querySelector('.image-thumbnails');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = '';

        if (car.images.length === 0) {
            // Нет фото — показываем заглушку
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail active';
            thumb.innerHTML = '<div class="thumbnail-placeholder">1</div>';
            thumbnailsContainer.appendChild(thumb);
        } else {
            car.images.forEach((imgFile, index) => {
                const thumb = document.createElement('div');
                thumb.className = `thumbnail${index === 0 ? ' active' : ''}`;

                const img = document.createElement('img');
                img.src = `images/cars/${car.id}/${imgFile}`;
                img.alt = `${car.title} - фото ${index + 1}`;
                img.onerror = function() {
                    this.style.display = 'none';
                    const ph = document.createElement('div');
                    ph.className = 'thumbnail-placeholder';
                    ph.textContent = index + 1;
                    thumb.appendChild(ph);
                };
                thumb.appendChild(img);

                thumb.addEventListener('click', function() {
                    if (carImage) {
                        carImage.innerHTML = `<img src="images/cars/${car.id}/${imgFile}" alt="${car.title} - фото ${index + 1}">`;
                    }
                    thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });

                thumbnailsContainer.appendChild(thumb);
            });
        }
    }

    // Сбрасываем аккордеон скидок при открытии новой машины
    const discountsToggle = document.getElementById('discountsToggle');
    const discountsContent = document.getElementById('discountsContent');
    if (discountsToggle && discountsContent) {
        discountsToggle.classList.remove('active');
        discountsContent.classList.remove('show');
        const icon = discountsToggle.querySelector('i');
        if (icon) icon.style.transform = 'rotate(0deg)';
    }

    // ГЕНЕРИРУЕМ БЛОК ЦЕН ПО ПЕРИОДАМ
    generatePeriodsTable(car);

    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Функция генерации таблицы периодов
// Функция генерации таблицы периодов (убрана строка 31+)
function generatePeriodsTable(car) {
    const discountsGrid = document.getElementById('discountsGrid');
    if (!discountsGrid) return;

    // Фильтруем периоды, убираем те, где minDays >= 31 (долгосрочные)
    const filteredPeriods = car.periods.filter(period => period.minDays < 31);

    // Создаем таблицу периодов
    discountsGrid.innerHTML = `
        <div class="periods-table">
            <div class="periods-header">
                <div class="period-header">Период аренды</div>
                <div class="price-header">Цена за сутки</div>
            </div>
            ${filteredPeriods.map(period => {
                // Формируем текст периода
                let periodText;
                if (period.maxDays) {
                    periodText = `${period.minDays}-${period.maxDays} ${getDayWord(period.maxDays)}`;
                } else {
                    periodText = `${period.minDays}+ ${getDayWord(period.minDays)}`;
                }
                return `
                <div class="period-row" data-days="${period.minDays}" data-price="${period.price}" data-period-text="${periodText}">
                    <div class="period-cell">
                        ${periodText}
                    </div>
                    <div class="price-cell">
                        ${period.price.toLocaleString()} ₸
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;

    // Добавляем обработчики для выбора периода аренды
    const periodRows = document.querySelectorAll('.period-row');
    periodRows.forEach(row => {
        row.addEventListener('click', function() {
            // Убираем активный класс у всех строк
            periodRows.forEach(r => r.classList.remove('active'));
            // Добавляем активный класс к выбранной строке
            this.classList.add('active');

            // Обновляем основную цену на выбранный вариант
            const days = this.getAttribute('data-days');
            const price = this.getAttribute('data-price');
            const periodText = this.getAttribute('data-period-text');
            const modalPriceMain = document.getElementById('modalPriceMain');
            const modalRentBtn = document.getElementById('modalRentBtn');
            const modalPriceWithDeposit = document.getElementById('modalPriceWithDeposit');

            if (modalPriceMain) {
                modalPriceMain.textContent = `${price} ₸/сутки`;
            }
            if (modalPriceWithDeposit) {
                modalPriceWithDeposit.innerHTML = `
                    <div class="price-main">${price} ₸/сутки</div>
                    <div class="deposit-small">Залог: ${car.deposit}</div>
                `;
            }
            if (modalRentBtn) {
                modalRentBtn.textContent = `Забронировать на ${periodText}`;
            }
        });
    });

    // Активируем первую строку по умолчанию
    if (periodRows[0]) {
        periodRows[0].click();
    }

}

// Функция для получения правильной формы слова "день"
function getDayWord(days) {
    if (typeof days === 'string') days = parseInt(days);
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
    return 'дней';
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