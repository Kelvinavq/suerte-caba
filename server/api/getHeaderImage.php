<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

try {
    $query = "SELECT image, path FROM header LIMIT 1";
    $stmt = $conexion->prepare($query);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $imagen = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($imagen);
    } else {
        http_response_code(404);
        echo json_encode(array("error" => "Imagen no encontrada."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("error" => "Error interno del servidor.", "details" => $e->getMessage()));
} finally {
    $conexion = null;
}
?>
