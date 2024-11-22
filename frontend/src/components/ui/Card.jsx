import PropTypes from 'prop-types'

export function Card({ children, className }) {
  return (
    <div
      className={`bg-zinc-900 p-10 rounded-md ${className}`}
    >{children}</div>
  )
}

Card.propTypes = {
  children: PropTypes.node, // Esto indica que `children` puede ser cualquier tipo de nodo React
};

export default Card;