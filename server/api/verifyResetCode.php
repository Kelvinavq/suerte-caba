<?php
include '../config/cors.php'; // Incluye el archivo CORS para manejar las políticas de seguridad.
include("../config/config.php"); // Incluye el archivo de configuración.

$conexion = obtenerConexion(); // Obtiene la conexión a la base de datos.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtiene los datos enviados en el cuerpo de la solicitud.
    $data = json_decode(file_get_contents('php://input'), true);

    $email = $data['email'];
    $code = $data['code'];
    $newPassword = $data['newPassword'];

    // Verifica que el código exista y no haya expirado.
    $query = "SELECT id FROM password_reset_requests WHERE email = :email AND code = :code AND expires_at > NOW()";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':code', $code);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Actualiza la contraseña del usuario.
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $queryUpdate = "UPDATE users SET password = :password WHERE email = :email";
        $stmtUpdate = $conexion->prepare($queryUpdate);
        $stmtUpdate->bindParam(':password', $hashedPassword);
        $stmtUpdate->bindParam(':email', $email);
        $stmtUpdate->execute();

        // Elimina la solicitud de restablecimiento de la tabla.
        $queryDelete = "DELETE FROM password_reset_requests WHERE email = :email AND code = :code";
        $stmtDelete = $conexion->prepare($queryDelete);
        $stmtDelete->bindParam(':email', $email);
        $stmtDelete->bindParam(':code', $code);
        $stmtDelete->execute();

        // Responde al cliente con éxito.
        http_response_code(200);
        echo json_encode(array("message" => "Contraseña actualizada exitosamente."));
    } else {
        // Responde con error si el código es inválido o ha expirado.
        http_response_code(400);
        echo json_encode(array("error" => "El código de restablecimiento es inválido o ha expirado."));
    }
} else {
    // Método no permitido.
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
