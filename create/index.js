let picker;
let color = "#ffffff";
const url = "https://portal.tca.ingeniumedu.com";
let profilePic = "";
const appModal = new bootstrap.Modal(document.getElementById("goToAppModal"), {
  keyboard: false,
});
const mobileSpan = document.getElementById("mobile");
const mobileNum = JSON.parse(localStorage.getItem("form")).contact;
mobileSpan.innerText = `(${mobileNum})`;
const mobileButton = document.getElementById("mobileButton");
mobileButton.innerText = `OK, Copy ${mobileNum}`;
const domainInput = document.getElementById("domainName");

const themeColors = [
  "#00B4D8",
  "#0096C7",
  "#0077B6",
  "#023E8A",
  "#80B918",
  "#55A630",
  "#2B9348",
  "#007F5F",
  "#52B788",
  "#40916C",
  "#2D6A4F",
  "#1B4332",
  "#E85D04",
  "#D00000",
  "#9D0208",
  "#6A040F",
  "#FF4D6D",
  "#C9184A",
  "#A4133C",
  "#800F2F",
  "#FFE169",
  "#EDC531",
  "#C9A227",
  "#A47E1B",
  "#7209B7",
  "#560BAD",
  "#480CA8",
  "#3A0CA3",
];
const fillInstituteInfo = () => {
  document.querySelector(".client_name").value = JSON.parse(
    localStorage.getItem("form")
  ).client_name;
  document.querySelector(".tagline").value = JSON.parse(
    localStorage.getItem("form")
  ).tagline;
};

const generateOtherSuggestions = () => {
  const first = `<p class='blue'>${
    instituteName.split(" ").join("-") + ".ingeniumedu.com"
  }</p>`;
  const sec = `<p class='blue'>${
    instituteName.split(" ").join("_") + ".ingeniumedu.com"
  }</p>`;
  const third = `<p class='blue'>${
    instituteName.split(" ").join("") + "1.ingeniumedu.com"
  }</p>`;
  document
    .querySelector(".otherSuggestions")
    .insertAdjacentHTML("beforeend", first);
  document
    .querySelector(".otherSuggestions")
    .insertAdjacentHTML("beforeend", sec);
  document
    .querySelector(".otherSuggestions")
    .insertAdjacentHTML("beforeend", third);
};

function initColorPallete() {
  const palletArr = [...document.querySelectorAll(".colorIcon")];
  palletArr.forEach((elem, i) => {
    elem.style.color = themeColors[i] || "gray";
  });
}

document
  .querySelector(".color_container")
  .addEventListener("click", function (e) {
    const icon = e.target.closest(".colorIcon");
    if (!icon) return;

    color = icon.style.color;
    document.querySelector(".selectedColor").style.color = color;

    // document.querySelector(".selectedColorHex").textContent = newC;
  });

function onChangeType(e) {
  picker.setType(e.value);
}

window.onload = function () {
  initColorPallete();
  // updateColor(color);
  fillInstituteInfo();
  checkDomainValidity(domainInput.value);
  uploadCanvasLogo(pnGImage);
  generateOtherSuggestions();
};

const checkDomainValidity = (domain) => {
  const list = [
    ...document
      .querySelector(".domainCheckContainer")
      .getElementsByTagName("li"),
  ];
  if (domain.length > 3) {
    list[0].childNodes[0].classList.add("greenBullet");
    list[0].childNodes[0].classList.remove("redBullet");
  } else {
    list[0].childNodes[0].classList.add("redBullet");
    list[0].childNodes[0].classList.remove("greenBullet");
  }

  if (domain.length < 22) {
    list[3].childNodes[0].classList.add("greenBullet");
    list[3].childNodes[0].classList.remove("redBullet");
  } else {
    list[3].childNodes[0].classList.add("redBullet");
    list[3].childNodes[0].classList.remove("greenBullet");
  }

  if (domain.includes(" ")) {
    list[1].childNodes[0].classList.add("redBullet");
    list[1].childNodes[0].classList.remove("greenBullet");
  } else {
    list[1].childNodes[0].classList.add("greenBullet");
    list[1].childNodes[0].classList.remove("redBullet");
  }

  if (domain.match(/^[a-z0-9]+$/i)) {
    list[2].childNodes[0].classList.add("greenBullet");
    list[2].childNodes[0].classList.remove("redBullet");
  } else {
    list[2].childNodes[0].classList.add("redBullet");
    list[2].childNodes[0].classList.remove("greenBullet");
  }
};

const checkLaunchButton = () => {
  const list = [
    ...document
      .querySelector(".domainCheckContainer")
      .getElementsByTagName("li"),
  ];
  const validityArr = list.filter((ele) => {
    return [...ele.childNodes[0].classList].includes("redBullet");
  });
  document.querySelector(".launchButton").disabled = validityArr.length;
};

domainInput.addEventListener("keyup", function (e) {
  domainInput.value = e.target.value;
  checkDomainValidity(e.target.value);
  checkLaunchButton();
});

