const itemList = document.getElementById('itemList');
const addItemForm = document.getElementById('addItemForm');

// Fetch all items
async function fetchItems() {
  const response = await fetch('/api/items');
  const items = await response.json();
  itemList.innerHTML = items.map(item => `
    <li class="${item.purchased ? 'purchased' : ''}">
      <span>${item.name} (${item.quantity})</span>
      <div>
        <input type="checkbox" ${item.purchased ? 'checked' : ''} onchange="togglePurchased('${item._id}')">
        <button onclick="editItem('${item._id}')">Edit</button>
        <button onclick="deleteItem('${item._id}')">Delete</button>
      </div>
    </li>
  `).join('');
}

// Add a new item
addItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const itemName = document.getElementById('itemName').value;
  const itemQuantity = document.getElementById('itemQuantity').value;
  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
  });
  fetchItems();
  addItemForm.reset();
});

// Toggle purchased status
async function togglePurchased(id) {
  await fetch(`/api/items/${id}/purchased`, { method: 'PUT' });
  fetchItems();
}

// Edit an item
async function editItem(id) {
  const newName = prompt('Enter new name:');
  const newQuantity = prompt('Enter new quantity:');
  if (newName && newQuantity) {
    await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, quantity: newQuantity }),
    });
    fetchItems();
  }
}

// Delete an item
async function deleteItem(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  fetchItems();
}

// Initial fetch
fetchItems();