<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Validar los datos recibidos
        $id = isset($data->id) ? $data->id : null;
        $status = isset($data->status) ? $data->status : null;

        if (!$id || !$status) {
            http_response_code(400);
            echo json_encode(array("error" => "Faltan datos obligatorios."));
            exit;
        }

        // Verificar que el estado recibido sea válido ("activo" o "inactivo")
        if ($status !== "activo" && $status !== "inactivo") {
            http_response_code(400);
            echo json_encode(array("error" => "Estado no válido."));
            exit;
        }

        // Preparar la consulta de actualización
        $query = "UPDATE testimonios SET status = :status WHERE id = :id";
        $params = array(
            ':id' => $id,
            ':status' => $status
        );

        // Ejecutar la consulta de actualización
        $stmt = $conexion->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(array("message" => "Estado del testimonio actualizado correctamente."));
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
