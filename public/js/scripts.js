const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};
document.addEventListener('DOMContentLoaded', () => {
  const x = getCookie('radarrApiKey');
  if (x) {
    document.querySelector('#radarr-api').value = x;
  }
  const y = getCookie('keyOmdb');
  if (y) {
    document.querySelector('#keyOmdb').value = y;
  }
  const z = getCookie('radarrUrl');
  if (z) {
    document.querySelector('#radarr-url').value = z;
  }
  const zy = getCookie('desiredRating');
  if (z) {
    document.querySelector('#desiredRating').value = zy;
  }
  const loader = document.querySelector('.loader');
  if (loader) {
    document.querySelector('#send').disabled = true;
  } else {
    document.querySelector('#send').disabled = false;
  }
}, false);
let selectedArr = [];
function selectAll() {
  const del = document.querySelector('#deleting');
  const selectCheck = document.querySelector('#selectAll');
  const moviesTable = document.querySelector('#movies');
  const num = document.querySelector('#NumberToBeDeleted');
  const movies = document.querySelectorAll('.movie_checkbox');
  if (selectCheck.checked === true && moviesTable.childElementCount > 0) {
    selectedArr = [];
    for (let i = 0; i < movies.length; i++) {
      movies[i].checked = true;
      selectedArr.push(Number(movies[i].id));
      del.classList.remove('no-display');
      if (selectedArr.length === 0) {
        del.classList.add('no-display');
      }
      num.innerHTML = `<p>Movies Selected: ${selectedArr.length}</p>`;
    }
  } else {
    for (let i = 0; i < movies.length; i++) {
      movies[i].checked = false;
      selectedArr = [];
      del.classList.remove('no-display');
      if (selectedArr.length === 0) {
        del.classList.add('no-display');
      }
      num.innerHTML = `<p>Movies Selected: ${selectedArr.length}</p>`;
    }
  }
}

function selectOne(id) {
  const num = document.querySelector('#NumberToBeDeleted');
  const del = document.querySelector('#deleting');
  if (!selectedArr.includes(id)) {
    selectedArr.push(id);
    del.classList.remove('no-display');
    if (selectedArr.length === 0) {
      del.classList.add('no-display');
    }
    num.innerHTML = `<p><strong>Movies Selected:</strong> ${selectedArr.length}</p>`;
  } else {
    const index = selectedArr.indexOf(id);
    if (index > -1) {
      selectedArr.splice(index, 1);
    }
    del.classList.remove('no-display');
    if (selectedArr.length === 0) {
      del.classList.add('no-display');
    }
    num.innerHTML = `<p><strong>Movies Selected:</strong> ${selectedArr.length}</p>`;
  }
}

async function deleteMovies() {
  const radarrApi = document.querySelector('#radarr-api').value;
  const radarrUrl = document.querySelector('#radarr-url').value;
  const addExclusion = document.querySelector('#addExclusion').checked;
  const deleteFiles = document.querySelector('#deleteFiles').checked;
  const del = document.querySelector('#deleting');

  const formData = {
    radarrUrl,
    radarrApi,
    addExclusion,
    deleteFiles,
    selectedArr,
  };
  let strMovies = 'movie';
  if (selectedArr.length >= 2) {
    strMovies = 'movies';
  }
  iziToast.warning({
    title: 'Deleting',
    message: `${selectedArr.length} ${strMovies}`,
  });
  const response = await fetch('delete-movies', {
    method: 'POST',
    headers,
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  del.classList.add('no-display');
  for (let i = 0; i < selectedArr.length; i++) {
    const item = document.querySelector(`tr[radarr-id="${selectedArr[i]}"]`);
    item.classList.add('no-display');
  }

  selectedArr = [];
  return iziToast.warning({
    title: 'Deleted',
    message: `${data.length} ${strMovies}`,
  });
}

async function sendData() {
  const radarrApi = document.querySelector('#radarr-api').value;
  const radarrUrl = document.querySelector('#radarr-url').value;
  const keyOmdb = document.querySelector('#keyOmdb').value;
  const desiredRating = document.querySelector('#desiredRating').value;
  const addExclusion = document.querySelector('#addExclusion').checked;
  const deleteFiles = document.querySelector('#deleteFiles').checked;
  const moviesTable = document.querySelector('#movies');
  movies.innerHTML = '';
  const loader = document.createElement('div');
  loader.classList.add('loader');
  const dot1 = document.createElement('div');
  dot1.classList.add('dot', 'dot-1');
  loader.append(dot1);
  const dot2 = document.createElement('div');
  dot2.classList.add('dot', 'dot-2');
  loader.append(dot2);
  const dot3 = document.createElement('div');
  dot3.classList.add('dot', 'dot-3');
  loader.append(dot3);
  moviesTable.append(loader);
  setCookie('radarrApiKey', radarrApi, 7);
  setCookie('radarrUrl', radarrUrl, 7);
  setCookie('keyOmdb', keyOmdb, 7);
  setCookie('desiredRating', desiredRating, 7);
  const formData = {
    radarrUrl,
    radarrApi,
    keyOmdb,
    desiredRating,
    addExclusion,
    deleteFiles,
  };
  const response = await fetch('find-movies', {
    method: 'POST',
    headers,
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (data.error) {
    movies.innerHTML = '';
    return iziToast.error({
      title: 'Error',
      message: data.message,
    });
  }
  const iMovies = data.returnedMovies;
  movies.innerHTML = '';
  for (let index = 0; index < iMovies.length; index++) {
    const tr = document.createElement('tr');
    tr.setAttribute('radarr-id', iMovies[index].rId);
    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerHTML = index + 1;
    tr.append(th);
    const poster = document.createElement('img');
    poster.src = iMovies[index].Poster;
    poster.classList.add('poster');
    tr.append(poster);
    const title = document.createElement('td');
    title.innerHTML = iMovies[index].title;
    tr.append(title);
    const link = document.createElement('td');
    const aTag = document.createElement('a');
    aTag.href = `https://imdb.com/title/${iMovies[index].imdbId}/`;
    aTag.target = '_blank';
    aTag.innerHTML = iMovies[index].imdbId;
    link.append(aTag);
    tr.append(link);
    const imdbVotes = document.createElement('td');
    imdbVotes.innerHTML = iMovies[index].imdbVotes;
    tr.append(imdbVotes);
    const imdbRating = document.createElement('td');
    imdbRating.innerHTML = iMovies[index].imdbRating;
    tr.append(imdbRating);
    tr.innerHTML += `<td>
  <input type="checkbox" class='movie_checkbox' id="${iMovies[index].rId}" imdbID='${iMovies[index].imdbId}' onclick='selectOne(${iMovies[index].rId})'></td>`;
    moviesTable.append(tr);
  }
}

let timeout = null;
if (document.querySelector('#send')) {
  const sendBtn = document.querySelector('#send');
  sendBtn.addEventListener('click', () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      iziToast.info({
        title: 'Searching',
        message: 'Please wait',
      });
      sendData();
    }, 1000);
  });
}
