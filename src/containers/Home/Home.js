import React, {Component} from "react";
import classes from './Home.module.css'
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import {connect} from "react-redux";
import {analyze} from "../../store/actions/analysisActions";

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formValid: false,
            result: {
                value: '',
                error: false
            },
            formControls: {
                name: {
                    value: '',
                    type: 'text',
                    label: 'Indicator name',
                    errorMessage: 'Field is mandatory',
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                    }
                },
                value: {
                    value: '',
                    type: 'number',
                    label: 'Value',
                    errorMessage: 'Field is mandatory',
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                    }
                }
            }
        };
    }


    analyze = () => {
        this.setState({formValid: false})
        this.props.analyze(
            this.state.formControls.name.value,
            this.state.formControls.value.value,
        ).then(result => {
            console.log(result.data)
            this.setResult(result)
        });
    };

    setResult = (response) => {
        console.log('setResult')
        let result = {...this.state.result};
        result.value = response.data;
        result.error = response.error;
        this.setState({result})
    }

    clearResult = () => {
        let result = {...this.state.result};
        result.value = '';
        this.setState({result})
    }

    clearFields = () => {
        console.log('removeFields')
        if (this.state.result.error){
            this.clearResult()
        } else {
            this.clearResult()
            let formControls = {...this.state.formControls};
            formControls.name.value = '';
            formControls.name.valid = false;
            formControls.name.touched = false;
            formControls.value.value = '';
            formControls.value.valid = false;
            formControls.value.touched = false;
            this.setState({formControls, formValid: false})
        }
    }

    submitHandler = (event) => {
        event.preventDefault()
    };


    validateControl(value, validation) {
        if (!validation)
            return true;
        let isValid = true;
        if (validation.required) {
            isValid = value.trim() !== '' && isValid;
        }
        return isValid
    }

    onChangeHandler(event, controlName) {
        this.clearResult()
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};
        control.value = event.target.value;
        control.touched = true;
        control.valid = this.validateControl(control.value, control.validation);
        formControls[controlName] = control;

        let formValid = true;
        // eslint-disable-next-line array-callback-return
        Object.keys(formControls).map((controlName, index) => {
            formValid = formControls[controlName].valid && formValid;
        });

        this.setState({formControls, formValid});
    };

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName];
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })
    }

    render() {
        return (
            <div className={classes.Home}>
                <ul className={classes.list}>
                    <div>
                        <h1>Welcome</h1>
                        <form className={classes.TestForm} onSubmit={this.submitHandler}>
                            {this.renderInputs()}

                            <Button
                                type={'success'}
                                onClick={this.analyze}
                                disabled={!this.state.formValid}
                            >Check</Button>
                        </form>
                    </div>
                    {
                        this.state.result.value !== '' ?
                            <li className={classes.TestForm}>
                                <h2>{this.state.result.value}</h2>
                                <Button
                                    type={this.state.result.error ? 'error' : 'success'}
                                    onClick={this.clearFields}
                                    disabled={false}
                                >Ok</Button>
                            </li> :
                            <div/>
                    }
                </ul>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        analyze: (name, value) => dispatch(analyze(name, value))
    }
}

export default connect(null, mapDispatchToProps)(Home)