// TBD: higher resolution canvas
var DPI = 300;

// cm to pixels
function cm(x){
  return x * DPI / 2.54;
}

function pt(x){
  return x * DPI / 100;
}

// syntax:
// note: 0abcdefgABCDEFG
// point: .
// space: <space> or -
// note group: =

const ALPHABET = "0abcdefgABCDEFG.- =";

// first G = 0
function note_idx(note){
  return "0abcdefgABCDEFG".indexOf(note)
}

function note_freq(note){
  switch(note){
    case 'G':
      return 392;
    case 'F':
      return 440;
    case 'E':
      return 493;
    case 'D':
      return 523;
    case 'C':
      return 587;
    case 'B':
      return 659;
    case 'A':
      return 698;
    case 'g':
      return 784;
    case 'f':
      return 880;
    case 'e':
      return 987;
    case 'd':
      return 1046;
    case 'c':
      return 1175;
    case 'b':
      return 1318;
    case 'a':
      return 1396;
    case '0':
      return 1567;
    case '.':
      return 0;
    default:
      return 0;
  }
}

function clear_sequence(raw_sequence){
  var sequence = "";
  for (var i = 0; i < raw_sequence.length; i++){
    var sym = raw_sequence[i];
    if(ALPHABET.indexOf(sym) >= 0){
      sequence += sym;
    }
  }
  return sequence;
}


