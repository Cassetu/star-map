const TECHNOLOGIES = {
    advancedFarming: {
        name: 'Advanced Farming',
        description: '+30% population growth in all cities',
        cost: { food: 500, metal: 200, energy: 100 },
        icon: '🌾',
        requires: [],
        effect: 'popGrowth',
        value: 0.3
    },
    militaryTactics: {
        name: 'Military Tactics',
        description: '+15% attack power for all units',
        cost: { food: 300, metal: 400, energy: 200 },
        icon: '⚔️',
        requires: [],
        effect: 'attackBonus',
        value: 0.15
    },
    efficientRoads: {
        name: 'Efficient Roads',
        description: 'Roads cost 50% less to build',
        cost: { food: 200, metal: 300, energy: 150 },
        icon: '🛣️',
        requires: [],
        effect: 'roadCost',
        value: 0.5
    },
    fortifications: {
        name: 'Fortifications',
        description: 'City upgrades cost 25% less',
        cost: { food: 400, metal: 500, energy: 200 },
        icon: '🏰',
        requires: [],
        effect: 'upgradeCost',
        value: 0.25
    },
    industrialization: {
        name: 'Industrialization',
        description: '+25% metal production in all cities',
        cost: { food: 300, metal: 600, energy: 300 },
        icon: '⚙️',
        requires: ['efficientRoads'],
        effect: 'metalProduction',
        value: 0.25
    },
    energyEfficiency: {
        name: 'Energy Efficiency',
        description: '+25% energy production in all cities',
        cost: { food: 200, metal: 400, energy: 500 },
        icon: '⚡',
        requires: [],
        effect: 'energyProduction',
        value: 0.25
    },
    massRecruitment: {
        name: 'Mass Recruitment',
        description: 'Units require 25% less population',
        cost: { food: 600, metal: 400, energy: 300 },
        icon: '👥',
        requires: ['militaryTactics'],
        effect: 'recruitmentCost',
        value: 0.25
    },
    veteranCorps: {
        name: 'Veteran Corps',
        description: '+20% defense for all units',
        cost: { food: 400, metal: 600, energy: 400 },
        icon: '🛡️',
        requires: ['militaryTactics'],
        effect: 'defenseBonus',
        value: 0.2
    },
    greenRevolution: {
        name: 'Green Revolution',
        description: '+40% food production in all cities',
        cost: { food: 800, metal: 300, energy: 200 },
        icon: '🌿',
        requires: ['advancedFarming'],
        effect: 'foodProduction',
        value: 0.4
    },
    rapidExpansion: {
        name: 'Rapid Expansion',
        description: 'New cities cost 30% less',
        cost: { food: 500, metal: 500, energy: 300 },
        icon: '🏙️',
        requires: ['advancedFarming', 'efficientRoads'],
        effect: 'cityCost',
        value: 0.3
    }
};

const TechTree = {
    unlockedTechs: [],

    init() {
        this.createTechPanel();
    },

    createTechPanel() {
        const leftPanel = document.getElementById('left-panel');

        const section = document.createElement('div');
        section.className = 'collapsible-section';
        section.innerHTML = `
            <div class="collapsible-header" onclick="toggleCollapsible('tech-tree')">
                <h4>TECHNOLOGY TREE</h4>
                <span class="collapsible-indicator" id="tech-tree-indicator">▼</span>
            </div>
            <div class="collapsible-content" id="tech-tree-content">
                <div id="tech-tree-container"></div>
            </div>
        `;

        leftPanel.insertBefore(section, leftPanel.firstChild);
        this.updateTechDisplay();
    },

    updateTechDisplay() {
        const container = document.getElementById('tech-tree-container');
        if (!container) return;

        container.innerHTML = '';

        Object.keys(TECHNOLOGIES).forEach(techKey => {
            const tech = TECHNOLOGIES[techKey];
            const isUnlocked = this.unlockedTechs.includes(techKey);
            const canResearch = !isUnlocked && this.canResearch(techKey);
            const requirementsMet = this.requirementsMet(techKey);

            const techDiv = document.createElement('div');
            techDiv.className = `tech-option ${isUnlocked ? 'tech-unlocked' : ''} ${!requirementsMet ? 'tech-locked' : ''}`;

            if (canResearch && requirementsMet) {
                techDiv.onclick = () => this.researchTech(techKey);
            }

            const reqText = tech.requires.length > 0
                ? `<div class="tech-requires">Requires: ${tech.requires.map(r => TECHNOLOGIES[r].name).join(', ')}</div>`
                : '';

            techDiv.innerHTML = `
                <div class="tech-header">
                    <span class="tech-icon">${tech.icon}</span>
                    <span class="tech-name">${tech.name}</span>
                    ${isUnlocked ? '<span class="tech-check">✓</span>' : ''}
                </div>
                <div class="tech-description">${tech.description}</div>
                ${reqText}
                <div class="tech-cost">${tech.cost.food}F, ${tech.cost.metal}M, ${tech.cost.energy}E</div>
            `;

            container.appendChild(techDiv);
        });
    },

    requirementsMet(techKey) {
        const tech = TECHNOLOGIES[techKey];
        return tech.requires.every(reqKey => this.unlockedTechs.includes(reqKey));
    },

    canResearch(techKey) {
        const tech = TECHNOLOGIES[techKey];
        return hasResources(tech.cost) && this.requirementsMet(techKey);
    },

    researchTech(techKey) {
        if (this.unlockedTechs.includes(techKey)) return;
        if (!this.canResearch(techKey)) {
            addMessage('Cannot research this technology yet!', 'warning');
            return;
        }

        const tech = TECHNOLOGIES[techKey];
        spendResources(tech.cost);
        this.unlockedTechs.push(techKey);

        addMessage(`Researched: ${tech.name}!`, 'success');
        AudioManager.playSFX('sfx-success', 0.7);

        this.updateTechDisplay();
    },

    getTechBonus(effectType) {
        let totalBonus = 0;
        this.unlockedTechs.forEach(techKey => {
            const tech = TECHNOLOGIES[techKey];
            if (tech.effect === effectType) {
                totalBonus += tech.value;
            }
        });
        return totalBonus;
    },

    hasTech(techKey) {
        return this.unlockedTechs.includes(techKey);
    }
};