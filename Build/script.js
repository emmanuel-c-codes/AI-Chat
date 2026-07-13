// Store items in localStorage
const items = JSON.parse(localStorage.getItem('items')) || [];

// Handle posting new items
const postForm = document.getElementById('postForm');
if (postForm) {
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newItem = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: document.getElementById('price').value,
      category: document.getElementById('category').value,
      contact: document.getElementById('contact').value
    };
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    alert('Item posted successfully!');
    window.location.href = 'index.html';
  });
}

// Display items on Home
const itemsGrid = document.getElementById('itemsGrid');
if (itemsGrid) {
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.title}</h3>
                      <p>${item.description}</p>
                      <p><strong>$${item.price}</strong></p>
                      <p>Category: ${item.category}</p>
                      <p>Contact: ${item.contact}</p>`;
    itemsGrid.appendChild(card);
  });
}

// Display items on Dashboard
const dashboardItems = document.getElementById('dashboardItems');
if (dashboardItems) {
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.title}</h3>
                      <p>${item.description}</p>
                      <p><strong>$${item.price}</strong></p>
                      <p>Category: ${item.category}</p>
                      <p>Contact: ${item.contact}</p>
                      <button onclick="deleteItem(${index})">Delete</button>`;
    dashboardItems.appendChild(card);
  });
}

function deleteItem(index) {
  items.splice(index, 1);
  localStorage.setItem('items', JSON.stringify(items));
  window.location.reload();
}
