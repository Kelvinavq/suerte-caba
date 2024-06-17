<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

// Función para generar un código aleatorio
function generateRandomCode() {
    $length = 6; // Longitud del código
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $randomString;
}

// Función para enviar correo electrónico con el código de restablecimiento
function sendResetPasswordEmail($email, $code) {
    $to = $email;
    $subject = 'Código de Restablecimiento de Contraseña';
    $message = 'Su código de restablecimiento de contraseña es: ' . $code;
    $headers = 'From: contacto@suertecaba.com' . "\r\n" .
               'Reply-To: contacto@suertecaba.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    return mail($to, $subject, $message, $headers);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $email = $data['email'];

    // Validar que el correo electrónico existe en la base de datos
    $query = "SELECT id FROM users WHERE email = :email";
    $stmt = $conexion->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Generar un código único para el restablecimiento
        $code = generateRandomCode(); // Llamada a la función para generar código aleatorio
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour')); // El código expira en 1 hora

        // Guardar el código en la base de datos
        $queryInsert = "INSERT INTO password_reset_requests (email, code, expires_at) VALUES (:email, :code, :expires_at)";
        $stmtInsert = $conexion->prepare($queryInsert);
        $stmtInsert->bindParam(':email', $email);
        $stmtInsert->bindParam(':code', $code);
        $stmtInsert->bindParam(':expires_at', $expiresAt);
        $stmtInsert->execute();

        // Enviar el código por correo electrónico al usuario
        if (sendResetPasswordEmail($email, $code)) { // Llamada a la función para enviar correo electrónico
            // Responder al cliente con éxito
            http_response_code(200);
            echo json_encode(array("message" => "Se ha enviado un código de restablecimiento a su correo electrónico."));
        } else {
            // Responder con error si falla el envío del correo electrónico
            http_response_code(500);
            echo json_encode(array("error" => "Error al enviar el correo electrónico."));
        }
    } else {
        // Responder con error si el correo electrónico no está registrado
        http_response_code(404);
        echo json_encode(array("error" => "El correo electrónico no está registrado."));
    }
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(array("error" => "Método no permitido."));
}
?>
