<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener el cuerpo de la solicitud HTTP
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE); // Decodificar el JSON en un array asociativo

        // Verificar que se hayan recibido los datos necesarios
        $id = isset($input['id']) ? $input['id'] : null;
        $cliente = isset($input['cliente']) ? $input['cliente'] : null;
        $estrellas = isset($input['estrellas']) ? $input['estrellas'] : null;
        $testimonio = isset($input['testimonio']) ? $input['testimonio'] : null;

        // Validación mínima (puedes añadir más validaciones según necesites)
        if (!$id || !$cliente || !$estrellas || !$testimonio) {
            http_response_code(400);
            echo json_encode(array("error" => "Faltan datos obligatorios."));
            exit;
        }

        // Preparar la consulta de actualización
        $query = "UPDATE testimonios SET cliente = :cliente, estrellas = :estrellas, testimonio = :testimonio WHERE id = :id";
        $params = array(
            ':id' => $id,
            ':cliente' => $cliente,
            ':estrellas' => $estrellas,
            ':testimonio' => $testimonio
        );

        // Ejecutar la consulta de actualización
        $stmt = $conexion->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(array("message" => "Testimonio actualizado correctamente."));
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
