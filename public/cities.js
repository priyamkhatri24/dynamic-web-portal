const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJzcml2YmFkZGFtQGdtYWlsLmNvbSIsImFwaV90b2tlbiI6Im9Sa1lsY2JDSXhKRGtBSjlKaUo4U005ZmxyMm9NZGp5QTgzZTBpMjcwM3BJTlpvVVRBeURuNUlFR3ZEUHY1S0V2MHMifSwiZXhwIjoxNjI3OTcwNzc1fQ.wwhh4sN1LzFjWtk_eQP5EvQlIw9qJiZXNMs0Ud05BTc',
  Accept: 'application/json',
};

function generateOpts(id, arr, key, initOpt) {
  const option_str = document.getElementById(id);
  option_str.length = 0;
  option_str.options[0] = new Option(initOpt, '');
  option_str.selectedIndex = 0;
  for (var i = 0; i < arr.length; i++) {
    option_str.options[option_str.length] = new Option(
      arr[i][key],
      arr[i][key]
    );
  }
}

function getCountries() {
  fetch('https://www.universal-tutorial.com/api/countries/', {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      generateOpts('country', res, 'country_name', 'Select Country');
    });
}

function print_state(state_id, country_name) {
  console.log(state_id, country_name);
  fetch(`https://www.universal-tutorial.com/api/states/${country_name}`, {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      generateOpts(state_id, res, 'state_name', 'Select State');
    });
}

function print_city(city_id, city_name) {
  fetch(`https://www.universal-tutorial.com/api/cities/${city_name}`, {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      generateOpts(city_id, res, 'city_name', 'Select City');
    });
}

getCountries();
