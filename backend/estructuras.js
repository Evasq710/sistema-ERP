'use strict'


/**
 * BINARIO DE PROVEEDORES
 */
 class NodoProveedor{
     // proveedor objeto JSON
    constructor(proveedor){
        this.proveedor = proveedor;
        this.dato = proveedor.id;
        this.izquierdo = null;
        this.derecho = null;
    }
}

class AbbProveedor{
    constructor(){
        this.raiz = null;
    }

    insertarProveedor(proveedor){
        let nuevo = new NodoProveedor(proveedor);

        if (this.raiz == null){
            this.raiz = nuevo;
        } else {
            this.raiz = this.insertarNodo(this.raiz, nuevo);
        }
    }

    insertarNodo(raiz_actual, nuevo){
        if(raiz_actual != null){
            // Recorriendo los subárboles hijos hasta que termine de hacer la inserción, para retornar el raiz actual (this.raiz) con la inserción
            if (nuevo.dato < raiz_actual.dato){
                //Tomando el camino de la izquierda
                raiz_actual.izquierdo = this.insertarNodo(raiz_actual.izquierdo, nuevo);
            } else if (nuevo.dato > raiz_actual.dato){
                //Tomando el camino de la derecha
                raiz_actual.derecho = this.insertarNodo(raiz_actual.derecho, nuevo);
            } else {
                console.log(`No se insertó el proveedor con el id: ${nuevo.dato}, ya que ya existe`)
            }

            // Devuelve el this.raiz con el nuevo dato ya insertado
            return raiz_actual;
        } else {
            //El hijo es nulo, por lo que metemos el nodo en él, luego de hacer los recorridos
            raiz_actual = nuevo;
            return raiz_actual;
        }
    }

    mostrarDatosProveedores(select){
        this.insertarDatosProveedores(this.raiz, select);
    }

    insertarDatosProveedores(raizActual, select){
        if(raizActual != null){
            this.insertarDatosProveedores(raizActual.izquierdo, select);
            let option = document.createElement('option');
            option.value = raizActual.dato;
            option.text = `[ID ${raizActual.dato}] ${raizActual.proveedor.nombre}`
            select.appendChild(option);
            this.insertarDatosProveedores(raizActual.derecho, select);
        }
    }

    obtenerProveedor(idProveedor){
        return this.obtenerJSONProveedor(this.raiz, idProveedor);
    }

    obtenerJSONProveedor(raizActual, idProveedor){
        if(raizActual != null){
            if(raizActual.dato == idProveedor){
                return raizActual.proveedor;
            }
            let proveedor = this.obtenerJSONProveedor(raizActual.izquierdo, idProveedor);
            if(proveedor != null){
                return proveedor;
            }
            return this.obtenerJSONProveedor(raizActual.derecho, idProveedor);
        }else{
            return null;
        }
    }

    eliminarProveedor(idProveedor){
        if(this.raiz != null){
            this.raiz = this.eliminarNodoProveedor(this.raiz, idProveedor);
        }else{
            console.log(`El árbol está vacío, por lo que ${idProveedor} no se encuentra guardado aún.`)
        }
    }

    eliminarNodoProveedor(raizActual, idProveedor){
        if(raizActual != null){
            if(idProveedor < raizActual.dato){
                raizActual.izquierdo = this.eliminarNodoProveedor(raizActual.izquierdo, idProveedor);
                return raizActual;
            }else if(idProveedor > raizActual.dato){
                raizActual.derecho = this.eliminarNodoProveedor(raizActual.derecho, idProveedor);
                return raizActual;
            }else if(idProveedor == raizActual.dato){
                if(raizActual.izquierdo == null && raizActual.derecho == null){
                    //El nodo es hoja, no tiene hijos
                    raizActual = null;
                    return raizActual;
                }
                if(raizActual.izquierdo == null){
                    //Tiene hijo derecho
                    raizActual = raizActual.derecho;
                    return raizActual;
                }
                if(raizActual.derecho == null){
                    //Tiene hijo izquierdo
                    raizActual = raizActual.izquierdo;
                    return raizActual;
                }
                //Tiene hijo izquierdo y derecho
                //Buscamos la menor clave de los mayores (derecho)
                let menorNodo = this.obtenerMenorNodo(raizActual.derecho);
                //Sustituyendo el dato menor en el nodo a eliminar
                console.log(`Menor de los mayores: ${menorNodo.dato}, eliminando ${idProveedor}`)
                raizActual.dato = menorNodo.dato;
                //Eliminando el menor de los mayores, que pasó a ser la raizActual
                raizActual.derecho = this.eliminarNodoProveedor(raizActual.derecho, menorNodo.dato)
                return raizActual;
            }
        }else{
            console.log(`El dato ${idProveedor} no existe en el árbol.`)
            return null;
        }
    }

    obtenerMenorNodo(raizActual){
        if(raizActual.izquierdo == null){
            //La raíz actual es el menor
            return raizActual;
        }
        //Si no, moverse por los subárboles a la izquierda
        return this.obtenerMenorNodo(raizActual.izquierdo);
    }

    generarDotProveedores(){
        let cadena = "digraph arbol {\ngraph[label=\"Arbol binario Proveedores\"] node[shape=\"doublecircle\", style=\"filled\", fillcolor=\"palegreen\"]\n"
        cadena += this.generarNodos(this.raiz);
        cadena+="\n";
        cadena+=this.enlazar(this.raiz);
        cadena+="\n}";
        return cadena;
    }

    generarNodos(raiz_actual){
        let nodos = "";
        if(raiz_actual != null){
            nodos += `n${raiz_actual.dato}[label=\"PROVEEDOR\\n[ID ${raiz_actual.dato}] ${raiz_actual.proveedor.nombre}\\nTel. ${raiz_actual.proveedor.telefono}\"];\n`
            nodos += this.generarNodos(raiz_actual.izquierdo);
            nodos += this.generarNodos(raiz_actual.derecho);
        }
        return nodos;
    }

    enlazar(raiz_actual){
        let cadena="";
        if(raiz_actual != null){
            //Raiz actual padre       
            if(raiz_actual.izquierdo != null){
                cadena+= `n${raiz_actual.dato} -> n${raiz_actual.izquierdo.dato};\n`;
            }
            if(raiz_actual.derecho != null){
                cadena+= `n${raiz_actual.dato} -> n${raiz_actual.derecho.dato};\n`;
            }
            cadena += this.enlazar(raiz_actual.izquierdo);
            cadena += this.enlazar(raiz_actual.derecho);            
        }
        return cadena;
    }
}


/**
 * AVL VENDEDORES, CON CLIENTES Y CALENDARIO POR VENDEDOR
 */

class NodoVendedor{
    constructor(vendedor){
        // vendedor objeto JSON
        this.vendedor = vendedor;
        this.dato = vendedor.id;
        this.izquierdo = null;
        this.derecho = null;
        this.altura = 0;
        this.listaClientes = new ListaDobleClientes();
        this.calendario = new ListaDobleMeses();
    }
}

class Avl{
    constructor(){
        this.raiz = null;
    }

