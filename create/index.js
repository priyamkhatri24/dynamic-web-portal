let picker;
let color = '#ffffff';
const url = 'https://class.ingeniumedu.com';
let clientLogo = '';

const mobileSpan = document.getElementById('mobile');
const mobileNum = JSON.parse(localStorage.getItem('form')).contact;
mobileSpan.innerText = `(${mobileNum})`;
const mobileButton = document.getElementById('mobileButton');
mobileButton.innerText = `OK, Copy ${mobileNum}`;

const defaults = {
  color: color,
  container: document.getElementById('color_picker'),
  onChange: function (color) {
    updateColor(color);
  },
  swatchColors: ['#D1BF91', '#60371E', '#A6341B', '#F9C743', '#C7C8C4'],
};

function initPicker(options) {
  options = Object.assign(defaults, options);
  picker = new EasyLogicColorPicker(options);
}

function updateColor(value) {
  color = value;
  const $color = document.querySelector('.sample__color');
  const $code = document.querySelector('.sample__code');
  $code.innerText = color;
  $color.style.setProperty('--color', color);
}

function onChangeType(e) {
  picker.setType(e.value);
}

window.onload = function () {
  initPicker();
  updateColor(color);
};

function verifyDomain() {
  const domain = document.getElementById('domainName').value;
  const suggestionDiv = document.getElementById('suggestions');

  const suggestPara = document.getElementById('suggestText');
  if (suggestPara) {
    suggestPara.parentNode.removeChild(suggestPara);
  }

  const suggestList = document.getElementById('suggestList');

  if (suggestList) {
    suggestList.parentNode.removeChild(suggestList);
  }

  fetch(`${url}/checkDomainAvailability?name=${domain}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 'domain available') {
        document.getElementById('noDomain').style.display = 'none';
        document.getElementById('availableDomain').style.display = 'block';
      } else {
        document.getElementById('noDomain').style.display = 'block';
        document.getElementById('availableDomain').style.display = 'none';
        const para = document.createElement('p');
        para.id = 'suggestText';
        para.innerText = 'Try the below suggestions';
        suggestionDiv.appendChild(para);
        const list = document.createElement('ul');
        list.id = 'suggestList';
        suggestionDiv.appendChild(list);
        console.log(res.suggested_domains);
        res.suggested_domains.forEach((element) => {
          const suggestion = document.createElement('li');
          suggestion.className = 'suggestion';
          suggestion.innerText = element;
          suggestion.addEventListener('click', () => {
            document.getElementById('domainName').value = element.split('.')[0];
          });
          list.appendChild(suggestion);
        });
      }
    });
}

function uploadFile(e) {
  console.log(e.files[0]);
  const file = e.files[0];
  const fd = new FormData();
  fd.append('upl', file);
  fetch(`${url}/upload`, { method: 'POST', body: fd })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        document.getElementById('profilePic').src = res.filename;
        clientLogo = res.filename;
      }
    });
}

function hexAToRGBA(h) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (h.length == 5) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];
    a = '0x' + h[4] + h[4];
  } else if (h.length == 9) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
    a = '0x' + h[7] + h[8];
  } else if (h.length == 7) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
  }
  a = +(a / 255).toFixed(3);

  return [+(+r), +g, +b, h.length === 7 ? 1 : a];
}

function RGBToHSL(r, g, b) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function createDomain() {
  const domain = `${
    document.getElementById('domainName').value
  }.ingeniumedu.com`;

  const [r, g, b, a] = hexAToRGBA(color);
  const finalColor = RGBToHSL(r, g, b);

  const formObj = {
    domain_name: domain,
    client_logo: clientLogo,
    client_id: JSON.parse(localStorage.getItem('client_id')),
    color: finalColor,
  };
  const formBody = Object.keys(formObj)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formObj[key])
    )
    .join('&');
  fetch(`${url}/setDomainNameAndColor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
}

async function goToApp() {
  const domain = `${
    document.getElementById('domainName').value
  }.ingeniumedu.com`;
  await navigator.clipboard.writeText(mobileNum);
  window.location = `https://${domain}`;
}
