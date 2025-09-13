class Region {
    constructor(id, name, x, y, width, height, income) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.income = income;
        this.owner = null;
        this.security = 1;
    }
    
    draw(ctx) {
        // 根据所有者决定颜色
        let color = '#7f8c8d'; // 中性灰色
        if (this.owner) {
            if (this.owner.isPlayer) {
                color = '#3498db'; // 玩家蓝色
            } else {
                color = '#e74c3c'; // AI红色
            }
        }
        
        // 绘制区域
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制边框
        ctx.strokeStyle = this.owner ? (this.owner.isPlayer ? '#f1c40f' : '#c0392b') : '#95a5a6';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 绘制区域名称和收入
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.name} ($${this.income})`, this.x + this.width / 2, this.y + this.height / 2);
    }
    
    containsPoint(x, y) {
        return x >= this.x && x <= this.x + this.width && 
               y >= this.y && y <= this.y + this.height;
    }
}

class GameMap {
    constructor() {
        this.regions = [];
        this.canvas = document.getElementById('game-map');
        this.ctx = this.canvas.getContext('2d');
    }
    
    generateRegions() {
        this.regions = [
            new Region(1, '市中心', 50, 50, 120, 80, 300),
            new Region(2, '工业区', 200, 30, 100, 90, 200),
            new Region(3, '住宅区', 350, 60, 110, 70, 150),
            new Region(4, '商业区', 500, 40, 130, 85, 250),
            new Region(5, '码头', 50, 160, 90, 75, 180),
            new Region(6, '娱乐区', 180, 150, 120, 90, 220),
            new Region(7, '仓库区', 330, 170, 100, 80, 170),
            new Region(8, '旧城区', 480, 160, 110, 70, 130),
            new Region(9, '金融区', 50, 270, 140, 85, 280),
            new Region(10, '居民区', 220, 260, 100, 90, 160),
            new Region(11, '工业园', 370, 280, 120, 75, 190),
            new Region(12, '郊区', 530, 270, 100, 80, 140)
        ];
        
        this.draw();
    }
    
    getRegionAt(x, y) {
        return this.regions.find(region => region.containsPoint(x, y));
    }
    
    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制所有区域
        this.regions.forEach(region => region.draw(this.ctx));
    }
}
