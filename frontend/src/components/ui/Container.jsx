import PropTypes from 'prop-types';

 export function Container({ children, className }) {
    return (
        <div className={'max-w-7xl px-4 mx-auto ' + className}>{children}</div>
    )

}
Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
export default Container