    insertarVendedor(vendedor){
        let nuevo = new NodoVendedor(vendedor)
        if (this.raiz == null){
            this.raiz = nuevo;
        } else {
            this.raiz = this.insertarNodo(this.raiz, nuevo);
        }
    }

    insertarNodo(raiz_actual, nuevo){
        if(raiz_actual != null){
            // Recorriendo los subárboles hijos hasta que termine de hacer la inserción, para retornar el raiz actual (this.raiz) con la inserción
            if (nuevo.dato < raiz_actual.dato){
                //Tomando el camino de la izquierda
                raiz_actual.izquierdo = this.insertarNodo(raiz_actual.izquierdo, nuevo);
                
                //Si se inserta en el subarbol izquierdo, validar el posible FE negativo (Hd - Hi)
                let factorEquilibrio = this.getAltura(raiz_actual.derecho) - this.getAltura(raiz_actual.izquierdo);
                if(factorEquilibrio == -2){
                    //Se insertó en el hijo de raiz actual.izquierdo, Caso 1 o Caso 4
                    if(nuevo.dato < raiz_actual.izquierdo.dato){
                        //FE -1 de raiz_actual.izquierdo, Caso 1, Rotación Izq-Izq
                        //Haciendo la rotación
                        raiz_actual = this.rotacionSimpleIzquierda(raiz_actual);
                    }else{
                        //FE 1 de raiz_actual.izquierdo, Caso 4, Rotación Izq-Der
                        raiz_actual = this.rotacionIzquierdaDerecha(raiz_actual);
                    }
                }
            } else if (nuevo.dato > raiz_actual.dato){
                //Tomando el camino de la derecha
                raiz_actual.derecho = this.insertarNodo(raiz_actual.derecho, nuevo);
                
                //Si se inserta en el subarbol derecho, validar el posible FE positivo 2 (Hd - Hi)
                let factorEquilibrio = this.getAltura(raiz_actual.derecho) - this.getAltura(raiz_actual.izquierdo);
                if(factorEquilibrio == 2){
                    //Se insertó en el hijo de raiz actual.derecho, Caso 2 o Caso 3
                    if(nuevo.dato < raiz_actual.derecho.dato){
                        //FE -1 de raiz_actual.derecho, Caso 3, Rotación Der-Izq
                        raiz_actual = this.rotacionDerechaIzquierda(raiz_actual);
                    }else{
                        //FE 1 de raiz_actual.derecho, Caso 2, Rotación Der-Der
                        raiz_actual = this.rotacionSimpleDerecha(raiz_actual);
                    }
                }
            } else {
                console.log(`No se insertó el dato ${nuevo.dato}, ya que ya existe`)
            }
            
            //Una vez insertado el nodo, se recalcula la altura de la raiz actual, con la altura máxima de los hijos
            raiz_actual.altura = this.alturaMaxima(this.getAltura(raiz_actual.izquierdo), this.getAltura(raiz_actual.derecho)) + 1;

            // Devuelve el this.raiz con el nuevo dato ya insertado
            return raiz_actual;
        } else {
            //El hijo es nulo, por lo que metemos el nodo en él, luego de hacer los recorridos
            raiz_actual = nuevo;
            return raiz_actual;
        }
    }

    insertarCliente(idVendedor, cliente){
        return this.insertarClienteEnVendedor(this.raiz, idVendedor, cliente);
    }

    insertarClienteEnVendedor(raizActual, idVendedor, cliente){
        if(raizActual != null){
            if (idVendedor == raizActual.dato){
                raizActual.listaClientes.insertarCliente(cliente);
                return true;
            }else if(idVendedor < raizActual.dato){
                return this.insertarClienteEnVendedor(raizActual.izquierdo, idVendedor, cliente);
            }else{
                return this.insertarClienteEnVendedor(raizActual.derecho, idVendedor, cliente);
            }
        }else{
            console.log(`No se encontró el vendedor con el id ${idVendedor}. No se pudo insertar al cliente`);
            return false;
        }
    }

    mostrarDatosVendedores(select){
        this.insertarDatosVendedores(this.raiz, select);
    }

    insertarDatosVendedores(raizActual, select){
        if(raizActual != null){
            this.insertarDatosVendedores(raizActual.izquierdo, select);
            let option = document.createElement('option');
            option.value = raizActual.dato;
            option.text = `[ID ${raizActual.dato}] ${raizActual.vendedor.nombre}`
            select.appendChild(option);
            this.insertarDatosVendedores(raizActual.derecho, select);
        }
    }

    obtenerVendedorID(idVendedor){
        return this.obtenerJSONVendedorID(this.raiz, idVendedor);
    }

    obtenerJSONVendedorID(raizActual, idVendedor){
        if(raizActual != null){
            if(raizActual.dato == idVendedor){
                return raizActual.vendedor;
            }
            let vendedor = this.obtenerJSONVendedorID(raizActual.izquierdo, idVendedor);
            if(vendedor != null){
                return vendedor;
            }
            return this.obtenerJSONVendedorID(raizActual.derecho, idVendedor);
        }else{
            return null;
        }
    }

    eliminarVendedor(idVendedor){
        if(this.raiz != null){
            this.raiz = this.eliminarNodoVendedor(this.raiz, idVendedor);
        }else{
            console.log(`El árbol está vacío, por lo que ${idVendedor} no se encuentra guardado aún.`)
        }
    }

