<?php
/* este codigo se ejecutara solo cuando la variable $_POST(cuando mandas datos a php a travez de POST se crea esa variable en automatico) exista //isset valida que una variable php exista y devuelve un boolean */
if(isset($_POST)){
  error_reporting(0);/* esta funcion es para evitar que se nos manden reportes de error al front(0) OJO si quieres depurar tu codigo php a travez de las cabeceras del navegador coloca esta hasta que acabes todo sino ya no te apareceran los errores */
    $name = $_POST["name"];
    $email = $_POST["email"];/* estamos guargando en variables los valores que recibimos de POST estas son las mismas que le pusimos de atributo name a los inputs */
    $subject = $_POST["subject"];
    $comments = $_POST["comemnts"];

    /* esta variable guardara el dominio desde donde sale la info $_SERVER["HTTP_HOST"]; obtiene esa info */
    $domain = $_SERVER["HTTP_HOST"];
    $to = "dosek1996@gmail.com";
    $subject_mail = "Contacto desde el formulario del sitio $domain";
    $message = "
    <p>
    Contacto desde el formulario del sitio <b>$domain</b>
    </p>
    <ul>
      <li>Nombre:<b>$name</b></li>
      <li>Email:<b>$email</b></li>
      <li>Asunto:$subject</li>
      <li>Comentarios:$comments</li>
    </ul>
    ";
    /* en php el . es de concatenacion, enviar una cabecera asi ayudara a que no se te vaya a la carpeta spam en correo, la ultima parte de From serian los datos de la persona que te envia el mensaje From:nombre del que lo envia  en la bandeja de entrada*/
    $headers = "MIME-Version: 1.0\r\n"."Content-Type: text/html: charset: utf-8\r\n"."From:Envio Automatico No Responder <no-reply@$domain>";/* \r es un enter y \n es una nueva linea */


    /* el metodo para mandar un email de php se llama mail(a quien le llegara el correo, asunto, mensaje, cabeceras) */
    $send_mail = mail($to, $subject_mail, $message, $headers);

    if($send_mail){
        $res =[
          "err" => false,
          "message" => "Tus Datos han sido enviados"
        ];
    } else {
        $res =[
          "err" => true,
          "message" => "Error al enviar tus datos, intenta nuevamente"
        ];
    }

    /* esta cabecera es para que permita la transferencia de origenes cruzados CORS */
    header("Access-Control-Allow-Origin:*");//permite desde cualquier sitio o todas las peticiones
    // header("Access-Control-Allow-Origin:https://tudominio.com"); //permite desde un  dominio en especifico

    /* especificamos el tipo de contenido en el que mandaremos la respuesta a la applicacion que nos hizo l peticio, en este caso es el arreglo de respuesta de arriba */
    header('Content-Type: application/json');
    /* parseamos para que salga en formato json */

    echo json_encode($res);
    exit;
}