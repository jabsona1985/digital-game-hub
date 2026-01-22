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
    // Game Detail Page
    gameDetail: {
      backToGames: 'Back to Games',
      description: 'About This Game',
      inStock: 'In Stock',
      keysAvailable: 'keys available',
      instantDeliveryDesc: 'Get your key instantly',
      securePaymentDesc: 'Safe & encrypted',
      supportDesc: 'Always here to help',
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
    // Games Page
    gamesPage: {
      title: 'All Games',
      subtitle: 'Discover your next favorite game from our collection',
      platforms: 'Platforms',
      categories: 'Categories',
      priceRange: 'Price Range',
      filters: 'Filters',
      clearFilters: 'Clear Filters',
      sortBy: 'Sort by',
      sortNewest: 'Newest',
      sortPriceLow: 'Price: Low to High',
      sortPriceHigh: 'Price: High to Low',
      sortName: 'Name',
      sortRating: 'Rating',
      gamesFound: 'games found',
      noResultsHint: 'Try adjusting your filters or search query',
    },
    // Cart
    cart: {
      title: 'Shopping Cart',
      items: 'items',
      empty: 'Your cart is empty',
      emptyHint: 'Add some games to get started',
      browseGames: 'Browse Games',
      subtotal: 'Subtotal',
      total: 'Total',
      clear: 'Clear',
      checkout: 'Checkout',
      addedToCart: 'Added to cart!',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search games...',
      noResults: 'No games found',
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
    // Game Detail Page
    gameDetail: {
      backToGames: 'თამაშებში დაბრუნება',
      description: 'თამაშის შესახებ',
      inStock: 'მარაგშია',
      keysAvailable: 'გასაღები ხელმისაწვდომია',
      instantDeliveryDesc: 'მიიღე გასაღები მყისიერად',
      securePaymentDesc: 'უსაფრთხო და დაშიფრული',
      supportDesc: 'ყოველთვის მზად დახმარებისთვის',
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
    // Games Page
    gamesPage: {
      title: 'ყველა თამაში',
      subtitle: 'აღმოაჩინე შენი შემდეგი საყვარელი თამაში ჩვენი კოლექციიდან',
      platforms: 'პლატფორმები',
      categories: 'კატეგორიები',
      priceRange: 'ფასის დიაპაზონი',
      filters: 'ფილტრები',
      clearFilters: 'ფილტრების გასუფთავება',
      sortBy: 'დალაგება',
      sortNewest: 'უახლესი',
      sortPriceLow: 'ფასი: დაბლიდან მაღლამდე',
      sortPriceHigh: 'ფასი: მაღლიდან დაბლამდე',
      sortName: 'სახელი',
      sortRating: 'რეიტინგი',
      gamesFound: 'თამაში მოიძებნა',
      noResultsHint: 'სცადე ფილტრების ან ძებნის შეცვლა',
    },
    // Cart
    cart: {
      title: 'კალათა',
      items: 'ნივთი',
      empty: 'თქვენი კალათა ცარიელია',
      emptyHint: 'დაამატე რამდენიმე თამაში დასაწყებად',
      browseGames: 'თამაშების ნახვა',
      subtotal: 'ჯამი',
      total: 'სულ',
      clear: 'გასუფთავება',
      checkout: 'გადახდა',
      addedToCart: 'კალათაში დამატებულია!',
    },
    // Common
    common: {
      loading: 'იტვირთება...',
      error: 'რაღაც არასწორად წავიდა',
      save: 'შენახვა',
      cancel: 'გაუქმება',
      delete: 'წაშლა',
      edit: 'რედაქტირება',
      search: 'თამაშების ძებნა...',
      noResults: 'თამაშები ვერ მოიძებნა',
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
    // Game Detail Page
    gameDetail: {
      backToGames: 'Назад к играм',
      description: 'Об игре',
      inStock: 'В наличии',
      keysAvailable: 'ключей доступно',
      instantDeliveryDesc: 'Получите ключ мгновенно',
      securePaymentDesc: 'Безопасно и зашифровано',
      supportDesc: 'Всегда готовы помочь',
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
    // Games Page
    gamesPage: {
      title: 'Все игры',
      subtitle: 'Найди свою следующую любимую игру в нашей коллекции',
      platforms: 'Платформы',
      categories: 'Категории',
      priceRange: 'Диапазон цен',
      filters: 'Фильтры',
      clearFilters: 'Сбросить фильтры',
      sortBy: 'Сортировка',
      sortNewest: 'Новинки',
      sortPriceLow: 'Цена: по возрастанию',
      sortPriceHigh: 'Цена: по убыванию',
      sortName: 'Название',
      sortRating: 'Рейтинг',
      gamesFound: 'игр найдено',
      noResultsHint: 'Попробуй изменить фильтры или поисковый запрос',
    },
    // Cart
    cart: {
      title: 'Корзина',
      items: 'товаров',
      empty: 'Ваша корзина пуста',
      emptyHint: 'Добавьте несколько игр для начала',
      browseGames: 'Смотреть игры',
      subtotal: 'Подитог',
      total: 'Итого',
      clear: 'Очистить',
      checkout: 'Оформить заказ',
      addedToCart: 'Добавлено в корзину!',
    },
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Что-то пошло не так',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      search: 'Поиск игр...',
      noResults: 'Игры не найдены',
    },
  },
} as const;

// Deep type that converts literal strings to string type
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type TranslationKeys = DeepStringify<typeof translations.en>;