    eliminarNodoVendedor(raizActual, idVendedor){
        if(raizActual != null){
            if(idVendedor < raizActual.dato){
                raizActual.izquierdo = this.eliminarNodoVendedor(raizActual.izquierdo, idVendedor);

                let factorEquilibrio = this.getAltura(raizActual.derecho) - this.getAltura(raizActual.izquierdo);
                console.log(`F.E. idVendedor < raiz.dato ---> ${factorEquilibrio}`);
                if(factorEquilibrio == -2){
                    let factorEquilibrioIzq = this.getAltura(raizActual.izquierdo.derecho) - this.getAltura(raizActual.izquierdo.izquierdo);
                    if(factorEquilibrioIzq == -1){
                        console.log("Caso 1, Rotación Izq-Izq");
                        raizActual = this.rotacionSimpleIzquierda(raizActual);
                    }else{
                        console.log("Caso 4, Rotación Izq-Der");
                        raizActual = this.rotacionIzquierdaDerecha(raizActual);
                    }
                }else if(factorEquilibrio == 2){
                    let factorEquilibrioDer = this.getAltura(raizActual.derecho.derecho) - this.getAltura(raizActual.derecho.izquierdo);
                    if(factorEquilibrioDer == 1){
                        console.log("Caso 2, Rotación Der-Der");
                        raizActual = this.rotacionSimpleDerecha(raizActual);
                    }else{
                        console.log("Caso 3, Rotación Der-Izq");
                        raizActual = this.rotacionDerechaIzquierda(raizActual);
                    }
                }
                raizActual.altura = this.alturaMaxima(this.getAltura(raizActual.izquierdo), this.getAltura(raizActual.derecho)) + 1;
                
                return raizActual;
            }else if(idVendedor > raizActual.dato){
                raizActual.derecho = this.eliminarNodoVendedor(raizActual.derecho, idVendedor);

                let factorEquilibrio = this.getAltura(raizActual.derecho) - this.getAltura(raizActual.izquierdo);
                console.log(`F.E. idVendedor > raiz.dato ---> ${factorEquilibrio}`);
                if(factorEquilibrio == -2){
                    let factorEquilibrioIzq = this.getAltura(raizActual.izquierdo.derecho) - this.getAltura(raizActual.izquierdo.izquierdo);
                    if(factorEquilibrioIzq == -1){
                        console.log("Caso 1, Rotación Izq-Izq");
                        raizActual = this.rotacionSimpleIzquierda(raizActual);
                    }else{
                        console.log("Caso 4, Rotación Izq-Der");
                        raizActual = this.rotacionIzquierdaDerecha(raizActual);
                    }
                }else if(factorEquilibrio == 2){
                    let factorEquilibrioDer = this.getAltura(raizActual.derecho.derecho) - this.getAltura(raizActual.derecho.izquierdo);
                    if(factorEquilibrioDer == 1){
                        console.log("Caso 2, Rotación Der-Der");
                        raizActual = this.rotacionSimpleDerecha(raizActual);
                    }else{
                        console.log("Caso 3, Rotación Der-Izq");
                        raizActual = this.rotacionDerechaIzquierda(raizActual);
                    }
                }
                raizActual.altura = this.alturaMaxima(this.getAltura(raizActual.izquierdo), this.getAltura(raizActual.derecho)) + 1;
                
                return raizActual;
            }else if(idVendedor == raizActual.dato){
                if(raizActual.izquierdo == null && raizActual.derecho == null){
                    //El nodo es hoja, no tiene hijos
                    raizActual = null;
                }
                else if(raizActual.izquierdo == null){
                    //Tiene hijo derecho
                    raizActual = raizActual.derecho;
                }
                else if(raizActual.derecho == null){
                    //Tiene hijo izquierdo
                    raizActual = raizActual.izquierdo;
                }
                else {
                    //Tiene hijo izquierdo y derecho
                    //Buscamos la menor clave de los mayores (derecho)
                    let menorNodo = this.obtenerMenorNodo(raizActual.derecho);
                    //Sustituyendo el dato menor en el nodo a eliminar
                    console.log(`Menor de los mayores: ${menorNodo.dato}, eliminando ${idVendedor}`)
                    raizActual.dato = menorNodo.dato;
                    //Eliminando el menor de los mayores, que pasó a ser la raizActual
                    raizActual.derecho = this.eliminarNodoVendedor(raizActual.derecho, menorNodo.dato)
                }
                return raizActual;
            }
        }else{
            console.log(`El ID ${idVendedor} no existe en el árbol.`)
            return null;
        }
    }

    obtenerMenorNodo(raizActual){
        if(raizActual.izquierdo == null){
            //La raíz actual es el menor
            return raizActual;
        }
        //Si no, moverse por los subárboles a la izquierda
        return this.obtenerMenorNodo(raizActual.izquierdo);
    }

    mostrarDatosClientes(select){
        this.insertarDatosClientesDeVendedor(this.raiz, select);
    }

    insertarDatosClientesDeVendedor(raizActual, select){
        if(raizActual != null){
            this.insertarDatosClientesDeVendedor(raizActual.izquierdo, select);
            raizActual.listaClientes.insertarDatosClientes(select);
            this.insertarDatosClientesDeVendedor(raizActual.derecho, select);
        }
    }

    mostrarDatosClientesDeIDVendedor(idVendedor, select){
        return this.insertarClientesDeIDVendedor(this.raiz, idVendedor, select);
    }

    insertarClientesDeIDVendedor(raizActual, idVendedor, select){
        if(raizActual != null){
            if(raizActual.dato == idVendedor){
                raizActual.listaClientes.insertarDatosClientes(select);
                return true;
            }else if(idVendedor < raizActual.dato){
                return this.insertarClientesDeIDVendedor(raizActual.izquierdo, idVendedor, select);
            }else{
                return this.insertarClientesDeIDVendedor(raizActual.derecho, idVendedor, select);
            }
        }else{
            return false;
        }
    }

    obtenerCliente(idCliente, nombreCliente){
        return this.obtenerJSONClienteDeVendedor(this.raiz, idCliente, nombreCliente);
    }

    obtenerJSONClienteDeVendedor(raizActual, idCliente, nombreCliente){
        if(raizActual != null){
            let cliente = raizActual.listaClientes.obtenerJSONCliente(idCliente, nombreCliente);
            if(cliente != null){
                return cliente;
            }
            cliente = this.obtenerJSONClienteDeVendedor(raizActual.izquierdo, idCliente, nombreCliente);
            if(cliente != null){
                return cliente;
            }
            return this.obtenerJSONClienteDeVendedor(raizActual.derecho, idCliente, nombreCliente);
        }else{
            return null;
        }
    }

    eliminarClienteEnAVL(cliente){
        return this.eliminarClienteEnVendedor(this.raiz, cliente);
    }

    eliminarClienteEnVendedor(raizActual, cliente){
        if(raizActual != null){
            let eliminado = raizActual.listaClientes.eliminarCliente(cliente);
            if(eliminado == true){
                return true;
            }
            eliminado = this.eliminarClienteEnVendedor(raizActual.izquierdo, cliente);
            if(eliminado == true){
                return true;
            }
            eliminado = this.eliminarClienteEnVendedor(raizActual.derecho, cliente);
            return eliminado;
        }
    }

    insertarEvento(idVendedor, evento){
        return this.insertarEventoEnVendedor(this.raiz, idVendedor, evento.mes, evento.desc, evento.hora, evento.dia);
    }

    insertarEventoEnVendedor(raizActual, idVendedor, mes, descripcion, hora, dia){
        if(raizActual != null){
            if (idVendedor == raizActual.dato){
                raizActual.calendario.insertarEventoEnMes(mes, descripcion, hora, dia);
                //True o false indica que se encontró al vendedor, no la correcta inserción del evento
                return true;
            }else if(idVendedor < raizActual.dato){
                return this.insertarEventoEnVendedor(raizActual.izquierdo, idVendedor, mes, descripcion, hora, dia);
            }else{
                return this.insertarEventoEnVendedor(raizActual.derecho, idVendedor, mes, descripcion, hora, dia);
            }
        }else{
            console.log(`No se encontró el vendedor con el id ${idVendedor}. No se pudo insertar el evento al vendedor.`);
            return false;
        }
    }

    booleanCredencialesVendedor(username, password){
        return this.verificacionCredenciales(this.raiz, username, password);
    }

    verificacionCredenciales(raiz_actual, username, password){
        if(raiz_actual != null){
            if(username == raiz_actual.vendedor.username && password == raiz_actual.vendedor.password){
                return true;
            }
            let encontrado = this.verificacionCredenciales(raiz_actual.izquierdo, username, password);
            if(encontrado == true){
                return true;
            }
            encontrado = this.verificacionCredenciales(raiz_actual.derecho, username, password);
            if(encontrado == true){
                return true;
            }
        }else{
            return false;
        }
    }

