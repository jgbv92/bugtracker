import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'

//La petición se realiza a una URL que incluye dos parámetros de consulta: _limit y _start. 
     //Estos parámetros son utilizados para especificar cuántos elementos se deben obtener y a partir de qué índice se deben obtener los elementos.

     //Una vez que se recibe la respuesta de la petición, se extrae la data utilizando response.data 
     //y se calcula la cantidad de páginas totales necesarias para mostrar todos los elementos con la función handlePageCount. 
     //Luego, se actualiza el estado de la aplicación con la data obtenida, la cantidad de páginas y la página actual, utilizando this.setState.

     export const peticionGet = (pageNumber = 1) => {
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
      
      export const peticionPut = () => {
        const baseUrl = `http://localhost:4000/api/bugtracker/${this.state.form.id}?db=${this.state.db}`;
        axios.put(baseUrl, this.state.form)
          .then(response => {
            // SweetAlert en caso de éxito
            Swal.fire({
              title: 'Reporte actualizado',
              text: `El reporte con el ID ${this.state.form.id} se ha actualizado correctamente`,
              icon: 'info',
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

      export const peticionPost = async () => {
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