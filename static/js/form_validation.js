function register_user_validate(){
    var fn = document.forms["register_user"]["firstname"].value;
    var ln = document.forms["register_user"]["lastname"].value;
    var email = document.forms["register_user"]["email"].value;
    var pass = document.forms["register_user"]["password"].value;
    var re_pass = document.forms["register_user"]["re_password"].value;

    console.log(pass);
    console.log(re_pass);

    if(pass != re_pass){
        alert("Password entered differently");
        return false;
    }
    return true;
}