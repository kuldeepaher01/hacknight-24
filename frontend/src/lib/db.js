"use server";
import { Pool } from "pg";
import "dotenv/config";

async function runQuery(query, values) {
	const connectionString = process.env.DB;
	console.log("Connecting to database:", connectionString);

	const pool = new Pool({
		connectionString: connectionString,
	});

	try {
		const client = await pool.connect();
		const result = await client.query(query, values);
		client.release();
		console.log("Query executed successfully:\n", query, values);
		return result.rows;
	} catch (err) {
		console.error("Error executing query:", err);
		throw err;
	}
}

async function updateLandOwnership(user_id, center_coordinate, polygon_coordinates, area_in_ha, coordinates, gov_id) {
    const query = `
        UPDATE land_ownership
        SET center_coordinate = ST_GeomFromText($2, 4326), 
            polygon_coordinates = ST_GeomFromText($3, 4326), 
            area_in_ha = $4, 
            polygon_list = $5
        WHERE user_id = $1 and gov_id = $6;
    `;
    const values = [user_id, center_coordinate, polygon_coordinates, area_in_ha, coordinates, gov_id];
    return runQuery(query, values);
}





async function getFarmCoordinates(farmId) {
    const query = "SELECT coordinates FROM farms WHERE id = $1";
    const values = [farmId];
    return runQuery(query, values);
}

async function getUsers(){
	const query = "SELECT * FROM users";
	return runQuery(query, []);
}

async function setUserData(no_of_wells, no_of_vehicles, no_of_cattles, no_of_borewells, gender, total_lands_owned){
	const query = "INSERT INTO user_data (no_of_wells, no_of_vehicles, no_of_cattles, no_of_borewells, gender, total_lands_owned) VALUES ($1, $2, $3, $4, $5, $6)";
	const values = [no_of_wells, no_of_vehicles, no_of_cattles, no_of_borewells, gender, total_lands_owned];
	
	await runQuery(query, values);
}

async function createUser(username, email, phone){
  const query = "INSERT INTO users(username,email,phone) VALUES($1, $2, $3)";
  const values = [username, email , phone];
  
  return runQuery(query, values);
}

async function compareData(user_id){
	const query = `SELECT 
    vud.id AS user_id,
    vud.no_of_wells,
    vud.no_of_vehicles,
    vud.no_of_cattles,
    vud.no_of_borewells,
    vud.vehicles_owned,
    vud.total_lands_owned,
    ud.no_of_wells AS user_data_no_of_wells,
    ud.no_of_vehicles AS user_data_no_of_vehicles,
    ud.no_of_cattles AS user_data_no_of_cattles,
    ud.no_of_borewells AS user_data_no_of_borewells,
    ud.vehicles_owned AS user_data_vehicles_owned,
    ud.total_lands_owned AS user_data_total_lands_owned
FROM user_data ud
RIGHT JOIN verified_user_data vud ON vud.user_id = ud.id
WHERE vud.user_id = $1;

`;
	const values = [user_id];
	
	return runQuery(query, values);
}

async function getUserData(user_id){
	const query = "SELECT * FROM user_data WHERE id = $1";
	const values = [user_id];
	
	return runQuery(query, values);
}

async function fetchLocation(survey_no, userid){
	const query = "SELECT * FROM land_ownership where gov_id = $1 and user_id = $2";
	const values = [survey_no, userid];
	const val = await runQuery(query, values);
	// if val is none add the survey_no to the database
	if(val.length === 0){
		const query = "INSERT INTO land_ownership (gov_id, user_id) VALUES ($1, $2) returning *";
		const values = [survey_no, userid];
		await runQuery(query, values);
	}
	return val;
}

async function fetchCoordinatesForLoan(survey_no, userid){
	const query = "SELECT * FROM land_ownership where gov_id = $1 and user_id = $2";
	const values = [survey_no, userid];
	return runQuery(query, values);
}





export { updateLandOwnership,fetchCoordinatesForLoan, getFarmCoordinates, fetchLocation, getUsers, setUserData, createUser, compareData , getUserData};