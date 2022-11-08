export class Enums {
    static typeCategory = {
        "school" : 2,
        "university" : 1,
        "all" : 3,
        "getId": (nameSpanish) => {
            if (nameSpanish === "colegio") return this.typeCategory.school
            if (nameSpanish === "universidad") return this.typeCategory.university
            return null
        },
        "getNameSpanish": (id) => {
            if (id == 2) return "Colegio"
            if (id == 1) return "Universidad"
            return null
        }
    }

    static typeInstitution = {
        "school" : 1,
        "university" : 0,
        "getName": (id) => {
            if (id === 1) return "school"
            if (id === 0) return "university"
            return null
        }
    }

    static typeContest = {
        "school" : 1,
        "university" : 0,
        "getName": (id) => {
            if (id == 1) return "Colegio"
            if (id == 0) return "Universidad"
            return null
        }
    }
}