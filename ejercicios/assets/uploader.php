<?php
// echo "Hola respuesta desde el servidor";/* imprime texto */

// var_dump($_FILES);/* var_dump sirve para imprimir objetos, $_FILES crea un arreglo de los elementos subidos */

if(isset($_FILES["file"])){/* isset es una funcion que evalua si una variable en php existe("si la variable de tipo $_FILES[de nombre "file"]" existe  haz el if) */
  $name = $_FILES["file"]["name"];
  $file = $_FILES["file"]["tmp_name"];
  $error = $_FILES["file"]["error"];

  /* esta sera la ruta donde se subiran los archivos */
  $destination = "../files/$name";

  /* recibe 2 parametros(archivo, detino) y sirve para subir archivos */
  $upload = move_uploaded_file($file, $destination);

  //definimos que enviaremos como respuesta del lado server a JS
  if($upload){
    $res = array(/* las "" en php sirven para interpolar */
      "err" => false,
      "status" => http_response_code(200),
      "statusText" => "Archivo $name subido con exito",
      "files" => $_FILES["file"]
    );
  } else {
    $res = array(/* las "" en php sirven para interpolar */
      "err" => true,
      "status" => http_response_code(400),
      "statusText" => "Error al subir el archivo $name",
      "files" => $_FILES["file"]
    );
  }

  echo json_encode($res);/* json_encode convierte codigo php a formato JSON  y usamos echo para mandar la respuesta */

}