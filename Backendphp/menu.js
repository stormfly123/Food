// Dummy data for initial menu items (can be replaced with actual data from backend)
let menuItems = [
    { id: 1, name: "Cheeseburger", price: 8.99, description: "Delicious cheeseburger with fresh ingredients." },
    { id: 2, name: "Margherita Pizza", price: 12.99, description: "Classic Italian pizza with tomato and mozzarella." },
    { id: 3, name: "Caesar Salad", price: 6.99, description: "Fresh Caesar salad with crunchy croutons." }
];

// Function to initialize menu items on page load
function initializeMenuItems() {
    const menuList = document.getElementById("menuList");

    menuItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.description}</td>
            <td class="action-buttons">
                <button onclick="editMenuItem(${item.id})">Edit</button>
                <button onclick="deleteMenuItem(${item.id})">Delete</button>
            </td>
        `;
        menuList.appendChild(row);
    });
}

// Function to add or edit menu item
document.getElementById("menuForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const itemId = document.getElementById("itemId").value;
    const itemName = document.getElementById("itemName").value;
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);
    const itemDescription = document.getElementById("itemDescription").value;

    if (itemId) {
        // Edit existing item
        const existingItem = menuItems.find(item => item.id === parseInt(itemId));
        if (existingItem) {
            existingItem.name = itemName;
            existingItem.price = itemPrice;
            existingItem.description = itemDescription;
        }
    } else {
        // Add new item
        const newItem = {
            id: menuItems.length + 1,
            name: itemName,
            price: itemPrice,
            description: itemDescription
        };
        menuItems.push(newItem);
    }

    // Clear form fields
    document.getElementById("itemId").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemDescription").value = "";

    // Refresh menu list
    refreshMenuList();
});

// Function to refresh menu list
function refreshMenuList() {
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = "";

    menuItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.description}</td>
            <td class="action-buttons">
                <button onclick="editMenuItem(${item.id})">Edit</button>
                <button onclick="deleteMenuItem(${item.id})">Delete</button>
            </td>
        `;
        menuList.appendChild(row);
    });
}

// Function to edit menu item
function editMenuItem(id) {
    const itemToEdit = menuItems.find(item => item.id === id);
    if (itemToEdit) {
        document.getElementById("itemId").value = itemToEdit.id;
        document.getElementById("itemName").value = itemToEdit.name;
        document.getElementById("itemPrice").value = itemToEdit.price;
        document.getElementById("itemDescription").value = itemToEdit.description;
    }
}

// Function to delete menu item
function deleteMenuItem(id) {
    menuItems = menuItems.filter(item => item.id !== id);
    refreshMenuList();
}

// Initialize menu items on page load
initializeMenuItems();
