// Agregar manejador de evento al elemento padre (delegación de eventos)
document.addEventListener('submit', function (event) {
  // Verificar si el objetivo del evento es un formulario con la clase 'product-form'
  if (event.target && event.target.classList.contains('frmchangerole')) {
    // Evitar que se realice la acción por defecto (enviar el formulario)
    event.preventDefault();

    // Obtener el formulario y la data
    const form = event.target;
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((value, key) => (obj[key] = value));
    console.log(1, JSON.stringify(obj));
    const url = `/api/users/premium/${obj['uid']}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(1, data);
        if (
          data.error === 'No esta autorizado a cambiar le perfil del usuario'
        ) {
          title = 'Confirmación de cambio de Rol';
          text =
            'No estas autorizado a realizar el cambio o falta la información requerida!!!';
          Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            willClose: () => {
              // Aquí colocas la URL a la que deseas redirigir
              window.location.replace('/home');
            },
          });
        } else {
          title = 'Confirmación del Rol';
          text = 'el rol se ha cambiado satisfactoriamente!!';
          Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            willClose: () => {
              // Aquí colocas la URL a la que deseas redirigir
              window.location.replace('/home');
            },
          });
        }
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
