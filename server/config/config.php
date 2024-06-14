<?php

function obtenerConexion()
{
    $host = 'localhost';
    $dbname = 'suertecaba';
    $username = 'root';
    $password = '';

    // $host = 'localhost';
    // $dbname = 'c2301988_system';
    // $username = 'c2301988_system';
    // $password = '79meNAgubo';


    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
    } catch (PDOException $e) {
        echo "Error de conexión: " . $e->getMessage();
    }
}
