// prettier-ignore
const headers = {
  "Accept": "application/json",
  "api-token": "5mIwz0uyV9oJpdWuX6zyLOHE2YiLmr-KRtUNDIq94srRpKQo1Rno2H73Zf2i4sar8dQ",
  "user-email": "priyamkhatri1998@gmail.com",
};
let auth_token = "";

function generateOpts(id, arr, key, initOpt) {
  const option_str = document.getElementById(id);
  console.log(option_str);
  option_str.length = 1;
  // option_str.options[0] = new Option(initOpt, "");
  option_str.selectedIndex = 0;
  for (var i = 0; i < arr.length; i++) {
    option_str.options[option_str.length] = new Option(
      arr[i][key],
      arr[i][key]
    );
  }
}

function getCountries() {
  fetch("https://www.universal-tutorial.com/api/getaccesstoken", { headers })
    .then((res) => res.json())
    .then((res) => {
      auth_token = res.auth_token;
      const headers = {
        Authorization: `Bearer ${res.auth_token}`,
        Accept: "application/json",
      };
      fetch("https://www.universal-tutorial.com/api/countries", { headers })
        .then((res) => res.json())
        .then((data) => {
          generateOpts("country", data, "country_name", "Select Country");
        });
    });
}

function print_state(state_id, country_name) {
  console.log(state_id, country_name);

  const headers = {
    Authorization: `Bearer ${auth_token}`,
    Accept: "application/json",
  };
  fetch(`https://www.universal-tutorial.com/api/states/${country_name}`, {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      generateOpts(state_id, res, "state_name", "Select State");
    });
}

function print_city(city_id, city_name) {
  const headers = {
    Authorization: `Bearer ${auth_token}`,
    Accept: "application/json",
  };
  fetch(`https://www.universal-tutorial.com/api/cities/${city_name}`, {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      generateOpts(city_id, res, "city_name", "Select City");
    });
}

getCountries();
