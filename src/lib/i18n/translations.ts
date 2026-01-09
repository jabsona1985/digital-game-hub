export type Language = 'en' | 'ge' | 'ru';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      games: 'Games',
      deals: 'Deals',
      about: 'About',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      admin: 'Admin',
      myKeys: 'My Keys',
    },
    // Hero Section
    hero: {
      title: 'Unlock Your Next',
      titleHighlight: 'Gaming Adventure',
      subtitle: 'Instant digital game keys at unbeatable prices. Join thousands of gamers worldwide.',
      cta: 'Browse Games',
      ctaSecondary: 'View Deals',
    },
    // Features
    features: {
      title: 'Why Choose Us',
      subtitle: 'Experience gaming like never before',
      instant: {
        title: 'Instant Delivery',
        description: 'Get your game keys within seconds after purchase',
      },
      secure: {
        title: 'Secure Payment',
        description: 'All transactions protected with bank-level encryption',
      },
      support: {
        title: '24/7 Support',
        description: 'Our team is always ready to help you',
      },
      prices: {
        title: 'Best Prices',
        description: 'Guaranteed lowest prices or money back',
      },
    },
    // Games Section
    games: {
      title: 'Featured Games',
      subtitle: 'Discover the hottest titles',
      viewAll: 'View All Games',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      outOfStock: 'Out of Stock',
      platforms: 'Platforms',
      category: 'Category',
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
    },
    // Auth
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      login: 'Login',
      signup: 'Create Account',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginSuccess: 'Welcome back!',
      signupSuccess: 'Account created successfully!',
      logoutSuccess: 'See you soon!',
    },
    // Admin
    admin: {
      title: 'Admin Dashboard',
      games: 'Manage Games',
      keys: 'Manage Keys',
      orders: 'Orders',
      users: 'Users',
      addGame: 'Add Game',
      addKey: 'Add Key',
      editGame: 'Edit Game',
      deleteGame: 'Delete Game',
      totalGames: 'Total Games',
      totalKeys: 'Available Keys',
      totalOrders: 'Total Orders',
      revenue: 'Revenue',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search...',
      noResults: 'No results found',
    },
  },
  ge: {
    // Navigation
    nav: {
      home: 'მთავარი',
      games: 'თამაშები',
      deals: 'ფასდაკლებები',
      about: 'ჩვენს შესახებ',
      login: 'შესვლა',
      signup: 'რეგისტრაცია',
      logout: 'გასვლა',
      admin: 'ადმინი',
      myKeys: 'ჩემი გასაღებები',
    },
    // Hero Section
    hero: {
      title: 'გახსენი შენი შემდეგი',
      titleHighlight: 'სათამაშო თავგადასავალი',
      subtitle: 'მყისიერი ციფრული თამაშის გასაღებები შეუდარებელ ფასებში. შეუერთდი ათასობით მოთამაშეს.',
      cta: 'თამაშების ნახვა',
      ctaSecondary: 'ფასდაკლებები',
    },
    // Features
    features: {
      title: 'რატომ ჩვენ',
      subtitle: 'განიცადე თამაშები როგორც არასდროს',
      instant: {
        title: 'მყისიერი მიწოდება',
        description: 'მიიღე თამაშის გასაღებები წამებში შეძენის შემდეგ',
      },
      secure: {
        title: 'უსაფრთხო გადახდა',
        description: 'ყველა ტრანზაქცია დაცულია საბანკო დონის დაშიფვრით',
      },
      support: {
        title: '24/7 მხარდაჭერა',
        description: 'ჩვენი გუნდი ყოველთვის მზადაა დაგეხმაროს',
      },
      prices: {
        title: 'საუკეთესო ფასები',
        description: 'გარანტირებული ყველაზე დაბალი ფასები',
      },
    },
    // Games Section
    games: {
      title: 'რჩეული თამაშები',
      subtitle: 'აღმოაჩინე ყველაზე ცხელი სათაურები',
      viewAll: 'ყველა თამაშის ნახვა',
      addToCart: 'კალათაში დამატება',
      buyNow: 'ახლავე ყიდვა',
      outOfStock: 'არ არის მარაგში',
      platforms: 'პლატფორმები',
      category: 'კატეგორია',
    },
    // Footer
    footer: {
      rights: 'ყველა უფლება დაცულია',
      privacy: 'კონფიდენციალურობის პოლიტიკა',
      terms: 'მომსახურების პირობები',
      contact: 'კონტაქტი',
    },
    // Auth
    auth: {
      email: 'ელ.ფოსტა',
      password: 'პაროლი',
      confirmPassword: 'გაიმეორეთ პაროლი',
      login: 'შესვლა',
      signup: 'რეგისტრაცია',
      forgotPassword: 'დაგავიწყდა პაროლი?',
      noAccount: 'არ გაქვს ანგარიში?',
      hasAccount: 'უკვე გაქვს ანგარიში?',
      loginSuccess: 'კეთილი იყოს შენი დაბრუნება!',
      signupSuccess: 'ანგარიში წარმატებით შეიქმნა!',
      logoutSuccess: 'მალე გნახავთ!',
    },
    // Admin
    admin: {
      title: 'ადმინის პანელი',
      games: 'თამაშების მართვა',
      keys: 'გასაღებების მართვა',
      orders: 'შეკვეთები',
      users: 'მომხმარებლები',
      addGame: 'თამაშის დამატება',
      addKey: 'გასაღების დამატება',
      editGame: 'თამაშის რედაქტირება',
      deleteGame: 'თამაშის წაშლა',
      totalGames: 'სულ თამაშები',
      totalKeys: 'ხელმისაწვდომი გასაღებები',
      totalOrders: 'სულ შეკვეთები',
      revenue: 'შემოსავალი',
    },
    // Common
    common: {
      loading: 'იტვირთება...',
      error: 'რაღაც არასწორად წავიდა',
      save: 'შენახვა',
      cancel: 'გაუქმება',
      delete: 'წაშლა',
      edit: 'რედაქტირება',
      search: 'ძებნა...',
      noResults: 'შედეგები ვერ მოიძებნა',
    },
  },
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      games: 'Игры',
      deals: 'Скидки',
      about: 'О нас',
      login: 'Вход',
      signup: 'Регистрация',
      logout: 'Выход',
      admin: 'Админ',
      myKeys: 'Мои ключи',
    },
    // Hero Section
    hero: {
      title: 'Открой своё следующее',
      titleHighlight: 'игровое приключение',
      subtitle: 'Мгновенные цифровые ключи к играм по непревзойдённым ценам. Присоединяйся к тысячам геймеров.',
      cta: 'Смотреть игры',
      ctaSecondary: 'Скидки',
    },
    // Features
    features: {
      title: 'Почему мы',
      subtitle: 'Испытай игры как никогда раньше',
      instant: {
        title: 'Мгновенная доставка',
        description: 'Получи ключи к играм в течение секунд после покупки',
      },
      secure: {
        title: 'Безопасная оплата',
        description: 'Все транзакции защищены банковским шифрованием',
      },
      support: {
        title: 'Поддержка 24/7',
        description: 'Наша команда всегда готова помочь',
      },
      prices: {
        title: 'Лучшие цены',
        description: 'Гарантированно самые низкие цены',
      },
    },
    // Games Section
    games: {
      title: 'Избранные игры',
      subtitle: 'Открой самые горячие новинки',
      viewAll: 'Смотреть все игры',
      addToCart: 'В корзину',
      buyNow: 'Купить сейчас',
      outOfStock: 'Нет в наличии',
      platforms: 'Платформы',
      category: 'Категория',
    },
    // Footer
    footer: {
      rights: 'Все права защищены',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      contact: 'Связаться с нами',
    },
    // Auth
    auth: {
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      login: 'Войти',
      signup: 'Создать аккаунт',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      loginSuccess: 'С возвращением!',
      signupSuccess: 'Аккаунт успешно создан!',
      logoutSuccess: 'До скорой встречи!',
    },
    // Admin
    admin: {
      title: 'Панель администратора',
      games: 'Управление играми',
      keys: 'Управление ключами',
      orders: 'Заказы',
      users: 'Пользователи',
      addGame: 'Добавить игру',
      addKey: 'Добавить ключ',
      editGame: 'Редактировать игру',
      deleteGame: 'Удалить игру',
      totalGames: 'Всего игр',
      totalKeys: 'Доступных ключей',
      totalOrders: 'Всего заказов',
      revenue: 'Доход',
    },
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Что-то пошло не так',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      search: 'Поиск...',
      noResults: 'Ничего не найдено',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;