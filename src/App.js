import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


const color_type = {
  'Black': 'Black',
  'White': 'White',
  'Blue': 'Blue',
  'Red': 'Red',
};

function enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      car_details: [],
      car_registration_no: "",
      car_color: "",
      car_parking_slot: 1,
      registration_number_valid: true,
      color_valid: true,
      color_message: "",
      registration_number_message: "",
      free_slot: [],
      allocated_slot: [],
      allocate_status: true,
      show_allocate_input: true,
      total_parking_slot: { number: "", valid: true, validator_message: "" },
    }
  }

  set_car_color = (color) => {
    this.setState({
      car_color: color
    })
  }

  allocate_slot = () => {

    var valid_flag = true
    var car_parking_value = {
      'car_registration_no': this.state.car_registration_no,
      'car_color': this.state.car_color,
      'car_parking_slot': this.state.car_parking_slot,
    }
    var temp_car_details = this.state.car_details
    var deallocate_car_index =
      temp_car_details.findIndex(data => data.car_registration_no === this.state.car_registration_no)

    if (deallocate_car_index > -1) {
      valid_flag = false
      this.setState({
        registration_number_message: "Duplicate Car Registration Number",
        registration_number_valid: false
      })
    }
    if (this.state.car_registration_no.match(/^[A-Za-z]{2}-(\d){2}-[A-Z]{2}-(\d){4}$/) == null) {
      valid_flag = false
      this.setState({
        registration_number_message: "Please Enter a Valid Registration Number",
        registration_number_valid: false
      })
    }
    if (this.state.car_color === "") {
      valid_flag = false
      this.setState({
        color_message: "Please Select a Color",
        color_valid: false
      })
    }
    if (valid_flag) {

      temp_car_details.push(car_parking_value)

      var temp_parking_slot = this.state.car_parking_slot

      var temp_free_slot = this.state.free_slot
      var temp_allocated_slot = this.state.allocated_slot

      temp_free_slot.splice(temp_free_slot.indexOf(temp_parking_slot), 1)
      temp_allocated_slot.push(temp_parking_slot)

      temp_parking_slot = Math.min.apply(Math, temp_free_slot) === Infinity ? -1 : Math.min.apply(Math, temp_free_slot)

      this.setState({
        car_details: temp_car_details,
        car_parking_slot: temp_parking_slot,
        free_slot: temp_free_slot,
        allocate_slot: temp_allocated_slot,
        car_registration_no: "",
        car_color: "",
        registration_number_valid: true,
        color_valid: true,
        allocate_button_disabled: temp_free_slot.length > 0 ? false : true
      })
    }

  }

  deallocate_slot = (car) => {

    var temp_car_details = this.state.car_details
    var deallocate_car =
      temp_car_details.findIndex(data => data.car_registration_no === car.car_registration_no)

    var temp_parking_slot = this.state.car_parking_slot

    var temp_free_slot = this.state.free_slot
    var temp_allocated_slot = this.state.allocated_slot

    temp_allocated_slot.splice(temp_allocated_slot.indexOf(temp_parking_slot), 1)
    temp_free_slot.push(car.car_parking_slot)

    temp_parking_slot = Math.min.apply(Math, temp_free_slot)
    temp_car_details.splice(deallocate_car, 1)
    this.setState({
      free_slot: temp_free_slot,
      allocate_slot: temp_allocated_slot,
      car_details: temp_car_details,
      car_parking_slot: temp_parking_slot,
      allocate_button_disabled: false
    })

  }

  deallocate_slot_button = (cell, row) => {
    return (
      <strong className="table-edit-option">
        <span onClick={() => this.deallocate_slot(row)}>
          <i className="fas fa-trash" style={{ color: "#d61b1b" }} title="Deallocate"></i>
        </span>
      </strong>

    );
  }

  change_total_parking_slot = (parking_slot) => {
    var temp_parking_slot = this.state.total_parking_slot
    var valid_flag = true
    temp_parking_slot.valid = valid_flag
    temp_parking_slot.number = parking_slot
    if (isNaN(parking_slot) || parking_slot === "") {
      temp_parking_slot.valid = false
      temp_parking_slot.validator_message = "Only Numbers are Allowed"
    }
    this.setState({
      total_parking_slot: temp_parking_slot,
    })
  }

  get_total_parking_slot = (parking_slot) => {

    var temp_parking_slot = this.state.total_parking_slot

    var valid_flag = true
    temp_parking_slot.valid = valid_flag

    temp_parking_slot.number = parking_slot


    if (isNaN(parking_slot) || parking_slot === "") {
      valid_flag = false
      temp_parking_slot.valid = valid_flag
      temp_parking_slot.validator_message = "Only Numbers are Allowed"
    }
    var temp_free_slot = this.state.free_slot
    if (valid_flag) {

      for (var i = 1; i <= parking_slot; i++) {
        temp_free_slot.push(i)
      }
      this.setState({
        free_slot: temp_free_slot,
        show_allocate_input: false
      })
    }
    else {
      this.setState({
        total_parking_slot: temp_parking_slot
      })
    }
  }

  render() {
    return (
      <div>

        <header className="header-text"> <h2> Welcome to Give India Car Parking Slot </h2> </header>
        {this.state.show_allocate_input &&
          <div className="grid">
            <label></label>
            <input type="text"
              value={this.state.total_parking_slot.number}
              placeholder="Only Numbers are allowed, e.g: 10,30"
              onChange={(event) => this.change_total_parking_slot(event.target.value)}
            />

            <button onClick={(event) => this.get_total_parking_slot(this.state.total_parking_slot.number)}>
              ALLOCATE SPACE
            </button>
          </div>

        }
        {this.state.show_allocate_input &&
          <div className="grid">
            <label></label>
            {
              !this.state.total_parking_slot.valid &&
              <label className="error-label">
                {this.state.total_parking_slot.validator_message}
              </label>
            }
            <label></label>
            <label></label>
          </div>
        }
        {!this.state.show_allocate_input &&

          <div>

            <section className="grid">
              <label>Car Registration Number</label>
              <label>Car Color</label>
              <label className="text-center">Parking Slot</label>
              <label>Allocate Slot</label>
            </section>

            <section className="grid">
              <input type="text" placeholder="e.g: KA-01-HH-1234"
                value={this.state.car_registration_no}
                onChange={(event) => this.setState({
                  car_registration_no: event.target.value
                })}
              />
              <select value={this.state.car_color}
                onChange={(event) => this.set_car_color(event.target.value)}>
                <option value="">--Car Colour--</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
              </select>
              <label className="text-center">{this.state.car_parking_slot}</label>
              <button disabled={this.state.allocate_button_disabled}
                onClick={(event) => this.allocate_slot()}>
                {this.state.allocate_button_disabled ?
                  <span>Can Not Allocate More</span>
                  :
                  <span>
                    Allocate Slot
                  </span>
                }
              </button>
            </section>

            <section className="grid">

              <label className="error-label">
                {!this.state.registration_number_valid &&
                  <span>
                    {this.state.registration_number_message}
                  </span>
                }
              </label>

              <label className="error-label">
                {!this.state.color_valid &&
                  <span>
                    {this.state.color_message}
                  </span>
                }
              </label>
              <label></label>
              <label></label>
            </section>

            <header className="header-text"> <h3> Car Parking Details </h3></header>

            <BootstrapTable data={this.state.car_details} striped hover version='4'>
              <TableHeaderColumn filter={{ type: 'TextFilter' }} isKey dataField='car_registration_no'>Car Number</TableHeaderColumn>
              <TableHeaderColumn dataField='car_color'
                filterFormatted dataFormat={enumFormatter} formatExtraData={color_type}
                filter={{ type: 'SelectFilter', options: color_type }}
              >
                Car Colour
              </TableHeaderColumn>
              <TableHeaderColumn filter={{ type: 'TextFilter' }} dataField='car_parking_slot'>Parking Slot</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this.deallocate_slot_button}>De Allocate</TableHeaderColumn>
            </BootstrapTable>

          </div>

        }

      </div>

    );
  }
}

export default App;
