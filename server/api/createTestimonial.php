<?php
require "../vendor/autoload.php";
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);

        $nombre = isset($data['nombre']) ? $data['nombre'] : null;
        $rating = isset($data['rating']) ? $data['rating'] : null;
        $testimonio = isset($data['testimonio']) ? $data['testimonio'] : null;

        // Validación mínima
        if (!$nombre || !$rating || !$testimonio) {
            http_response_code(400);
            echo json_encode(array("error" => "Todos los campos son obligatorios."));
            exit;
        }

        // Preparar la consulta de inserción
        $query = "INSERT INTO testimonios (cliente, estrellas, testimonio) VALUES (:nombre, :rating, :testimonio)";
        $stmt = $conexion->prepare($query);
        $params = array(
            ':nombre' => $nombre,
            ':rating' => $rating,
            ':testimonio' => $testimonio
        );

        // Ejecutar la consulta de inserción
        $stmt->execute($params);

        http_response_code(201);
        echo json_encode(array("message" => "Testimonio creado correctamente."));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("error" => "Error interno del servidor.", "details" => $e->getMessage()));
    } finally {
        $conexion = null;
    }
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
