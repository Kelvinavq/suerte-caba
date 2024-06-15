<?php

function obtenerConexion()
{
    // $host = 'localhost';
    // $dbname = 'suertecaba';
    // $username = 'root';
    // $password = '';

    $host = 'localhost';
    $dbname = 'u211881118_suertecaba';
    $username = 'u211881118_suertecaba';
    $password = '#1kVB=?+p';


    try {
        $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
    } catch (PDOException $e) {
        echo "Error de conexión: " . $e->getMessage();
    }
}
