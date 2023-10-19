/*~~~~~ Notas antes de iniciar:
Links de Tutoriales:

1- https://drive.google.com/drive/folders/187OEqmu-8txAnCAEOvTY4Kb8zNC5VSJK
2- https://developers.sap.com/mission.cap-java-app.html
3- https://developers.sap.com/mission.cap-java-app.html
4- https://youtube.com/playlist?list=PLBBoc2l3GGf34_14VXo2gAaKgoSgdd78z&si=OabSyzNqAQnORGtS

*/
//--- Inicio de la pagina
window.addEventListener("load", loadDada);
HOST = window.location.host;
//---------Declaraciones y Acciones
const btnSend = document.getElementById('btnSend');
btnSend.addEventListener('click', (e) => {
    if(validateForm()){
        createUser();
    }
});

const inputSearch = document.getElementById('search');
inputSearch.addEventListener('keyup', function() {
  userFilter('search', this.value);
});

const thName = document.getElementById('th-name');
thName.addEventListener('click', function() {
  userFilter('name');
});

const thLastName = document.getElementById('th-lastname');
thLastName.addEventListener('click', function() {
  userFilter('lastname');
});

const thAge = document.getElementById('th-age');
thAge.addEventListener('click', function() {
  userFilter('age');
});

//-------------Funciones:

/*Consulta la lista de usuarios*/
async function loadDada() {
    /*~~Consulta usando $.get Libreria Jqery
    $.get("http://" + HOST + "/odata/v4/list/Users", (data, status) => {
        console.log(data); 
    });
    ~~*/

    //~~Consulta usando fetch
    try {
        const response = await fetch(`http://${HOST}/odata/v4/list/Users`);
        const result = await response.json();
        //console.log("Success:", result);
        setDataInTable(result.value);
    } catch (error) {
        alert(`Service Error: 
        ${error}`);
    }
}

/*Llena la tabla por favor*/
function setDataInTable(result){
    console.log("setDataInTable - result:", result);
    // Obtener el elemento tbody de la tabla
    const tableBody = document.querySelector('.body-table');
    // Establecer el contenido de la tabla en una cadena vacía
    tableBody.innerHTML = '';
    // Verificar si el objeto result tiene datos
    if (result.length > 0) {
        let position = 1;
        // Iterar sobre los usuarios y generar una fila para cada uno
        result.forEach(user => {
            // Clonar el template de la fila
            const row = document.importNode(document.querySelector('#template-table').content, true);
            // Reemplazar los valores de las celdas con los datos del usuario
            row.querySelector('.position').textContent = position++;
            row.querySelector('.name').textContent = user.name;
            row.querySelector('.lastname').textContent = user.lastname;
            row.querySelector('.age').textContent = user.age;
            row.querySelector('.email').textContent = user.email;
            row.querySelector('.phone').textContent = user.phone;
            //--- Actions de los Botones
            let obj = {
                'ID': user.ID,
                'name': user.name,
                'lastname': user.lastname,
                'age': user.age,
                'email': user.email,
                'phone': user.phone
            }
            row.querySelector('.btnEdit').addEventListener('click', (e) => { 
                setModalEdit(obj);
            });
            row.querySelector('.btnDelete').addEventListener('click', (e) => { 
                deleteUser(obj);
            });

            // Agregar la fila a la tabla
            tableBody.appendChild(row);
        });
    }else{
        // El objeto result no tiene datos, generar mensaje en la tabla
        const row = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.setAttribute('colspan', '7');
        messageCell.classList.add('text-center', 'bg-light');
        messageCell.textContent = 'NO HAY DATOS DISPONIBLES';
        row.appendChild(messageCell);
        tableBody.appendChild(row);
    }
}

