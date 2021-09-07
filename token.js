class Token {
    #characterId;
    #graphic;
    #isHero;
    #name;
    #statusMarkers;

    constructor (graphic) {
        this.#graphic = graphic;

        const characterId = graphic.get("represents");
        this.#isHero = characterId && getAttrByName(characterId, "hero") === "1";
        this.#isHero = !!this.#isHero;
        this.#characterId = characterId;

        this.#name = graphic.get("name");
        this.#statusMarkers = new TokenStatusMarkers(graphic);
    }

    #getBarValue (barNumber) { return parseInt(this.#graphic.get(`bar${barNumber}_value`)); }
    #setBarValue(barNumber, value) { this.#graphic.set(`bar${barNumber}_value`, value); }
    
    get armor() { return this.#getBarValue(2); }
    set armor(value) { this.#setBarValue(2, value); }

    get hp() { return this.#getBarValue(1); }
    set hp(value) { 
        this.#setBarValue(2, value);

        if (value > 0) {
            this.#statusMarkers.deleted = false;
        } else {
            this.#statusMarkers.deleted = true;
        }
    }

    get isHero () { return this.#isHero; }

    get name () { return this.#name; }
}