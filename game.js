class Game {
    constructor() {
        this.map = new GameMap();
        this.playerGang = new Gang('玩家帮派', true);
        this.aiGangs = [
            new Gang('血狼帮', false),
            new Gang('暗蛇会', false),
            new Gang('铁拳团', false)
        ];
        this.economy = new Economy(this);
        this.ui = new UI(this);
        this.day = 1;
        this.selectedRegion = null;
        
        this.init();
    }
    
    init() {
        // 初始化游戏
        this.map.generateRegions();
        this.distributeInitialTerritories();
        this.ui.update();
        
        // 设置地图点击事件
        const canvas = document.getElementById('game-map');
        canvas.addEventListener('click', (e) => this.handleMapClick(e));
        
        // 设置按钮事件
        document.getElementById('btn-next-day').addEventListener('click', () => this.nextDay());
        document.getElementById('btn-recruit').addEventListener('click', () => this.recruitMember());
        document.getElementById('btn-upgrade').addEventListener('click', () => this.upgradeHeadquarters());
        
        this.logEvent('游戏开始！扩张你的地盘，成为城市的主宰。');
    }
    
    distributeInitialTerritories() {
        // 玩家初始地盘
        const playerRegion = this.map.regions[0];
        playerRegion.owner = this.playerGang;
        this.playerGang.controlledRegions.push(playerRegion);
        
        // AI初始地盘
        this.aiGangs.forEach((gang, index) => {
            const region = this.map.regions[index + 1];
            region.owner = gang;
            gang.controlledRegions.push(region);
        });
    }
    
    handleMapClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.selectedRegion = this.map.getRegionAt(x, y);
        this.ui.update();
    }
    
    nextDay() {
        this.day++;
        this.economy.collectIncome();
        this.aiActions();
        this.ui.update();
        this.logEvent(`第 ${this.day} 天开始。`);
    }
    
    recruitMember() {
        if (this.playerGang.money >= 200) {
            this.playerGang.money -= 200;
            const newMember = this.playerGang.recruitMember();
            this.ui.update();
            this.logEvent(`招募了新成员: ${newMember.name} (${newMember.type})`);
        } else {
            this.logEvent('资金不足，无法招募成员！');
        }
    }
    
    upgradeHeadquarters() {
        const cost = this.playerGang.headquartersLevel * 500;
        if (this.playerGang.money >= cost) {
            this.playerGang.money -= cost;
            this.playerGang.headquartersLevel++;
            this.ui.update();
            this.logEvent(`总部升级到 level ${this.playerGang.headquartersLevel}`);
        } else {
            this.logEvent(`资金不足！升级需要 $${cost}`);
        }
    }
    
    attemptTakeover(region, members) {
        if (!region || !members.length) return false;
        
        const totalStrength = members.reduce((sum, member) => sum + member.strength, 0);
        const defense = region.security * 10 + (region.owner ? region.owner.influence : 0);
        const successChance = Math.min(0.9, totalStrength / (defense + 10));
        
        if (Math.random() < successChance) {
            // 占领成功
            const previousOwner = region.owner;
            if (previousOwner) {
                previousOwner.controlledRegions = previousOwner.controlledRegions.filter(r => r !== region);
            }
            
            region.owner = this.playerGang;
            this.playerGang.controlledRegions.push(region);
            
            this.logEvent(`成功占领 ${region.name}！`);
            return true;
        } else {
            // 占领失败
            this.logEvent(`占领 ${region.name} 的尝试失败了！`);
            return false;
        }
    }
    
    aiActions() {
        this.aiGangs.forEach(gang => {
            if (Math.random() < 0.3) { // 30% 几率行动
                const availableRegions = this.map.regions.filter(r => 
                    r.owner !== gang && (!r.owner || r.owner.influence < gang.influence)
                );
                
                if (availableRegions.length > 0) {
                    const target = availableRegions[Math.floor(Math.random() * availableRegions.length)];
                    if (gang.attemptTakeover(target)) {
                        this.logEvent(`${gang.name} 占领了 ${target.name}！`);
                    }
                }
            }
            
            // AI 也可能招募成员
            if (gang.money >= 300 && gang.members.length < 8) {
                gang.recruitMember();
            }
        });
    }
    
    logEvent(message) {
        this.ui.addLogEntry(message);
    }
}

// 启动游戏
window.addEventListener('load', () => {
    window.game = new Game();
});
