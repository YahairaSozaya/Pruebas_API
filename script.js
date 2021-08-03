//VARIABLES GENERALES
const input=document.getElementById("input");
const nombre_persona=document.getElementById("nombre_persona");
const trabajo_persona=document.getElementById("trabajo_persona");
const botones=document.getElementById("botones_datos");

//Llamado a la "base de datos"
async function consulta(endpoint, lista_trabajadores={}){
    const url="http://localhost:3000";
    lista_trabajadores.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

    const response= await fetch (url+endpoint,lista_trabajadores);
    const data= await response.json();   
    tratamiento(data);
}

//Tratamiento de los datos para lista_personas en la pizarra
function tratamiento(data){
    data.map(function(item){
        //Crear los input en los que se presentan los datos
        const lista_personas=document.createElement("input");
        const lista_trabajos=document.createElement("input");
        const actualizar_boton=document.createElement("input");
        const eliminar_boton=document.createElement("input");

        //Agregar clases para darles formato y reloadOnly para que no se puedan modificar
        lista_personas.classList.add("nombres");
        lista_personas.readOnly=true;
        lista_trabajos.classList.add("nombres");
        lista_trabajos.readOnly=true;
        actualizar_boton.classList.add("actualizar");
        actualizar_boton.classList.add(`${item.id}`);
        actualizar_boton.readOnly=true;
        eliminar_boton.classList.add("eliminar");
        eliminar_boton.classList.add(`${item.id}`);
        eliminar_boton.readOnly=true;

        //Agrega los valores (datos) a los inputs
        lista_personas.value=item.nombre;
        lista_trabajos.value=item.trabajo;
        actualizar_boton.name=`${item.nombre}`;
        actualizar_boton.id = `actualizar_${item.nombre}`;
        eliminar_boton.id= `eliminar_${item.nombre}`;

        //Agrega los nodos inputs en sus contenedores
        nombre_persona.appendChild(lista_personas);
        trabajo_persona.appendChild(lista_trabajos);
        botones.appendChild(actualizar_boton);
        botones.appendChild(eliminar_boton);      

        //Activa las funciones de actualizar y eliminar
        document.getElementById(`actualizar_${item.nombre}`).addEventListener("click", actualizar_funcion);
        document.getElementById(`eliminar_${item.nombre}`).addEventListener("click", eliminar_funcion);
    })
}



//OPERACIONES CRUD
const api= {
        list() {
            return consulta('/personas');
        },

        create(persona, opcion) {
            return consulta('/personas', {
            method: 'POST',
            body: JSON.stringify({"nombre": `${persona}`, "trabajo": `${opcion.value}`}),
            });
        },

        //READ NO HACE FALTA PORQUE TODOS LOS DATOS DE LAS PERSONAS SE MUESTRAN, PODRÍA
        //SERVIR SI QUISIERA IMPRIMIR OTROS DATOS, PERO EN ESTE CASO NO HAY MÁS QUE MOSTRAR
        // read(dato){
        //     return consulta();
        // },

        update(actualizacion, opcion, id) {
            return consulta(`/personas/${id}`,{
            method: 'PUT',
            body: JSON.stringify({"nombre": `${actualizacion}`, "trabajo": `${opcion.value}`}),
            });
        },

        remove(Id) {
            return consulta(`/personas/${Id}`,{
            method: 'DELETE',
            });
        },
};


//FUNCION QUE IMPRIME LOS DATOS EN LA PIZARRA
async function info_imprimir(){
    try{ 
        await api.list();
    } catch(error){
        window.alert("ERROR EN EL SERVICIO");
    }
}


//FUNCION PARA ACTUALIZAR DATOS
function actualizar_funcion(e){
    document.getElementById("formulario_actualizar").style.display="block";
    document.getElementById("nombre_actualizado").value=`${e.target.name}`; 
    const guardar=document.getElementById("guardar");
    guardar.addEventListener("click", async function guardar_funcion(){
        const actualizacion=document.getElementById("nombre_actualizado").value;
        try{ 
            await api.update(actualizacion, document.opcion_choice.opcion, e.target.classList[1]);
        } catch(error){
            window.alert("DATOS ACTUALIZADOS")
            window.location.reload();
        }
    });   

    const cancelar=document.getElementById("cancelar");
    cancelar.addEventListener("click", ()=>{
        document.getElementById("formulario_actualizar").style.display="none";
    })

}

//FUNCION PARA ELIMINAR DATOS
async function eliminar_funcion(e){
    document.getElementById("confirma_eliminar").style.display="block";
    //classList[1] es para acceder a la segunda clase, que corresponde al input
    document.getElementById("si").addEventListener("click", async function (){
        try{ 
            await api.remove(e.target.classList[1]);
        } catch(error){
            window.alert("DATOS ELIMINADOS")
            window.location.reload();
        }   
    })

    document.getElementById("no").addEventListener("click", async function (){
        document.getElementById("confirma_eliminar").style.display="none";
    })    
}


//FUNCION PARA CREAR NUEVA PERSONA
async function crear_nuevo(){
    const persona_nueva=document.getElementById("input").value;
    try{ 
        await api.create(persona_nueva, document.opcion_nueva.opcion_personaNueva);
    } catch(error){
        window.alert("CREADO");
        window.location.reload();
    }
}

const crear_boton=document.getElementById("crear");
crear_boton.addEventListener("click", crear_nuevo);



//Ejecuta el tratamiento de los datos en la pizarra
info_imprimir();



