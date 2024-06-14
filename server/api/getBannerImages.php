<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT id, image FROM banner";
        $stmt = $conexion->prepare($query);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($result);
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
