let svgFiles = [];
let svgGraphics = [];
let cellSize;
let cols = 4;
let rows = 4;
let renderer;

function preload() {
  for (let i = 1; i <= 15; i++) {
    svgFiles.push(loadImage(`svgs/${i}.svg`)); // 确保放在 /svgs/ 目录下
  }
}

function setup() {
  let w = min(windowWidth, windowHeight);
  renderer = createCanvas(w, w, SVG);
  frameRate(1); // 每秒刷新一次，或用按键控制
  shuffleAndDraw();
}

function windowResized() {
  let w = min(windowWidth, windowHeight);
  resizeCanvas(w, w);
  shuffleAndDraw();
}

function draw() {
  // draw 被触发只在 shuffleAndDraw 中，或按键后
}

function keyPressed() {
  if (key === ' ') {
    shuffleAndDraw();
    save("poster.svg");
  }
}

function shuffleAndDraw() {
  clear();
  background('#f7931e'); // 背景橙色

  // 计算单元格大小
  cellSize = width / cols;

  // 打乱 SVG 顺序
  let shuffled = shuffle(svgFiles.slice());

  let idx = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // 随机生成大图的布局：2x2 块
      let isBig = random() < 0.15 && x < cols - 1 && y < rows - 1;

      if (isBig) {
        drawSVG(shuffled[idx % shuffled.length], x * cellSize, y * cellSize, cellSize * 2);
        idx++;
        x++; // skip next col
      } else {
        drawSVG(shuffled[idx % shuffled.length], x * cellSize, y * cellSize, cellSize);
        idx++;
      }
    }
  }
}

function drawSVG(img, x, y, size) {
  push();
  translate(x, y);
  image(img, 0, 0, size, size);
  pop();
}