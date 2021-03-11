    function imprimirMensaje(mensaje, tipo){
        const divMensaje = document.createElement('div');   
        const aux = document.querySelector('.aux');
        

        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'aux');


        if(tipo === 'error'){
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        }else{
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        if(!aux){
            formulario.appendChild(divMensaje);
        }

        divMensaje.textContent = mensaje;
        setTimeout(()=>{
            divMensaje.remove()
            formulario.reset();
        }, 5000);
    }


