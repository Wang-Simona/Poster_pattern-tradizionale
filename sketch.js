let svgFiles = [];
let cellSize;
let cols = 4;
let rows = 4;
let renderer;
let pg_size = 100; // SVG 图像原始尺寸（假设是 100x100）
let canvasSize;

let resizeToggle = true; // 控制是否重绘，避免叠图

function preload() {
  for (let i = 1; i <= 15; i++) {
    svgFiles.push(loadImage(`svgs/${i}.svg`)); // 加载本地 SVG 图像为 bitmap
  }
}

function setup() {
  canvasSize = min(windowWidth, windowHeight);
  renderer = createCanvas(canvasSize, canvasSize, SVG);
  cellSize = canvasSize / cols;

  frameRate(1);
  shuffleAndDraw();
}

function windowResized() {
  canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
  cellSize = canvasSize / cols;
  resizeToggle = true;
}

function draw() {
  if (resizeToggle) {
    renderer.drawingContext.__clearCanvas(); // 清除旧的 SVG 元素
    shuffleAndDraw();
    resizeToggle = false;
  }
}

function keyPressed() {
  if (key === ' ') {
    resizeToggle = true; // 空格重绘
  } else if (key === 's') {
    save("poster.svg"); // 按下 s 键保存完整画布为 SVG 文件
  }
}

function shuffleAndDraw() {
  let shuffled = shuffle(svgFiles.slice());
  let idx = 0;

  background('#f7931e'); // 背景橙色

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let isBig = random() < 0.15 && x < cols - 1 && y < rows - 1;
      let size = isBig ? cellSize * 2 : cellSize;
      let px = x * cellSize;
      let py = y * cellSize;

      image(shuffled[idx % shuffled.length], px, py, size, size);
      idx++;

      if (isBig) x++;
    }
  }
}