    getAltura(nodo){
        if(nodo != null){
            return nodo.altura;
        }
        //Si es nulo
        return -1;
    }

    alturaMaxima(altura1, altura2){
        if(altura2 > altura1){
            return altura2;
        }
        return altura1;
    }

    rotacionSimpleIzquierda(nodo){
        //Caso 1
        //Declarando como auxiiar al subarbol izquierdo, esta será la nueva raíz nodo
        let auxiliar = nodo.izquierdo;
        //Quitando el subarbol hijo derecho del auxiliar, y poniendolos como hijos izquierdos del nodo
        //El auxiliar queda solo con su subarbol izquierdo
        nodo.izquierdo = auxiliar.derecho;
        //El subarbol derecho del auxiliar será el que antes era el nodo, con nuevo subarbol izquierdo hijo
        auxiliar.derecho = nodo;
        //Recalculando las alturas de los nodos
        auxiliar.altura = this.alturaMaxima(this.getAltura(auxiliar.derecho), this.getAltura(auxiliar.izquierdo)) + 1;
        nodo.altura = this.alturaMaxima(this.getAltura(nodo.derecho), this.getAltura(nodo.izquierdo)) + 1;

        //Retornando el auxiliar, que funge como nodo raíz
        return auxiliar;
    }

    rotacionSimpleDerecha(nodo){
        //Caso 2
        //Declarando como auxiiar al subarbol derecho, esta será la nueva raíz nodo
        let auxiliar = nodo.derecho;
        //Quitando el subarbol hijo izquierdo del auxiliar, y poniendolos como hijos derechos del nodo
        //El auxiliar queda solo con su subarbol derecho
        nodo.derecho = auxiliar.izquierdo;
        //El subarbol izquierdo del auxiliar será el que antes era el nodo, con nuevo subarbol derecho hijo
        auxiliar.izquierdo = nodo;
        //Recalculando las alturas de los nodos
        auxiliar.altura = this.alturaMaxima(this.getAltura(auxiliar.derecho), this.getAltura(auxiliar.izquierdo)) + 1;
        nodo.altura = this.alturaMaxima(this.getAltura(nodo.derecho), this.getAltura(nodo.izquierdo)) + 1;

        //Retornando el auxiliar, que funge como nodo raíz
        return auxiliar;
    }

    rotacionDerechaIzquierda(nodo){
        //Caso 3
        nodo.derecho = this.rotacionSimpleIzquierda(nodo.derecho);
        nodo = this.rotacionSimpleDerecha(nodo)

        return nodo;
    }

    rotacionIzquierdaDerecha(nodo){
        //Caso 4
        nodo.izquierdo = this.rotacionSimpleDerecha(nodo.izquierdo);
        nodo = this.rotacionSimpleIzquierda(nodo)

        return nodo;
    }

    inOrderClientes(raiz_actual){
        if(raiz_actual != null){
            this.inOrderClientes(raiz_actual.izquierdo);
            console.log(`======${raiz_actual.dato} - ${raiz_actual.vendedor.nombre}======`)
            raiz_actual.listaClientes.mostrarClientes()
            this.inOrderClientes(raiz_actual.derecho);
        }
    }

    inOrderMesesEventos(raiz_actual){
        if(raiz_actual != null){
            this.inOrderMesesEventos(raiz_actual.izquierdo);
            console.log(`======${raiz_actual.dato} - ${raiz_actual.vendedor.nombre}======`)
            raiz_actual.calendario.mostrarMesesYEventos();
            this.inOrderMesesEventos(raiz_actual.derecho);
        }
    }

    obtenerDotVendedores(){
        let cadena = "digraph arbol {\ngraph[label=\"Arbol AVL Vendedores\"] node[shape=\"doubleoctagon\", style=\"filled\", fillcolor=\"cadetblue\"]\n"
        cadena += this.generarNodos(this.raiz);
        cadena+="\n";
        cadena+=this.enlazar(this.raiz);
        cadena+="\n}";
        return cadena;
    }

    generarNodos(raiz_actual){
        let nodos = "";
        if(raiz_actual != null){
            nodos += `n${raiz_actual.dato}[label=\"VENDEDOR\\n[ID ${raiz_actual.dato}] ${raiz_actual.vendedor.nombre}\\nEmail: ${raiz_actual.vendedor.correo}\"];\n`
            nodos += this.generarNodos(raiz_actual.izquierdo);
            nodos += this.generarNodos(raiz_actual.derecho);
        }
        return nodos;
    }

    enlazar(raiz_actual){
        let cadena="";
        if(raiz_actual != null){
            //Raiz actual padre       
            if(raiz_actual.izquierdo != null){
                cadena+= `n${raiz_actual.dato} -> n${raiz_actual.izquierdo.dato};\n`;
            }
            if(raiz_actual.derecho != null){
                cadena+= `n${raiz_actual.dato} -> n${raiz_actual.derecho.dato};\n`;
            }
            cadena += this.enlazar(raiz_actual.izquierdo);
            cadena += this.enlazar(raiz_actual.derecho);            
        }
        return cadena;
    }

    obtenerDotClientesDeVendedor(raizActual, idVendedor){
        if(raizActual != null){
            if (idVendedor == raizActual.dato){
                let dotClientes = raizActual.listaClientes.obtenerDotClientes(raizActual.vendedor.nombre, raizActual.dato);
                return dotClientes;
            }else if(idVendedor < raizActual.dato){
                return this.obtenerDotClientesDeVendedor(raizActual.izquierdo, idVendedor);
            }else{
                return this.obtenerDotClientesDeVendedor(raizActual.derecho, idVendedor);
            }
        }else{
            console.log(`No se encontró el vendedor con el id ${idVendedor}. No se pudo retornar la lista de clientes.`);
            return null;
        }
    }

    obtenerDotEventosDeVendedor(raizActual, idVendedor, mes){
        if(raizActual != null){
            if (idVendedor == raizActual.dato){
                let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                let dotMatriz = raizActual.calendario.generarMatrizDeMes(mes, meses[mes - 1], raizActual.vendedor.nombre, raizActual.dato);
                return dotMatriz;
            }else if(idVendedor < raizActual.dato){
                return this.obtenerDotEventosDeVendedor(raizActual.izquierdo, idVendedor, mes);
            }else{
                return this.obtenerDotEventosDeVendedor(raizActual.derecho, idVendedor, mes);
            }
        }else{
            console.log(`No se encontró el vendedor con el id ${idVendedor}. No se pudo retornar la matriz de eventos.`);
            return null;
        }
    }

    obtenerVendedorJSON(user){
        return this.obtenerVendedor(this.raiz, user);
    }

    obtenerVendedor(raiz_actual, user){
        if(raiz_actual != null){
            if(user == raiz_actual.vendedor.username){
                return raiz_actual.vendedor;
            }
            let vendedor = this.obtenerVendedor(raiz_actual.izquierdo, user);
            if(vendedor != null){
                return vendedor;
            }
            vendedor = this.obtenerVendedor(raiz_actual.derecho, user);
            if(vendedor != null){
                return vendedor;
            }
        }else{
            return null;
        }
    }
}

