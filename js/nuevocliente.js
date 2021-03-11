(function(){
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });
    
    function conectarDB(){
        let conexionDB = window.indexedDB.open('crm', 1);

        conexionDB.onerror = e => {  console.log('Hubo un error') };
        conexionDB.onsuccess = e => {  
            DB = conexionDB.result;
        };
    }

    function validarCliente(e) {
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const correo = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa= document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirMensaje('Campos vacios', 'error');
            return;
        }

        let cliente = {
            nombre: nombre,
            correo: correo,
            telefono : telefono,
            empresa: empresa,
            id: Date.now()
        };

        crearNuevoCliente(cliente);
    };

    function crearNuevoCliente(newCliente){
        let transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(newCliente);

        transaction.oncomplete = function(){

            Swal.fire(
                'Buen trabajo!',
                'El registro se ha agregado!',
                'success'
            );

            setTimeout(()=>{window.location.href='index.html'}, 3000);
        }  

        transaction.onerror = function(){
            // imprimirMensaje('Digite otro correo', 'error');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Digite otro correo!',
            });
        }
    };
})();