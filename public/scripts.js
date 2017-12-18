$(document).ready(() => {
  fetchItems();
})

const appendItem = (item) => {
  $('.append-item').append(
    ` <div class="item">
         <h2 class="item-title">${item.item}</h2>
         <div class="hide-content">
           <h2 class="item-reason">${item.reason}</h2>
           <h2 class="item-reason">${item.cleanliness}</h2>
         </div>
      </div>`
  );
}

$('.append-item').on('click', '.item',
  (event => revealContent(event.target)))

const revealContent = () => {
  console.log(event.target);
  $(event.target).toggleClass('reveal');
}

const displayCount = (items) => {
  console.log(items);
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
  items.forEach(item => appendItem(item))
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
  console.log();
  $('.garage-door').slideToggle(3000, () => {
    const text = $('.garage-opener').text();
    text === 'Open Garage' ?
      $('.garage-opener').text('Close Garage') :
      $('.garage-opener').text('Open Garage')
  });
}

$('.garage-opener').on('click', toggleGarage)
$('.new-item-save').on('click', postItem);


// $('body').click(function(){
//     $("p").slideToggle();
// });
