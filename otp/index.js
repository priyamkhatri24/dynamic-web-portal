const Swal = window.Swal;

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

  console.log(otp);
  const formObj = { otp };
  const formBody = Object.keys(formObj)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(formObj[key])
    )
    .join('&');
  fetch('http://localhost:3000/verifyOtp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formBody,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        window.location.href = '/create';
      } else {
        alert('Invalid Otp');
      }
    })
    .catch(() => {
      alert('Network Error');
    });
});
