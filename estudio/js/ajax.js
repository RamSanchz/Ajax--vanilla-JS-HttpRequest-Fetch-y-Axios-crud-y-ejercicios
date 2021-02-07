/* esto es una funcion anonima auto ejecutable que nos permite encapsular codigo sin la necesidad de modulos o funciona como los modulos de js */


//todos estos metodos de las APIS funcionan con archivos locales solo se pasa la URL del archivo

/* XMLHttpRequest */
(() => {
  /* paso 1-- instanciar el objeto XMLHttpRequest */
  const xhr = new XMLHttpRequest(),
    $xhr = document.getElementById("xhr"),
    $fragment = document.createDocumentFragment(); // los fragmentos se hacen para evitar hacer muchas inserciones al DOM se recomienda trabajar con estos

  /* paso 2-- asignar el evento a nuestra instancia (readystatechange) este evento estara escuchando y a la espera de algun cambio en nuestro estatus de la peticion */
  xhr.addEventListener("readystatechange", (e) => {
    /* esta es una de las principales validaciones y es que cuando nuestro readyState sea diferente de 4 no hara  nada ya que es hasta el estado 4 cuando ya podemos manipular la info que nos da la API en el DOM  de caso contrario se llamara el numero de veces que de los estados de nuestro state = 4*/
    if (xhr.readyState !== 4) return;
    // console.log(xhr);
    if (xhr.status >= 200 && xhr.status < 300) {
      /* esto valida que cuando recibamos una respuesta satisfactoria es cuando podremos efectuar nuestra programacion ya que las respuestas satisfactorias estan en el rango de 200 a 299 */
      // console.log("Exito");
      // console.log(xhr.responseText);// la respuesta de la API viene en el objeto .responseText pero la respuesta viene en formato JSON

      let json = JSON.parse(xhr.responseText); // creamos una variable en la cual pasaremos la respuesta haciendole un parse para que de formato JSON pase a JS

      json.forEach((el) => {
        const $li = document.createElement("li");
        $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
        $fragment.appendChild($li);
      });

      $xhr.appendChild($fragment);

      // console.log(json);
    } else {
      // console.log("Error");
      let message = xhr.statusText || "Ocurrio un Error";
      $xhr.innerHTML = `Error ${xhr.status} : ${message} `;
    }
    // console.log(xhr);

    // console.log("Este Mensaje cargara de cualquier forma");
  });

  /* paso 3 -- Abrir la peticion .open() recibe 2 parametros ("metodo po el cual se accedera a la info" (GET, POST, PUT, etc), "obtener o pasar el recurso" (como usamos get pasamos la url))  */
  xhr.open("GET", "https://jsonplaceholder.typicode.com/users");
  // xhr.open("GET", "assets/users.json"); asi se mandaria a llamar desde el archivo local desde nuestro archivo json en la carpeta assets

  /* paso 4 -- enviar la peticion */
  xhr.send();
})();

/* API Fetch */
(() => {
  const $fetch = document.getElementById("fetch"),
    $fragment = document.createDocumentFragment();

  /* para trabajar con fetch no se necesitan instancias solo se manda a llamar al metodo fetch() que recibe 2 parametros (url del recurso, metodos por defecto fetch tiene el metodo GET) */
  fetch("https://jsonplaceholder.typicode.com/users") //tambien funciona de manera local solo pasando la url como con el XMLHttpRequest
    /* fetch funciona con promesas */
    .then((res) => {
      // en el primer then siempre hay que transformar el valor
      //recibira una respuesta pero esta respuesta la recive en formato ReadableStream
      // console.log(res);
      /* si la respuesta en el parametro ok es verdadera(este parametro nos dice el estado de la peticion)  si es verdadera se pasara a la siguiente promesa, si es falsa accedemos a la promesa y con reject rechasamos el objeto de la respuesta y en automatico se va al catch */
      return res.ok ? res.json() : Promise.reject(res); // la respuesta tiene 3 metodos .json(convierte a formarto js) , .text("convierte a formato JSON") .blob("es un formato de imagen") y se retornara la respuesta para que ya se pueda usar en la siguiente promesa
    })
    .then((json) => {
      // recibimos la promesa y ahora si se efectua la programacion
      // console.log(json);
      json.forEach((el) => {
        const $li = document.createElement("li");
        $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
        $fragment.appendChild($li);
      });

      $fetch.appendChild($fragment);
    })
    .catch((err) => {
      //recibira un error
      // console.log("Estamos en el cath ", err);
      let message = err.statusText || "Ocurrio un Error";
      $fetch.innerHTML = `Error ${err.status} : ${message} `;
    })
    .finally(() => {
      // se efectuara de todos modos
      // console.log("esto se ejecutara independientemente del resultado de la promesa fetch");
    });
})();

