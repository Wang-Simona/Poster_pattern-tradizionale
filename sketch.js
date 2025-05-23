let svgs1 = [];
let svgs2 = [];
let svgPaths1 = ['svgs/2.svg', 'svgs/4.svg', 'svgs/5.svg', 'svgs/6.svg', 'svgs/7.svg', 'svgs/8.svg', 'svgs/9.svg', 'svgs/10.svg', 'svgs/14.svg', 'svgs/15.svg'];
let svgPaths2 = ['svgs/1.svg', 'svgs/3.svg', 'svgs/11.svg', 'svgs/12.svg', 'svgs/13.svg'];
let totalToLoad = svgPaths1.length + svgPaths2.length;
let totalLoaded = 0;

let G;
let buff;
let gridDivsX = 5; // gridDivsX 和 gridDivsY 是网格的横纵分割数
let gridDivsY = 7;
let gSX, gSY, pad = 5; //只把 pad 初始化为 10


function preload() {
  loadSVGSet(svgPaths1, svgs1);
  loadSVGSet(svgPaths2, svgs2);
}

function loadSVGSet(paths, targetArray) {
  for (let i = 0; i < paths.length; i++) {
    loadXML(paths[i], xml => {
      let svgStr = new XMLSerializer().serializeToString(xml.documentElement);
      targetArray.push(svgStr);
      totalLoaded++;
      if (totalLoaded === totalToLoad) {
        setup();
        redraw();
      }
    });
  }
}


function setup() {
  createCanvas(595, 842, SVG);
  buff = createGraphics(width, height, SVG); // 注意：如果你打算导出 SVG，就需要这个缓冲区也用 SVG 渲染器
  buff.clear();
  noLoop();

  // 计算单格尺寸
  gSX = (width - 2 * pad) / gridDivsX;
  gSY = (height - 2 * pad) / gridDivsY;

  // 创建网格处理器
  G = new makeGrid(gridDivsX, gridDivsY);
  G.setupGrid();
  G.populateGrid();
}


function draw() {
  if (svgs1.length === 0 || svgs2.length === 0 || !G) return;

  buff.clear();

  for (let n = 0; n < G.rectInfo.length; n++) {
    let R = G.rectInfo[n];
    let randSvgStr;

    if (R.dimX > 1) {
      randSvgStr = random(svgs2);
    } else {
      randSvgStr = random(svgs1);
    }

    let x = R.posX * gSX + pad;
    let y = R.posY * gSY + pad;
    let wid = R.dimX * gSX;
    let hei = R.dimY * gSY;

    let div = createDiv(randSvgStr);
    div.style('position', 'absolute');
    div.style('left', '-9999px');
    document.body.appendChild(div.elt);

    let svgElem = div.elt.querySelector("svg");
    svgElem.setAttribute("width", wid);
    svgElem.setAttribute("height", hei);

    buff.drawingContext.drawSvg(randSvgStr, x, y, wid, hei);

    div.remove();
  }

  image(buff, 0, 0);
}


function makeGrid(xCount, yCount) {
  this.gridW = xCount;
  this.gridH = yCount;
  this.boolGrid = [];
  this.rectInfo = [];

  this.setupGrid = function () {
    for (let x = 0; x < this.gridW; x++) {
      let col = [];
      for (let y = 0; y < this.gridH; y++) {
        col.push(true);
      }
      this.boolGrid.push(col);
    }
  };

  this.populateGrid = function () {
    for (let x = 0; x < this.gridW; x++) {
      for (let y = 0; y < this.gridH; y++) {
        if (!this.boolGrid[x][y]) continue;

        let dimX = 1;
        let dimY = 1;

        if (random() > 0.5) {
          if (
            x < this.gridW - 1 &&
            y < this.gridH - 1 &&
            this.boolGrid[x + 1][y] &&
            this.boolGrid[x][y + 1] &&
            this.boolGrid[x + 1][y + 1]
          ) {
            dimX = 2;
            dimY = 2;
          }
        }

        for (let i = x; i < x + dimX; i++) {
          for (let j = y; j < y + dimY; j++) {
            this.boolGrid[i][j] = false;
          }
        }

        this.rectInfo.push({
          posX: x,
          posY: y,
          dimX: dimX,
          dimY: dimY,
        });
      }
    }
  };
}

function keyPressed() {
  if (key === 's') {
    save(buff, 'poster.svg');
  }
}
