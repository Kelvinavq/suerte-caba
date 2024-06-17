<?php
include '../config/cors.php';
include "../config/config.php";

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verificar si se ha subido algún archivo
        if (!empty($_FILES['images']['name'][0])) {
            $uploadedImages = [];
            $errors = [];

            // Configuración de extensiones de archivo permitidas
            $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'svg', 'webp');

            // Recorrer cada archivo subido
            foreach ($_FILES['images']['name'] as $key => $imageFileName) {
                $fileTmpPath = $_FILES['images']['tmp_name'][$key];
                $fileName = $_FILES['images']['name'][$key];
                $fileSize = $_FILES['images']['size'][$key];
                $fileType = $_FILES['images']['type'][$key];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
                $newFileName = uniqid('img_', true) . '.' . $fileExtension;

                // Verificar si la extensión del archivo está permitida
                if (in_array($fileExtension, $allowedfileExtensions)) {
                    $uploadFileDir = '../public/awards/';
                    $dest_path = $uploadFileDir . $newFileName;

                    // Mover el archivo subido al directorio de premios
                    if (move_uploaded_file($fileTmpPath, $dest_path)) {
                        // Guardar el nombre del archivo en la base de datos
                        $query = "INSERT INTO premios (image) VALUES (:image)";
                        $stmt = $conexion->prepare($query);
                        $stmt->bindValue(':image', $newFileName);
                        $stmt->execute();

                        // Agregar el nombre del archivo subido al array de imágenes subidas
                        $uploadedImages[] = $newFileName;
                    } else {
                        // Agregar el error al array de errores si falla el movimiento del archivo
                        $errors[] = "Error al mover el archivo al servidor: " . $fileName;
                    }
                } else {
                    // Agregar el error de extensión no permitida al array de errores
                    $errors[] = "Extensión de archivo no permitida para el archivo: " . $fileName;
                }
            }

            // Verificar si hubo errores
            if (empty($errors)) {
                http_response_code(200);
                echo json_encode(array("message" => "Imágenes subidas correctamente.", "images" => $uploadedImages));
            } else {
                http_response_code(400);
                echo json_encode(array("error" => "Hubo errores al subir algunas imágenes.", "details" => $errors));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "No se ha subido ninguna imagen o ocurrió un error."));
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
