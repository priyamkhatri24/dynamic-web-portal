const webForm = document.forms['webapp'];
const url = 'https://class.ingeniumedu.com';
let profilePic = '';

const phoneInputField = document.querySelector('#phone');
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ['in', 'co', 'us', 'de'],
  utilsScript:
    'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
});

// bind the onsubmit property to a function to do some logic
webForm.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(webForm);
  let formObj = {};
  for (var x of formData) {
    console.log(x);
    formObj[x[0]] = x[1];
  }
  formObj.country_code = phoneInput.getSelectedCountryData().dialCode;
  formObj.profile_image = profilePic;
  console.log(formObj);
  localStorage.setItem('form', JSON.stringify(formObj));

  const formBody = Object.keys(formObj)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formObj[key])
    )
    .join('&');
  fetch(`${url}/enterNumberAndLoginClient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success && res.result.guest_client_id) {
        console.log(res);
        localStorage.setItem('sidhant', JSON.stringify(res.result));
        window.location.href = '/otp';
      } else if (res.success) {
        alert('You have already created an app with this number');
      }
    })
    .catch((err) => alert('Network error'));
};

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
        profilePic = res.filename;

        const cropperModal = new bootstrap.Modal(
          document.getElementById('staticBackdrop'),
          {
            keyboard: false,
          }
        );
        const img = document.getElementById('profilePhoto');
        img.src = profilePic;
        cropperModal.show();
        cropperStart(cropperModal);
      }
    });
}
