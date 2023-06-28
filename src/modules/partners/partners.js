const importedData = require("../../assets/json/partners.json");

export class Partners {

    col;
    activated=true;
    constructor() {
        this.getJson();
    }

    getJson() {
        this.col = importedData;
        
    }
}