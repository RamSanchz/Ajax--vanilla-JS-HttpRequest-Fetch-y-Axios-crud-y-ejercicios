/* cuando importas algo que no se le puso nombre lo puedes importar con el nombre que deses, en este caso se usaron mayusculas para indicar que seran constantes */
import stripeKeys from "./stripe-keys.js";
import STRIPE_KEYS from "./stripe-keys.js";

// console.log(STRIPE_KEYS);

const d = document,
  $tacos = d.getElementById("tacos"),
  $template = d.getElementById("taco-template").content,
  $fragent = d.createDocumentFragment(),
  fetchOptions = {
    headers: {
      // con headers agregamos las cabeceras de fetch
      Authorization: `Bearer ${STRIPE_KEYS.secret}`,
    },
  };
/* hacemos nuestra peticion con fetch a la api stripe y como la api stripe nos pide autenticacion vamos a pasarle en la cabecera a travez del atributo autorization la ppalabra Beare y nuestra llave secreta. asi viene la documentacion ya que la autenticacion varia deacuerdo a la api*/

let products, prices;
/* en esta funcion formatearemos el valor del precio que nos da ya que nos lo da son .decimal, slice recorta cadenas de texto slice(0,-2) desde la posicion 0 y quitas las 2 ultimas */
const moneyFormat = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`;

/* Promise.all es un metodo de las promesas que se usa cuando se necesitan hacer fdiferentes peticiones con diferentes entpoints , esta devuelve un solo objeto con todas las opciones */
Promise.all([
  /* peticion productos /v1/products*/
  fetch("https://api.stripe.com/v1/products", fetchOptions),
  /* peticion precios /v1/prices*/
  fetch("https://api.stripe.com/v1/prices", fetchOptions),
])
  /* en este then esperamos todas las respuestas de Promise.all, por cada respuesta de Promise all crearemos un arreglo usando.map y cada respuesta en este arreglo la convertiremos a formato js */
  .then((responses) => Promise.all(responses.map((res) => res.json())))
  .then((json) => {
    // console.log(json);
    products = json[0].data;
    prices = json[1].data; //como solo nos importa la data de la respuesta guardamos en las variables el valor de cada una de las peticiones
    // console.log(products, prices);

    //pintado de html con los valores
    prices.forEach((el) => {
      /* productData va a guardar la informacion de el prodcuto, va a entrar al arreglo de los productos y por cada producto va a buscar aquel que coincida su id con el apartado product de los precios  */
      let productData = products.filter((product) => product.id === el.product);
      // console.log(productData);
      $template.querySelector(".taco").setAttribute("data-price", el.id);
      /* en la figure le agregaremos un dataAtribute (nombre:data-price que tendra de valor el id del precio de ese preoducto ya que este id se usara al vender y se mandara a stripe) */

      /* agregamos los valores de img */
      $template.querySelector("img").src = productData[0].images[0];
      $template.querySelector("img").alt = productData[0].name;
      /* agregamos los valores de la  figcaption */
      $template.querySelector("figcaption").innerHTML = `
      ${productData[0].name}
      <br>
      ${moneyFormat(el.unit_amount_decimal)} ${el.currency}
      `;

      let $clone = d.importNode($template, true);
      $fragent.appendChild($clone);
    });
    $tacos.appendChild($fragent);
  })
  .catch((err) => {
    console.log(err);
    let message =
      err.statusText || "Ocurrio un error al conectarse con la API de Stripe";
    $tacos.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  });

d.addEventListener("click", (e) => {
  if (e.target.matches(".taco *")) {
    /* .taco * hace referencia a cualquier cosa dentro de taco */
    let price = e.target.parentElement.getAttribute("data-price");
    /* parentElement es que se ira al elemento padre */
    // invcamos al objeto stripe que viene de la libreria de stripe y este pide como parametro  la llave publica, utilizamos el metodo redirectToCheckout para redireccionar a la pagina del checkout de stripe, recibe un objeto con configuraciones
    Stripe(STRIPE_KEYS.public)
      .redirectToCheckout({
        lineItems: [{ price, quantity: 1 }],
        /* lineItems es un arreglo que lleva dentro cada uno de los productos que se compraran, en este caso solo es uno{dentro price es el id del precio de cada producto y quantity es la cantidad de veces que se cobrara en este caso solo es 1 orden} */
        mode:
          "subscription" /* mode: es el tipo de pago que se hara, en este caso como pusimos una vez por mes en stripe lo maneja como suscription */,
        successUrl:
          "http://127.0.0.1:5500/ajax/ejercicios/assets/stripe-success.html" /*es una direccion de una pagina que es donde te direccionara el checkout despues de que se realiza  */,
        cancelUrl:
          "http://127.0.0.1:5500/ajax/ejercicios/assets/stripe-cancel.html" /* es lo mismo que success pero en caso de que ocurra un error */,
      })
      .then((res) => {
        if (res.error) {
          /* stripe te devuelve el error en un atributo error que dentro tiene un mensaje */
          $tacos.insertAdjacentHTML("afterend", res.error.message);
        }
      });
  }
});
