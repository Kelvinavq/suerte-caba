<?php
include '../config/cors.php';
include "../config/config.php";

// Obtener conexión a la base de datos
$conexion = obtenerConexion();

// Verificar si la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("error" => "Método no permitido."));
    exit(); // Salir del script si no es POST
}

try {
    // Obtener datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));

    // Validar y escapar los datos para prevenir SQL injection
    $email = filter_var($data->email, FILTER_VALIDATE_EMAIL);
    $password = htmlspecialchars(strip_tags($data->password));

    // Buscar usuario por correo electrónico
    $buscarUsuario = "SELECT id, password FROM users WHERE email = :email";
    $stmtBuscar = $conexion->prepare($buscarUsuario);
    $stmtBuscar->bindValue(':email', $email);
    $stmtBuscar->execute();

    if ($stmtBuscar->rowCount() > 0) {
        // Usuario encontrado, verificar la contraseña
        $usuario = $stmtBuscar->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $usuario['password'])) {
            // Contraseña válida, iniciar sesión de forma segura
            session_start();
            session_regenerate_id(); // Regenerar el ID de la sesión para prevenir ataques de fijación de sesión
            $_SESSION['user_id'] = $usuario['id'];

            // Devolver información del usuario en la respuesta
            http_response_code(200);
            echo json_encode(array(
                "message" => "Inicio de sesión exitoso.",
                "user_id" => $usuario['id'],
            ));
        } else {
            // Contraseña incorrecta
            http_response_code(401); // Unauthorized
            echo json_encode(array("error" => "Contraseña incorrecta."));
        }
    } else {
        // Usuario no encontrado
        http_response_code(401); // Unauthorized
        echo json_encode(array("error" => "Usuario no encontrado."));
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Error interno del servidor.", "details" => $e->getMessage()));
} finally {
    // Cerrar la conexión después de usarla
    $conexion = null;
}
?>
