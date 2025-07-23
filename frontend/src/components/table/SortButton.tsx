import { Button } from "react-bootstrap";
import { FaSort, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

interface SortButtonProps {
    icon: string,
    [x: string]: any,
}

const sortIcons = {
    false: <FaSort />,
    asc: <FaSortAmountDown />,
    desc: <FaSortAmountUp />
};

const SortButton = ({ icon, ...props }: SortButtonProps) => {

    return (
        <Button
            className="text-body-emphasis"
            size="sm" variant="primary"
            {...props}
        >
            {sortIcons[icon as keyof typeof sortIcons]}
        </Button>
    );
}

export default SortButton;