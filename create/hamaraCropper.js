let vanilla = null;
let cropModal = null;
function cropperStart(modal) {
  const el = document.getElementById("profilePhoto");
  vanilla = new Croppie(el, {
    viewport: { width: 300, height: 300, type: "circle" },
    boundary: { width: 300, height: 300 },
    showZoomer: true,
    enableOrientation: true,
  });
  vanilla.bind({
    url: profilePic,
    orientation: 1,
  });
  cropModal = modal;
}

function destroyCropper() {
  cropModal.hide();
}

function uploadFiles(e) {
  const fd = new FormData();
  fd.append("upl", e);
  fetch(`${url}/upload`, { method: "POST", body: fd })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        console.log(res);
        document.getElementById("profilePic").src = res.filename;
        profilePic = res.filename;
        cropModal.hide();
      }
    });
}

function cropDone() {
  vanilla.result("blob").then(function (blob) {
    const name = new Date().getTime() * Math.floor(Math.random() * 100);
    const file = new File([blob], `name.png`);
    uploadFiles(file);
  });
}
