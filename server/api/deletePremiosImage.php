<?php
include '../config/cors.php';
include("../config/config.php");

$conexion = obtenerConexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener datos enviados por el cliente desde la URL
    $imageToDelete = isset($_GET['image']) ? $_GET['image'] : null;
    $idToDelete = isset($_GET['id']) ? $_GET['id'] : null;

    try {
        if (!empty($imageToDelete) && !empty($idToDelete)) {
            $imagePath = '../public/awards/' . $imageToDelete;

            // Verificar si el archivo existe y eliminarlo del servidor
            if (file_exists($imagePath)) {
                unlink($imagePath); // Eliminar archivo del servidor
            }

            // Eliminar el registro de la imagen de la base de datos
            $query = "DELETE FROM premios WHERE id = :id";
            $stmt = $conexion->prepare($query);
            $stmt->bindValue(':id', $idToDelete, PDO::PARAM_INT);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(array("message" => "Imagen eliminada correctamente.", "image" => $imageToDelete));
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "No se especificó correctamente la imagen o el ID para eliminar."));
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
