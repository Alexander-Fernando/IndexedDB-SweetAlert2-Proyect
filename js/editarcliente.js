(function(){
    let DB;
    const nombreForm = document.querySelector('#nombre');
    const correoForm = document.querySelector('#email');
    const telefonoForm = document.querySelector('#telefono');
    const empresaForm = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');
    let idCliente;

    window.addEventListener('DOMContentLoaded', ()=>{
        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');
        conectarDB();

        setTimeout(function(){
            obtenerCliente(idCliente);
        }, 100);
        
        formulario.addEventListener('submit', actuRegistro);
    });

    function actuRegistro(e){
        e.preventDefault();
        if(nombreForm.value === '' || correoForm.value === '' || telefonoForm.value === ''  || empresaForm.value === ''){
            imprimirMensaje('CAMPOS VACÍOS', 'error');
            return;
        }

        let clienteActualizado = {
            nombre: nombreForm.value,
            correo: correoForm.value,
            telefono: telefonoForm.value,
            empresa: empresaForm.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        
        objectStore.put(clienteActualizado);

        transaction.oncomplete = e => {
            Swal.fire(
                'Buen trabajo!',
                'Registro Editado!',
                'success'
            );

            setTimeout(()=>{
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = e => {
            imprimirMensaje('Error al editar registro', 'error');
        }
    };

    function conectarDB(){
        let conexionDB = window.indexedDB.open('crm', 1);

        conexionDB.onerror = e => {  console.log('Hubo un error') };
        conexionDB.onsuccess = e => {  
            DB = conexionDB.result;
        };
    }

    function obtenerCliente(idCliente){

        const transaction = DB.transaction(['crm'], 'readwrite');
        let objectStore = transaction.objectStore('crm');

        let cliente = objectStore.openCursor();
        cliente.onsuccess = e => {
            const cursor = e.target.result;

            if(cursor){
                const {id} = cursor.value;
                if(id === Number(idCliente)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        };
    };

    function llenarFormulario(data){
        const {nombre, correo, telefono, empresa} = data;

        nombreForm.value = nombre;
        correoForm.value = correo;
        telefonoForm.value = telefono;
        empresaForm.value = empresa;
    }
})();