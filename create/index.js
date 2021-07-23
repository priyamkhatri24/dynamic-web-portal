let picker;
let color = '#ffffff';
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