/* API Fetch + Async-Await  */
(() => {
  const $fetchAsync = document.getElementById("fetch-async"),
    $fragment = document.createDocumentFragment();

  //recuerda que la funcion se debe de crear con async
  async function getData() {
    try {
      /* await dice que esperes a que se cumpla antes de ejecutar la siguiente linea */
      let res = await fetch("https://jsonplaceholder.typicode.com/users"), // aqui se disparara el fetchque es la peticion al servidor
        json = await res.json(); // como devuelve un objeto ReadableStream lo convertimos a typo valido de JS son los datos que ocuparemos

      if (!res.ok)
        throw {
          status: res.status,
          statusText: res.statusText,
        }; // el throw envia el flujo de la programacion al catch es un return

      json.forEach((el) => {
        const $li = document.createElement("li");
        $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
        $fragment.appendChild($li);
      });

      $fetchAsync.appendChild($fragment);

      // console.log(res, json);
    } catch (err) {
      let message = err.statusText || "Ocurrio un Error";
      $fetchAsync.innerHTML = `Error ${err.status} : ${message} `;
    } finally {
      /*       console.log(
        "esto se ejecutara independientemente del resultado de la promesa fetch"
      ); */
    }
  }
  /* al final debe ser llamada la funcion sino no funcionara  */
  getData();
})();

/* Axios */
(() => {
  const $axios = document.getElementById("axios"),
    $fragment = document.createDocumentFragment();

  //como en fetch se usa fetch para llamar a la api aqui se usa solo axios
  axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((res) => {
      //en axios la respuesta ya nos la da convertida en un objeto de tipo js
      let json = res.data; // pasamos el valor que queremos recivir, en axios viene en la variable data

      json.forEach((el) => {
        const $li = document.createElement("li");
        $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
        $fragment.appendChild($li);
      });

      $axios.appendChild($fragment);
      // console.log(res);
    })
    .catch((err) => {
      console.log("estamos en el catch", err.response); //el error --> .response es un metodo que accede a la información de nuestra respuesta pero en este caso cargada de los valores del error

      let message = err.response.statusText || "Ocurrio un Error";
      $axios.innerHTML = `Error ${err.response.status} : ${message} `;
    })
    .finally(() => {
      /*       console.log(
        "esto se ejecutara independientemente del resultado de axios"
      ); */
    });
})();

/* Axios-Async-Await */
(() => {
  const $axiosAsync = document.getElementById("axios-async"),
    $fragment = document.createDocumentFragment();

  async function getData() {
    try {
      // con await le decimos que estamos esperando la respuesta del api que se consulto
      let res = await axios.get("https://jsonplaceholder.typicode.com/users"),
        json = await res.data;
      // console.log(res, json);
      json.forEach((el) => {
        const $li = document.createElement("li");
        $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
        $fragment.appendChild($li);
      });

      $axiosAsync.appendChild($fragment);

      //axios ya te da la opcion para manipular el error
    } catch (err) {
      let message = err.response.statusText || "Ocurrio un Error";
      $axiosAsync.innerHTML = `Error ${err.response.status} : ${message} `;
    } finally {
      console.log(
        "esto se ejecutara independientemente del resultado de axios"
      );
    }
  }

  getData();
})();
/* 

*/

/* las promesas lanzan una solicitud a una api de manera asincrona y tienen 3 parametros donde puede colocar la respuesta que le da esta API, .then() es cuando la respuesta se cumple y arroja el resultado, tener varios then quiere decir que no se puede cumplir el de abajo hasta que el primero reciba la respuesta, es para llevar un control en cuanto al flujo del loop, el segundo es el .catch() que es cuando en la peticion algo salio mal y genero un error, este error se manipula dentro del catch y por ultimo .finally() que es codigo que se ejecutara independientemente de el resultado de then o catch */
