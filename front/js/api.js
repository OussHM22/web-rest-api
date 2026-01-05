import { API_CONFIG } from "./config.js";

export async function fetchAllCars() {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARS}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": API_CONFIG.API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json(); // ton backend renvoie {success, data, ...}
  } catch (err) {
    console.error("fetchAllCars error:", err);
    return null;
  }
}

export async function fetchCarById(id) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAR_BY_ID(id)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": API_CONFIG.API_KEY }
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    return await response.json();
  } catch (err) {
    console.error("fetchCarById error:", err);
    return null;
  }
}

export async function createCar(carData) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARS}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_CONFIG.API_KEY
      },
      body: JSON.stringify(carData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("createCar error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateCar(id, carData) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAR_BY_ID(id)}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_CONFIG.API_KEY
      },
      body: JSON.stringify(carData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("updateCar error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteCar(id) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAR_BY_ID(id)}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "x-api-key": API_CONFIG.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("deleteCar error:", err);
    return { success: false, error: err.message };
  }
}
