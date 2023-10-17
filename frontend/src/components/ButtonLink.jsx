import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

function ButtonLink({text, to, size}) {
  return (
    <button className={`ButtonLink ButtonLink-${size}`}>
      <Link to={to}>{text}</Link>
    </button>
  )
}

ButtonLink.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  size: PropTypes.string
};

export default ButtonLink