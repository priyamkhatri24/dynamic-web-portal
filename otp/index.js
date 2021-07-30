const url = 'https://class.ingeniumedu.com';

function goBack(first, last) {
  const key = event.keyCode || event.charCode;

  if ((key == 8 || key == 46) && !first.value) {
    document.getElementById(last).focus();
  }
}

function clickEvent(first, last) {
  if (first.value.length) {
    document.getElementById(last).focus();
  }
}

const confirm = document.getElementById('confirmButton');
confirm.addEventListener('click', () => {
  let otp = '';
  const arr = ['ist', 'sec', 'third', 'fourth'];
  arr.forEach((id) => {
    otp += document.getElementById(id).value;
  });
  const formObj = {
    filled_otp: otp,
    ...JSON.parse(localStorage.getItem('sidhant')),
  };
  console.log(formObj);

  const formBody = Object.keys(formObj)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formObj[key])
    )
    .join('&');
  fetch(`${url}/verifyOTPForClientAddition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        if (res.result.verification_status === 'invalid otp') {
          alert('Invalid Otp');
        } else {
          console.log(res, 'otp verification');
          const client_id = res.result.result[0].client_id;
          console.log(client_id);
          localStorage.setItem('client_id', client_id);
          window.location.href = '/create';
        }
      } else {
        alert('Network Error');
      }
    })
    .catch(() => {
      alert('Network Error');
    });
});
