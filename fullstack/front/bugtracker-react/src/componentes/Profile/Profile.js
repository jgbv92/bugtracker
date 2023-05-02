import React, {Component} from "react";
import './Profile.css'
import Profilelogo from './profile-image.webp'

class Profile extends Component {
    state = {
        name: 'Jesús Boada',
        email: 'example@example.com'
    }

    handleChange = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    handleSave = () => {
        console.log('Se ha guardado el nuevo nombre:', this.state.name);
    }

    render (){
        return (
            <div>
                <div className="profile-header">
                    <h1>Bienvenido a tu perfil</h1>
                </div>
                <div className="profile-header">
                    <img src={Profilelogo} alt="profile-img" />
                    <input type="text" placeholder="" className="search-bar text-center" name="name" value={this.state.name} onChange={this.handleChange}></input>
                    <input type="text" disabled placeholder="" className="search-bar text-center" name="email" value={this.state.email}></input>
                </div>
                <div className="w-100 d-flex justify-content-between px-4">
                    <button className="btn btn-success col-md-2 mx-auto" onClick={this.handleSave}>Guardar cambios</button>
                </div>
            </div>
        );
    };
}

export default Profile;