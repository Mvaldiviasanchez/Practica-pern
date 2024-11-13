import PropTypes from "prop-types";

export function Label({ children, htmlFor }) {
    return (
        <label
            className="block text-sm font-medium text-gray-400"
            htmlFor={htmlFor}
        >
            {children}
        </label>
    )
}

Label.propTypes = {
    children: PropTypes.node.isRequired,
    htmlFor: PropTypes.string.isRequired,
};

export default Label