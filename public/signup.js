// const registerForm = document.getElementById('forms');
// const message = document.getElementById('message');

// // Handle form submit event
// registerForm.addEventListener('submit', async (event) => {
//   // Prevent form from submitting
//   event.preventDefault();

//   // Get form data
//   const formData = new FormData(registerForm);

//   // Send request to server
//   const response = await fetch('/register', {
//     method: 'POST',
//     body: formData
//   });

//   // Handle response
//   const data = await response.json();

//   if (response.ok) {
//     // User was created successfully
//     message.innerText = data.message;
//   } else {
//     // There was an error creating the user
//     message.innerText = data.error;
//   }
// });