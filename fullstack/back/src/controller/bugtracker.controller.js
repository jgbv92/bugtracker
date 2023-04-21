import { getConnection } from "./../database/database";

//MÉTODOS PARA LA BASE DE DATOS BUG_TRACKER Y TABLA BUG_REPORTS
//Metodo GET 
const getBugTracker = async (req, res) => {
    try{
        const { db } = req.query;
        const pool = await getConnection(db);

        let table_name = 'bug_reports';
        if (db === 'pool2') {
            table_name = 'bug_reports_wen';
        } else if (db === 'pool3') {
            table_name = 'bug_reports_press';
        };

        const result = await pool.query(`SELECT * FROM ${table_name}`);
        console.log(result);
        res.json(result);
        }catch(error){
            res.status(500);
            res.send(error.message);
        }
    };

//METODO POST
const addBug = async (req, res) => {
    try{
        const { db } = req.query;
        const {resumen, descripcion, pasos, resultado_obtenido, resultado_esperado, evidencia, comentarios, regresion, ticket_relacionado, status, developer, informador} = req.body;

        if (!resumen || !descripcion || !resultado_esperado || !resultado_obtenido){
            res.status(400).json({message:"Bad request. Please, fill all the fields"});
        };
        
        const pool = await getConnection(db);
        const variables = {
            resumen, descripcion, pasos, resultado_obtenido, resultado_esperado, evidencia, comentarios, regresion, ticket_relacionado, status, developer, informador
        };

        let table_name = 'bug_reports';
        if (db === 'pool2') {
            table_name = 'bug_reports_wen';
        } else if (db === 'pool3') {
            table_name = 'bug_reports_press';
        }

        const result = await pool.query(`INSERT INTO ${table_name} SET ?`, variables);
        res.json({message:"The item has been added"});
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

//GET by ID
const getBug = async (req, res) => {
    try{
        const { db } = req.query;
        console.log(req.params);
        const { id } = req.params;

        let table_name = 'bug_reports';
        if (db === 'pool2') {
            table_name = 'bug_reports_wen';
        } else if (db === 'pool3') {
            table_name = 'bug_reports_press';
        }

        const pool = await getConnection(db);
        const result = await pool.query(`SELECT * FROM ${table_name} WHERE id = ${parseInt(id)}`);

        if (result[0]){
            return res.json(result);
         }
         
        return res.status(400).json({message:"Bad request. Please, provide a valid id"});
        
        
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

//UPDATE
const updateBug = async (req, res) => {
    try{
        const {id} = req.params;
        const { db} = req.query;
        const  {resumen, descripcion, pasos, resultado_obtenido, resultado_esperado, evidencia, comentarios, regresion, ticket_relacionado, status, developer, informador} = req.body;

        console.log("db:", db);
        console.log("id:", id);
        console.log("req.body:", req.body);
        
        if (!id || !resumen || !descripcion || !resultado_esperado || !resultado_obtenido){
            res.status(400).json({message:"Bad request. Please, fill all the fields"});
        };
        const bugStructure = {id, resumen, descripcion, pasos, resultado_obtenido, resultado_esperado, evidencia, comentarios, regresion, ticket_relacionado, status, developer, informador};

        console.log("bugStructure:", bugStructure)

        const pool = await getConnection(db);    

        let table_name = 'bug_reports';
        if (db === 'pool2') {
            table_name = 'bug_reports_wen';
        } else if (db === 'pool3') {
            table_name = 'bug_reports_press';
        }

        console.log("table_name:", table_name);

        const result = await pool.query(`UPDATE ${table_name} SET ? WHERE id = ?`, [bugStructure, id]);
        res.json({message:"The item has been updated"});

        console.log("result:", result);

    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

//DELETE
const deleteBug = async (req, res) => {
    try{
        const { db } = req.query;
        console.log(req.params);
        const { id } = req.params;
        const pool = await getConnection(db);

        let table_name = 'bug_reports';
        if (db === 'pool2') {
            table_name = 'bug_reports_wen';
        } else if (db === 'pool3') {
            table_name = 'bug_reports_press';
        }

        const result = await pool.query(`DELETE FROM ${table_name} WHERE id = ${parseInt(id)}`);
        res.json(result);
        
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getBugTracker,
    getBug,
    addBug,
    deleteBug,
    updateBug
};