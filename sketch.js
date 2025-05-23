let svgPaths1 = [
  'svgs/2.svg', 'svgs/4.svg', 'svgs/5.svg', 'svgs/6.svg', 'svgs/7.svg',
  'svgs/8.svg', 'svgs/9.svg', 'svgs/10.svg', 'svgs/14.svg', 'svgs/15.svg'
];
let svgPaths2 = [
  'svgs/1.svg', 'svgs/3.svg', 'svgs/11.svg', 'svgs/12.svg', 'svgs/13.svg'
];

let svgs1 = [];
let svgs2 = [];
let G;
let gridDivsX = 5; // gridDivsX 和 gridDivsY 是网格的横纵分割数
let gridDivsY = 7;
let gSX, gSY, pad = 5; //只把 pad 初始化为 10

function preload() {
  // 加载 1x1 的 SVG 图块
  svgPaths1.forEach(path => {
    fetch(path).then(res => res.text()).then(txt => svgs1.push(txt));
  });
  // 加载 2x2 的 SVG 图块
  svgPaths2.forEach(path => {
    fetch(path).then(res => res.text()).then(txt => svgs2.push(txt));
  });
}

function setup() {
  createCanvas(595, 842); // createCanvas(由于我们自己生成 SVG 不需要 SVG 模式)

  // 计算单格尺寸
  gSX = (width - 2 * pad) / gridDivsX;
  gSY = (height - 2 * pad) / gridDivsY;

  // 创建网格处理器
  G = new makeGrid(gridDivsX, gridDivsY);
  G.setupGrid();
  G.populateGrid();

  noLoop();
}

function draw() {
  background(255);
  fill(150);
  stroke(150);

  // 阴线编排 SVG 内容
  let svgHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842">`;
  let svgContent = '';

  for (let n = 0; n < G.rectInfo.length; n++) {
    let R = G.rectInfo[n];
    let randSvg;
    if (R.dimX > 1) {
      randSvg = random(svgs2);
    } else {
      randSvg = random(svgs1);
    }

    let x = R.posX * gSX + pad;
    let y = R.posY * gSY + pad;
    let wid = R.dimX * gSX;
    let hei = R.dimY * gSY;

    // 将 SVG 图块展开到指定位置和尺寸
    let wrapped = `<g transform="translate(${x},${y}) scale(${wid/100},${hei/100})">` +
                  extractSvgContent(randSvg) + `</g>`;
    svgContent += wrapped;
  }

  svgContent = svgHeader + svgContent + '</svg>';

  // 展示一个按钮用于保存
  let button = createButton('Download SVG');
  button.position(10, 10);
  