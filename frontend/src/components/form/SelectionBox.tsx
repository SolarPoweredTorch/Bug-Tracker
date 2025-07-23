import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectionBoxProps {
    name: string,
    label: string,
    options: string[],
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const SelectionBox = (
    {
        name,
        label,
        options,
        register,
        registerOptions,
        error,
        ...props
    }: SelectionBoxProps) => {

    return (

        <Form.Group className="mb-3" controlId={name + "-select"}>

            <Form.Label>{label}</Form.Label>

            <Form.Select
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </Form.Select>

            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>

        </Form.Group>
    );
}

export default SelectionBox;