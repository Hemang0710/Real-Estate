document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("propertyForm");
    const propertyList = document.getElementById("propertyList");
    
    // Fetch and display properties
    async function loadProperties() {
        const response = await fetch("/api/properties"); // API route to fetch properties
        const properties = await response.json();

        propertyList.innerHTML = properties.map(prop => `
                <div>
                    <h3>${property.title}</h3>
                    <p>${property.addressLine1}, ${property.addressLine2}</p>
                    <p>Price: $${property.price}</p>
                    <p>${property.beds} Beds | ${property.baths} Baths</p>
                    <img src="${property.image}" width="200" alt="Property Image">
                </div>
        `).join("");
    }

    // Handle form submission
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        const response = await fetch("/properties", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Property added successfully!");
            form.reset();
            window.location.href = "/"; // Redirect to homepage
        } else {
            alert("Failed to add property");
        }
    });

    // Load properties on page load
    loadProperties();
});
