const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//Modal Event Listner 

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (event) => (event.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    Object.keys(bookmarks).forEach((id) => {
        if (bookmarks[id]) {
            const { name, url } = bookmarks[id];
        // Item 
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`);
        // Favicon / Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
        }
    });
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from local storage if availiable
    if (localStorage.getItem(bookmarks)) {
        bookmarks =JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in local storage
        const id = 'http://amazon.se'
        bookmarks[id] = {
            name: 'Amazon',
            url: 'http://amazon.se'
        }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); 
    }
    buildBookmarks();
}

// Delete a bookmark
function deleteBookmark(id) {
        if (bookmarks[id]) {
            delete bookmarks[id];
    };
    // Update bookmarks in local storage and re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    buildBookmarks();
}

// Handle data from Form
function storeBookmark (event) {
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    // Set bookmark object, add to array
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    // Set bookmarks in local Storage, fetch reset input field
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listner
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();