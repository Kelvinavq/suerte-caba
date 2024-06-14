<?php
require "../vendor/autoload.php";
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $email = isset($_POST['email']) ? $_POST['email'] : null;
        $password = isset($_POST['password']) ? $_POST['password'] : null;

        // Validación mínima para la contraseña
        if ($password && strlen($password) < 8) {
            http_response_code(400);
            echo json_encode(array("error" => "La contraseña debe tener al menos 8 caracteres."));
            exit;
        }

        // Preparar la consulta de actualización
        $query = "UPDATE users SET email = :email";
        $params = array(':email' => $email);

        // Incluir la contraseña en la consulta solo si se proporciona
        if ($password) {
            $query .= ", password = :password";
            $params[':password'] = password_hash($password, PASSWORD_DEFAULT); // Hash de la contraseña
        }

        // Ejecutar la consulta de actualización
        $stmt = $conexion->prepare($query);
        $stmt->execute($params);

        http_response_code(200);
        echo json_encode(array("message" => "Datos actualizados correctamente."));
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
