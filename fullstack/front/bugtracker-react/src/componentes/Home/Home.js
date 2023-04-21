import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import Pclogo from './PC-logo.png';
import Applogo from './Mobile-logo.png';
import Presslogo from './Press-logo.png';

class Home extends Component {
  render() { 
    return (
      <div className="container">
        <h1 className="center">PROYECTOS</h1>
        <div className="row row-cols-1 row-cols-md-3 g-8">
          <div className="col">
            <div className="card h-100">
              <img src={Pclogo} className="card-img-top" alt="web"/>
              <div className="card-body">
                <h5 className="card-title center">Proyecto BBX Web</h5>
                <p className="card-text center">Reporta bugs relacionado a BBX Web</p>
                <Link to="/webpage" className="btn btn-primary d-block mx-auto">Reporta bugs <FontAwesomeIcon icon={faPencil}/></Link>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <img src={Applogo} className="card-img-top" alt="mobile"/>
              <div className="card-body">
                <h5 className="card-title center">Proyecto BBX App</h5>
                <p className="card-text center">Reporta bugs relacionados a BBX App</p>
                <Link to="/mobilepage" className="btn btn-primary d-block mx-auto">Reporta bugs <FontAwesomeIcon icon={faPencil}/></Link>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100">
              <img src={Presslogo} className="card-img-top" alt="press"/>
              <div className="card-body">
                <h5 className="card-title center">Proyecto BBX Press</h5>
                <p className="card-text center">Reporta bugs relacionado a BBX Press Site</p>
                <Link to="/presspage" className="btn btn-primary d-block mx-auto">Reporta bugs <FontAwesomeIcon icon={faPencil}/></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
 
export default Home;