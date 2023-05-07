var elUsername = document.getElementById('username'); // Get username input
var elPassword = document.getElementById('password');
var elEmail=document.getElementById('email');



function checkUsername() {                             // Declare function
  var elfbu = document.getElementById('fbusername');     // Get feedback element
  if (this.value.length < 5) {                         // If username too short
    elfbu.textContent = '*Username must be 5 characters or more'; // Set msg
  } else {                                             // Otherwise
    elfbu.textContent = '';                            // Clear msg
  }
}

            function ValidateEmail()
             {
              var elfbe = document.getElementById('fbmail');   
              //let inputText=document.getElementById("email");
               var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
               if(this.value.match(mailformat))
               {
                elfbe.textContent = '';
                //document.getElementById("fbmail").innerHTML="";
                
                }
               else
               {
                elfbe.textContent = 'Incorrect email';
              
                //document.getElementById("fbmail").innerHTML="**Incorrect email";
              }
           }
       //document.getElementById("email").addEventListener('blur',ValidateEmail)
        
function checkPassword(){
  var elfbp = document.getElementById('fbpassword');
  if (this.value.length < 8) {                         // If username too short
    elfbp.textContent = '*Password must be 8 characters or more'; // Set msg
  } 
  else {                                             // Otherwise
	if (!(/^[A-Za-z]+$/.test(this.value) || /^[0-9]+$/.test(this.value) ))
    {
		elfbp.textContent = '';
	}
	else
	{
	   elfbp.textContent = '*Password should contain both numbers and alphabets';                         
	}
  }
}

elUsername.addEventListener('blur', checkUsername, false);
elEmail.addEventListener('blur', ValidateEmail, false);
elPassword.addEventListener('blur', checkPassword, false);

