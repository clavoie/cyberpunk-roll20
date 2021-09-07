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

    get x () { return Math.ceil(this.#graphic.get("left")/70); }
    get y () { return Math.ceil(this.#graphic.get("top")/70); }

    /**
     * @param {Token} otherToken
     */
    calculateDistance  (otherToken) {
        // https://app.roll20.net/forum/post/972389/feature-request-api-ruler-distance#post-972547

        const distX = Math.abs(this.x - otherToken.x);
        const distY = Math.abs(this.y- otherToken.y);
        const distance = Math.sqrt(distX * distX + distY * distY);

        const page = getObj('page', this.#graphic.get('pageid'));
        const gridUnitSize = page.get('snapping_increment'); // units per grid square
        const unitScale = page.get('scale_number'); // scale for 1 unit, eg 1 unit = 5ft
        const unit = page.get('scale_unit'); // unit, eg ft or km

        return {
            distance: distance, // Distance between token1 and token2 in units
            squares: distance / gridUnitSize, // Distance between token1 and token2 in squares
            measurement: '' + (unitScale * distance / gridUnitSize) + unit // Ruler measurement as a string
        };
    }
}