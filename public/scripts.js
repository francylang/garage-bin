const appendItem = (item) => {
  $('.append-item').append(
    ` <div class="item">
      <div class="title">
         <h2 class="item-title item-id-${item.id}" id="item${item.id}">${item.item}</h2>
       </div>
         <div class="item-id-${item.id} inactive">
           <h2 class="item-reason">${item.reason}</h2>
           <h2 class="item-reason clean-${item.id}">${item.cleanliness}</h2>
       <select class="status-update" value="Select Condition" id='item${item.id}'>
         <option class="dropdown-option">Update Status</option>
         <option class="dropdown-option" value='Sparkling'>Sparkling</option>
         <option class="dropdown-option" value='Dusty'>Dusty</option>
         <option class="dropdown-option" value='Rancid'>Rancid</option>
       </select>
         </div>
      </div>`
  );
}

const displayCount = (items) => {
  $('.item-count').text(`Total Count: ${items.length}`);
  $('.rancid-count').text(`Rancid: ${countCleanliness(items, 'rancid')}`);
  $('.sparkling-count').text(`Sparkling: ${countCleanliness(items, 'sparkling')}`);
  $('.dusty-count').text(`Dusty: ${countCleanliness(items, 'dusty')}`);
}

const countCleanliness = (items, status) => {
  const filtered = items.filter(item => item.cleanliness === status);
  return filtered.length;
}

const appendAllItems = (items) => {
  $('.append-item').html('')
  const sorted = items.sort((a, b) => {
  const nameA = a.item.toUpperCase();
  const nameB = b.item.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
    });
  sorted.forEach(item => appendItem(item))
}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(storedItems => {
      appendAllItems(storedItems)
      displayCount(storedItems)
    })
    .catch(error => console.log(error))
}

const postItem = (event) => {
  event.preventDefault();
  const newItem = $('.item-name').val();
  const newReason = $('.reason').val();
  const newCleanliness = $('.status').val();

  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify({ item: newItem, reason: newReason, cleanliness: newCleanliness }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(item => {
      fetchItems()
    })
    .catch(error => console.log(error))
    $('.item-name').val('');
    $('.reason').val('');
    $('.cleanliness').val('');
}

const toggleGarage = () => {
  $('.garage-door').slideToggle(3000, () => {
    const text = $('.garage-opener').text();
    text === 'Open Garage' ?
      $('.garage-opener').text('Close Garage') :
      $('.garage-opener').text('Open Garage')
  });
}

const revealContent = (event) => {
  const itemNumber = event.target.id.slice(4)
  const revealMe = $(`.item-id-${itemNumber}`)
  revealMe.toggleClass('active')
}

const patchStatus = (id, body) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .catch(error => console.log(error));
};

const updateStatus = () => {
  const updateClean = {
    cleanliness: $(event.target).val()
  }
  console.log(updateClean);
  const id = $(event.target).closest('.status-update').attr('id').slice(4)
  console.log(id);

  patchStatus(id, updateClean)
  $(`.clean-${id}`).text(`${$(event.target).val()}`)
}

$('.append-item').on('change', 'select', (event) => updateStatus(event))
$('.garage-opener').on('click', toggleGarage)
$('.new-item-save').on('click', postItem);
$('.append-item').on('click', '.item-title', (event) => revealContent(event));
fetchItems();