/**
 * LISTA DOBLE DE CLIENTES
 */

class NodoDobleCliente{
    constructor(cliente){
        // cliente objeto JSON
        this.cliente = cliente;
        this.siguiente = null;
        this.anterior = null;
    }
}

class ListaDobleClientes{
    constructor(){
        this.primero = null;
    }

    insertarCliente(cliente){
        let nuevo = new NodoDobleCliente(cliente);
        if(this.primero == null){
            this.primero = nuevo;
        }else{
            let actual = this.primero;
            while(actual.siguiente != null){
                actual = actual.siguiente;
            };
            actual.siguiente = nuevo;
            nuevo.anterior = actual;
        }
    }

    eliminarCliente(cliente){
        if(this.primero != null){
            if(this.primero.cliente.id == cliente.id && this.primero.cliente.nombre == cliente.nombre){
                if(this.primero.siguiente != null){
                    this.primero.siguiente.anterior = null;
                    this.primero = this.primero.siguiente;
                }else{
                    this.primero = null;
                }
                console.log(`Se eliminó al cliente con id ${cliente.id}, ${cliente.nombre}`);
                return true;
            }
            let actual = this.primero;
            while(actual != null){
                if(actual.cliente.id == cliente.id && actual.cliente.nombre == cliente.nombre){
                    actual.anterior.siguiente = actual.siguiente;
                    if(actual.siguiente != null){
                        actual.siguiente.anterior = actual.anterior;
                    }
                    actual = null;
                    console.log(`Se eliminó al cliente con id ${cliente.id}, ${cliente.nombre}`);
                    return true;
                }
                actual = actual.siguiente;
            }
            return false;
        }
        return false;
    }

    insertarDatosClientes(select){
        let actual = this.primero;
        while(actual != null){
            let option = document.createElement('option');
            option.value = actual.cliente.id;
            option.text = `[ID ${actual.cliente.id}]-${actual.cliente.nombre}`
            select.appendChild(option);
            actual = actual.siguiente;
        }
    }

    obtenerJSONCliente(idCliente, nombreCliente){
        let actual = this.primero;
        while(actual != null){
            if(actual.cliente.id == idCliente && actual.cliente.nombre == nombreCliente){
                return actual.cliente;
            }
            actual = actual.siguiente;
        }
        return null;
    }

    mostrarClientes(){
        let actual = this.primero;
        console.log("***** Mostrar clientes *****")
        while(actual != null){
            console.log(`-> ${actual.cliente.id} - ${actual.cliente.nombre}`);
            actual = actual.siguiente;
        }
    }

    obtenerDotClientes(nombreVendedor, idVendedor){
        let cadena = `digraph listaEnlazada {
            rankdir = "LR"
        graph[label=\"Lista Doble Clientes\\nVendedor ${nombreVendedor} [ID ${idVendedor}]\"] node[shape="rectangle", style="filled", fillcolor="darksalmon"];\n`
        let actual = this.primero;
        // Creando los nodos
        while(actual != null){
            cadena += `n${actual.cliente.id}[label=\"CLIENTE\\n[ID ${actual.cliente.id}] ${actual.cliente.nombre}\\nCorreo: ${actual.cliente.correo}\"];\n`
            actual = actual.siguiente;
        }
        // Enlaces dobles
        actual = this.primero;
        while(actual != null && actual.siguiente != null){
            cadena += `n${actual.cliente.id} -> n${actual.siguiente.cliente.id};\n`
            cadena += `n${actual.siguiente.cliente.id} -> n${actual.cliente.id};\n`
            actual = actual.siguiente;
        }
        cadena += "\n}"
        return cadena;
    }
}

/**
 * LISTA DOBLE DE MESES (CALENDARIO) CON MATRICES DINÁMICAS POR MES
 */

class NodoDobleMes{
    constructor(mes){
        // Pasar el mes como viene en el JSON, con el número
        this.mes = mes;
        this.matrizEventos = new Matriz();
        this.siguiente = null;
        this.anterior = null;
    }
}

//Lista doble ordenada
class ListaDobleMeses{
    constructor(){
        this.primero = null;
    }

    insertarEventoEnMes(mes, descripcion, hora, dia){
        let actual = this.primero;
        let noExiste = true;
        while(actual != null){
            if(actual.mes == mes){
                actual.matrizEventos.insertarEvento(descripcion, hora, dia);
                noExiste = false;
                break;
            }
            actual = actual.siguiente;
        }
        if(noExiste){
            this.insertarMes(mes);
            this.insertarEventoEnMes(mes, descripcion, hora, dia);
        }
    }

    insertarMes(mes){
        let nuevo = new NodoDobleMes(mes);
        if(this.primero == null){
            this.primero = nuevo;
        }else if(nuevo.mes < this.primero.mes){
            nuevo.siguiente = this.primero;
            this.primero.anterior = nuevo;
            this.primero = nuevo;
        }else {
            let actual = this.primero;
            while(actual != null){
                if(nuevo.mes > actual.mes){
                    if(actual.siguiente != null){
                        nuevo.anterior = actual;
                        nuevo.siguiente = actual.siguiente;
                        actual.siguiente.anterior = nuevo;
                        actual.siguiente = nuevo;
                    }else{
                        nuevo.anterior = actual;
                        actual.siguiente = nuevo;
                    }
                    break;
                }
                actual = actual.siguiente;
            };
        }
    }

    mostrarMesesYEventos(){
        let actual = this.primero;
        console.log("*** Meses Y eventos De Empleado **")
        while(actual != null){
            console.log(`-----> ${actual.mes}`);
            console.log(actual.matrizEventos.generarDotMatrizEventos());
            actual = actual.siguiente;
        }
    }

    generarMatrizDeMes(mes, nombreMes, nombreVendedor, idVendedor){
        let actual = this.primero;
        while(actual != null){
            if(actual.mes == mes){
                let dotEventos = actual.matrizEventos.generarDotMatrizEventos(nombreMes, nombreVendedor, idVendedor);
                return dotEventos;
            }
            actual = actual.siguiente;
        }
        return null;
    }
}

/**
 * MATRIZ DINÁMICA DE EVENTOS
 */

// ==================LISTA INTERNA==================
 class NodoInternoEvento{
    constructor(descripcion, hora, dia){
        //hora -> filas
        //dia -> columnas
        //      n1  n2
        //      v   v
        //m1 ->
        //m2 ->
        this.descripcion = descripcion;
        this.hora = hora;
        this.dia = dia;

        //Apuntadores para insertar en hora, la dia delimita el orden o la posición
        this.siguiente = null;
        this.anterior = null;
        //Apuntadores para insertar en dia, la hora delimita el orden o la posición
        this.arriba = null;
        this.abajo = null;
    }
}

class ListaInternaEventos{
    constructor(){
        this.primero = null;
    }

