<?php

include '../config/cors.php';
include("../config/config.php");

// Obtener la conexión a la base de datos
$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Consulta para obtener las imágenes de las tarjetas
        $query = "SELECT id, image FROM tarjetas";
        $stmt = $conexion->prepare($query);
        $stmt->execute();

        // Obtener los resultados de la consulta
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Preparar un arreglo asociativo para almacenar las imágenes de las tarjetas
        $cardImages = [];

        // Iterar sobre los resultados y almacenar las rutas de las imágenes por ID de tarjeta
        foreach ($images as $image) {
            $cardImages[$image['id']] = $image['image'];
        }

        // Devolver la respuesta en formato JSON
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode($cardImages);
    } catch (Exception $e) {
        // Manejar errores
        http_response_code(500);
        echo json_encode(array("error" => "Error interno del servidor.", "details" => $e->getMessage()));
    } finally {
        // Cerrar la conexión a la base de datos
        $conexion = null;
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