/*Pintaremos data a editar en Modal*/
function setModalEdit(obj){
    console.log(`setModalEdit - obj: ${JSON.stringify(obj)}`);
    let nameModal = document.getElementById("modal-name");
    let lastnameModal = document.getElementById("modal-lastname");
    let ageModal = document.getElementById("modal-age");
    let emailModal = document.getElementById("modal-email");
    let phoneModal = document.getElementById("modal-phone");
    let userID = document.getElementById("modal-userID");
    userID.value = obj.ID;
    nameModal.value = obj.name;
    lastnameModal.value = obj.lastname;
    ageModal.value = obj.age;
    emailModal.value = obj.email;
    phoneModal.value = obj.phone;
}

/*Editar Usuario - Accion agregada en documento html*/
function editUser(){
    let nameModal = document.getElementById("modal-name");
    let lastnameModal = document.getElementById("modal-lastname");
    let ageModal = document.getElementById("modal-age");
    let emailModal = document.getElementById("modal-email");
    let phoneModal = document.getElementById("modal-phone");
    let userID = document.getElementById("modal-userID");
    let obj = {
        "ID": userID.value,
        "name": nameModal.value,
        "lastname": lastnameModal.value,
        "age": ageModal.value,
        "email": emailModal.value,
        "phone": phoneModal.value
    }
    console.log(`editUser - obj: ${JSON.stringify(obj)}`);
    whatIsTheMethod("PUT", obj);
}

/*Eliminar Usuario*/    
function deleteUser(obj){
    msg=`⚠ Deseas eliminar al usuario ${obj.name} ${obj.lastname}?`;
    if(confirm(msg)==true){
        whatIsTheMethod("DELETE", obj);
    }
}

/*Crear Usuario*/ 
function createUser(){
    let nameModal = document.getElementById("name");
    let lastnameModal = document.getElementById("lastname");
    let ageModal = document.getElementById("age");
    let emailModal = document.getElementById("email");
    let phoneModal = document.getElementById("phone");
    let obj = {
        "name": nameModal.value,
        "lastname": lastnameModal.value,
        "age": ageModal.value,
        "email": emailModal.value,
        "phone": phoneModal.value
    }
    console.log(`createUser - obj: ${JSON.stringify(obj)}`);
    whatIsTheMethod("POST", obj);
}

/*Filtros de Usuarios*/ 
function userFilter(reason, value){
    let url = `http://${HOST}/odata/v4`;
    value ? value : "";

    const callback = (result, status) => {
        console.log("userFilter res: ", result);
        setDataInTable(result.value);
    }

    switch (reason) {
        case "name":
        case "lastname":
        case "age":
            $.get(`${url}/list/Users?$orderby=${reason}`, callback);
        break;
        case "search":
            $.get(`${url}/list/Users?$search=${value.trim()}`, callback);
        break;
        default:
            $.get(`${url}/list/Users`, callback);
        break;
    }
}

/*Que metodo deseas emplear?*/
function whatIsTheMethod(method, data) {
    let url = `http://${HOST}/odata/v4`;
    switch (method) {
        case "DELETE"://DELETE xD
        case 'PUT'://EDIT
        case 'PATCH'://EDIT
            url = `${url}/list/Users/${data.ID}`
        break;
        case 'POST'://CREATE
            url = `${url}/list/Users`
        break;
        default:
            url = '';//GET - READ
        break;
    }
    console.log(`whatIsTheMethod - url: ${url}`);
    fetchData(method,data,url, function (res){
        /*Control de respuestas*/
        console.log("fetchData res: ", res);
        loadDada();
        document.getElementById("btnCloseModal").click();
        if(res.Error){
        alert(`❌ Algo a salido mal, intente de nuevo.`);
        return
        }
        if(method === "PUT" || method === "PATCH") {
        alert(`✅ Usted actualizó correctamente al usuario.`);
        }else if(method === "POST"){
        alert(`✅ Usted agregó correctamente al usuario.`);
        }else if(method === "DELETE"){
        alert(`🆑 Usted eliminó correctamente al usuario.`);
        }
    });
}

