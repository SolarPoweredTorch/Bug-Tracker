import { Form } from "react-bootstrap";

interface PageSizeSelectorProps {
    pageSize: number,
    onChange: (e: any) => void,
    [x: string]: any,
}

const PageSizeSelector = ({ pageSize, onChange, ...props }: PageSizeSelectorProps) => {

    return (

        <Form.Control as="select" defaultValue={pageSize} onChange={onChange} {...props} size="sm" className="w-auto text-body-emphasis">

            {[10, 20, 30, 40, 50].map(pageSizeOption => (
                <option key={pageSizeOption} value={pageSizeOption} >
                    {`Show ${pageSizeOption}`}
                </option>

            ))}

        </Form.Control>
    )
}

export default PageSizeSelector;