class TokenStatusMarkers {
    #graphic;

    constructor (graphic) {
        this.#graphic = graphic;
    }

    /**
     * @param {boolean} value
     */
    set deleted (value) {
        const markers = (this.#graphic.get("statusmarkers") || "").split(",");
        const deletedIndex = markers.indexOf("deleted");

        if (value) {
            if (deletedIndex > -1) {
                // deleted already
                return;
            }

            markers.push("deleted");
        } else {
            if (deletedIndex === -1) {
                // not deleted, nothing to do
                return;
            }

            markers.splice(deletedIndex, 1);
        }

        this.#graphic.set("statusmarkers", markers.join(","));
    }
}