/*Peticiones del CRUD - Reservado para Create, Update and Delete*/
async function fetchData(method, data, url, callback) {
    if(method !== 'DELETE'){
        try {
            console.log(`fetchData- url: ${url}`);
            if(url === ''){
                loadDada();//READ
                return
            }
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            callback(result);
        } catch (error) {
            console.error("Error:", error);
            callback({ "Error": "Falla de servicio" });
        }
    }else{
        try {
            const response = await fetch(url, {
              method: 'DELETE'
            });
            if (response.ok) {
                callback(response);
            } else {
              const error = await response.text();
              throw new Error(error);
            }
          } catch (error) {
            console.error('Error al eliminar los datos:', error);
            callback({ "Error": "Falla de servicio" });
          }
    }
}

/*Valida los datos del formulario*/
function validateForm() {
    var nombre = document.getElementById('name').value;
    var apellido = document.getElementById('lastname').value;
    var edad = document.getElementById('age').value;
    var correo = document.getElementById('email').value;
    var telefono = document.getElementById('phone').value;
    // Validar nombre y apellido: solo letras y máximo 15 caracteres
    var nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(nombre)) {
      alert('El nombre debe contener solo letras y tener un máximo de 15 caracteres');
      return false;
    }
    if (!nombreRegex.test(apellido)) {
      alert('El apellido debe contener solo letras y tener un máximo de 15 caracteres');
      return false;
    }
    // Validar edad: solo números enteros
    var edadRegex = /^\d+$/;
    if (!edadRegex.test(edad)) {
      alert('La edad debe ser un número entero');
      return false;
    }
    // Validar correo electrónico: formato de correo
    var correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      alert('El correo electrónico debe tener un formato válido');
      return false;
    }
    // Validar teléfono: solo números
    var telefonoRegex = /^\d+$/;
    if (!telefonoRegex.test(telefono)) {
      alert('El número telefónico debe contener solo números');
      return false;
    }
    // Validar que todos los campos estén completos
    if (nombre === '' || apellido === '' || edad === '' || correo === '' || telefono === '') {
      alert('Todos los campos son obligatorios');
      return false;
    }
    return true;
  }
  
