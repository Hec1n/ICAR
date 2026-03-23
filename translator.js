// =============================================
// i18n — автоматический переводчик страниц
// Не требует изменений в HTML — сам находит и заменяет текст
// JSON формат: { "Русский текст": "Translation" }
// =============================================
(function () {
    'use strict';

    var STORAGE_KEY = 'icar_lang';
    var DEFAULT_LANG = 'ru';
    var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    var dictCache = {};       // lang -> dict
    var originals = [];       // массив сохранённых оригиналов для отката

    // ---- Загрузка JSON и применение ----
    async function setLang(lang) {
        if (lang === DEFAULT_LANG) {
            revert();
            currentLang = DEFAULT_LANG;
            localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
            document.documentElement.lang = DEFAULT_LANG;
            updateLangUI(DEFAULT_LANG);
            return;
        }

        if (!dictCache[lang]) {
            try {
                var resp = await fetch('lang/' + lang + '.json');
                if (!resp.ok) throw new Error(resp.status);
                dictCache[lang] = await resp.json();
            } catch (e) {
                console.warn('[i18n] Failed to load lang/' + lang + '.json', e);
                return;
            }
        }

        revert(); // сначала вернуть к русскому
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        translate(dictCache[lang]);
        updateLangUI(lang);

        // событие для динамического контента (script.js и т.д.)
        window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang, dict: dictCache[lang] } }));
    }

    // ---- Перевод всей страницы ----
    function translate(dict) {
        // 1. Title страницы
        var origTitle = document.title;
        if (dict[origTitle]) {
            originals.push({ type: 'title', val: origTitle });
            document.title = dict[origTitle];
        }

        // 2. Текстовые узлы внутри body
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        var node;
        while (node = walker.nextNode()) {
            var trimmed = node.textContent.trim();
            if (!trimmed) continue;

            // Пропускаем скрипты/стили
            var parent = node.parentElement;
            if (!parent) continue;
            var tag = parent.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;

            if (dict[trimmed]) {
                var orig = node.textContent;
                // сохраняем ведущие/конечные пробелы
                var lead = orig.match(/^\s*/)[0];
                var trail = orig.match(/\s*$/)[0];
                originals.push({ type: 'text', node: node, val: orig });
                node.textContent = lead + dict[trimmed] + trail;
            }
        }

        // 3. Placeholder-ы input/textarea
        var inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        for (var i = 0; i < inputs.length; i++) {
            var el = inputs[i];
            var ph = el.placeholder.trim();
            if (ph && dict[ph]) {
                originals.push({ type: 'placeholder', el: el, val: el.placeholder });
                el.placeholder = dict[ph];
            }
        }

        // 4. Option-ы в select
        var options = document.querySelectorAll('select option');
        for (var j = 0; j < options.length; j++) {
            var opt = options[j];
            var txt = opt.textContent.trim();
            if (txt && dict[txt]) {
                originals.push({ type: 'option', el: opt, val: opt.textContent });
                opt.textContent = dict[txt];
            }
        }
    }

    // ---- Откат к оригинальному русскому тексту ----
    function revert() {
        for (var i = originals.length - 1; i >= 0; i--) {
            var o = originals[i];
            if (o.type === 'title') {
                document.title = o.val;
            } else if (o.type === 'text') {
                o.node.textContent = o.val;
            } else if (o.type === 'placeholder') {
                o.el.placeholder = o.val;
            } else if (o.type === 'option') {
                o.el.textContent = o.val;
            }
        }
        originals = [];
    }

    // ---- Перевод динамически добавленного контента ----
    function translateElement(root) {
        if (currentLang === DEFAULT_LANG) return;
        var dict = dictCache[currentLang];
        if (!dict) return;

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var node;
        while (node = walker.nextNode()) {
            var trimmed = node.textContent.trim();
            if (!trimmed) continue;
            var parent = node.parentElement;
            if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
            if (dict[trimmed]) {
                var orig = node.textContent;
                var lead = orig.match(/^\s*/)[0];
                var trail = orig.match(/\s*$/)[0];
                originals.push({ type: 'text', node: node, val: orig });
                node.textContent = lead + dict[trimmed] + trail;
            }
        }

        // placeholder-ы внутри нового контента
        var inputs = root.querySelectorAll ? root.querySelectorAll('input[placeholder], textarea[placeholder]') : [];
        for (var i = 0; i < inputs.length; i++) {
            var ph = inputs[i].placeholder.trim();
            if (ph && dict[ph]) {
                originals.push({ type: 'placeholder', el: inputs[i], val: inputs[i].placeholder });
                inputs[i].placeholder = dict[ph];
            }
        }

        // option-ы
        var opts = root.querySelectorAll ? root.querySelectorAll('select option') : [];
        for (var j = 0; j < opts.length; j++) {
            var txt = opts[j].textContent.trim();
            if (txt && dict[txt]) {
                originals.push({ type: 'option', el: opts[j], val: opts[j].textContent });
                opts[j].textContent = dict[txt];
            }
        }
    }

    // ---- Обновление кнопки языка и active-состояния ----
    function updateLangUI(lang) {
        var labels = { ru: 'РУС', en: 'ENG', kz: 'КАЗ', zh: '中文', de: 'DE' };
        var btn = document.getElementById('currentLang');
        if (btn) {
            var span = btn.querySelector('span');
            if (span) span.textContent = labels[lang] || lang.toUpperCase();
        }
        var langMap = { 'РУС': 'ru', 'ENG': 'en', 'КАЗ': 'kz', '中文': 'zh', 'DE': 'de' };
        document.querySelectorAll('.lang-option').forEach(function (opt) {
            var optLang = langMap[opt.getAttribute('data-lang')] || opt.getAttribute('data-lang');
            opt.classList.toggle('active', optLang === lang);
        });
    }

    // ---- Функция перевода для JS-кода: i18n.t('Русский текст') → перевод ----
    function t(text) {
        if (currentLang === DEFAULT_LANG) return text;
        var dict = dictCache[currentLang];
        return (dict && dict[text]) || text;
    }

    // ---- Инициализация ----
    function init() {
        var langMap = { 'РУС': 'ru', 'ENG': 'en', 'КАЗ': 'kz', '中文': 'zh', 'DE': 'de' };

        document.querySelectorAll('.lang-option').forEach(function (opt) {
            opt.addEventListener('click', function () {
                var dataLang = this.getAttribute('data-lang');
                var lang = langMap[dataLang] || dataLang.toLowerCase();
                setLang(lang);
            });
        });

        // Загружаем сохранённый язык
        if (currentLang !== DEFAULT_LANG) {
            setLang(currentLang);
        }
    }

    // ---- Экспорт ----
    window.i18n = {
        setLang: setLang,
        t: t,
        translateElement: translateElement,
        getLang: function () { return currentLang; },
        getDict: function () { return dictCache[currentLang] || {}; }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
