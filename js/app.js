(function(){
    let DB; 
    let tbody = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearBD();
        if(window.indexedDB.open('crm', 1)){
            cargarDatos();
        }
        tbody.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);
        
            Swal.fire({
                title: 'Seguro de eliminar el registro?',
                text: "No se podrá recuperar el registro!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const transaction = DB.transaction(['crm'],'readwrite');

                    const objectStore = transaction.objectStore('crm');

                    objectStore.delete(idEliminar);

                    transaction.oncomplete = function(){
                        Swal.fire(
                            'Eliminado!',
                            'Registro eliminado correctamente.',
                            'success'
                        )
                        e.target.parentElement.parentElement.remove();
                    }
        
                    transaction.onerror = e => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salió mal!',
                            footer: '<a href="#">Intentar Nuevamente</a>'
                          })
                    }
                }
            })
        }
    };
    
    function crearBD(){
        let crearBD = window.indexedDB.open('crm', 1);

        crearBD.onerror = (e) => {console.log(e.target.errorCode)};
        crearBD.onsuccess = (e) => {
            DB = crearBD.result;
        };

        crearBD.onupgradeneeded = (e) => {
            // resultado es lo que contiene la base de datos, que se encuentra vacía al ejecutar el evento onupgradedneeded
            const resultado = e.target.result;
            const objectStore = resultado.createObjectStore('crm', {keyPath:'id', autoIncrement: true});

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('correo', 'correo', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});
        };
       
    };


    function cargarDatos(){
        let conexionDB = window.indexedDB.open('crm', 1);
        conexionDB.onsuccess = function(){
            let transaction = DB.transaction(['crm'], 'readonly');
            let objectStore = transaction.objectStore('crm');

            objectStore.openCursor().onsuccess = e => {
                var cursor = e.target.result;
                if(cursor){
                    const {nombre, empresa, correo, telefono, id } = cursor.value;

                    tbody.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>

                            <p class="text-sm leading-10 text-gray-700"> ${correo} </p>
                        </td>

                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>


                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>


                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>

                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                        `;

                    cursor.continue();
                }
            }   
        }
        
    }
})();