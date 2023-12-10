const results = document.querySelector('#results');
const form = document.querySelector('.searcher');
const btnSearch = document.querySelector('.searcher button[type="submit"]');
const footer = document.querySelector('#footer');

const url = 'https://rickandmortyapi.com/api/character';

window.onload = () => {
    getAllCharacters();

    btnSearch.addEventListener('click', getCharactersByName); 
};

function getAllCharacters() {

    fetch(url)
        .then( response => response.json())
        .then( data => {
            showCharacters(data.results, data.info);
            createPaginator(data.info);
        })
    ;
}

function getCharactersByName(e) {
    e.preventDefault();

    const inputSearch = document.querySelector('#search').value;
    const selectStatus = document.querySelector('#status').value;

    if(inputSearch.trim() === '' && selectStatus.trim() === '') {
        showAlert('Write some character name');
        return;
    }

    let getCharacters;

    if(selectStatus.trim() === '') {
        getCharacters = `${url}/?name=${inputSearch}`;
    } else {
        getCharacters = `${url}/?name=${inputSearch}&status=${selectStatus}`;
    }

    fetch(getCharacters)
        .then( response => {
            if(response.status !== 200) {
                showAlert('That Character does not exist yet');
                return;
            }
            return response.json();
        })
        .then( data => {
            showCharacters(data.results);
            createPaginator(data.info);
            window.location = '#results';
        })
    ;

    form.reset();
}

function showCharacters(characters = []) {

    cleanHtml(results);

    characters.forEach( character => {
        const { name, image , gender, species, status, location: { name: location }, origin: { name: origin } } = character;
        const circle = statusColor(status);

        results.innerHTML += `
            <div class="card">
                <img src="${image}" class="rounded m-auto">
                <div class="text-center text-white text-lg mt-2 flex space-between flex-col pb-4 pr-2 pl-2">
                    <h1 class="font-bold text-3xl text-teal-300">${name}</h1>
                    <div class="status"> 
                        <figure class="status-circle ${circle}"></figure>
                        <p>${status}</p>
                    </div>
                    <p>${species} - ${gender}</p>
                    <p>Origin: ${origin}</p>
                </div>
            </div>
        `;        
    });
}

function statusColor(status) {

    switch (status) {
        case 'Alive':
            return 'bg-green-500';

        case 'Dead':
            return 'bg-red-500';

        case 'unknown':
            return 'bg-gray-500';
    
        default:
            break;
    }
}

function createPaginator(info) {

    const { next, prev } = info;

    cleanHtml(footer);

    const btnPrev = document.createElement('button');
    btnPrev.classList.add('btn-paginator');
    btnPrev.style.display = 'none';
    btnPrev.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
        </svg>
    `;

    if(prev !== null) {
        btnPrev.style.display = 'block';

        btnPrev.onclick = () => {
            fetch(prev)
                .then( response => response.json())
                .then( data => {
                    showCharacters(data.results);
                    createPaginator(data.info);
                    window.location = '#results';
                })
            ;
        }
    }

    const btnNext = document.createElement('button');
    btnNext.classList.add('btn-paginator');
    btnNext.style.display = 'none';
    btnNext.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
        </svg>
    `;

    if(next !== null) {
        btnNext.style.display = 'block';

        btnNext.onclick = () => {
            fetch(next)
                .then( response => response.json())
                .then( data => {
                    showCharacters(data.results);
                    createPaginator(data.info);
                    window.location = '#results';
                })
            ;
        }
    }

    footer.appendChild(btnPrev);
    footer.appendChild(btnNext);
}

function showAlert(message) {

    const alert = document.querySelector('.alert');

    if(!alert) {
        const alert = document.createElement('p');
        alert.classList.add('alert');
        alert.textContent = message;
    
        form.appendChild(alert);
    
        setTimeout(() => {
            alert.remove()
        }, 3000);
    }

}

function cleanHtml(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}