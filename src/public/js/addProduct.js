// Agregar manejador de evento al elemento padre (delegación de eventos)
document.addEventListener('submit', function (event) {
  // Verificar si el objetivo del evento es un formulario con la clase 'product-form'
  if (event.target && event.target.classList.contains('product-form')) {
    // Evitar que se realice la acción por defecto (enviar el formulario)
    event.preventDefault();

    // Obtener el formulario y la data
    const form = event.target;
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((value, key) => (obj[key] = value));
    const url = `/api/carts/currentCart/${obj['userId']}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const urlAdd = `/api/carts/${data.payload._id}/product/${obj['product_id']}`;

        fetch(urlAdd, {
          method: 'POST', // o el método que corresponda
          headers: {
            'Content-Type': 'application/json',
          },
          // Puedes enviar datos en el cuerpo de la solicitud si es necesario
          body: JSON.stringify({}),
        })
          .then((response) => response.json())
          .then((data) => {
            title = 'Registro satisfactorio';
            text = 'El producto se agregó a tu carrito correctamente';
            Swal.fire({
              icon: 'success',
              title: title,
              text: text,
            });
            // Aquí puedes hacer lo que necesites con la respuesta del segundo fetch
          })
          .catch((error) => {
            console.error('Error en el segundo fetch:', error);
            title = 'Ups! Hubo en error';
            text = 'No se agregó el item al carrito';
            Swal.fire({
              icon: 'error',
              title: title,
              text: text,
            });
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        title = 'Error de Sistema';
        text = 'No es posible agregar productos al carrito';
        Swal.fire({
          icon: 'error',
          title: title,
          text: text,
        });
      });
  }
});
