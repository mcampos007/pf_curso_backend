// import axios from '../../../node_modules/axios';
// Obtener el formulario
const form = document.getElementById('profileForm');

// Agregar un evento de envío al formulario
form.addEventListener('submit', function (event) {
  // Evitar que el formulario se envíe automáticamente
  event.preventDefault();

  // Obtener los datos del formulario

  const formData = new FormData(form);

  const userId = document.getElementById('userId').value;
  // const file = [];
  // file.push(document.getElementById('profile').value);
  // console.log(file);

  // formData.append('userId', userId);
  // formData.append('profile', file);

  // // console.log(1, userId);
  // // console.log(1, file);
  // formData.forEach((value, key) => {
  //   console.log(key, value);
  // });

  const apiUrl = `/api/users/${userId}avatarprofile`;

  axios
    .post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Es importante establecer el tipo de contenido como 'multipart/form-data'
      },
    })
    .then((response) => {
      console.log('Respuesta:', response.data);
      if (response.data.status === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Actualización de imágen de Perfil',
          text: 'La imagen de perfil del usuario se ha actualizado correctamente',
          willClose: () => {
            // Aquí colocas la URL a la que deseas redirigir
            window.location.replace('/profile');
          },
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Ups, error al actualizal la imagen de Perfil',
        text: error,
        willClose: () => {
          // Aquí colocas la URL a la que deseas redirigir
          window.location.replace('/profile');
        },
      });
      console.error('Error:', error);
    });
});

//   console.log(0, userId);
//   const apiUrl = `/api/users/1/documents`;
//   console.log(1, apiUrl);
//   // Realizar la solicitud fetch
//   fetch(apiUrl, {
//     method: 'POST',
//     body: formData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Error en la solicitud.');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log('Datos recibidos:', data);
//       // Aquí puedes realizar cualquier acción adicional después de enviar el formulario
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       // Aquí puedes manejar cualquier error que ocurra durante la solicitud
//     });
// });

// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   //const data = new FormData(form);
//   const formData = new FormData();
//   const fileInputElement = document.getElementById('profile');
//   const destination = document.getElementById('destination');
//   formData.append('profile', fileInputElement.files[0]);
//   formData.append('destination', destination);
//   const uid = document.getElementById('userId').value;
//   console.log(1, destination.value);
//   console.log(2, fileInputElement.value);
//   console.log(3, formData.profile);
//   //   const obj = {};
//   //   data.forEach((value, key) => (obj[key] = value));
//   //   console.log(JSON.stringify(data));
//   fetch(`/api/users/${uid}/documents`, {
//     method: 'POST',
//     body: formData, //JSON.stringify(obj),
//     // headers: {
//     //   'Content-Type': 'application/json',
//     // },
//   })
//     .then((result) => {
//       if (result.status === 200) {
//         //Ubicacion de las vistas
//         // console.log("Usuario autorizado");
//         result.json().then((json) => {
//           //LocalStorage
//           /*  console.log(json);
//                         localStorage.setItem('authToken', json.jwt);
//                     */
//           // 2do:cookie
//           // console.log(json);
//           // console.log("Cookies generadas:");
//           // console.log(document.cookie);
//           // alert(result.message);
//           window.location.replace('/home');
//           //console.log(result);
//           // window.location.replace('/products');
//           //alert(json.jwt);
//         });
//       } else if (result.status === 401) {
//         // Estado 401: Puedes manejar la autenticación fallida de alguna manera
//         console.log('Autenticación fallida');
//         //console.error('Error de autenticación:', error);
//         title = 'Authentication Error';
//         text = 'It was not possible to authorize entry';
//         Swal.fire({
//           icon: 'error',
//           title: title,
//           text: text,
//         });
//         // Puedes mostrar un mensaje de error al usuario, por ejemplo
//       } else {
//         // Otros estados: Manejar según sea necesario
//         console.log('Unexpected error:', result.status);
//         console.error('Error al realizar la solicitud:', error);
//         title = 'System error';
//         text = 'It was not possible to authorize entry';
//         Swal.fire({
//           icon: 'error',
//           title: title,
//           text: text,
//         });
//       }
//       // window.location.replace('/');
//     })
//     .catch((error) => {
//       // Manejar errores de red u otros problemas
//       console.error('Error al realizar la solicitud:', error);
//       title = 'Error de Sistema';
//       text = 'No fué posible autorizar el ingreso, Revise usuario y clave';
//       Swal.fire({
//         icon: 'error',
//         title: title,
//         text: text,
//       });
//     });
// });
