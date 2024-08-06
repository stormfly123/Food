document.getElementById('foodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('foodName').value;
    const description = document.getElementById('foodDescription').value;
    const price = document.getElementById('foodPrice').value;
    const image = document.getElementById('foodImage').files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        const tableBody = document.getElementById('foodTableBody');
        const newRow = tableBody.insertRow();
        
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);
        
        cell1.innerHTML = `<img src="${imageUrl}" alt="${name}">`;
        cell2.innerText = name;
        cell3.innerText = description;
        cell4.innerText = `$${price}`;
        cell5.innerHTML = '<button>Edit</button> <button>Delete</button>';
        
        document.getElementById('foodForm').reset();
    };
    reader.readAsDataURL(image);
});
