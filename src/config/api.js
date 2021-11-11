/**
 * API
 * Archivo con todos los datos para la conexión al backend
 * @exports API - Objeto JSON con datos de conexión a Backend
 */
import environment from './../environment';
export let API = {
    /**
     * apiUrl debe reemplazarse por la dirección del backend
     */
    apiUrl: environment.API_BACKEND_URL_DEVELOPMENT,
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
        principal: "principal",
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