function asyncVerify() {
  return new Promise((resolve, rej) => {
    const domain = document.getElementById("domainName").value;
    const suggestionDiv = document.getElementById("suggestions");

    const suggestPara = document.getElementById("suggestText");
    if (suggestPara) {
      suggestPara.parentNode.removeChild(suggestPara);
    }

    const suggestList = document.getElementById("suggestList");

    if (suggestList) {
      suggestList.parentNode.removeChild(suggestList);
    }

    fetch(`${url}/checkDomainAvailability?name=${domain}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "domain available") {
          document.getElementById("noDomain").style.display = "none";
          document.getElementById("availableDomain").style.display = "block";
          resolve("success");
        } else {
          document.getElementById("noDomain").style.display = "block";
          document.getElementById("availableDomain").style.display = "none";
          const para = document.createElement("p");
          para.id = "suggestText";
          para.innerText = "Try the below suggestions";
          suggestionDiv.appendChild(para);
          const list = document.createElement("ul");
          list.id = "suggestList";
          suggestionDiv.appendChild(list);
          console.log(res.suggested_domains);
          res.suggested_domains.forEach((element) => {
            const suggestion = document.createElement("li");
            suggestion.className = "suggestion";
            suggestion.innerText = element;
            suggestion.addEventListener("click", () => {
              document.getElementById("domainName").value = element.split(
                "."
              )[0];
            });
            list.appendChild(suggestion);
          });
          resolve("success");
        }
      })
      .catch((err) => rej(err));
  });
}

function verifyDomain() {
  asyncVerify().then((res) => console.log(res));
}

function uploadCanvasLogo(img) {
  var blobBin = atob(img.src.split(",")[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  var file = new File([new Uint8Array(array)], "defaultLogo.png");

  var fd = new FormData();

  fd.append("upl", file);
  fetch(`${url}/upload`, { method: "POST", body: fd })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      profilePic = res.filename;
    });
}

function uploadFile(e) {
  console.log(e.files[0], "e");
  const file = e.files[0];
  const fd = new FormData();
  fd.append("upl", file);
  console.log(fd, "fd");
  fetch(`${url}/upload`, { method: "POST", body: fd })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        document.getElementById("profilePic").src = res.filename;
        profilePic = res.filename;
        const cropperModal = new bootstrap.Modal(
          document.getElementById("staticBackdrop"),
          {
            keyboard: false,
          }
        );

        // const img = document.getElementById('profilePhoto');
        // img.src = clientLogo;
        cropperModal.show();
        cropperStart(cropperModal);
      }
    });
}

function hexAToRGBA(h) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (h.length == 5) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    a = "0x" + h[4] + h[4];
  } else if (h.length == 9) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    a = "0x" + h[7] + h[8];
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
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

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

function createDomain() {
  asyncVerify().then((res) => {
    console.log(document.getElementById("noDomain").style.display);
    if (document.getElementById("noDomain").style.display === "block") {
      return;
    } else {
      const domain = `${
        document.getElementById("domainName").value
      }.ingeniumedu.com`;
      // const [r, g, b, a] = hexAToRGBA("#555");
      color = color.replace("rgb(", "").replace(")", "");
      const [r, g, b] = color.split(",");
      const finalColor = RGBToHSL(r, g, b);

      const formObj = {
        domain_name: domain,
        client_logo: profilePic,
        client_id: JSON.parse(localStorage.getItem("client_id")),
        color: finalColor,
      };
      const formBody = Object.keys(formObj)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(formObj[key])
        )
        .join("&");
      fetch(`${url}/setDomainNameAndColor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          appModal.show();
        });
    }
  });
}

async function goToApp() {
  const domain = `${
    document.getElementById("domainName").value
  }.ingeniumedu.com`;
  await navigator.clipboard.writeText(mobileNum);
  window.location = `https://${domain}`;
}
////////////////////////////////canavs logo//////////////////////////////////////
const extractInitialsFromName = (fullName) => {
  return fullName
    .split(" ")
    .map((ele) => ele[0].toUpperCase())
    .join("");
};
const instituteName = JSON.parse(localStorage.getItem("form")).client_name;
const instituteInitials = extractInitialsFromName(instituteName);

const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(25, 58, 109)"; // mark the center
ctx.fillRect(0, 0, canvas.width, canvas.height);
// ctx.fillRect(0, (canvas.height / 2) | 0, canvas.width, 1);
ctx.fillStyle = "white";

// textVertSpacing is fraction of FontSize
// fade is the index of characters to fade, including spaces
// centerX and y is center of all text
function drawStroked(
  text,
  fontSize,
  color,
  centerX,
  centerY,
  textVertSpacing,
  fade
) {
  let line = text.split("\n");
  ctx.font = fontSize + "px " + "Montserrat";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // to count each character
  var charIndex = 0;
  // find the top ypos and then move down half a char space
  var yPos =
    centerY -
    fontSize * line.length * 0.5 * textVertSpacing +
    (fontSize * textVertSpacing) / 2;

  for (var i = 0; i < line.length; i++) {
    // get the width of the whole line
    var width = ctx.measureText(line[i]).width;
    // use the width to find start
    var textPosX = centerX - width / 2;
    for (var j = 0; j < line[i].length; j++) {
      // get char
      var char = line[i][j];
      // get its width
      var cWidth = ctx.measureText(char).width;
      // check if char needs to fade
      if (fade.indexOf(charIndex) > -1) {
        ctx.globalAlpha = 0.5;
      } else {
        ctx.globalAlpha = 1;
      }
      // draw the char offset by half its width (center)
      ctx.fillText(char, textPosX + cWidth / 2, yPos);
      // move too the next pos
      textPosX += cWidth;
      // count the char
      charIndex += 1;
    }
    // move down one line
    yPos += fontSize * textVertSpacing;
  }
}

drawStroked(
  instituteInitials.slice(0, 2),
  280,
  "#000",
  canvas.width / 2,
  canvas.height / 2 + 10,
  0.9,
  [2, 4, 8, 12]
);

function convertCanvasToImage() {
  const canvas = document.getElementById("canvas");
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}
const pnGImage = convertCanvasToImage();
pnGImage.id = "profilePic";
pnGImage.classList.add("profile");
pnGImage.alt = "upload your profile pic";

document.getElementById("file-input").appendChild(pnGImage);

///////////////////////////////////////autofill domain///////////////////////////////////
const domain = instituteName
  .split(" ")
  .map((ele) => ele.toLowerCase())
  .join("");

document.getElementById("domainName").value = domain;
