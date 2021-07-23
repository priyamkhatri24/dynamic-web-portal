const webForm = document.forms['webapp'];
const url = 'https://class.ingeniumedu.com';
let profilePic = '';
// bind the onsubmit property to a function to do some logic
webForm.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(webForm);
  let formObj = {};
  for (var x of formData) {
    console.log(x);
    formObj[x[0]] = x[1];
  }
  console.log(formObj);
  formObj.country_code = '91';

  const formBody = Object.keys(formObj)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formObj[key])
    )
    .join('&');
  fetch('https://portal.tca.ingeniumedu.com/enterNumberAndLoginClient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        console.log(res);
        localStorage.setItem('sidhant', JSON.stringify(res.result));
        window.location.href = '/otp';
      }
    });
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
      }
    });
}
