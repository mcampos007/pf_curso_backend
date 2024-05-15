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
    const data = JSON.stringify(obj);
    const urlAdd = `/api/carts/${obj['cid']}/products/${obj['pid']}`;
    fetch(urlAdd, {
      method: 'DELETE', // o el método que corresponda
      headers: {
        'Content-Type': 'application/json',
      },
      // Puedes enviar datos en el cuerpo de la solicitud si es necesario
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        title = 'Carrito actualizado';
        text = 'El producto se eliminó correctamente';
        Swal.fire({
          icon: 'success',
          title: title,
          text: text,
          willClose: () => {
            // Aquí colocas la URL a la que deseas redirigir
            location.reload();
          },
        });
        // Aquí puedes hacer lo que necesites con la respuesta del segundo fetch
      })
      .catch((error) => {
        title = 'Ups! Hubo en error';
        text = 'No se eliminó el item del carrito';
        Swal.fire({
          icon: 'error',
          title: title,
          text: text,
          willClose: () => {
            // Aquí colocas la URL a la que deseas redirigir
            location.reload();
          },
        });
      });
  }
});
