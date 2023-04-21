import React, { Component } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import '../Pagination.css'
import Swal from 'sweetalert2'


class MobilePage extends Component {
    state = { 
        data:[],
        originalData: [],
        modalInsertar: false,
        modalVer: false,
        formFilled: false,
        busqueda:'',
        db:'pool1',
        form:{
            id:'',
            descripcion:'',
            resumen:'',
            pasos:'',
            resultado_obtenido:'',
            resultado_esperado:'',
            evidencia:'',
            comentarios:'',
            regresion:'',
            ticket_relacionado:'',
            status:'',
            developer:'',
            informador:'',
            tipoModal: ''
        },
        offset: 0,
        perPage: 12, // Número de elementos por página
        currentPage: 1, // Índice de la página actual
        pageCount: 0 // Número total de páginas
     }

     // la función verificará si los campos tienen una longitud mayor a cero, lo que significa que el campo contiene al menos un carácter. 
     //Esto asegurará que el botón de envío solo se deshabilite si todos los campos están realmente vacíos.

     //"informador" es un valor fijo que se carga a través de una API y se setea como readOnly o disabled, 
     //entonces no debería ser un campo que influya en la lógica de validación de si el formulario está completo o no, 
     //ya que su valor nunca cambiará y no depende de la interacción del usuario.

     isFormFilled = () => {
        const { form } = this.state;
        if (!form) {
          return false;
        }
        return (
          form.descripcion && 
          form.descripcion.length > 0 &&
          form.resumen &&
          form.resumen.length > 0 &&
          form.pasos &&
          form.pasos.length > 0 &&
          form.resultado_obtenido &&
          form.resultado_obtenido.length > 0 &&
          form.resultado_esperado &&
          form.resultado_esperado.length > 0 &&
          form.evidencia &&
          form.evidencia.length > 0 &&
          form.comentarios &&
          form.comentarios.length > 0 &&
          form.regresion &&
          form.regresion.length > 0 &&
          form.ticket_relacionado &&
          form.ticket_relacionado.length > 0 &&
          form.status &&
          form.status.length > 0 &&
          form.developer &&
          form.developer.length > 0
        );
      }

     modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar})
     }

     modalVer=()=>{
        this.setState({modalVer: !this.state.modalVer})
     }

     seleccionarBug=(bug)=>{
        this.setState({
            tipoModal:'actualizar',
            form:{
                id:bug.id,
                descripcion:bug.descripcion,
                resumen:bug.resumen,
                pasos:bug.pasos,
                resultado_obtenido:bug.resultado_obtenido,
                resultado_esperado:bug.resultado_esperado,
                evidencia:bug.evidencia,
                comentarios:bug.comentarios,
                regresion:bug.regresion,
                ticket_relacionado:bug.ticket_relacionado,
                status:bug.status,
                developer:bug.developer,
                informador:bug.informador
                }
             })
     }
     
     
    
     //En la función, se actualiza el estado del componente usando this.setState(). 
     //Primero, se usa this.isFormFilled() para comprobar si el formulario está completo o no. 
     //Luego, se actualiza el estado del formulario (form) con los valores actuales de los campos de entrada usando la sintaxis de spread (...this.state.form) 
     //para crear una copia del objeto, y reemplazando el valor del campo de entrada correspondiente con e.target.value.

     handleChange= e=>{
        e.persist();
        this.setState({
            formFilled: this.isFormFilled(),
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
     }
     
     //La petición se realiza a una URL que incluye dos parámetros de consulta: _limit y _start. 
     //Estos parámetros son utilizados para especificar cuántos elementos se deben obtener y a partir de qué índice se deben obtener los elementos.

     //Una vez que se recibe la respuesta de la petición, se extrae la data utilizando response.data 
     //y se calcula la cantidad de páginas totales necesarias para mostrar todos los elementos con la función handlePageCount. 
     //Luego, se actualiza el estado de la aplicación con la data obtenida, la cantidad de páginas y la página actual, utilizando this.setState.

     peticionGet = (pageNumber = 1) => {
        const baseUrl = `http://localhost:4000/api/bugtracker?db=${this.state.db}`;
        const itemsPerPage = 12;
        const offset = (pageNumber - 1) * itemsPerPage;
        axios
          .get(`${baseUrl}&_limit=${itemsPerPage}&_start=${offset}`)
          .then((response) => {
            const data = response.data;
            const pageCount = this.handlePageCount(data.length, this.state.perPage);
            const disablePagination = pageCount === 1;
            this.setState({
              data: data,
              originalData: response.data,
              pageCount,
              currentPage: pageNumber,
              disablePagination: disablePagination,
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      };
      
      componentDidMount() {
        this.peticionGet(); // Ejecutar la función por primera vez al cargar el componente
      }
      
      peticionPut = () => {
        const baseUrl = `http://localhost:4000/api/bugtracker/${this.state.form.id}?db=${this.state.db}`;
        axios.put(baseUrl, this.state.form)
          .then(response => {
            // SweetAlert en caso de éxito
            Swal.fire({
              title: 'Reporte actualizado',
              text: `El reporte con el ID ${this.state.form.id} se ha actualizado correctamente`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.modalInsertar();
            this.peticionGet();
          })
          .catch(error => {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: `Ocurrió un error al actualizar el reporte con el ID ${this.state.form.id}`,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
          });
      }

      peticionPost = async () => {
        const baseUrl = `http://localhost:4000/api/bugtracker?db=${this.state.db}`;
        delete this.state.form.id;
        axios.post(baseUrl, this.state.form)
          .then(response => {
            // SweetAlert en caso de éxito
            Swal.fire({
              title: 'Reporte guardado',
              text: `El reporte se ha guardado correctamente`,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.modalInsertar();
            this.peticionGet();
          })
          .catch(error => {
            console.log(error.message)
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar guardar el reporte',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
          });
      }

    //Busqueda
    //La función comienza verificando si la búsqueda está vacía o no. 
    //Si la búsqueda está vacía, se establece el estado de data a originalData, lo que significa que se muestran todos los elementos en la tabla. 
    //Si la búsqueda no está vacía, se filtran los elementos originales utilizando el método filter de JavaScript.
    filtrarElementos = (pageNumber = 1) => {
        const { originalData, busqueda } = this.state;
        if (busqueda === '') {
          // Si la búsqueda está vacía, mostrar todos los elementos
          this.setState({ data: originalData });
        } else {
          const search = originalData.filter((item) => {
            const itemValues = Object.values(item).map((val) =>
              String(val).toLowerCase()
            );
            return itemValues.some((value) =>
              value.includes(busqueda.toLowerCase())
            );
          });
          const pageCount = this.handlePageCount(search.length, this.state.perPage);
          const disablePagination = pageCount === 1;
          this.setState({
            data: search,
            pageCount,
            currentPage: pageNumber,
            disablePagination: disablePagination,
          });
        }
      };

      //En la función handleFilter, cuando el usuario escribe en el campo de búsqueda, se actualiza el estado de busqueda con el valor ingresado por el usuario. 
      //Luego, se verifica si la búsqueda está vacía. Si la búsqueda está vacía, se llama a la función peticionGet para cargar todos los elementos de nuevo en la tabla. 
      //Si la búsqueda no está vacía, se llama a la función filtrarElementos y se pasa el número de página actual como argumento.
      handleFilter = async (e) => {
        e.persist();
        await this.setState({ busqueda: e.target.value });
        if (this.state.busqueda === '') {
          this.peticionGet();
        } else {
          this.filtrarElementos(this.state.currentPage);
        }
      };

    //Paginacion
    //handlePageClick es una función que se ejecuta cuando se hace click en un número de página en la paginación. 
    //Toma el objeto data que se pasa como argumento, que contiene información sobre la página seleccionada, como el índice de la página seleccionada. 
    //Luego, la función calcula el índice de offset multiplicando el número de página seleccionado por el número de elementos por página (perPage), 
    //actualiza el estado con el nuevo número de página y offset y luego llama a la función peticionGetPorPagina.
    handlePageClick = (data) => {
        const { perPage } = this.state;
        const selectedPage = data.selected;
        const offset = selectedPage * perPage;
        this.setState({ currentPage: selectedPage, offset }, () => {
          this.peticionGetPorPagina(selectedPage, perPage);
        });
      };
    
      //peticionGetPorPagina es una función que realiza una solicitud GET a la URL proporcionada y devuelve los datos de la página seleccionada. 
      //Toma los parámetros pageNumber y pageSize, que indican el número de la página y la cantidad de elementos por página, respectivamente. 
      //Luego, la función calcula el índice de inicio de la página seleccionada multiplicando el número de página por la cantidad de elementos por página, y agrega esto a la URL como el parámetro _start. 
      //También agrega el parámetro _limit a la URL para especificar la cantidad de elementos por página. Finalmente, la función actualiza el estado con los nuevos datos y los parámetros de paginación correspondientes.
      peticionGetPorPagina = async (pageNumber, pageSize) => {
        const { url } = this.props;
        const { busqueda } = this.state;
        const start = pageNumber * pageSize;
      
        const response = await fetch(`${url}?_start=${start}&_limit=${pageSize}&q=${busqueda}`);
        const data = await response.json();
      
        const disablePagination = this.handlePageCount(data.length, pageSize) === 1;
      
        this.setState({
          data: data,
          originalData: data,
          disablePagination: disablePagination,
          pageCount: this.handlePageCount(data.length, pageSize),
        });
      };

      //handlePageCount es una función auxiliar que toma el número total de elementos y la cantidad de elementos por página 
      //y devuelve el número total de páginas requeridas para mostrar todos los elementos.
    handlePageCount = (totalItems, pageSize) => {
        return Math.ceil(totalItems / pageSize);
    }
    
    render() { 

        //Constante para no repetir el this.state en todos los campos del modal
        const {form} = this.state;
        
        //Constantes para Paginacion
        const { data, offset, perPage, pageCount } = this.state;
        const slicedData = data.slice(offset, offset + perPage);

        return (
            <div className='table-responsive-lg'>
                <div className="HomePage">
                    <div className="container-full">
                        <div className="w-100 d-flex justify-content-between px-4">
                            <button className="btn btn-success col-md-2 text-right" onClick={()=>{this.setState({form:'', tipoModal:'insertar'}); this.modalInsertar()}}>Agrega un bug</button>
                            <input type="text" placeholder="Buscar" className="search-bar" name="busqueda" value={this.state.busqueda} onChange={this.handleFilter}/>
                        </div>
            </div>            
            <br /><br />
            <div className="table-container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Comentarios</th>
                        <th>¿Regresión?</th>
                        <th>Ticket relacionado</th>
                        <th>Status</th>
                        <th>Developer</th>
                        <th>Informador</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody className={slicedData.length ? '' : 'table-empty'}>
                        {slicedData.length ? (
                        slicedData.map(bug => {
                            return (
                            <tr key={bug.id}>
                                <td>{bug.id}</td>
                                <td>{bug.descripcion}</td>
                                <td>{bug.comentarios}</td>
                                <td>{bug.regresion}</td>
                                <td>{bug.ticket_relacionado}</td>
                                <td>{bug.status}</td>
                                <td>{bug.developer}</td>
                                <td>{bug.informador}</td>
                                <td>
                                <button className="btn btn-primary" onClick={() => { this.seleccionarBug(bug); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                {"   "}
                                <button className="btn btn-secondary" onClick={() => { this.seleccionarBug(bug); this.modalVer() }}><FontAwesomeIcon icon={faEye} /></button>
                                </td>
                            </tr>
                            )
                        })
                        ) : (
                        <tr>
                            <td colSpan="9">No hay registros que mostrar</td>
                        </tr>
                        )}
                    </tbody>
                    <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={<FontAwesomeIcon icon={faChevronLeft}/>}
                        nextLabel={<FontAwesomeIcon icon={faChevronRight}/>}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                    </div>
                    </table>
                </div>
            </div>

            <Modal 
            className="my-modal"
            isOpen={this.state.modalInsertar}
            style={{width: '100%', maxWidth: '100%'}}
            >
            <ModalHeader style={{display: 'block'}}>
                <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>
                <FontAwesomeIcon icon={faClose}/>
                </span>
            </ModalHeader>
            <ModalBody>
                <div className="form-group-container">
                    <div className="form-group col-md-6" style={{display: 'flex'}}>
                        <div style={{flex: '1', marginRight: '10px'}}>
                            <label htmlFor="id">ID</label>
                                <input 
                                className="form-control small-input-id" 
                                type="text" 
                                name="id" 
                                id="id" 
                                disabled
                                onChange={this.handleChange} 
                                value={form?form.id: ''}
                                />
                                <br />
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea
                                rows="10" 
                                className="form-control textarea-field" 
                                type="text" 
                                name="descripcion" 
                                id="descripcion" 
                                onChange={this.handleChange} 
                                value={form?form.descripcion: ''}
                                />
                                <br />
                                <label htmlFor="resumen">Resumen</label>
                                <textarea 
                                className="form-control textarea-field" 
                                type="text" 
                                name="resumen" 
                                id="resumen" 
                                rows="10" 
                                onChange={this.handleChange} 
                                value={form?form.resumen: ''}
                                />
                                <br />
                                <label htmlFor="pasos">Pasos</label>
                                <textarea 
                                className="form-control textarea-field"  
                                type="text" 
                                name="pasos" 
                                id="pasos" 
                                rows="10" 
                                onChange={this.handleChange} 
                                value={form?form.pasos: ''}
                                />
                                <br />
                                <label htmlFor="resultado_obtenido">Resultado obtenido</label>
                                <textarea 
                                className="form-control textarea-field"  
                                type="text" 
                                name="resultado_obtenido" 
                                id="resultado_obtenido" 
                                rows="10" 
                                onChange={this.handleChange} 
                                value={form?form.resultado_obtenido: ''}
                                />
                                <br />
                                <label htmlFor="resultado_esperado">Resultado esperado</label>
                                <textarea 
                                className="form-control textarea-field"  
                                type="text" 
                                name="resultado_esperado" 
                                id="resultado_esperado" 
                                rows="10" 
                                onChange={this.handleChange} 
                                value={form?form.resultado_esperado: ''}
                                />
                                </div>
                            </div>
                        <div style={{flex: '1', marginLeft: '10px'}}>
                            <label htmlFor="evidencia">Evidencia</label>
                            <textarea 
                            className="form-control textarea-field" 
                            type="text" 
                            name="evidencia" 
                            id="evidencia" 
                            rows="10" 
                            onChange={this.handleChange} 
                            value={form?form.evidencia: ''}
                            />
                            <br />
                            <label htmlFor="comentarios">Comentarios</label>
                            <textarea 
                            className="form-control textarea-field" 
                            type="text" 
                            name="comentarios" 
                            id="comentarios" 
                            rows="10" 
                            onChange={this.handleChange} 
                            value={form?form.comentarios: ''}
                            />
                            <br />
                            <label htmlFor="regresion">¿Regresión?</label>
                            <select 
                            className="form-control small-input" 
                            type="text" 
                            name="regresion" 
                            id="regresion" 
                            onChange={this.handleChange} 
                            value={form?form.regresion: ''}>
                                <option>Seleccione</option>
                                <option>Por definir</option>
                                <option>Sí</option>
                                <option>No</option>
                            </select>
                            <br />
                            <label htmlFor="ticket_relacionado">Ticket relacionado</label>
                            <input 
                            className="form-control small-input" 
                            type="text" 
                            name="ticket_relacionado" 
                            id="ticket_relacionado" 
                            onChange={this.handleChange} 
                            value={form?form.ticket_relacionado: ''}
                            />
                            <br />
                            <label htmlFor="status">Status</label>
                            <select 
                            className="form-control small-input" 
                            type="text" 
                            name="status" 
                            id="status" 
                            onChange={this.handleChange} 
                            value={form?form.status: ''}>
                                <option>Seleccione</option>
                                <option>Pendiente</option>
                                <option>Falló</option>
                                <option>Resuelto</option>
                                <option>Pendiente de testing</option>
                            </select>
                            <br />
                            <label htmlFor="developer">Developer</label>
                            <select 
                            className="form-control small-input" 
                            type="text" 
                            name="developer" 
                            id="developer" 
                            onChange={this.handleChange} 
                            value={form?form.developer: ''}>
                                <option>Seleccione</option>
                                <option>Por definir</option>
                                <option>Jonathan</option>
                                <option>Daniel</option>
                                <option>Gonzalo</option>
                                <option>Emanuel</option>
                            </select>
                            <br />
                            <label htmlFor="informador">Informador</label>
                            <input
                            className="form-control small-input" 
                            type="text" 
                            name="informador" 
                            id="informador" 
                            onChange={this.handleChange} 
                            defaultValue={form?form.informador: ''}
                            />
                        </div>
                    </div>

                </ModalBody>

                <ModalFooter>
                    {this.state.tipoModal==='insertar'?
                    <button className="btn btn-success" disabled={!this.state.formFilled} onClick={()=>this.peticionPost()}>
                        Insertar
                    </button>:<button className="btn btn-primary"onClick={()=>this.peticionPut()}>
                        Actualizar
                    </button>
    }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>
                        Cancelar
                    </button>
                </ModalFooter>
        </Modal>

        <Modal 
            className="my-modal"
            isOpen={this.state.modalVer}
            style={{width: '100%', maxWidth: '100%'}}
            >
            <ModalHeader style={{display: 'block'}}>
                <span style={{float: 'right'}} onClick={()=>this.modalVer()}>
                <FontAwesomeIcon icon={faClose}/>
                </span>
            </ModalHeader>
            <ModalBody>
                <div className="form-group-container">
                    <div className="form-group col-md-6" style={{display: 'flex'}}>
                        <div style={{flex: '1', marginRight: '10px'}}>
                            <label htmlFor="id">ID</label>
                                <input 
                                readOnly
                                className="form-control small-input-id" 
                                type="text" 
                                name="id" 
                                id="id" 
                                onChange={this.handleChange} 
                                value={form?form.id: ''}
                                />
                                <br />
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea 
                                readOnly
                                className="form-control" 
                                type="text" 
                                name="descripcion" 
                                id="descripcion" 
                                onChange={this.handleChange} 
                                value={form?form.descripcion: ''}
                                />
                                <br />
                                <label htmlFor="resumen">Resumen</label>
                                <textarea 
                                readOnly
                                className="form-control" 
                                type="text" 
                                name="resumen" 
                                id="resumen" 
                                onChange={this.handleChange} 
                                value={form?form.resumen: ''}
                                />
                                <br />
                                <label htmlFor="pasos">Pasos</label>
                                <textarea 
                                readOnly
                                className="form-control" 
                                type="text" 
                                name="pasos" 
                                id="pasos" 
                                onChange={this.handleChange} 
                                value={form?form.pasos: ''}
                                />
                                <br />
                                <label htmlFor="resultado_obtenido">Resultado obtenido</label>
                                <textarea 
                                readOnly
                                className="form-control" 
                                type="text" 
                                name="resultado_obtenido" 
                                id="resultado_obtenido" 
                                onChange={this.handleChange} 
                                value={form?form.resultado_obtenido: ''}
                                />
                                <br />
                                <label htmlFor="resultado_esperado">Resultado esperado</label>
                                <textarea 
                                readOnly
                                className="form-control" 
                                type="text" 
                                name="resultado_esperado" 
                                id="resultado_esperado" 
                                onChange={this.handleChange} 
                                value={form?form.resultado_esperado: ''}
                                />
                                </div>
                            </div>
                        <div style={{flex: '1', marginLeft: '10px'}}>
                            <label htmlFor="evidencia">Evidencia</label>
                            <textarea
                            readOnly 
                            className="form-control" 
                            type="text" 
                            name="evidencia" 
                            id="evidencia" 
                            onChange={this.handleChange} 
                            value={form?form.evidencia: ''}
                            />
                            <br />
                            <label htmlFor="comentarios">Comentarios</label>
                            <textarea 
                            readOnly
                            className="form-control" 
                            type="text" 
                            name="comentarios" 
                            id="comentarios" 
                            onChange={this.handleChange} 
                            value={form?form.comentarios: ''}
                            />
                            <br />
                            <label htmlFor="regresion">¿Regresión?</label>
                            <select 
                            disabled
                            className="form-control small-input" 
                            type="text" 
                            name="regresion" 
                            id="regresion" 
                            onChange={this.handleChange} 
                            value={form?form.regresion: ''}>
                                <option>Seleccione</option>
                                <option>Por definir</option>
                                <option>Sí</option>
                                <option>No</option>
                            </select>
                            <br />
                            <label htmlFor="ticket_relacionado">Ticket relacionado</label>
                            <input 
                            readOnly
                            className="form-control small-input" 
                            type="text" 
                            name="ticket_relacionado" 
                            id="ticket_relacionado" 
                            onChange={this.handleChange} 
                            value={form?form.ticket_relacionado: ''}
                            />
                            <br />
                            <label htmlFor="status">Status</label>
                            <select 
                            disabled
                            className="form-control small-input" 
                            type="text" 
                            name="status" 
                            id="status" 
                            onChange={this.handleChange} 
                            value={form?form.status: ''}>
                                <option>Seleccione</option>
                                <option>Pendiente</option>
                                <option>Falló</option>
                                <option>Resuelto</option>
                                <option>Pendiente de testing</option>
                            </select>
                            <br />
                            <label htmlFor="developer">Developer</label>
                            <select 
                            disabled
                            className="form-control small-input" 
                            type="text" 
                            name="developer" 
                            id="developer" 
                            onChange={this.handleChange} 
                            value={form?form.developer: ''}>
                                <option>Seleccione</option>
                                <option>Por definir</option>
                                <option>Jonathan</option>
                                <option>Daniel</option>
                                <option>Gonzalo</option>
                                <option>Emanuel</option>
                            </select>
                            <br />
                            <label htmlFor="comentarios">Informador</label>
                            <input
                            readOnly
                            className="form-control small-input" 
                            type="text" 
                            name="informador" 
                            id="informador" 
                            onChange={this.handleChange} 
                            value={form?form.informador: 'Jesús'}
                            />   
                        </div>
                    </div>

                </ModalBody>

                <ModalFooter>
                    <button className="btn btn-danger" onClick={()=>this.modalVer()}>
                        Volver
                    </button>
                </ModalFooter>
          </Modal>
            </div>
        
        
        );
    }
}
 
export default MobilePage;