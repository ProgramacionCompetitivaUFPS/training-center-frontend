const importedData = require("../../assets/json/partners.json");

export class Partners {

    col;

    constructor() {
        this.getJson();
    }

    getJson() {
        this.col = importedData;
        
    }
}