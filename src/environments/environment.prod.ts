// Настройки для продакшена (сборка в Docker)
export const environment = {
  production: true,
  apiUrl: ''  // Пустая строка - запросы будут идти на тот же хост (через nginx прокси)
};
