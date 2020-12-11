/**
 * API
 * Archivo con todos los datos para la conexión al backend
 * @exports API - Objeto JSON con datos de conexión a Backend
 */
export let API = {
    // API

    /**
     * apiUrl debe reemplazarse por la dirección del backend
     */
    apiUrl: "http://127.0.0.1:3000/",
    endpoints: {
        addMaterials: "add-materials",
        addProblemAssignment: "add-problems",
        assignment: "assignment",
        assignments: "assignments",
        auth: "auth",
        categories: "categories",
        categoryProblems: "categories/{1}/problems",
        contests: "contests",
        date: "server-date",
        enrolledSyllabus: "users/{1}/syllabus",
        materials: "materials",
        problems: "problems",
        principal: "principal", //se agrego 3/11
        ranking: "ranking",
        recovery: "recovery",
        removeMaterialSyllabus: "remove-materials",
        removeProblemAssignment: "remove-problems",
        reset: "reset",
        submissions: "submissions",
        superUser: "super-user",
        syllabus: "syllabus",
        user: "user",
        users: "users"
    },

    // SESSION
    tokenName: "Authorization"
};