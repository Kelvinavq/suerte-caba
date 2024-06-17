<?php
include '../config/cors.php';
include "../config/config.php";

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Obtener la información del archivo subido
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $fileName = $_FILES['image']['name'];
            $fileSize = $_FILES['image']['size'];
            $fileType = $_FILES['image']['type'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            $newFileName = uniqid('img_', true) . '.' . $fileExtension;

            $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'svg', 'webp');
            if (in_array($fileExtension, $allowedfileExtensions)) {
                $uploadFileDir = '../public/images/';
                $dest_path = $uploadFileDir . $newFileName;

                // Mover el archivo subido al directorio de imágenes
                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    // Obtener la imagen anterior y eliminarla si existe
                    $querySelect = "SELECT image, path FROM header WHERE id = 1";
                    $stmtSelect = $conexion->prepare($querySelect);
                    $stmtSelect->execute();
                    $oldImageData = $stmtSelect->fetch(PDO::FETCH_ASSOC);

                    if ($oldImageData && !empty($oldImageData['image'])) {
                        $oldImagePath = $oldImageData['path'];
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath); // Eliminar la imagen anterior del servidor
                        }
                    }

                    // Actualizar la base de datos con la nueva imagen
                    $queryUpdate = "UPDATE header SET image = :image, path = :path WHERE id = 1";
                    $stmtUpdate = $conexion->prepare($queryUpdate);
                    $stmtUpdate->bindValue(':image', $newFileName);
                    $stmtUpdate->bindValue(':path', $dest_path);
                    $stmtUpdate->execute();

                    http_response_code(200);
                    echo json_encode(array(
                        "message" => "Imagen actualizada exitosamente.",
                        "image" => $newFileName,
                        "path" => $dest_path
                    ));
                } else {
                    http_response_code(500);
                    echo json_encode(array("error" => "Error al mover el archivo."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("error" => "Extensión de archivo no permitida."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "No se ha subido ninguna imagen."));
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
