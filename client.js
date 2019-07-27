// define variables that reference elements on our page
const dupeList = document.getElementById('dupes');
const dupeForm = document.forms[0];
const dupeInput = dupeForm.elements['str'];
const dupeCount = document.getElementById('count');
const report = document.querySelector('h3');

const showbugRegex = /show_bug\.cgi\?id=(\d+)/;

const getURL = function(str) {
  str = str.trim();
  var url = 'https://bugzilla.mozilla.org/rest/bug/possible_duplicates';
  
  if (parseInt(str, 10) == str && str > 0) {
    url += `?id=${str}`;
  } else if (showbugRegex.test(str)) {
    url += `?id=${str.match(showbugRegex)[1]}`;
  }
  else {
    url += `?summary=${encodeURIComponent(str)}`;
  }
  
  console.log(url);
  return url;
}

const findDupes = function(str) {
  fetch(getURL(str))
  .then(response => {
    if (response.ok) {
      response.json()
      .then(data => {
        renderDupes(data.bugs);
      });
    }
  });
}

const renderDupes = function(duplicates) {
  
  dupeCount.innerHTML = duplicates.length;
  
  report.style.display = 'block';
  
  duplicates.forEach(function(dupe) {
    dupeList.insertAdjacentHTML('beforeend', `<li>
      <a href="https://bugzilla.mozilla.org/bug/${dupe.id}" target="_blank">${dupe.id}</a> (${dupe.status} ${dupe.resolution}) Version ${dupe.version}:  ${dupe.summary}
</li>`);
    });
}

// listen for the form to be submitted
dupeForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  dupeList.innerHTML = '';
  
  if (dupeInput.value) {
    findDupes(dupeInput.value);
  }
};

dupeInput.focus();
