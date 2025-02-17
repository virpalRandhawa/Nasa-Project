const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl =   `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;



let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

// 4 FavoriteDOM element
function createDOMNodes(page) {
    console.log(page)
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log('Current Array', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Images
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'Nasa Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results') {
        saveText.textContent = 'Add To Favorites';
        saveText.setAttribute('onclick',`saveFavorite('${result.url}')`);
        }else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick',`removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date,copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    });
}


//2 UpdateDom 
function updateDOM(page) {
    console.log('hello')

    // Get Favorites from localStorage
    if(localStorage.getItem('nasaFavorites')) {    
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    console.log('get item',favorites);
    }
    imagesContainer.textContent = ''; 
    createDOMNodes(page);
    showContent(page);
}

//1 Get 10 Images Nasa  Api
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try{
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    console.log('APi Data',resultsArray);
    updateDOM('results');
  }catch(error) {
    console.log('error',error)
  }
}

// 3 Add Result to Favorites
function saveFavorite(itemUrl) {  
    console.log(itemUrl) 
    // Loop Through Results  array to Select Favorite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            console.log('add',favorites);
            // Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            },2000);
            // Set Favorites in LocalStorage           
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        }
    });
}

// 5 Remove Item From Favorites
function removeFavorite(itemUrl) {
    if(favorites[itemUrl]){
        console.log('remove')
        delete favorites[itemUrl];
        //  Set Favorites in LocalStorage     
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();














