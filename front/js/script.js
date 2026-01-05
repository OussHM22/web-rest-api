import { fetchAllCars, createCar, deleteCar } from "./api.js";

function createCarCard(car) {
  const article = document.createElement("article");
  article.className = "card shadow-sm";

  const link = document.createElement("a");
  link.href = `car.html?id=${car.id}`;

  const img = document.createElement("img");
  img.className = "card-img-top";
  img.src = car.imageUrl || "https://placehold.co/600x400?text=Car";
  img.alt = `${car.year ?? ""} ${car.brand ?? ""} ${car.model ?? ""}`.trim() || "Car";

  link.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = `${car.year ?? ""} ${car.brand ?? ""} ${car.model ?? ""}`.trim();

  const desc = document.createElement("p");
  desc.className = "card-text";
  desc.textContent = car.description || "Aucune description.";

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "d-flex gap-2";

  const more = document.createElement("a");
  more.className = "btn btn-primary";
  more.href = `car.html?id=${car.id}`;
  more.textContent = "See more";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Êtes-vous sûr de vouloir supprimer la voiture ${car.brand} ${car.model} ?`)) {
      const result = await deleteCar(car.id);
      if (result.success) {
        alert("Voiture supprimée avec succès !");
        initHomePage();
      } else {
        alert("Erreur lors de la suppression de la voiture.");
      }
    }
  });

  buttonGroup.append(more, deleteBtn);
  body.append(title, desc, buttonGroup);
  article.append(link, body);

  return article;
}

function showLoading(container) {
  container.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border" role="status"></div>
    </div>
  `;
}

function showError(container, message) {
  container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

function displayCars(cars, container) {
  container.innerHTML = "";

  if (!cars || cars.length === 0) {
    container.innerHTML = `<p class="text-muted">Aucune voiture disponible.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  cars.forEach(car => fragment.appendChild(createCarCard(car)));
  container.appendChild(fragment);
}

async function initHomePage() {
  const container = document.querySelector(".card-cont");
  if (!container) return;

  showLoading(container);

  const result = await fetchAllCars();
  if (!result || !result.data) {
    showError(container, "Impossible de récupérer les voitures.");
    return;
  }

  displayCars(result.data, container);
}

document.addEventListener("DOMContentLoaded", initHomePage);

// FORMULAIRE POST
const form = document.getElementById("add-car-form");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const carData = Object.fromEntries(formData.entries());

    carData.year = Number(carData.year);
    carData.mileage = Number(carData.mileage);
    carData.price = Number(carData.price);

    const result = await createCar(carData);

    if (result.success) {
      alert("Voiture ajoutée avec succès !");
      form.reset();
      // Fermer le modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("addCarModal"));
      if (modal) modal.hide();
      initHomePage();
    } else {
      alert("Erreur lors de l'ajout de la voiture.");
    }
  });
}
