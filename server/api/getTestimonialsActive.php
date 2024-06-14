<?php
include("../config/config.php");
include '../config/cors.php';

$conexion = obtenerConexion();


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {

        // Consultar la base de datos para obtener los datos del usuario
        $query = "SELECT * FROM testimonios WHERE status = 'activo' ORDER BY id DESC";
        $stmt = $conexion->prepare($query);
        $stmt->execute();

        $testimonios  = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($testimonios) {
            http_response_code(200);
            echo json_encode($testimonios);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "testimonios no encontrado."));
        }
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
