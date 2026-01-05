import { fetchCarById, deleteCar, updateCar } from "./api.js";

function getCarIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function createCarDetailsCard(car) {
  const article = document.createElement("article");
  article.className = "card shadow-lg";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body p-4";

  // Image
  const imgContainer = document.createElement("div");
  imgContainer.className = "text-center mb-4";
  const img = document.createElement("img");
  img.src = car.imageUrl || "https://placehold.co/800x500?text=Car";
  img.alt = `${car.year ?? ""} ${car.brand ?? ""} ${car.model ?? ""}`.trim() || "Car";
  img.className = "img-fluid rounded";
  img.style.maxHeight = "500px";
  imgContainer.appendChild(img);

  // Title
  const title = document.createElement("h2");
  title.className = "card-title text-center mb-4";
  title.textContent = `${car.year ?? ""} ${car.brand ?? ""} ${car.model ?? ""}`.trim();

  // Details list
  const listGroup = document.createElement("ul");
  listGroup.className = "list-group list-group-flush mb-4";

  const details = [
    { label: "Brand", value: car.brand },
    { label: "Model", value: car.model },
    { label: "Year", value: car.year },
    { label: "Color", value: car.color || "N/A" },
    { label: "Mileage", value: car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A" },
    { label: "Price", value: car.price ? `${car.price.toLocaleString()} €` : "N/A" }
  ];

  details.forEach(detail => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    const label = document.createElement("strong");
    label.textContent = `${detail.label}: `;
    const value = document.createElement("span");
    value.textContent = detail.value;
    listItem.appendChild(label);
    listItem.appendChild(value);
    listGroup.appendChild(listItem);
  });

  // Description
  const description = document.createElement("div");
  description.className = "mb-4";
  const descTitle = document.createElement("h5");
  descTitle.textContent = "Description";
  const descText = document.createElement("p");
  descText.className = "text-muted";
  descText.textContent = car.description || "Aucune description disponible.";
  description.appendChild(descTitle);
  description.appendChild(descText);

  // Action buttons
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "d-flex gap-2 justify-content-center";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-warning";
  editBtn.textContent = "Edit Car";
  editBtn.setAttribute("data-bs-toggle", "modal");
  editBtn.setAttribute("data-bs-target", "#editCarModal");
  editBtn.addEventListener("click", () => {
    fillEditForm(car);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Delete Car";
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) {
      const result = await deleteCar(car.id);
      if (result.success) {
        alert("Voiture supprimée avec succès !");
        window.location.href = "./index.html";
      } else {
        alert("Erreur lors de la suppression de la voiture.");
      }
    }
  });

  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);
  cardBody.appendChild(imgContainer);
  cardBody.appendChild(title);
  cardBody.appendChild(listGroup);
  cardBody.appendChild(description);
  cardBody.appendChild(buttonGroup);
  article.appendChild(cardBody);

  return article;
}

function showLoading(container) {
  container.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

function showError(container, message) {
  container.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Erreur</h4>
      <p>${message}</p>
      <hr>
      <a href="./index.html" class="btn btn-primary">Retour à l'accueil</a>
    </div>
  `;
}

async function initCarPage() {
  const container = document.getElementById("car-details");
  if (!container) return;

  const carId = getCarIdFromURL();
  if (!carId) {
    showError(container, "Aucun ID de voiture fourni dans l'URL.");
    return;
  }

  showLoading(container);

  const result = await fetchCarById(carId);
  if (!result || !result.success || !result.data) {
    showError(container, "Impossible de récupérer les détails de la voiture.");
    return;
  }

  container.innerHTML = "";
  container.appendChild(createCarDetailsCard(result.data));
}

function fillEditForm(car) {
  const form = document.getElementById("edit-car-form");
  if (!form) return;

  form.querySelector('[name="brand"]').value = car.brand || "";
  form.querySelector('[name="model"]').value = car.model || "";
  form.querySelector('[name="year"]').value = car.year || "";
  form.querySelector('[name="color"]').value = car.color || "";
  form.querySelector('[name="mileage"]').value = car.mileage || "";
  form.querySelector('[name="price"]').value = car.price || "";
  form.querySelector('[name="imageUrl"]').value = car.imageUrl || "";
  form.querySelector('[name="description"]').value = car.description || "";

  // Stocker l'ID de la voiture dans le formulaire
  form.dataset.carId = car.id;
}

function initEditForm() {
  const form = document.getElementById("edit-car-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const carId = form.dataset.carId;
    if (!carId) {
      alert("Erreur : ID de voiture manquant.");
      return;
    }

    const formData = new FormData(form);
    const carData = Object.fromEntries(formData.entries());

    carData.year = Number(carData.year);
    carData.mileage = carData.mileage ? Number(carData.mileage) : null;
    carData.price = carData.price ? Number(carData.price) : null;

    const result = await updateCar(carId, carData);

    if (result.success) {
      alert("Voiture modifiée avec succès !");
      // Fermer le modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("editCarModal"));
      if (modal) modal.hide();
      // Recharger les détails de la voiture
      initCarPage();
    } else {
      alert("Erreur lors de la modification de la voiture.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCarPage();
  initEditForm();
});
