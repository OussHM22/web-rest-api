export const API_CONFIG = {
  BASE_URL: "https://car-api-3f03.onrender.com", // <-- remplace
  API_KEY: "ma-super-cle-api-2024",
  ENDPOINTS: {
    CARS: "/api/cars",
    CAR_BY_ID: (id) => `/api/cars/${id}`,
  }
};
