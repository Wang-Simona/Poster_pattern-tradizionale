let svgFiles = [];
let cellSize;
let cols = 4;
let rows = 4;

function setup() {
  noCanvas(); // 不再使用 p5 canvas
  let w = min(windowWidth, windowHeight);
  cellSize = w / cols;
  frameRate(1);

  loadSVGs().then(() => {
    shuffleAndDraw();
  });
}

function windowResized() {
  // 简化处理：页面刷新以重新布局
  location.reload();
}

function keyPressed() {
  if (key === ' ') {
    clearImages();
    shuffleAndDraw();
  }
}

function loadSVGs() {
  const promises = [];
  for (let i = 1; i <= 15; i++) {
    const path = `svgs/${i}.svg`;
    const img = createImg(path, '');
    img.hide(); // 暂时隐藏，绘制时显示
    svgFiles.push(img);
    promises.push(new Promise((resolve) => img.elt.onload = resolve));
  }
  return Promise.all(promises); // 等待所有图片加载完毕
}

function shuffleAndDraw() {
  clearImages();
  let shuffled = shuffle(svgFiles.slice());
  let idx = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let isBig = random() < 0.15 && x < cols - 1 && y < rows - 1;
      let img = shuffled[idx % shuffled.length];

      let size = isBig ? cellSize * 2 : cellSize;
      let px = x * cellSize;
      let py = y * cellSize;

      img.show();
      img.position(px, py);
      img.size(size, size);

      idx++;
      if (isBig) x++; // 跳过一格
    }
  }
}

function clearImages() {
  for (let img of svgFiles) {
    img.hide();
  }
}