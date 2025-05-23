let svgs1=[];
let svgs2 = [];
let G;
let buff;
let gridDivsX = 5; // gridDivsX 和 gridDivsY 是网格的横纵分割数
let gridDivsY = 7;
let gSX, gSY, pad = 5; //只把 pad 初始化为 10


function preload(){
  // 加载 1x1 的 SVG 图块
  svgs1 = [
    loadImage('svgs/2.svg'),
    loadImage('svgs/4.svg'),
    loadImage('svgs/5.svg'),
    loadImage('svgs/6.svg'),
    loadImage('svgs/7.svg'),
    loadImage('svgs/8.svg'),
    loadImage('svgs/9.svg'),
    loadImage('svgs/10.svg'),
    loadImage('svgs/14.svg'),
    loadImage('svgs/15.svg'), 
  ];

  // 加载 2x2 的 SVG 图块
  svgs2 = [
    loadImage('svgs/1.svg'),
    loadImage('svgs/3.svg'),
    loadImage('svgs/11.svg'),
    loadImage('svgs/12.svg'),
    loadImage('svgs/13.svg'),
  ];
}


function setup() {
    //createCanvas(2480, 3508, SVG);  // 第三个参数指定使用 SVG 模式
    createCanvas(595, 842, SVG);
    buff = createGraphics(width, height, SVG); // 注意：如果你打算导出 SVG，就需要这个缓冲区也用 SVG 渲染器

    buff.background(255);
    fill(150);
    stroke(150);

// 计算单格尺寸
  gSX = (width - 2 * pad) / gridDivsX;
  gSY = (height - 2 * pad) / gridDivsY;

 // 创建网格处理器
  G = new makeGrid(gridDivsX, gridDivsY);
    // 创建布尔类型的网格（可用于标记格子是否已占用）
    G.setupGrid();
   // 用矩形填充这个网格
   // 每个矩形的信息保存在名为 rectInfo 的数组中
   G.populateGrid();
}

function draw() {
  // 防止资源未加载时出错
  if (svgs1.length === 0 || svgs2.length === 0 || !G) return;

  background(255);

for (let n = 0; n < G.rectInfo.length; n++) {
  let R = G.rectInfo[n]; //G一个数组，存储所有生成的矩形块的位置与尺寸
                         //R是要绘制的矩形
  // 如果这个矩形跨越多个格子（也就是尺寸大于 1x1）
  // 我们就从 2x2 的 SVG 图块中随机选一个
  // 否则就从 1x1 的图块中选一个
  let randSvg;
  if (R.dimX > 1) {
    randSvg = random(svgs2);//2x2格子
  } else {
    randSvg = random(svgs1);//1x1格子
  }

  // 计算这个图块的绘制位置和尺寸
  var x = R.posX * gSX + pad;   // X 位置：网格坐标 * 单格宽度(gSX) + 内边距(pad)
  var y = R.posY * gSY + pad;   // Y 位置：网格坐标 * 单格高度(gSY) + 内边距(pad)
  var wid = R.dimX * gSX;       // 宽度：跨多少格 * 单格宽度
  var hei = R.dimY * gSY;       // 高度

  // 在图形缓冲区上绘制这个 SVG 图块
  buff.image(randSvg, x, y, wid, hei);
 }

 // 显示到主画布
  image(buff, 0, 0);
  
  noLoop(); // 只运行一次
}

// makeGrid 函数
function makeGrid(xCount, yCount) {
  this.gridW = xCount; // 网格宽度（列数）
  this.gridH = yCount; // 网格高度（行数）
  this.boolGrid = [];  // 布尔网格，记录哪些格子已经被使用
  this.rectInfo = [];  // 存储已放置图块的信息（位置+尺寸）

 // 初始化布尔网格（全部为 true 表示可用）
  this.setupGrid = function () {
    for (let x = 0; x < this.gridW; x++) {
      let col = [];
      for (let y = 0; y < this.gridH; y++) {
        col.push(true);
      }
      this.boolGrid.push(col);
    }
  };

  // 使用不重叠策略填充 1x1 或 2x2 的块
  this.populateGrid = function () {
    for (let x = 0; x < this.gridW; x++) {
      for (let y = 0; y < this.gridH; y++) {

        // 如果这个格子已被占用，跳过
        if (!this.boolGrid[x][y]) continue;

        let dimX = 1;
        let dimY = 1;

        // 50% 概率尝试放置 2x2
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

        // 标记占用
        for (let i = x; i < x + dimX; i++) {
          for (let j = y; j < y + dimY; j++) {
            this.boolGrid[i][j] = false;
          }
        }

        // 保存矩形信息
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