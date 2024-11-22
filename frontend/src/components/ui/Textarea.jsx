import { forwardRef } from "react";
import PropTypes from "prop-types"; // Importa PropTypes

export const Textarea = forwardRef((props, ref) => { 
    return (
        <textarea
            className="bg-zinc-800 px-3 py-2 block my-2 w-full"
            ref={ref}
            {...props}
        >
            
            {props.children}
            </textarea>
    );
});

Textarea.displayName = "Texarea"; // Añade esto para evitar advertencias con forwardRef

Textarea.propTypes = {
    children: PropTypes.node, // Define que children puede ser cualquier nodo
};

export default Textarea;