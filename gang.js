class GangMember {
    constructor(name, type) {
        this.name = name;
        this.type = type; // 'enforcer', 'merchant', 'spy'
        this.level = 1;
        this.assignedRegion = null;
        
        // 根据类型初始化属性
        this.strength = this.type === 'enforcer' ? 15 : 
                       (this.type === 'merchant' ? 5 : 8);
        this.negotiation = this.type === 'merchant' ? 15 : 
                          (this.type === 'enforcer' ? 8 : 10);
        this.stealth = this.type === 'spy' ? 15 : 
                      (this.type === 'enforcer' ? 5 : 8);
    }
    
    upgrade() {
        this.level++;
        this.strength += this.type === 'enforcer' ? 3 : 1;
        this.negotiation += this.type === 'merchant' ? 3 : 1;
        this.stealth += this.type === 'spy' ? 3 : 1;
    }
}

class Gang {
    constructor(name, isPlayer = false) {
        this.name = name;
        this.isPlayer = isPlayer;
        this.members = [];
        this.controlledRegions = [];
        this.money = isPlayer ? 1000 : 1500;
        this.influence = 0;
        this.headquartersLevel = 1;
        
        // 初始成员
        this.recruitMember(); // 打手
        this.recruitMember(); // 商人
    }
    
    recruitMember() {
        const types = ['enforcer', 'merchant', 'spy'];
        const type = types[Math.floor(Math.random() * types.length)];
        const names = this.generateMemberName(type);
        
        const member = new GangMember(names, type);
        this.members.push(member);
        return member;
    }
    
    generateMemberName(type) {
        const firstNames = ['黑影', '毒蛇', '猛虎', '孤狼', '秃鹰', '猎豹', '狂鲨'];
        const lastNames = ['杰克', '托尼', '麦克', '维托', '桑尼', '卡洛', '里奇'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${firstName}·${lastName}`;
    }
    
    calculateIncome() {
        return this.controlledRegions.reduce((sum, region) => sum + region.income, 0);
    }
    
    updateInfluence() {
        this.influence = this.controlledRegions.length * 10 + this.headquartersLevel * 5;
    }
    
    attemptTakeover(region) {
        if (!region || this.money < 100) return false;
        
        this.money -= 100; // 行动成本
        
        const strength = this.members.reduce((sum, member) => sum + member.strength, 0);
        const defense = region.security * 10 + (region.owner ? region.owner.influence : 0);
        const successChance = Math.min(0.7, strength / (defense + 15));
        
        if (Math.random() < successChance) {
            const previousOwner = region.owner;
            if (previousOwner) {
                previousOwner.controlledRegions = previousOwner.controlledRegions.filter(r => r !== region);
            }
            
            region.owner = this;
            this.controlledRegions.push(region);
            return true;
        }
        
        return false;
    }
}
