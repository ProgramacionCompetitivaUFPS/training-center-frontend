/**
 * API
 * Archivo con todos los datos para la conexión al backend
 * @exports API - Objeto JSON con datos de conexión a Backend
 */

import environment from '../../config/environment.json'
export let API = {
    /**
     * apiUrl debe reemplazarse por la dirección del backend
     */
    apiUrl: environment.API_BACKEND_URL + environment.API_BACKEND_BASE,
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
        submissionsProblems: "problems/{1}/submissions",
        principal: "principal",
        ranking: "ranking",
        ranking2: "ranking2",
        ranking3: "ranking3",
        rankingCategory: "rankingCategory",
        recovery: "recovery",
        removeMaterialSyllabus: "remove-materials",
        removeProblemAssignment: "remove-problems",
        reset: "reset",
        submissions: "submissions",
        superUser: "super-user",
        syllabus: "syllabus",
        user: "user",
        users: "users",
        universities: "institutions/universities",
        colleges: "institutions/colleges"
    },

    // SESSION
    tokenName: "Authorization"
};