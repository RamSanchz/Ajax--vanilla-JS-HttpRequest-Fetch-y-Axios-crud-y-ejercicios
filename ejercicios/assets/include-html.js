document.addEventListener("DOMContentLoaded", (e) => {
  const includeHTML = (el, url) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", (e) => {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        el.outerHTML = xhr.responseText;
        /* outer sirve para rempplazar contenido html */
      } else {
        let message =
          xhr.statusText ||
          "Error al cargar el archivo, verifica que estes haciendo la petición por http o https";
        el.outerHTML = `<div><p>${message}</p></div>`;
      }
    });

    xhr.open("GET", url);
    xhr.setRequestHeader("Content-type", "text/html; charset=utf-8");

    xhr.send();
  };

  //obtenemos todos los elementos con el dataAttribute
  document
    .querySelectorAll("[data-include]")
    .forEach((el) => includeHTML(el, el.getAttribute("data-include"))); //por cada uno de ellos vamos a mandar llamar la funcion includeHTML pasando como parametro el elemento y la url
});
