class SpellEffect{
    static list = {};
    static nextId = 0;

    id
    name;
    validTargets = ["self", "melee", "target", "trail"];

    supportsDuration = false;
    durationMax;
    supportsMagnitude = false;
    magnitudeMin;
    magnitudeMax;
    supportsArea = false;
    areaMax;
    supportsChance = false;

    baseCost;
    magnitudeCost;
    chanceCost;
    durationCost;
    areaCost;

    constructor(name, validTargets, supportsDuration, durationMax, supportsMagnitude, magnitudeMin, magnitudeMax, supportsArea, areaMax, supportsChance) {
        this.id = SpellEffect.nextId;
        SpellEffect.nextId++;
        this.name = name;
        this.validTargets = validTargets;
        this.supportsDuration = supportsDuration;
        this.durationMax = durationMax;
        this.supportsMagnitude = supportsMagnitude;
        this.magnitudeMin = magnitudeMin;
        this.magnitudeMax  = magnitudeMax;
        this.supportsArea = supportsArea;
        this.areaMax = areaMax;
        this.supportsChance = supportsChance;

        SpellList[key] = this;
    }

    static init() {
        new SpellEffect("fire", ["self", "melee", "target", "trail"], true, 100, false, 0, 0, true, 25, true);
        new SpellEffect("levitate", ["self", "melee", "target", "trail"], true, 100, false, 0, 0, true, 25, true);
    }

    static fireEffect(caster, targetx, tartgety){
        console.log(caster.type+caster.id + ": I cast fire!!")
    }

    static levitateEffect(caster, targetx, targety) {
        iconsole.log(caster.type+caster.id + ": I cast levitate!!")
    }
}