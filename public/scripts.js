$(document).ready(() => {
  fetchItems();
})

const appendItem = (item) => {
  $('.append-item').append(
    ` <div class="item">
           <h2 class="item-title">${item.item}</h2>
           <h2 class="item-reason">${item.reason}</h2>
           <h2 class="item-cleanliness">${item.cleanliness}</h2>
        </div>
      </div>`
  );
  console.log('here');
}

const appendAllItems = (items) => {
  items.forEach(item => appendItem(item))
}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(storedItems => {
      appendAllItems(storedItems)
    })
    .catch(error => console.log(error))
}

const postItem = (event) => {
  event.preventDefault();
  const newItem = $('.item-name').val();
  const newReason = $('.reason').val();
  const newCleanliness = $('.cleanliness').val();

  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify({ item: newItem, reason: newReason, cleanliness: newCleanliness }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(item => {
      appendItem(item)
    })
    .catch(error => console.log(error))
}


$('.new-item-save').on('click', postItem);