/* 
INFO @@ 
#### Significado de CRUD en programación y métodos HTTP utilizados

En programación, CRUD es un acrónimo que se utiliza para referirse a las operaciones fundamentales de gestión de datos en sistemas de bases de datos. Las operaciones CRUD son las siguientes:

- **Create (Crear)**: Esta operación se utiliza para crear nuevos registros en la base de datos. En el contexto de HTTP, el método utilizado para la operación de creación es el **POST**.

- **Read (Leer)**: Esta operación se utiliza para leer o recuperar registros existentes de la base de datos. En el contexto de HTTP, el método utilizado para la operación de lectura es el **GET**.

- **Update (Actualizar)**: Esta operación se utiliza para actualizar registros existentes en la base de datos. En el contexto de HTTP, el método utilizado para la operación de actualización es el **PUT** o el **PATCH**.

- **Delete (Borrar)**: Esta operación se utiliza para eliminar registros existentes de la base de datos. En el contexto de HTTP, el método utilizado para la operación de eliminación es el **DELETE**.

Es importante tener en cuenta que los métodos HTTP utilizados pueden variar dependiendo de la implementación y las convenciones utilizadas en el desarrollo de la API o aplicación específica.

Espero que esta información te sea útil. Si tienes alguna otra pregunta, no dudes en hacerla.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

************************************************************************
 NOTAS SAP CAP -- COMANDOS
 ************************************************************************
1- Dentro de la carpeta del proyecto - ponemos el siguiente comando para inicializar y generar la estructura base:
---- 'cds init'
*__ Se puede crear todo desde cero si se hace de la siguiente forma:
---- 'cds init projectNameFolder'
Esto crearia la carpeta con su estructura.

2- Ahora necesitamos instalar cualquier dependencia que sea necesaria, por lo que ejecutamos el siguiente comando:
---- 'npm install'
*__ Esto basicamente lo que hace es crearnos nuestra carpera 'node_modules' donde estaran 
todas las dependencias necesarias para la construccion de la aplicacion.

3- Con el fin de realizar el servicio CAP pasamos a crear el 'esquema/entidades/tablas para relaciones de base de datos'
*__ En este sentido debemos posicionarnos dentro de la estructura de nuestro proyecto en la carpeta 'db' y crearemos
el archivo con extension '.cds' por ejemplo 'esquema.cds'

*__ Para inicializar el archivo:
using { Currency,managed,sap,cuid} from '@sap/cds/common';
//Currency es un dataType - - podria declararse una variable en el esquema y eso genera tablas nuebas - Manejo de moneta etc
//managed: Aporta - Create Date, Update Date, Create User, Modify User.  
//sap  creacion de llaves primarias para definir entidades, 
// common types and aspect https://cap.cloud.sap/docs/cds/common

4- Si ya tenemos una 'enditad/tabla' creada, debemos ejecutar los siguientes comandos para que podamos comenzar
a usarla, osea, que ya comience a tener informacion:

- Se hace un Deploy a la DB, definiendo que va a existir una persistencia de datosDeNavegacion, y asi no se perderan en cada ejecucion.
---- 'npm add sqlite3 -D >> cds deploy --to sqlite:myName.db'
---- 'cds deploy --to sqlite:myName.db' --> Este comando se usara siempre para actualizar cambios en las 'entidades/tablas'
*__ Ya asi se crearia la Base de datos y se puede verificar en la ruta: 'projectNameFolder/myName.db'
Para vertical, se puede descargar el complemento 'SQLite Viewer'

5- Cuando deseas ya meter informacion en las 'entidades/tablas' de base datos, es cuando se hace necesario tener un 'Servicio'
para la creacion manejamos la siguiente estructura:

*__ En la siguiente ruta creamos el archivo con extension '.cds', ejemplo 'projectNameFolder/srv/myNameService.cds'
*__ En este punto aun no podemos visualizar nada en caso de que se decida correr el proyecto, ya que no existe nada definido en el servicio.

6- Lo necesario para que mi 'Servicio' funcione:
*__ En este punto lo primero es asociar el servicio a mi 'projectNameFolder/db/esquema.cds'
Se debe indicar el 'namespace my.ejemplo' el nombre puede ser cualquiera.
using { my.ejemplo as db } from '../db/esquema';

Nota: Al utilizar 'as' estamos colocabdo un sobrenombre o alias al namespase

7- Para hacer un 'Run' correr nuestro proyecto ejecutamos el comando:
---- 'cds watch'
*__ Si todo sale bien, deberiamos ver algo como lo siguiente:
[cds] - serving AdminService { at: '/admin' }
[cds] - serving CatalogService { at: '/browse', impl: 'bookshop/srv/cat-service.js' }
[cds] - server listening on { url: 'http://localhost:4004' }
*__ La ultima 'URL' seria la qiue usaremos para ver el resultado.


8- Cualquier estructura visual se maneja dentro de la ruta 'projectNameFolder/app'
Ejemplo: 'alumnosview.html'
*__ Otro punto relevante es que toda la logica tambien es definida en esta ruta, por ejemplo podemos
crear una carpeta 'Controller' y aca definir los archivos 'projectNameFolder/app/controllers/controllerAlumnos.js'
********************************* END ************************************
JAVA
Comando: 'mvn -B archetype:generate -DarchetypeArtifactId=cds-services-archetype -DarchetypeGroupId=com.sap.cds \
-DarchetypeVersion=RELEASE -DjdkVersion=17 \
-DgroupId=com.sap.cap -DartifactId=products-service -Dpackage=com.sap.cap.productsservice'

Comando: 'mvn -B archetype:generate -DarchetypeArtifactId=cds-services-archetype -DarchetypeGroupId=com.sap.cds \
-DarchetypeVersion=RELEASE -DjdkVersion=17 \
-DgroupId=com.sap.cap -DartifactId=bookstore'
Comando: 'mvn clean install'
Des: Se usa para activar el proceso de compilación de Maven.
Comando: 'cd ~/projects/products-service && mvn clean spring-boot:run'
Des: Se utiiza para posicionarte en la raiz del project y correr el mismo.
por si solo, seria: 'mvn clean spring-boot:run'

Comandos variados:
'cd ~/projects/products-service && mvn clean spring-boot:run'

Ispeccionar OData
'/odata/v4/AdminService/$metadata'

Intente consultar categorías individuales, por ejemplo agregando lo siguiente al final de la URL de su aplicación:

'/odata/v4/AdminService/Categories(10)'

También puede expandir las estructuras anidadas. Agregue lo siguiente al final de la URL de su aplicación:

'/odata/v4/AdminService/Categories?$expand=children'
'/odata/v4/AdminService/Categories(10)?$expand=parent'
'/odata/v4/AdminService/Categories(1)?$expand=children'

Asegúrese de detener su aplicación después de probarla usando CTRL+C.

Instale el proyecto de servicio reutilizable como dependencia npm:
Comando:'npm install $(npm pack ../products-service -s)'
Des: 'npm packcrea un tarball a partir de products-service, que luego se usa directamente como una dependencia en la aplicación de la librería. Más información sobre npm pack: ​​https://docs.npmjs.com/cli-commands/pack.html .Encontrarás un sap-capire-products-1.0.0.tgzen la carpeta raíz del proyecto de la librería, que es el archivo tarball del products-serviceproyecto.'

Instale todos los demás paquetes y simplifique la estructura de dependencia general npm dedupe:
'npm install && npm dedupe'

Parametro de consulta 
'/odata/v4/BooksService/Books   +   ?sap-locale=es'

'cf api <CF_API_ENDPOINT>'
'cf login'

Deployed de la DB SQL
'cds deploy --to sqlite:my.sqlite'

Cree una instancia de servicio SAP HANA e implícitamente envíe todos los artefactos a la base de datos usando:
'cds deploy --to hana:bookstore-hana --store-credentials'

Probemos la conectividad de SAP HANA. Inicie su aplicación ejecutando:
'mvn spring-boot:run -Dspring-boot.run.profiles=cloud'


Ahora está listo para enviar su aplicación a la nube ejecutando los siguientes comandos desde la terminal en SAP Business Application Studio:

Asegúrate de estar en la raíz del proyecto de la librería:
'cd ~/projects/bookstore'
Construya su aplicación una vez ejecutando:
'mvn clean install'
Empuje la aplicación a la nube ejecutando:
'cf push'
Para recuperar la URL de la aplicación, ejecute el siguiente comando:
'cf app bookstore'

'bookstore-empathic-crocodile-wa.cfapps.us10-001.hana.ondemand.com'

*********
comando: 'cf env bookstore'
"url": "https://23584a8ctrial.authentication.us10.hana.ondemand.com"
"clientid": "sb-bookstore!t204697",
"clientsecret": "SYxHFK/J2+ql2z9NIMuyHdjNJMc=",

bookstore-empathic-crocodile-wa.cfapps.us10-001.hana.ondemand.com

--------------------
OData CRUD+Q

Agregar producto:
'user: northbreeze $ curl -H "Content-Type: application/json" -d '{"ProductID":77,"ProductName":"Original Frankfurter grüne Soße","UnitsInStock":32}' http://localhost:4004/main/Products
{"@odata.context":"$metadata#Products/$entity","ProductID":77,"ProductName":"Original Frankfurter grüne Soße","UnitsInStock":32}'


****************************************************
*/