<?php
include("../config/config.php");
include '../config/cors.php';

$conexion = obtenerConexion();

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(array("error" => "No hay una sesión activa.", $_SESSION['user_id']));
    exit();
}



if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
     
        // Consultar la base de datos para obtener los datos del usuario
        $query = "SELECT email FROM users WHERE id = :id";
        $stmt = $conexion->prepare($query);
        $stmt->bindValue(':id', $_SESSION['user_id']);
        $stmt->execute();

        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData) {
            http_response_code(200);
            echo json_encode($userData);
        } else {
            http_response_code(404);
            echo json_encode(array("error" => "Usuario no encontrado."));
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
?>