function render(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  // canvas.style.height = canvas.style.width / Math.sqrt(2);
  canvas.width = cm(29.7);
  canvas.height = cm(21);


  const pageMargin = cm(1.0)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "#F0F0F0";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = pt(1);

  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.setLineDash([pt(1), cm(0.5)])

  ctx.moveTo(cm(9.5), cm(1.5));
  ctx.lineTo(pageMargin, canvas.height - cm(2.5));
  ctx.stroke();

  ctx.moveTo(cm(9.5), cm(1.5));
  ctx.lineTo(cm(9.5), pageMargin);
  ctx.stroke();

  ctx.closePath();

  ctx.beginPath();
  ctx.setLineDash([pt(5), pt(15)])

  ctx.moveTo(cm(9.5), pageMargin);
  ctx.lineTo(canvas.width - cm(9.5), pageMargin);
  ctx.stroke();

  ctx.closePath();

  ctx.beginPath();
  ctx.setLineDash([pt(1), cm(0.5)])

  ctx.moveTo(canvas.width - cm(9.5), pageMargin);
  ctx.lineTo(canvas.width - cm(9.5), cm(1.5));
  ctx.stroke();

  ctx.moveTo(canvas.width - cm(9.5), cm(1.5));
  ctx.lineTo(canvas.width - pageMargin, canvas.height - cm(2.5));
  ctx.stroke();

  ctx.closePath();
  ctx.setLineDash([]);

  title = document.getElementById('title').value;
  ctx.font = pt(24) + "pt Century Gothic";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, pageMargin + pt(24) * 1.5);

  const y_0 = cm(2);
  const string_vspace = cm(1.25);

  var string_hspace_coeff = document.getElementById("notes_hspace").value;
  var note_size_coeff = document.getElementById("note_size").value;
  var raw_sequence = document.getElementById("sequence").value;
  var sequence = clear_sequence(raw_sequence);

  var def_note_size = pageMargin * note_size_coeff;
  var note_size = def_note_size;
  var big_note_size = note_size * 1.5

  clean_sequence_length = sequence.split('').filter(x => note_idx(x) >= 0).length;
  var string_hspace = (canvas.width - cm(3.0)) / (clean_sequence_length - 1) * string_hspace_coeff;
  if(string_hspace < note_size){
    string_hspace = note_size * 1.1;
  }
  var sequence_width = (clean_sequence_length - 1) * string_hspace;
  var hor_shift_coeff = document.getElementById('hor_shift').value;
  var hor_shift = hor_shift_coeff * (canvas.width / 2);
  var start_x = hor_shift + (canvas.width - sequence_width) / 2 - note_size / 2;
  start_x = Math.ceil(start_x / string_hspace) * string_hspace;

  var show_lines = document.getElementById('show_lines').checked;

  if(show_lines){
    ctx.strokeStyle = '#777777';
    ctx.beginPath();
    ctx.setLineDash([pt(1), string_hspace - 1]);

    var w_ = cm(11);
    var margin = 0;

    for(var i = 1; i < 15; i++){
      w_ += cm(1.25);
      margin = (canvas.width - w_) / 2;
      left_margin = Math.ceil(margin / string_hspace + 1) * string_hspace;
      var y = y_0 + string_vspace * i;
      ctx.font = pt(14) + "pt Century Gothic";
      ctx.fillText(ALPHABET[i], margin + cm(1), y - cm(0.1));
      ctx.moveTo(left_margin, y);
      ctx.lineTo(canvas.width - margin - string_hspace, y);
      ctx.stroke();
    }


    ctx.closePath();
    ctx.setLineDash([]);
  }

  var stanzas = document.getElementsByClassName("stanza");
  ctx.textAlign = "left";
  var text_size = parseInt(document.getElementById("text_size").value);
  ctx.font = pt(text_size) + "pt Century Gothic";
  for(var i = 0; i < stanzas.length; i++){
    var stanza = stanzas[i];
    var lines = stanza.value.split("\n");
    var dy_coeff = document.getElementById("stanza_dy_" + i).value;
    var dy = dy_coeff * canvas.height * 0.8;
    var y = y_0 + string_hspace * 1.5 + dy;
    var dx_coeff = document.getElementById("stanza_dx_" + i).value;
    var dx = dx_coeff * canvas.width * 0.5 + canvas.width * 0.5;
    var line_height = pt(text_size * 1.2);
    for(var j=0; j<lines.length; j++){
      var line = lines[j];
      ctx.fillText(line, dx, y + line_height * j);
    }
  }
  ctx.textAlign = "right";
  ctx.font = pt(7) + "pt Century Gothic";
  ctx.fillText("zelinskiy.github.io/nepenenoyka", canvas.width - pageMargin, canvas.height - pageMargin);
  ctx.textAlign = "center";


  // ctx.strokeStyle = '#00FF00';
  // ctx.beginPath();
  // ctx.lineWidth = 1;
  //
  //
  // ctx.moveTo(pageMargin, pageMargin);
  // ctx.lineTo(pageMargin, canvas.height - pageMargin);
  // ctx.stroke();
  // ctx.moveTo(pageMargin, canvas.height - pageMargin);
  //
  // ctx.lineTo(canvas.width - pageMargin, canvas.height - pageMargin);
  // ctx.stroke();
  // ctx.moveTo(canvas.width - pageMargin, canvas.height - pageMargin);
  //
  // ctx.lineTo(canvas.width - pageMargin, pageMargin);
  // ctx.stroke();
  // ctx.moveTo(canvas.width - pageMargin, pageMargin);
  //
  // ctx.lineTo(pageMargin, pageMargin);
  // ctx.stroke();
  //
  // ctx.closePath();


  ctx.fillStyle = "#000000";
  ctx.strokeStyle = '#000000';

  ctx.lineWidth = 1;
  var prev_point = null;
  var prev_note = null;
  // used for horiz spacing:
  var note_n = 0;
  ctx.font = pt(10) + "pt Verdana";
  show_notes = document.getElementById('show_notes').checked;
  for (var i = 0; i < sequence.length; i++){
    note = sequence[i];
    note_i = note_idx(note);
    if(note_i < 0){
      prev_note = note;
      if(note == '.'){
        ctx.setLineDash([pt(1), note_size]);
        note_size = big_note_size;
      } else if(note == '-' || note == ' '){
        ctx.setLineDash([0, note_size]);
      } else if (note == '='){
        ctx.lineWidth = ctx.lineWidth * 2;
      }
      continue;
    }
    curr_point = [start_x + string_hspace * note_n, y_0 + note_i * string_vspace]
    if(prev_point !== null){
      ctx.beginPath();
      ctx.moveTo(prev_point[0], prev_point[1]);
      ctx.lineTo(curr_point[0], curr_point[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = pt(1);
      ctx.closePath();
    }
    ctx.fillRect(curr_point[0] - note_size / 2, curr_point[1] - note_size / 2, note_size, note_size);
    if(show_notes){
      ctx.fillText(note, curr_point[0], curr_point[1] - note_size / 2 - cm(0.1));
    }

    prev_point = curr_point;
    prev_note = note;
    note_size = def_note_size;
    note_n += 1;
  }
}

function printCanvas(){
  var canvas = document.getElementById('canvas');
  var win = window.open();

  var width = Math.floor(canvas.width / (DPI / 99.9));

  win.document.write("<img width='" + width + "' src='"+canvas.toDataURL()+"'/>");
  win.document.body.style.margin = 0;
  win.document.title = document.getElementById('title').value;
  win.onload = win.print;
  // win.print();
}

function tone(freq, time=1){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  var oscillator = audioCtx.createOscillator();
  var gain = audioCtx.createGain();

  gain.connect(audioCtx.destination);
  oscillator.connect(gain);
  gain.gain.value = document.getElementById('volume').value;

  oscillator.connect(gain);
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;

  oscillator.start();
  setTimeout(function() {
        oscillator.stop(0);
        oscillator.disconnect(gain);
        gain.disconnect(audioCtx.destination);
        audioCtx.close();
    }, time * 1000);
}

function play(){
  var t = parseFloat(document.getElementById('time').value);
  var sequence = clear_sequence(document.getElementById('sequence').value);
  var acc_time = 0;
  for(var i=0; i<sequence.length; i++){
    var note = sequence[i];
    if(i != sequence.length - 1){
      var next_note = sequence[i + 1];
    } else {
      var next_note = null;
    }

    if(i != 0){
      var prev_note = sequence[i - 1];
    } else {
      var prev_note = null;
    }

    if(next_note == '=' || prev_note == '='){
      var t_ = t * 0.75;
    } else if(note == '-' || note == ' ') {
      var t_ = t * 1.25;
    } else if(note == '=') {
      var t_ = 0;
    } else if(note == '.') {
      var t_ = t * 2;
    } else {
      var t_ = t;
    }
    var freq = note_freq(note);
    setTimeout(tone, acc_time * 1000, freq, t_);
    acc_time += t_;
  }
}

// TODO: better id assignment
function add_stanza(){
  var root = document.getElementById("stanzas");
  var stanzas = document.getElementsByClassName("stanza");
  var stanza_0 = stanzas[0];
  var textarea = document.createElement("textarea");
  textarea.id = "stanza_" + stanzas.length;
  textarea.rows = stanza_0.rows;
  textarea.cols = stanza_0.cols;
  textarea.oninput = render;
  textarea.className = "stanza";


  var br1 = document.createElement("br");
  var br2 = document.createElement("br");
  var dx = document.createElement("input");
  dx.type = "range";
  dx.min = -1;
  dx.max = 1;
  dx.value = 0;
  dx.step = 0.001;
  dx.id = "stanza_dx_" + stanzas.length;
  dx.oninput = "render()";

  var dy = document.createElement("input");
  dy.type = "range";
  dy.min = 0;
  dy.max = 1;
  dy.step = 0.001;
  dy.value = 0;
  dy.id = "stanza_dy_" + stanzas.length;
  dy.oninput = "render()";
  dy.addEventListener('input', function(){
    console.log("!")
    render();
  });

  // var delete_btn = document.createElement("input");
  // delete_btn.type = "button";
  // delete_btn.value = "X";
  var p = document.createElement("p");
  p.appendChild(textarea);
  p.appendChild(br1);
  p.innerHTML += "dy:";
  p.appendChild(dy);
  p.appendChild(br2);
  p.innerHTML += "dx:";
  p.appendChild(dx);
  // p.appendChild(delete_btn);
  root.appendChild(p);

  textarea.addEventListener("change", render);
}

// function delete_stanza(id){
//   document.getElementById("stanza_" + id).remove();
//   document.getElementById("del_stanza_" + id).remove();
// }


render();

// console.log("!")