    // Insertando en una fila ------->
    insertarEnM(descripcion, hora, dia){
        let nuevoNodo = new NodoInternoEvento(descripcion, hora, dia);

        if(this.primero == null){
            this.primero = nuevoNodo;
        }else if(nuevoNodo.dia < this.primero.dia){
            nuevoNodo.siguiente = this.primero;
            this.primero.anterior = nuevoNodo;
            this.primero = nuevoNodo;
        }else{
            let actual = this.primero;
            while(actual != null){
                if(nuevoNodo.dia < actual.dia){
                    nuevoNodo.siguiente = actual;
                    nuevoNodo.anterior = actual.anterior;
                    actual.anterior.siguiente = nuevoNodo;
                    actual.anterior = nuevoNodo;
                    break;
                }else if(nuevoNodo.dia == actual.dia){
                    console.log(`No fue posible insertar el nodo en (${hora}, ${dia}), ya existe uno en esa posición`);
                    break;
                }else if(actual.siguiente == null){
                    actual.siguiente = nuevoNodo;
                    nuevoNodo.anterior = actual;
                    break
                }
                actual = actual.siguiente;
            }
        }
    }

    // Insertando en una columna v v v v v v v v v
    insertarEnN(descripcion, hora, dia){
        let nuevoNodo = new NodoInternoEvento(descripcion, hora, dia);

        if(this.primero == null){
            this.primero = nuevoNodo;
        }else if(nuevoNodo.hora < this.primero.hora){
            nuevoNodo.abajo = this.primero;
            this.primero.arriba = nuevoNodo;
            this.primero = nuevoNodo;
        }else{
            let actual = this.primero;
            while(actual != null){
                if(nuevoNodo.hora < actual.hora){
                    nuevoNodo.abajo = actual;
                    nuevoNodo.arriba = actual.arriba;
                    actual.arriba.abajo = nuevoNodo;
                    actual.arriba = nuevoNodo;
                    break;
                }else if(nuevoNodo.hora == actual.hora){
                    console.log(`No fue posible insertar el nodo en (${hora}, ${dia}), ya existe uno en esa posición`);
                    break;
                }else if(actual.abajo == null){
                    actual.abajo = nuevoNodo;
                    nuevoNodo.arriba = actual;
                    break
                }
                actual = actual.abajo;
            }
        }
    }

    recorrerM(){
        let actual = this.primero;
        console.log("Datos en M: ");
        while(actual != null){
            console.log(`\t${actual.descripcion} en (${actual.hora}, ${actual.dia})`);
            actual = actual.siguiente;
        }
    }

    recorrerN(){
        let actual = this.primero;
        console.log("Datos en N: ");
        while(actual != null){
            console.log(`\t${actual.descripcion} en (${actual.hora}, ${actual.dia})`);
            actual = actual.abajo;
        }
    }
}

// ==================CABECERAS (LISTAS DOBLES) PARA FILAS-COLUMNAS CON LISTAS INTERNAS DE EVENTOS==================

class nodoCabecera{
    constructor(posicion){
        this.posicion = posicion;
        this.siguiente = null;
        this.anterior = null;
        this.listaInterna = new ListaInternaEventos()
    }
}

class ListaCabecera{
    constructor(){
        this.primero = null;
    }

    insertarCabecera(nuevaCabecera){

        if(this.primero == null){
            this.primero = nuevaCabecera;
        }else if(nuevaCabecera.posicion < this.primero.posicion){
            nuevaCabecera.siguiente = this.primero;
            this.primero.anterior = nuevaCabecera;
            this.primero = nuevaCabecera;
        }else{
            let actual = this.primero;
            while(actual != null){
                if(nuevaCabecera.posicion < actual.posicion){
                    nuevaCabecera.siguiente = actual;
                    nuevaCabecera.anterior = actual.anterior;
                    actual.anterior.siguiente = nuevaCabecera;
                    actual.anterior = nuevaCabecera;
                    break;
                }else if(nuevaCabecera.posicion == actual.posicion){
                    console.log(`No fue posible insertar el nodo cabecera con posicion ${nuevaCabecera.posicion}, ya existe uno con este dato`);
                    break;
                }else if(actual.siguiente == null){
                    actual.siguiente = nuevaCabecera;
                    nuevaCabecera.anterior = actual;
                    break
                }
                actual = actual.siguiente;
            }
        }
    }

    obtenerCabecera(posicion){
        let actual = this.primero;
        while(actual != null){
            if(actual.posicion == posicion){
                return actual;
            }
            actual = actual.siguiente;
        }
        return null;
    }

    recorrer(){
        let actual = this.primero;
        while(actual != null){
            console.log(`${actual.posicion}`);
            actual = actual.siguiente;
        }
    }
}

// ==================MATRIZ DINÁMICA CON LISTAS DE CABECERAS==================

class Matriz{
    constructor(){
        this.cabecerasM = new ListaCabecera();
        this.cabecerasN = new ListaCabecera();
    }

    insertarEvento(descripcion, hora, dia){
        let nodoCabeceraM = this.cabecerasM.obtenerCabecera(hora);
        let nodoCabeceraN = this.cabecerasN.obtenerCabecera(dia);

        // Creando la cabecera en dado caso no exista
        if(nodoCabeceraM == null){
            nodoCabeceraM = new nodoCabecera(hora);
            this.cabecerasM.insertarCabecera(nodoCabeceraM);
        }
        if(nodoCabeceraN == null){
            nodoCabeceraN = new nodoCabecera(dia);
            this.cabecerasN.insertarCabecera(nodoCabeceraN)
        }

        //Insertando en la fila (M)
        nodoCabeceraM.listaInterna.insertarEnM(descripcion, hora, dia);
        //Insertando en columna (N)
        nodoCabeceraN.listaInterna.insertarEnN(descripcion, hora, dia);
    }

    recorrerMatriz(){
        console.log("*****CABECERAS EN FILAS (M)******");
        let actualCabeceraM = this.cabecerasM.primero;
        while(actualCabeceraM != null){
            console.log(`>FILA: ${actualCabeceraM.posicion}`);
            actualCabeceraM.listaInterna.recorrerM();
            actualCabeceraM = actualCabeceraM.siguiente;
        }
        console.log("\n*****CABECERAS EN COLUMNAS (N)******");
        let actualCabeceraN = this.cabecerasN.primero;
        while(actualCabeceraN != null){
            console.log(`>COLUMNA: ${actualCabeceraN.posicion}`);
            actualCabeceraN.listaInterna.recorrerN();
            actualCabeceraN = actualCabeceraN.siguiente;
        }
    }

