var headline = "SGB implodes";
var quote = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
var name = "Harry Kloman, Staff Writer";
var includeLogo = true;
var centerElements = false;
var includePhoto = false;
var photoURL = "";

var wrapText = function(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, y);
  return y;
}

var renderContent = function() {
  var canvas = document.getElementById("canvas");
  canvas.width = 270; //, 360, 1080;
  canvas.height = 480; //, 640, 1920;

  var quoteCtx = canvas.getContext("2d");
  quoteCtx.fillStyle = '#aa1e22';
  quoteCtx.fillRect(0, 0, canvas.width, canvas.height);

  // HEADLINE
  quoteCtx.font = "100 24px neuzeit-grotesk";
  quoteCtx.fillStyle = "#ffffff";

  var headlineY = wrapText(quoteCtx, headline, centerElements ? 500 : 25,
    canvas.height * 0.15, 200, 28);

  // BYLINE
  //quoteCtx.textAlign = "left"; // makes below calculations work
  canvas.getContext("2d").font = "12px neuzeit-grotesk";
  var bylineY = wrapText(quoteCtx, `By ${name}`, centerElements ? 500 : 25,
    headlineY + 30, 200, 28);

  // SEPARATOR
  var separatorCtx = canvas.getContext('2d');
  separatorCtx.beginPath();
  separatorCtx.moveTo(70, bylineY + 20);
  separatorCtx.lineTo(200, bylineY + 20);
  separatorCtx.strokeStyle = '#ffffff';
  separatorCtx.stroke();

  // TEXT
  //quoteCtx.textAlign = "left"; // makes below calculations work
  canvas.getContext("2d").font = "12px neuzeit-grotesk";

  wrapText(quoteCtx, quote, centerElements ? 500 : 25,
    bylineY + 50, 200, 22);

  // PICTURE
}

window.setTimeout(function() {
  renderContent();
}, 700);

document.getElementById('textBox').oninput = function() {
  quote = this.value;

  // Convert all quotes to curly quotes
  quote = quote.replace(/\b'/g, "\’");
  quote = quote.replace(/'(?=\d)/g, "\’");
  quote = quote.replace(/'(?=\b|$)/g, "\‘");
  quote = quote.replace(/\b"/g, "\”");
  quote = quote.replace(/"(?=\w|$)/g, "\“");
  renderContent();
}

document.getElementById('bylineBox').oninput = function() {
  name = this.value;
  renderContent();
}

document.getElementById('headlineBox').oninput = function() {
  headline = this.value;
  renderContent();
}

document.getElementById('saveButton').addEventListener('click', function() {
  var dataURL = canvas.toDataURL("image/png");
  var data = atob(dataURL.substring("data:image/png;base64,".length)),
    asArray = new Uint8Array(data.length);
  for (var i = 0, len = data.length; i < len; ++i) {
    asArray[i] = data.charCodeAt(i);
  }
  var blob = new Blob([asArray.buffer], {
    type: "image/png"
  });
  saveAs(blob, "quote.png");
});

document.getElementById('cmsButton').addEventListener('click', function() {
  var r = new RegExp(/pittnews.com\/article\/(\d+)\//);
  var id = document.getElementById('cmsUrl').value.match(r)[1];

  if (!id) return alert ('Invalid cms url');

  fetch(`https://pittnews.com/wp-json/wp/v2/posts/${id}`)
  .then((res) => res.json())
  .then((res) => {
    headline = document.getElementById('headlineBox').value = res.title.rendered;
    name = document.getElementById('bylineBox').value = `${res.writer.join(', ')} | ${res.jobtitle.join('')}`;
    quote = document.getElementById('textBox').value = res.excerpt.rendered.replace("<p>", "").replace("</p>", "");
    renderContent();
  });
});

// EVENT HANDLERS

// Toggle Center Elements
var toggleCenterCheckbox = document.getElementById('centerElements');
toggleCenterCheckbox.addEventListener('click', function() {
	centerElements = !centerElements;
	renderContent();
});

// Include Photo
var togglePictureCheckbox = document.getElementById('togglePicture');
togglePictureCheckbox.addEventListener('click', function() {
  includePhoto = !includePhoto;
	renderContent();
});

// Upload Picture
var uploadPicture = document.getElementById('uploadPicture');
var fileInput = document.getElementById('fileInput');
uploadPicture.addEventListener('click', function() {
  fileInput.click();
});
fileInput.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    photoURL = URL.createObjectURL(this.files[0]);
  }
  renderContent();
});

// Include logo
var toggleLogoCheckbox = document.getElementById('toggleLogo');
toggleLogoCheckbox.addEventListener('click', function() {
  includeLogo = !includeLogo;
  renderContent();
});