    generarDotMatrizEventos(nombreMes, nombreVendedor, idVendedor){
        let cadena = "digraph Matriz{\nlayout = neato;\n";
        cadena+= "node[shape = box,width=0.7,height=0.7, style=\"filled\"];\n";
        cadena+= "edge[style = \"bold\"]; \n"
        // Nodo matriz
        // pos = (dia, hora) = (x, y) IV Cuadrante
        //Al empezar en (0, 0), solo se grafican correctamente valores de 1 en adelante, tanto en M como en N
        //Si se quiere que los valores admitidos sean de 0 en adelante, cambiar el inicio a -1, 1, y las cabeceras en base a esto
        cadena+=`node[label = \"Calendario ${nombreMes}\\n[ID ${idVendedor}] ${nombreVendedor}\", fillcolor=\"cadetblue\", pos = \"0,0!\"]principal;\n`

        //***************************************CABECERAS******************************************
        // Cabeceras N para columnas(SUPERIORES, INSERTADAS EN M = 0)
        let actualN = this.cabecerasN.primero;
        while(actualN!=null){
            cadena+= "node[label = \""+"Día "+actualN.posicion+"\" fillcolor=\"darkseagreen\" pos = \""+actualN.posicion+",0!\"]dia"+actualN.posicion+";\n"
            actualN = actualN.siguiente;
        }
        // Enlaces dobles en las cabeceras de las columnas
        actualN = this.cabecerasN.primero;
        while(actualN.siguiente != null){
            cadena+="dia"+actualN.posicion+"->"+"dia"+actualN.siguiente.posicion+";\n"
            cadena+="dia"+actualN.siguiente.posicion+"->"+"dia"+actualN.posicion+";\n"
            actualN = actualN.siguiente;
        }
        // Enlace de Nodo matriz a las cabeceras N
        if(this.cabecerasN.primero!= null){
            cadena+="principal->dia"+this.cabecerasN.primero.posicion+";\n";
        }

        // Cabeceras M para filas (IZQUIERDA, INSERTADAS EN N = 0)
        let actualM = this.cabecerasM.primero;
        while(actualM!=null){
            cadena+="node[label = \""+"Hora "+actualM.posicion+"\" fillcolor=\"darkseagreen\" pos = \"0,-"+actualM.posicion+"!\"]hora"+actualM.posicion+";\n"
            actualM = actualM.siguiente;
        }
        // Enlaces dobles en las cabeceras de las filas
        actualM = this.cabecerasM.primero;
        while(actualM.siguiente != null){
            cadena+="hora"+actualM.posicion+"->"+"hora"+actualM.siguiente.posicion+";\n"
            cadena+="hora"+actualM.siguiente.posicion+"->"+"hora"+actualM.posicion+";\n"
            actualM = actualM.siguiente;
        }
        // Enlace simple de Nodo matriz a las cabeceras M
        if(this.cabecerasM.primero!= null){
            cadena+="principal->hora"+this.cabecerasM.primero.posicion+";\n";
        }

        //***************************************NODOS INTERNOS******************************************
        //Recorriendo las cabeceras en N (columnas) para ingresar a sus listas internas, y CREAR LOS NODOS
        actualN = this.cabecerasN.primero;
        while(actualN != null){
            let actualInterno = actualN.listaInterna.primero;
            while(actualInterno!=null){
                cadena+="\tnode[label = \""+actualInterno.descripcion+"\" fillcolor=\"gold\" pos = \""+actualInterno.dia+",-"+actualInterno.hora+"!\"]dia"+actualInterno.dia+"hora"+actualInterno.hora+";\n"
                actualInterno = actualInterno.abajo;
            }

            // Enlaces dobles entre nodos internos, recorriendo N
            actualInterno = actualN.listaInterna.primero;
            while(actualInterno.abajo!= null){
                cadena+="   dia"+actualInterno.dia+"hora"+actualInterno.hora+"->dia"+actualInterno.abajo.dia+"hora"+actualInterno.abajo.hora+";\n";
                cadena+="   dia"+actualInterno.abajo.dia+"hora"+actualInterno.abajo.hora+"->dia"+actualInterno.dia+"hora"+actualInterno.hora+";\n";
                actualInterno= actualInterno.abajo;
            }
            // Enlace simple de cabecera N a su primer nodo interno
            if(actualN.listaInterna.primero != null){
                cadena+="dia"+actualN.posicion+"->"+"dia"+actualN.listaInterna.primero.dia+"hora"+actualN.listaInterna.primero.hora+";\n";
            }

            actualN = actualN.siguiente;
        }

        actualM = this.cabecerasM.primero;
        // Enlaces dobles entre nodos internos, recorriendo M
        while(actualM!=null){
            let actualInterno = actualM.listaInterna.primero;
            while(actualInterno.siguiente!= null){
                cadena+="   dia"+actualInterno.dia+"hora"+actualInterno.hora+"->dia"+actualInterno.siguiente.dia+"hora"+actualInterno.siguiente.hora+";\n";
                cadena+="   dia"+actualInterno.siguiente.dia+"hora"+actualInterno.siguiente.hora+"->dia"+actualInterno.dia+"hora"+actualInterno.hora+";\n";
                actualInterno= actualInterno.siguiente;
            }
            // Enlace simple de cabecera M a su primer nodo interno
            if(actualM.listaInterna.primero!= null){
                cadena+="hora"+actualM.posicion+"->"+"dia"+actualM.listaInterna.primero.dia+"hora"+actualM.listaInterna.primero.hora+";\n";
            }
            actualM = actualM.siguiente;
        }

        cadena+= "\n}"
        return cadena;
    }
}

//***************************************************************************************** */

var avl_vendedores = new Avl();
// TODO Binario proveedores
var binario_proveedores = new AbbProveedor();

// ********** RECUPERANDO ESTRUCTURAS DEL STORAGE *************
function recuperarAVL(){
    let avlString = localStorage.getItem("vendedores");
    if(avlString != null){
        let avl_JSON = JSON.parse(avlString);
        let avlCircularJSON = CircularJSON.parse(avl_JSON); 
        Object.assign(avl_vendedores, avlCircularJSON);
        recuperacionAnidadainOrder(avl_vendedores.raiz);
    }
}

function recuperacionAnidadainOrder(raiz_actual){
    //Función que recorre los empleados inorder, actualizando las estructuras de cada empleado
    if(raiz_actual != null){
        recuperacionAnidadainOrder(raiz_actual.izquierdo);
        try{
            let listaSerializadaClientes = raiz_actual.listaClientes;
            let listaAnidadaClientes = new ListaDobleClientes();
            Object.assign(listaAnidadaClientes, listaSerializadaClientes);
            raiz_actual.listaClientes = listaAnidadaClientes;
    
            let listaSerializadaMeses = raiz_actual.calendario;
            let listaAnidadaMeses = new ListaDobleMeses();
            Object.assign(listaAnidadaMeses, listaSerializadaMeses);
            raiz_actual.calendario = listaAnidadaMeses;
    
            let mesActual = listaAnidadaMeses.primero;
            while(mesActual!= null){
                //MATRIZ
                let matrizSerializada = mesActual.matrizEventos;
                let matrizEventosAnidada = new Matriz()
                Object.assign(matrizEventosAnidada, matrizSerializada);

                //CABECERAS M
                let cabeceraMSerializada = matrizEventosAnidada.cabecerasM;
                let cabeceraMAnidada = new ListaCabecera()
                Object.assign(cabeceraMAnidada, cabeceraMSerializada);
                matrizEventosAnidada.cabecerasM = cabeceraMAnidada;

                let cabeceraActual = cabeceraMAnidada.primero;
                while(cabeceraActual != null){
                    //LISTA INTERNA DE NODOS EN M
                    let listaNodosSerializada = cabeceraActual.listaInterna;
                    let listaInternaAnidada = new ListaInternaEventos()
                    Object.assign(listaInternaAnidada, listaNodosSerializada);
                    cabeceraActual.listaInterna = listaInternaAnidada;
                    cabeceraActual = cabeceraActual.siguiente;
                }

                //CABECERAS N
                let cabeceraNSerializada = matrizEventosAnidada.cabecerasN;
                let cabeceraNAnidada = new ListaCabecera()
                Object.assign(cabeceraNAnidada, cabeceraNSerializada);
                matrizEventosAnidada.cabecerasN = cabeceraNAnidada;

                cabeceraActual = cabeceraNAnidada.primero;
                while(cabeceraActual != null){
                    //LISTA INTERNA DE NODOS EN N
                    let listaNodosSerializada = cabeceraActual.listaInterna;
                    let listaInternaAnidada = new ListaInternaEventos()
                    Object.assign(listaInternaAnidada, listaNodosSerializada);
                    cabeceraActual.listaInterna = listaInternaAnidada;
                    cabeceraActual = cabeceraActual.siguiente;
                }

                //ACTUALIZANDO MATRIZ EN MES ACTUAL
                mesActual.matrizEventos = matrizEventosAnidada;
                mesActual = mesActual.siguiente;
            }
        }catch(error){
            console.log(error);
        }
        recuperacionAnidadainOrder(raiz_actual.derecho);
    }
}

function recuperarABB(){
    let abbString = localStorage.getItem("proveedores");
    if(abbString != null){
        let abbJSON = JSON.parse(abbString);
        let abbCircularJSON = CircularJSON.parse(abbJSON); 
        Object.assign(binario_proveedores, abbCircularJSON);
    }
}

// *********** INSERCIÓN DE DATOS A ESTRUCTURAS (CON EL STORAGE) ***********

function crearProveedores(){
    let strProveedores = localStorage.getItem("proveedoresJSON");
    if(strProveedores != null){
        let arrProveedores = JSON.parse(strProveedores);
        
        arrProveedores.forEach(proveedorNuevo => {
            try{
                binario_proveedores.insertarProveedor(proveedorNuevo);
            }catch(error){
                console.log(error);
                // alert("Ocurrió un error al insertar proveedores nuevos al árbol binario. (Ver consola).")
            }
        });
        localStorage.removeItem("proveedoresJSON");
        actualizarProveedoresStorage();
        alert("Se han agregado a los proveedores correctamente. Ver consola para más detalles.")
    }
}

function crearVendedores(){
    let strVendedores = localStorage.getItem("vendedoresJSON");
    if(strVendedores != null){
        let arrVendedores = JSON.parse(strVendedores);
        
        arrVendedores.forEach(vendedorNuevo => {
            try{
                avl_vendedores.insertarVendedor(vendedorNuevo);
            }catch(error){
                console.log(error);
                // alert("Ocurrió un error al insertar vendedores nuevos al árbol AVL. (Ver consola).")
            }
        });
        localStorage.removeItem("vendedoresJSON");
        actualizarVendedoresStorage();
        alert("Se han agregado a los vendedores correctamente. Ver consola para más detalles.")
    }
}

function crearClientes(){
    let strClientes = localStorage.getItem("clientesJSON");
    if(strClientes != null){
        let arrVendedores = JSON.parse(strClientes);
        
        arrVendedores.forEach(vendedor => {
            vendedor.clientes.forEach(cliente => {
                try{
                    //Insertando a los clientes en la lista doble
                    // TODO llevar control de los que devuelven false
                    let insertado = avl_vendedores.insertarCliente(vendedor.id, cliente);
                }catch(error){
                    // TODO Llevar el control de los que generen error
                    console.log(error);
                }
            });
        });
        localStorage.removeItem("clientesJSON");
        actualizarVendedoresStorage();
        alert("Se han agregado a los clientes correctamente. Ver consola para más detalles.")
    }
}

function crearEventos(){
    let strEventos = localStorage.getItem("eventosJSON");
    if(strEventos != null){
        let arrVendedores = JSON.parse(strEventos);
        
        arrVendedores.forEach(vendedor => {
            vendedor.eventos.forEach(evento => {
                try{
                    // TODO llevar control de los que devuelven false
                    let vendedorEncontrado = avl_vendedores.insertarEvento(vendedor.id, evento);
                }catch(error){
                    // TODO Llevar el control de los que generen error
                    console.log(error);
                }
            });
        });
        localStorage.removeItem("eventosJSON");
        actualizarVendedoresStorage();
        alert("Se han agregado los eventos a los vendedores correctamente. Ver consola para más detalles.")
    }
}

// ***************ELIMINACIÓN DE DATOS EN ESTRUCTURAS*******************

function eliminacionVendedor(vendedor){
    try{
        avl_vendedores.eliminarVendedor(vendedor.id);
        actualizarVendedoresStorage();
        alert(`El vendedor ${vendedor.nombre} ha sido eliminado con éxito`);
    }catch(error){
        console.log(error);
        alert("Ocurrió un error en la eliminación del vendedor");
    }
}

function eliminacionCliente(cliente){
    try{
        let eliminado = avl_vendedores.eliminarClienteEnAVL(cliente);
        if(eliminado == true){
            actualizarVendedoresStorage();
            alert(`El cliente ${cliente.nombre} ha sido eliminado con éxito`);
        }else{
            alert("Ocurrió un error en la eliminación del cliente (Eliminado = false).");
        }
    }catch(error){
        console.log(error);
        alert("Ocurrió un error en la eliminación del cliente (Ver consola)");
    }
}
function eliminacionProveedor(proveedor){
    try{
        binario_proveedores.eliminarProveedor(proveedor.id);
        actualizarProveedoresStorage();
        alert(`El proveedor ${proveedor.nombre} ha sido eliminado con éxito`);
    }catch(error){
        console.log(error);
        alert("Ocurrió un error en la eliminación del proveedor");
    }
}

// *********** ACTUALIZACIÓN STORAGE CUANDO LAS ESTRUCTURAS CAMBIAN ***********

function actualizarVendedoresStorage(){
    let avl_circularJSON = CircularJSON.stringify(avl_vendedores);
    let avlString = JSON.stringify(avl_circularJSON);
    localStorage.setItem("vendedores", avlString);
}

function actualizarProveedoresStorage(){
    let abb_CircularJSON = CircularJSON.stringify(binario_proveedores);
    let abbProveedoresString = JSON.stringify(abb_CircularJSON);
    localStorage.setItem("proveedores", abbProveedoresString);
}

// *********** PRUEBAS PERMANENCIA DE DATOS ***********

function prueba(){
    console.log("**************DOT PROVEEDORES****************");
    console.log(binario_proveedores.generarDotProveedores());
    console.log("**************DOT VENDEDORES****************");
    console.log(avl_vendedores.obtenerDotVendedores());
    console.log("**************DETALLE CLIENTES****************");
    avl_vendedores.inOrderClientes(avl_vendedores.raiz);
}